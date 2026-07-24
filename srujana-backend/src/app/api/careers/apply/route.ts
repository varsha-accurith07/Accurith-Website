// POST /api/careers/apply — job application.
//
// Contract:
//   POST /api/careers/apply
//   Content-Type: application/json
//   Body: {
//     openingId, name, email, phone, linkedinUrl, portfolioUrl?, coverNote,
//     website?  // honeypot
//   }
//   Response 200: { success: true }
//   Response 4xx/5xx: { success: false, error: "<generic>" }
//
// NO CV file uploads. Applicants give links. We are a cyber-security firm;
// an endpoint that accepts arbitrary binaries from strangers is exactly the
// thing a buyer's pentest report will lead with.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { applicationSchema } from '@/lib/validation';
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
  // Content-type guard FIRST — see /api/contact for the CSRF reasoning.
  const ct = req.headers.get('content-type') ?? '';
  if (!ct.toLowerCase().includes('application/json')) {
    return fail(req, 415, 'Unsupported content type.');
  }

  const declaredLen = Number(req.headers.get('content-length') ?? '0');
  if (declaredLen > MAX_BODY_BYTES) return fail(req, 413, 'Payload too large.');
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail(req, 413, 'Payload too large.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail(req, 400, 'Invalid JSON.');
  }

  const result = applicationSchema.safeParse(parsed);
  if (!result.success) return fail(req, 400, 'Please check the form and try again.');
  const body = result.data;

  if (typeof body.website === 'string' && body.website.length > 0) {
    console.log('apply: honeypot triggered, dropping');
    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store', ...corsHeaders(req) } },
    );
  }

  const ip = clientIp(req);
  const RATE_WINDOW_MS = 10 * 60_000;
  const rl = checkRateLimit({ ip, bucket: 'apply', windowMs: RATE_WINDOW_MS, max: 5 });
  pruneExpiredBuckets(RATE_WINDOW_MS);
  if (!rl.ok) {
    return fail(req, 429, 'Too many submissions. Please try again shortly.', {
      'Retry-After': String(rl.retryAfterSec),
    });
  }

  // Verify the opening exists AND is open. Doing this in a single query means
  // an attacker can't distinguish "unknown role" from "closed role".
  const opening = await prisma.jobOpening.findFirst({
    where: { id: body.openingId, isOpen: true },
    select: { id: true, title: true, slug: true },
  });
  if (!opening) return fail(req, 404, 'This role is no longer accepting applications.');

  let saved;
  try {
    saved = await prisma.jobApplication.create({
      data: {
        openingId: opening.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        linkedinUrl: body.linkedinUrl,
        portfolioUrl: body.portfolioUrl && body.portfolioUrl.length > 0 ? body.portfolioUrl : null,
        coverNote: body.coverNote,
      },
      select: { id: true },
    });
  } catch (err) {
    console.error('apply: db insert failed', err);
    return fail(req, 500, 'We could not save your application. Please try again shortly.');
  }

  const subject = `New application — ${opening.title} (${body.name})`;
  const text = [
    `New application from accurith.com/careers`,
    ``,
    `Role:      ${opening.title} (${opening.slug})`,
    `Name:      ${body.name}`,
    `Email:     ${body.email}`,
    `Phone:     ${body.phone}`,
    `LinkedIn:  ${body.linkedinUrl}`,
    ...(body.portfolioUrl ? [`Portfolio: ${body.portfolioUrl}`] : []),
    ``,
    `Cover note:`,
    body.coverNote,
    ``,
    `Record id: ${saved.id}`,
  ].join('\n');

  const portfolioRow =
    body.portfolioUrl && body.portfolioUrl.length > 0
      ? `<tr><td><b>Portfolio</b></td><td><a href="${escapeHtml(body.portfolioUrl)}">${escapeHtml(body.portfolioUrl)}</a></td></tr>`
      : '';

  const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#1B2A4A;line-height:1.5;">
  <h2 style="color:#0E9E82;margin:0 0 12px;">New application — ${escapeHtml(opening.title)}</h2>
  <table cellpadding="4">
    <tr><td><b>Name</b></td><td>${escapeHtml(body.name)}</td></tr>
    <tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
    <tr><td><b>Phone</b></td><td>${escapeHtml(body.phone)}</td></tr>
    <tr><td><b>LinkedIn</b></td><td><a href="${escapeHtml(body.linkedinUrl)}">${escapeHtml(body.linkedinUrl)}</a></td></tr>
    ${portfolioRow}
  </table>
  <h3 style="margin:16px 0 4px;">Cover note</h3>
  <pre style="white-space:pre-wrap;font-family:inherit;background:#f5f7fa;padding:12px;border-radius:6px;">${escapeHtml(body.coverNote)}</pre>
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
    console.error('apply: mail send failed (record saved)', saved.id, err);
  }

  return NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store', ...corsHeaders(req) } },
  );
}

export function GET() {
  return new NextResponse(JSON.stringify({ success: false, error: 'Method not allowed.' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST' },
  });
}
