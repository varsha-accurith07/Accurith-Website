# CLAUDE.md — Accurith Website (Srujana Backend)

Read this before editing anything. It supersedes every other CLAUDE.md,
AGENTS.md, README or "project knowledge" file anywhere in this repo,
including anything under `varsha-frontend/`. Earlier files describing
Cloudflare Pages static export, `worker-mailer`, `/functions/`, `output:
'export'`, `public/_headers` or Zoho CRM are dead architecture. If you see
any of that, it's stale — do not build to it.

---

## 1. What we're building and where it runs

Marketing site + backend for **Accurith Technologies Private Limited**
(Bengaluru — cyber security, IS/IT audit, risk advisory, digital forensics).

**Runtime architecture (confirmed, do not propose alternatives):**

- **Hosting:** Railway (Node runtime, not serverless). Cloudflare in front for
  DNS, CDN, WAF, TLS.
- **App:** Next.js 16, TypeScript, App Router, `src/`, Tailwind v4.
  **`output: 'standalone'`**. Real API routes. Middleware. Per-request CSP nonce.
- **DB:** PostgreSQL on Railway. Prisma as client + migrations.
- **Mail:** nodemailer → SMTP → team inbox. Provider-agnostic via env vars.
- **Pattern:** Every form writes to Postgres AND emails an alert. The row is
  truth; the email is how we notice.
- **Analytics:** Plausible, only after cookie consent. Never Google Analytics.

**We are on a Node server.** nodemailer is the right library.
`worker-mailer` / `cloudflare:sockets` are gone.

---

## 2. Ownership boundaries — do not cross

### Srujana owns (edit these):

| Path | Purpose |
|------|---------|
| `/prisma/` | Schema + migrations + seed |
| `/src/app/api/` | Route handlers |
| `/src/lib/` | db.ts, mail.ts, validation.ts, abuse.ts, metadata.ts, blog.ts |
| `/content/blog/` | MDX posts |
| `/public/.well-known/` | security.txt |
| `next.config.ts` | Static headers + build config |
| `/src/middleware.ts` | Per-request CSP nonce |
| `/src/app/layout.tsx` | Metadata export + nonce plumbing + JSON-LD (see §3) |
| `.env.example`, Railway config | Config templates |
| `src/app/sitemap.ts`, `src/app/robots.ts` | SEO artifacts |

### Varsha owns (stop and ask):

| Path | Purpose |
|------|---------|
| `/src/components/` | All React UI |
| `/src/app/globals.css` | Tailwind v4 design tokens |
| `/public/images/`, `/public/icons/` | Brand assets |
| `/src/app/**/page.tsx` | All page visuals |

**Tailwind v4 note:** there is NO `tailwind.config.ts`. Tokens live in
`globals.css` via `@theme inline { ... }`. Do not create a Tailwind config.

### The `layout.tsx` boundary

Srujana touches: the `metadata` export, the `headers()` call that reads the
CSP nonce, and the one `<script type="application/ld+json">` line. Varsha
owns the shell (`<html>` classes, `<body>` structure, font wiring).

---

## 3. Architecture map

```
Browser ─── HTTPS ───► Cloudflare (DNS + CDN + WAF + TLS)
                            │
                            ▼  proxied (grey cloud OFF for now, see §Deploy)
                     Railway (Node + Next.js 16 standalone)
                            │
    ┌───────────────────────┼───────────────────────┐
    ▼                       ▼                       ▼
 middleware.ts        /src/app/api/*         layout.tsx / pages
 (per-req CSP        POST /consultation      (Varsha's JSX)
  nonce)             POST /careers/apply
                     GET  /careers/openings
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       Postgres (Railway)         SMTP (env-configured)
       Consultation               → team inbox
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
12. **Never** edit Varsha's files. Stop and describe what you needed.
13. **Never** accept file uploads on the careers endpoint in this phase.
    Applicants give links (LinkedIn / portfolio / Drive). Uploads = Phase 2.

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

### `POST /api/consultation`
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
Returns `{ openings: [ { id, slug, title, department, location, employmentType, descriptionMd, postedAt } ] }`. `isOpen = true` only. Cached 60s public.

### `POST /api/early-access`
```jsonc
{
  "name":    "string, 1–200",
  "email":   "email, ≤254",
  "product": "string, 1–200",   // label from the Products page select
  "website": ""                 // honeypot
}
```
Response 200 `{ "success": true }` on insert, on honeypot, AND on a repeat
signup — `EarlyAccessRequest` is unique on `(email, product)`, and someone
signing up twice is already on the list, which is what they asked for.

---

## 8. Privacy — open questions (S23 territory)

We now store personal data. **These are decisions for the client, not me:**

- **Retention** — how long do rows live before hard-delete? Placeholder:
  `{{RETENTION_PERIOD}}`. My default suggestion: 24 months for consultations,
  36 months for applications (both align to a routine audit cycle).
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

## 9. Two-directory reality check — MERGED

The merge described here happened on `feat/integrate-direction-c`
(2026-07-25), in the documented direction: Varsha's components, 23 page
routes, `globals.css` and brand assets moved INTO this project. This is now
the only app that renders the site.

`varsha-frontend/` still exists and still builds, but nothing depends on it.
It is a reference copy of the Direction C source, pending a team decision to
delete it. **Do not develop there** — changes made in that folder do not
reach the site.

What changed in this project as a result:

- `globals.css` carries the full Direction C token set in `@theme`, ported
  from Varsha's old Tailwind v3 config. Still v4, still no
  `tailwind.config.ts` (rule #11 holds).
- `src/components/blog/blogData.ts` is a display-shaped view over
  `src/lib/blog.ts`. Posts live in `/content/blog/*.mdx` and render through
  `/blog/[slug]`. `BlogPostMeta` gained `category`, `readTime`,
  `displayDate`, `featured`, `image`, `imageAlt`, `imagePos` — additive only,
  the three exported function signatures are unchanged.
- All three forms now POST to real routes. No mocks remain; `src/mocks/` is
  gone.
- `sitemap.ts` was advertising `/careers`, `/resources/blog`,
  `/services/risk-grc`, `/services/managed` and `/solutions`, none of which
  exist. Now matched to the real tree — keep it that way when routes move.

### Still open

- **DB write path is unverified.** Every route was exercised to the point of
  the Prisma call, but no Postgres was available, so no insert or SMTP send
  has ever succeeded. Run `db:migrate:deploy` then re-test all three forms
  before trusting them.
- **Migration `20260725000000_add_early_access_request` has never been
  applied.** It was generated offline via `prisma migrate diff`.
- **`/kitchen-sink` is publicly reachable.** It is an internal component
  gallery, kept out of the sitemap but not out of the crawl. Decide whether
  to noindex or drop it before launch.
- **Leadership cards on `/about` are placeholders** pending real bios, photos
  and certifications from the client.
