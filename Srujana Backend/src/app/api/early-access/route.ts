// POST /api/early-access — Products page waitlist.
//
// Contract (J01):
//   POST /api/early-access
//   Content-Type: application/json
//   Body: { name, email, product, website? }
//     - "website" is the honeypot — hidden field, real users leave it empty.
//   Response 200: { success: true }
//   Response 4xx/5xx: { success: false, error: "<generic message>" }
//
// Same order of operations as /api/consultation: validate, honeypot,
// rate-limit, insert, then best-effort mail. See that file for why.
//
// One difference: the table has a unique constraint on (email, product), so
// signing up twice is not an error. We swallow the duplicate and report
// success — the person IS on the list, which is what they asked for, and
// telling them otherwise would just make them try again.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { earlyAccessSchema } from '@/lib/validation';
import { sendNotification, escapeHtml } from '@/lib/mail';
import { clientIp, checkRateLimit, pruneExpiredBuckets, MAX_BODY_BYTES } from '@/lib/abuse';

function fail(status: number, error: string, extraHeaders?: HeadersInit): NextResponse {
  return NextResponse.json(
    { success: false, error },
    { status, headers: { 'Cache-Control': 'no-store', ...extraHeaders } },
  );
}

function ok(): NextResponse {
  return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
}

// Prisma's unique-constraint code. Checked structurally so this file does not
// depend on the generated error classes.
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: unknown }).code === 'P2002'
  );
}

export async function POST(req: Request): Promise<Response> {
  // 1. Body size cap.
  const declaredLen = Number(req.headers.get('content-length') ?? '0');
  if (declaredLen > MAX_BODY_BYTES) return fail(413, 'Payload too large.');

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, 'Payload too large.');

  // 2. Content-type guard.
  const ct = req.headers.get('content-type') ?? '';
  if (!ct.toLowerCase().includes('application/json')) {
    return fail(415, 'Unsupported content type.');
  }

  // 3. Parse.
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail(400, 'Invalid JSON.');
  }

  // 4. Validate.
  const result = earlyAccessSchema.safeParse(parsed);
  if (!result.success) {
    return fail(400, 'Please check the form and try again.');
  }
  const body = result.data;

  // 5. Honeypot. Return 200 so bots log "OK" and move on.
  if (typeof body.website === 'string' && body.website.length > 0) {
    console.log('early-access: honeypot triggered, dropping');
    return ok();
  }

  // 6. Rate limit (per IP, 5 hits per 10 minutes).
  const ip = clientIp(req);
  const rl = checkRateLimit({ ip, bucket: 'early-access', windowMs: 10 * 60_000, max: 5 });
  pruneExpiredBuckets();
  if (!rl.ok) {
    return fail(429, 'Too many submissions. Please try again shortly.', {
      'Retry-After': String(rl.retryAfterSec),
    });
  }

  // 7. Insert. A repeat signup for the same product is a no-op, not a failure.
  let saved;
  try {
    saved = await prisma.earlyAccessRequest.create({
      data: { name: body.name, email: body.email, product: body.product },
      select: { id: true },
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      console.log('early-access: duplicate signup, already on the list');
      return ok();
    }
    // Never surface the ORM name or column detail — that's reconnaissance.
    console.error('early-access: db insert failed', err);
    return fail(500, 'We could not add you to the list. Please try again shortly.');
  }

  // 8. Email the team. Best-effort — a failed alert does not fail the request.
  const subject = `Early access request — ${body.product}`;
  const text = [
    `New early-access request from accurith.com`,
    ``,
    `Name:    ${body.name}`,
    `Email:   ${body.email}`,
    `Product: ${body.product}`,
    ``,
    `Record id: ${saved.id}`,
  ].join('\n');
  const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#1B2A4A;line-height:1.5;">
  <h2 style="color:#0E9E82;margin:0 0 12px;">New early-access request</h2>
  <table cellpadding="4">
    <tr><td><b>Name</b></td><td>${escapeHtml(body.name)}</td></tr>
    <tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
    <tr><td><b>Product</b></td><td>${escapeHtml(body.product)}</td></tr>
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

  return ok();
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
