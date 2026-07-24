# CLAUDE.md — Accurith Website (srujana-backend)

Read this before editing anything. It supersedes every other CLAUDE.md,
AGENTS.md, README or "project knowledge" file anywhere in this repo,
including anything under `varsha-frontend/`. Earlier files describing
Cloudflare Pages static export, `worker-mailer`, `/functions/`, `output:
'export'`, `public/_headers` or Zoho CRM inside THIS folder are dead
architecture. If you see any of that here, it's stale — do not build to it.

Note: `varsha-frontend/` still uses `output: 'export'` — that's her app's
production model (Cloudflare Pages), not stale. Her contract with us is
CORS-over-HTTP from her origin to this backend.

---

## 1. What we're building and where it runs

Marketing site + backend for **Accurith Technologies Private Limited**
(Bengaluru — cyber security, IS/IT audit, risk advisory, digital forensics).

**Runtime architecture (confirmed, do not propose alternatives):**

- **Two apps in one repo**, permanent split:
  - `srujana-backend/` — this project. Next.js 16 standalone on Railway. API,
    Prisma, nodemailer.
  - `varsha-frontend/` — Varsha's Next.js 16 static export on Cloudflare Pages.
    Owned by @varsha-accurith07. Enforced by `.github/workflows/frontend-guard.yml`.
- **Hosting:** Railway (Node runtime, not serverless). Cloudflare in front for
  DNS, CDN, WAF, TLS on the API subdomain (e.g. `api.accurith.com`). Varsha's
  static bundle sits on Cloudflare Pages at `accurith.com`.
- **App:** Next.js 16, TypeScript, App Router, `src/`, Tailwind v4.
  **`output: 'standalone'`**. Real API routes. Middleware. Per-request CSP nonce.
- **DB:** PostgreSQL on Railway. Prisma as client + migrations. Locally via
  `docker-compose.yml` on host port 5433.
- **Mail:** nodemailer → SMTP → team inbox. Provider-agnostic via env vars.
- **CORS:** allowlist. `http://localhost:3000` always allowed; production origin
  from `FRONTEND_ORIGIN` env var. Never `*`. See `src/lib/cors.ts`.
- **Pattern:** Every form writes to Postgres AND emails an alert. The row is
  truth; the email is how we notice.
- **Analytics:** Plausible, only after cookie consent. Never Google Analytics.

**We are on a Node server.** nodemailer is the right library.
`worker-mailer` / `cloudflare:sockets` are gone.

---

## 2. Ownership boundaries — do not cross

### Srujana owns everything under `srujana-backend/`:

| Path | Purpose |
|------|---------|
| `prisma/` | Schema + migrations + seed |
| `src/app/api/` | Route handlers |
| `src/lib/` | db.ts, mail.ts, validation.ts, abuse.ts, cors.ts, metadata.ts, blog.ts |
| `content/blog/` | MDX posts (currently not surfaced anywhere) |
| `public/.well-known/` | security.txt |
| `next.config.ts` | Static headers + build config |
| `src/middleware.ts` | Per-request CSP nonce |
| `src/app/layout.tsx` | Metadata + nonce plumbing + JSON-LD (for THIS app's pages) |
| `docker-compose.yml`, `.env.example`, Railway config | Config |
| `src/app/sitemap.ts`, `src/app/robots.ts` | SEO artifacts |

Also root-level `.github/workflows/frontend-guard.yml` is owned by Srujana in
the sense that Varsha won't edit it — but I NEVER edit it to let my commits
touch `varsha-frontend/`. Working around the guard is a "never do".

### Varsha owns everything under `varsha-frontend/`. Do not touch.

A CI check called "Frontend Guard" fails the build on any push whose actor is
not `@varsha-accurith07` and whose diff touches `varsha-frontend/**`. If a
task appears to need a frontend change, STOP, describe what I needed and
which file, and ask Varsha.

---

## 3. Architecture map

```
Browser ── HTTPS ─► accurith.com (Cloudflare Pages)
                     serves varsha-frontend static bundle
                     │
                     ▼ fetch(FRONTEND makes CORS calls)
Browser ── HTTPS ─► api.accurith.com (Cloudflare → Railway)
                     │
                     ▼ Next.js 16 standalone (srujana-backend/)
              ┌──────┴──────┐
              ▼             ▼
  middleware.ts       /src/app/api/*
  (per-req CSP     POST /contact          → Consultation
   nonce for       POST /early-access     → EarlyAccess
   this app's      POST /careers/apply    → JobApplication
   own pages)      GET  /careers/openings → reads JobOpening
                            │
                            ▼
                     src/lib/cors.ts
                     (allowlist: localhost:3000 + FRONTEND_ORIGIN)
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       Postgres (Railway)         SMTP (env-configured)
       Consultation               → team inbox
       EarlyAccess
       JobOpening
       JobApplication
```

**No cross-instance state.** The rate limiter's in-memory Map only works
because Railway runs one long-lived process. See §5.

---

## 4. Never-do list

1. **Never** use `output: 'export'`. That's the old static architecture.
2. **Never** use `worker-mailer`, `cloudflare:sockets`, `/functions/`,
   `public/_headers`, or `wrangler.toml`. All removed.
3. **Never** put security headers only in `next.config.ts` — the CSP header
   must come from `middleware.ts` because it carries a per-request nonce.
   The other five headers live in `next.config.ts`.
4. **Never** build raw SQL by string concatenation. Prisma parameterises;
   use it.
5. **Never** leak DB, SMTP or stack error text to the client. Log server-side,
   return generic. An error message that names your ORM is reconnaissance.
6. **Never** use port 25 for SMTP. Use 587 (STARTTLS) or 465 (implicit TLS).
7. **Never** hardcode an SMTP host. Mailbox choice is not final; we swap by
   editing env vars.
8. **Never** put `NEXT_PUBLIC_` on anything server-side. That prefix inlines
   the value into the browser bundle.
9. **Never** loosen the CSP silently. If Next.js breaks, flag the trade-off.
10. **Never** claim a certification Accurith doesn't hold. "We align to" /
    "we help clients achieve" only. Frameworks are text chips, never seals.
11. **Never** create `tailwind.config.ts`. Tailwind v4 uses CSS-first config.
12. **Never** edit anything under `varsha-frontend/`. The Frontend Guard
    (`.github/workflows/frontend-guard.yml`) fails the build. Stop and
    describe what you needed and which file — flag for Varsha.
13. **Never** edit the Frontend Guard workflow to let yourself through.
14. **Never** accept file uploads on the careers endpoint in this phase.
    Applicants give links (LinkedIn / portfolio / Drive). Uploads = Phase 2.
15. **Never** set `Access-Control-Allow-Origin: '*'`. The allowlist in
    `src/lib/cors.ts` is deliberate — anything wider lets any site on the
    internet call our submission endpoints.

---

## 5. Rate limit — what's real, what isn't

The in-memory limiter in `src/lib/abuse.ts` is REAL for our current setup:
Railway runs ONE Node process, a `Map<string, Bucket>` persists across
requests. Config: 5 hits per IP per 10 minutes per bucket.

Two failure modes it does NOT cover, documented so future-me knows:

- **Resets on deploy.** Every push zeros the counters. At 5 enquiries/week
  that's a non-issue.
- **Breaks under horizontal scaling.** Each replica has its own Map; an
  attacker gets 2× the quota. If we ever scale, move to Redis (Upstash) or a
  DB-backed limiter.

The Cloudflare WAF in front of us adds another layer we do not control from
code. If abuse becomes a problem, add a Rate Limiting rule at Cloudflare
before adding complexity here.

---

## 6. CSP grade — the honest ceiling

We now use per-request nonces + `strict-dynamic`. Both were impossible under
static export — this is the entire reason we moved to standalone.

| Scanner | Predicted | What's still between us and A+ |
|---------|-----------|-------------------------------|
| **SSL Labs** | **A+** (with Cloudflare TLS) | Nothing at our end — depends on the Cloudflare/Railway TLS chain. Blocker: needs custom domain live. |
| **securityheaders.com** | **A+** | Should be clean — six headers plus a nonce'd CSP. |
| **Mozilla Observatory** | **A / A+ (~100/100)** | Small deductions possible for `style-src 'unsafe-inline'` (Tailwind + Next inject inline styles; Observatory does not dock this the way it docks script-src). If the grade comes back short, the fix is to migrate to nonce'd styles or hash-pin them — 4–8 hrs of work. |

The critical piece: **`script-src` NEVER contains `'unsafe-inline'`.** That's
where Observatory hurts most. We use `'nonce-<random>' 'strict-dynamic'`
instead — safe and modern.

---

## 7. Submission contracts (J01 with Varsha)

Every POST route also accepts `OPTIONS` for CORS preflight. Origin must be
`http://localhost:3000` (dev, hardcoded) or match `FRONTEND_ORIGIN` env var
(prod). Any other Origin → 403 on preflight; `Content-Type: application/json`
mandatory on the POST or 415.

### `POST /api/contact` — writes to `Consultation`

Matches Varsha's `ContactForm.tsx` field set (was previously called
`/api/consultation` on my side; renamed to match her mock's URL).

```jsonc
{
  "name":     "string, 1–200",
  "email":    "email, ≤254",
  "company":  "string, 1–200",
  "role":     "string, 1–200",
  "service":  "string, 1–200",
  "message":  "string, 1–5000",
  "website":  ""     // honeypot — MUST be empty; hidden in Varsha's form
}
```
Response 200 `{ "success": true }` on happy path OR honeypot triggered.
Response 400 / 413 / 415 / 429 / 500 with `{ "success": false, "error": "…" }`.

### `POST /api/early-access` — writes to `EarlyAccess`

Matches Varsha's `EarlyAccessForm.tsx` on the Products page.

```jsonc
{
  "name":    "string, 1–200",
  "email":   "email, ≤254",
  "product": "string, 1–200",
  "website": ""     // honeypot
}
```
Same 200 / 4xx / 5xx shape as `/api/contact`.

### `POST /api/careers/apply`
```jsonc
{
  "openingId":    "string (from GET openings)",
  "name":         "string",
  "email":        "email",
  "phone":        "digits + separators, 6–20",
  "linkedinUrl":  "http(s) URL",
  "portfolioUrl": "http(s) URL, optional",
  "coverNote":    "string, 1–5000",
  "website":      ""     // honeypot
}
```
404 if `openingId` unknown or `isOpen: false` (indistinguishable on purpose).

### `GET /api/careers/openings`
Returns `{ openings: [ { id, slug, title, department, location, employmentType, descriptionMd, postedAt } ] }`. `isOpen = true` only. Cached 60s public. CORS applies (Varsha's static bundle fetches from the browser).

---

## 8. Privacy — open questions (S23 territory)

We now store personal data. **These are decisions for the client, not me:**

- **Retention** — how long do rows live before hard-delete? Placeholder:
  `{{RETENTION_PERIOD}}`. My default suggestion: 24 months for consultations
  and early-access requests, 36 months for applications (both align to a
  routine audit cycle).
- **Right to erasure (DPDP 2023 §12; GDPR Art. 17)** — a data subject can
  ask us to delete their record. Prototype answer: **manual SQL via Railway
  Postgres dashboard**, triggered by a request to `privacy@accurith.com`.
  Say so on the page.
- **Data residency** — Railway has no India region; the nearest is
  **Singapore**. Applicant and enquirer personal data will sit in Singapore.
  DPDP allows cross-border transfer unless the government publishes a
  negative list (§16 read with §17). Confirm with counsel; if residency
  becomes binding, we replatform to AWS ap-south-1 / a domestic cloud.
- **Privacy Policy rewrite** — the pre-Phase-1 draft says "we email
  enquiries and store nothing." That is now false and it's S23. Do not
  publish anything trust-facing until it's updated.

---

## 9. Two-directory reality — permanent

Repo has two sibling apps that DO NOT merge:

- `srujana-backend/` — Next.js 16 standalone on Railway. Everything below the
  API line.
- `varsha-frontend/` — Next.js 16 static export on Cloudflare Pages. Everything
  above the API line.

They are glued by HTTP+CORS at the API boundary. Local dev:

| Service | Port |
|---------|------|
| Varsha's frontend (`next dev` in `varsha-frontend/`) | 3000 |
| This backend (`next dev` in `srujana-backend/`) | 3001 |
| Postgres (docker-compose) | 5433 (host) → 5432 (container) |

She sets `NEXT_PUBLIC_API_URL` in her `.env.local` to `http://localhost:3001`.
Her fetch calls resolve `${NEXT_PUBLIC_API_URL}/api/contact` etc. In prod she
sets it to whatever we deploy the backend at (e.g. `https://api.accurith.com`)
and we set `FRONTEND_ORIGIN=https://accurith.com` on Railway.

That last integration change is on Varsha's side and it's her only ask from me.
Her file: `varsha-frontend/src/mocks/contact.ts` — swap the mock body for
`fetch(process.env.NEXT_PUBLIC_API_URL + '/api/contact', …)`. Same shape for
`src/mocks/earlyAccess.ts`.
