// POST /api/contact — "Book a consultation" enquiry form.
//
// Contract (agreed with Varsha, J01):
//   POST /api/contact
//   Content-Type: application/json
//   Body: { name, email, company, role, service, message, website? }
//     - "website" is the honeypot — hidden field, real users leave it empty.
//   Response 200: { success: true }
//   Response 4xx/5xx: { success: false, error: "<generic message>" }
//
// Row lands in the Consultation Prisma table — the URL changed to match
// Varsha's mock (POST /api/contact), the DB model name did not.
//
// Order of operations is deliberate:
//   1. validate — cheapest check first, refuses garbage before we spend I/O
//   2. rate-limit — before DB / mail, so a flood does not fill the DB
//   3. insert into Postgres (the record of truth)
//   4. send email (the alert)
//   5. If step 4 fails but step 3 succeeded, we STILL return success.
//      The row is safe; we notice the mail failure via the server log and
//      catch up manually. A visitor should never see a 5xx just because
//      our SMTP hiccuped.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validation';
import { sendNotification, escapeHtml } from '@/lib/mail';
import { clientIp, checkRateLimit, pruneExpiredBuckets, MAX_BODY_BYTES } from '@/lib/abuse';
import { corsHeaders, handlePreflight } from '@/lib/cors';

function fail(
  req: Request,
  status: number,
  error: string,
  extraHeaders?: HeadersInit,
): NextResponse {
  return NextResponse.json(
    { success: false, error },
    {
      status,
      headers: { 'Cache-Control': 'no-store', ...corsHeaders(req), ...extraHeaders },
    },
  );
}

export function OPTIONS(req: Request): Response {
  return handlePreflight(req);
}

export async function POST(req: Request): Promise<Response> {
  // 1. Content-type guard FIRST — cheapest check and defends against a
  // cross-site <form enctype="text/plain"> CSRF: those POSTs are CORS
  // "simple requests" (no preflight), come from victim IPs, and would each
  // otherwise open a fresh rate-limit bucket. We refuse them before we
  // read the body, parse, or touch the limiter.
  const ct = req.headers.get('content-type') ?? '';
  if (!ct.toLowerCase().includes('application/json')) {
    return fail(req, 415, 'Unsupported content type.');
  }

  // 2. Body size cap. Rejects a lying Content-Length or oversized text body.
  const declaredLen = Number(req.headers.get('content-length') ?? '0');
  if (declaredLen > MAX_BODY_BYTES) return fail(req, 413, 'Payload too large.');

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail(req, 413, 'Payload too large.');

  // 3. Parse.
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail(req, 400, 'Invalid JSON.');
  }

  // 4. Validate.
  const result = contactSchema.safeParse(parsed);
  if (!result.success) {
    return fail(req, 400, 'Please check the form and try again.');
  }
  const body = result.data;

  // 5. Honeypot. Return 200 so bots log "OK" and move on.
  if (typeof body.website === 'string' && body.website.length > 0) {
    console.log('contact: honeypot triggered, dropping');
    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store', ...corsHeaders(req) } },
    );
  }

  // 6. Rate limit (per IP, 5 hits per 10 minutes). The prune window MUST
  // match the limit window — see abuse.ts.
  const ip = clientIp(req);
  const RATE_WINDOW_MS = 10 * 60_000;
  const rl = checkRateLimit({ ip, bucket: 'contact', windowMs: RATE_WINDOW_MS, max: 5 });
  pruneExpiredBuckets(RATE_WINDOW_MS);
  if (!rl.ok) {
    return fail(req, 429, 'Too many submissions. Please try again shortly.', {
      'Retry-After': String(rl.retryAfterSec),
    });
  }

  // 7. Insert. Prisma parameterises — never build raw SQL here.
  let saved;
  try {
    saved = await prisma.consultation.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        role: body.role,
        service: body.service,
        message: body.message,
      },
      select: { id: true },
    });
  } catch (err) {
    // Never surface the ORM name or column detail — that's reconnaissance.
    console.error('contact: db insert failed', err);
    return fail(req, 500, 'We could not save your message. Please try again shortly.');
  }

  // 8. Email the team. Best-effort — a failed alert does not fail the request.
  const subject = `New enquiry — ${body.company} (${body.service})`;
  const text = [
    `New consultation enquiry from accurith.com`,
    ``,
    `Name:    ${body.name}`,
    `Email:   ${body.email}`,
    `Company: ${body.company}`,
    `Role:    ${body.role}`,
    `Service: ${body.service}`,
    ``,
    `Message:`,
    body.message,
    ``,
    `Record id: ${saved.id}`,
  ].join('\n');
  const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#1B2A4A;line-height:1.5;">
  <h2 style="color:#0E9E82;margin:0 0 12px;">New consultation enquiry</h2>
  <table cellpadding="4">
    <tr><td><b>Name</b></td><td>${escapeHtml(body.name)}</td></tr>
    <tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
    <tr><td><b>Company</b></td><td>${escapeHtml(body.company)}</td></tr>
    <tr><td><b>Role</b></td><td>${escapeHtml(body.role)}</td></tr>
    <tr><td><b>Service</b></td><td>${escapeHtml(body.service)}</td></tr>
  </table>
  <h3 style="margin:16px 0 4px;">Message</h3>
  <pre style="white-space:pre-wrap;font-family:inherit;background:#f5f7fa;padding:12px;border-radius:6px;">${escapeHtml(body.message)}</pre>
  <p style="color:#666;font-size:12px;">Record id: ${saved.id}</p>
</body></html>`.trim();

  try {
    await sendNotification({
      subject,
      text,
      html,
      replyTo: body.email,
      replyToName: body.name,
    });
  } catch (err) {
    // Row is saved; log loudly so we can catch up manually. Do NOT surface
    // to the client — from their side the enquiry landed and we owe them a
    // response, which we do owe them from the DB row.
    console.error('contact: mail send failed (record saved)', saved.id, err);
  }

  return NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store', ...corsHeaders(req) } },
  );
}

export function GET() {
  return new NextResponse(JSON.stringify({ success: false, error: 'Method not allowed.' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Allow: 'POST',
    },
  });
}
