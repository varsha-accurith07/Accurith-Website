// CORS — allowlist-based, no wildcards.
//
// Varsha's frontend runs on http://localhost:3000 in dev and on a real origin
// in production (Cloudflare Pages / accurith.com). Both are configured
// explicitly: dev is hardcoded so it always works locally, prod is read from
// FRONTEND_ORIGIN so we can swap it by editing an env var.
//
// Never use Access-Control-Allow-Origin: '*'. Doing so also disables cookies
// and would let any site on the internet trigger our submission endpoints.

const ALWAYS_ALLOWED = new Set<string>(['http://localhost:3000', 'http://127.0.0.1:3000']);

function allowedOrigins(): Set<string> {
  const set = new Set(ALWAYS_ALLOWED);
  const prod = process.env.FRONTEND_ORIGIN?.trim();
  if (prod) set.add(prod);
  return set;
}

// If the request's Origin is in the allowlist, return it verbatim (so the
// response Access-Control-Allow-Origin echoes exactly what the browser sent).
// Otherwise return null — no CORS header at all, the browser blocks the read.
function matchOrigin(req: Request): string | null {
  const origin = req.headers.get('origin');
  if (!origin) return null;
  return allowedOrigins().has(origin) ? origin : null;
}

// Headers to attach to a normal (non-preflight) response.
export function corsHeaders(req: Request): Record<string, string> {
  const origin = matchOrigin(req);
  if (!origin) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

// Preflight — the browser sends OPTIONS before a POST with a JSON body because
// application/json is not a "simple" content type. Answer 204 + the same
// allowlist, plus the methods and headers we permit.
export function handlePreflight(req: Request): Response {
  const origin = matchOrigin(req);
  if (!origin) {
    // Bad origin — respond 403 with no CORS headers. The browser will show a
    // CORS error to the caller and block the follow-up POST.
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}
