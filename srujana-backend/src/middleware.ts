// Per-request CSP nonce.
//
// The CSP has to live here, not in next.config.ts, because the `nonce`
// changes on every request. Every inline <script> and <style> that Next.js
// emits (its hydration payload, its critical CSS block) must carry the same
// nonce. The `next/script`, `next/head` and root-layout render pipeline reads
// the nonce from the `x-nonce` request header we set here — that's the
// contract with Next 16's built-in nonce support.
//
// Doing this correctly is what makes an A+ on Mozilla Observatory possible.
// Without nonces we would have to add 'unsafe-inline' to script-src which
// costs 20 points there.

import { NextResponse, type NextRequest } from 'next/server';

function base64Nonce(): string {
  // 16 bytes of randomness → 24 base64 chars. Enough entropy that guessing
  // the nonce inside the 1-request lifetime is infeasible.
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  let bin = '';
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin);
}

function cspFor(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  // Dev needs 'unsafe-eval' for Turbopack's HMR runtime. Production does not.
  const scriptExtras = isDev ? " 'unsafe-eval'" : '';
  return [
    "default-src 'self'",
    // strict-dynamic + nonce lets the initial nonce'd inline scripts load
    // further scripts of their own without needing per-hash pinning. Modern
    // browsers ignore the 'self' when they see strict-dynamic; old ones fall
    // back to it.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${scriptExtras}`,
    // Tailwind and Next inject inline <style> blocks. 'unsafe-inline' here is
    // the accepted trade-off — Observatory does NOT penalize inline styles
    // the same way it does inline scripts.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // No third-party APIs from the browser today. Add here if we ever ship
    // Plausible: plausible.io. Do NOT add the SMTP host — SMTP is server-only.
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export function middleware(request: NextRequest) {
  const nonce = base64Nonce();
  const csp = cspFor(nonce);

  // Pass the nonce down to the Next.js render pipeline via a request header.
  // Next 16 reads `x-nonce` and applies it to every inline script it emits.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  // Set the actual response header the browser reads.
  response.headers.set('content-security-policy', csp);
  return response;
}

// Apply to every route except Next's static assets, images, and favicon —
// those are served without a document context and don't need a CSP.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.well-known).*)',
  ],
};
