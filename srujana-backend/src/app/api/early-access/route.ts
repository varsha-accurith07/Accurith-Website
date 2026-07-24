// POST /api/early-access — "Request early access" form on the Products page.
//
// Contract (agreed with Varsha):
//   POST /api/early-access
//   Content-Type: application/json
//   Body: { name, email, product, website? }
//     - "website" is the honeypot, same as /api/contact.
//   Response 200: { success: true }
//   Response 4xx/5xx: { success: false, error: "<generic>" }
//
// Same shape as /api/contact deliberately — same validation library, same
// rate limiter (separate bucket), same best-effort mail.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { earlyAccessSchema } from '@/lib/validation';
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

  const result = earlyAccessSchema.safeParse(parsed);
  if (!result.success) return fail(req, 400, 'Please check the form and try again.');
  const body = result.data;

  if (typeof body.website === 'string' && body.website.length > 0) {
    console.log('early-access: honeypot triggered, dropping');
    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store', ...corsHeaders(req) } },
    );
  }

  const ip = clientIp(req);
  const RATE_WINDOW_MS = 10 * 60_000;
  const rl = checkRateLimit({ ip, bucket: 'early-access', windowMs: RATE_WINDOW_MS, max: 5 });
  pruneExpiredBuckets(RATE_WINDOW_MS);
  if (!rl.ok) {
    return fail(req, 429, 'Too many submissions. Please try again shortly.', {
      'Retry-After': String(rl.retryAfterSec),
    });
  }

  let saved;
  try {
    saved = await prisma.earlyAccess.create({
      data: { name: body.name, email: body.email, product: body.product },
      select: { id: true },
    });
  } catch (err) {
    console.error('early-access: db insert failed', err);
    return fail(req, 500, 'We could not save your request. Please try again shortly.');
  }

  const subject = `New early-access request — ${body.product} (${body.name})`;
  const text = [
    `New early-access request from accurith.com/products`,
    ``,
    `Product: ${body.product}`,
    `Name:    ${body.name}`,
    `Email:   ${body.email}`,
    ``,
    `Record id: ${saved.id}`,
  ].join('\n');

  const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#1B2A4A;line-height:1.5;">
  <h2 style="color:#0E9E82;margin:0 0 12px;">New early-access request</h2>
  <table cellpadding="4">
    <tr><td><b>Product</b></td><td>${escapeHtml(body.product)}</td></tr>
    <tr><td><b>Name</b></td><td>${escapeHtml(body.name)}</td></tr>
    <tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
  </table>
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
    console.error('early-access: mail send failed (record saved)', saved.id, err);
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
