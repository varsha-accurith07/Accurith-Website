import type { NextConfig } from 'next';

// Standalone build — Next.js emits a minimal Node server at .next/standalone
// that Railway runs. This is the mode that gives us real API routes,
// middleware, and per-request CSP nonces (things static export could not do).
//
// Security headers are attached here (they were in /public/_headers on the
// old Cloudflare Pages setup). See middleware.ts for the CSP header — that
// one is per-request because it carries a nonce.
const nextConfig: NextConfig = {
  output: 'standalone',

  // We're behind Cloudflare which does TLS termination, so tell Next it can
  // trust the X-Forwarded-* headers Cloudflare sets. Without this,
  // `request.url` reports http://... on secure requests.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Blocks SSL-strip downgrades. Two-year max-age and preload eligibility
          // so first-time visitors are protected too.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Legacy clickjacking defense. CSP's frame-ancestors handles the
          // modern browsers; XFO: DENY covers the old ones.
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stops a browser MIME-sniffing an upload into executable content.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Never leak full URLs (with query params) to third-party origins.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Denylist the browser features we don't use, so an injected script
          // can't reach camera/mic/GPS/payment.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          // Isolate the browsing context — cheap defense against Spectre-class
          // cross-origin leaks.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
