# TASKS — Srujana track

Status legend: ✅ done · 🟡 in progress · ⬜ pending · ⚫ blocked

## Monday — Setup

| ID  | P | Task | Status |
|-----|---|------|--------|
| S01 | P0 | GitHub repo + branch protection | ⚫ (Accurith org access, client action) |
| S02 | P0 | Next.js 16 scaffold, TS, Tailwind v4, App Router, `src/`, `output:'standalone'`, build verified | ✅ |
| S03 | P0 | ESLint + Prettier + Husky + lint-staged | ✅ |
| S04 | P0 | Security headers in `next.config.ts` (5) + CSP nonce in `middleware.ts` (6th) | ✅ |
| S05 | P0 | Railway project + Postgres provisioned | ⚫ (Railway account, Srujana action) |
| S06 | P1 | `security.txt` at `/.well-known/` (RFC 9116) | ✅ |
| S07 | P0 | `.env.example` with every var commented; `.gitignore` covers `.env*.local` | ✅ |

## Tuesday — Backend + SEO

| ID  | P | Task | Status |
|-----|---|------|--------|
| S08a | P0 | Prisma schema — Consultation, JobOpening, JobApplication | ✅ |
| S08b | P0 | `src/lib/db.ts` (Prisma singleton) | ✅ |
| S08c | P0 | Initial migration + seed 3 sample openings | ✅ (verified end-to-end against docker Postgres) |
| S08d | P0 | `src/lib/validation.ts` (zod schemas for both routes) | ✅ |
| S08e | P0 | `src/lib/mail.ts` (nodemailer, provider-agnostic) | ✅ |
| S08f | P0 | `src/lib/abuse.ts` (IP + honeypot + rate limit) | ✅ |
| S08g | P0 | `POST /api/consultation` | ✅ |
| S08h | P0 | `POST /api/careers/apply` + `GET /api/careers/openings` | ✅ |
| S09  | P1 | Consent-mode cookie banner scaffolding | ⬜ (blocked on Varsha's UI component) |
| S10  | P1 | Plausible analytics loader (post-consent) | ⬜ (no Plausible account yet — Srujana action) |
| S11  | P0 | MDX pipeline: `next-mdx-remote` + `gray-matter`, `src/lib/blog.ts` | ✅ |
| S12  | P0 | Sample MDX post | ✅ |
| S13  | P0 | `src/lib/metadata.ts` — `createMetadata()` helper | ✅ |
| S14  | P0 | Organization JSON-LD in root layout + `sitemap.ts` + `robots.ts` | ✅ |

## Wednesday — Wiring

| ID  | P | Task | Status |
|-----|---|------|--------|
| S15 | P1 | Wire consultation form → `/api/consultation` | ⬜ (blocked on Varsha's `<ContactForm>`) |
| S16 | P1 | Call `createMetadata()` from every `page.tsx` | ⬜ (blocked on Varsha's page.tsx files) |
| S17 | P2 | `/resources/blog` reads `getAllPosts()` | ⬜ (blocked on Varsha's `BlogCard`, `BlogPostLayout`) |
| S18 | P1 | Wire careers form → `/api/careers/apply` and openings list → `/api/careers/openings` | ⬜ (blocked on Varsha's `<CareersList>`, `<ApplyForm>`) |
| S19 | P2 | Trust & Security page technical copy | ⬜ |

## Thursday — Legal + polish

| ID  | P | Task | Status |
|-----|---|------|--------|
| S20 | P1 | Legal drafts (Privacy, Terms, Cookies, DPA) with "pending counsel" banner | ⬜ |
| S21 | P2 | Report-a-vulnerability page copy | ⬜ |
| S22 | P2 | 404 copy (Varsha lays out) | ⬜ |
| S23 | **P0** | **Privacy Policy — rewrite to reflect we now store personal data** | ⬜ (SEE CLAUDE.md §8) |

## Friday — Ship prep

| ID  | P | Task | Status |
|-----|---|------|--------|
| S24 | P0 | Cloudflare WAF rate-limit on `/api/consultation` and `/api/careers/apply` | ⚫ (needs prod project) |
| S25 | P0 | Populate Railway env vars: `DATABASE_URL` (auto), SMTP_*, MAIL_TO, `NEXT_PUBLIC_SITE_URL` | ⚫ (SMTP mailbox not chosen) |
| S26 | P0 | Final scanner pass (SSL Labs / securityheaders / Observatory) | ⬜ (post-DNS) |
| S27 | P1 | Verify `security.txt` accessible on production | ⬜ |
| S28 | P1 | Submit sitemap to Google Search Console | ⬜ |
| S29 | P2 | Rich Results Test for Organization JSON-LD | ⬜ |

## Saturday — Launch

| ID  | P | Task | Status |
|-----|---|------|--------|
| S30 | P0 | Merge to `main`, tag release, prod smoke test | ⬜ |

---

## Blocked on Varsha

Contract to share with her at the standup:

- `<ContactForm>` posts to `/api/consultation` with the hidden honeypot
  field named `website`.
- `<ApplyForm>` posts to `/api/careers/apply` with `openingId` from the
  `GET /api/careers/openings` list, plus honeypot `website`.
- Every `page.tsx` imports `createMetadata` from `@/lib/metadata`.

## Blocked on client / dashboard / DNS

- **GitHub** — Accurith org, create repo, branch protection on `main`.
- **Railway** — create project, add Postgres plugin, deploy this branch,
  paste SMTP env vars.
- **Cloudflare** — DNS to Railway's custom domain, DNS-only (grey cloud)
  during first-boot, then flip to proxied (orange cloud) after WAF rules.
- **SMTP mailbox** — pick provider (Gmail Workspace / SES / Zoho / etc.),
  generate app password if 2FA'd, populate Railway env vars.
- **Client decision** — retention period, residency (Singapore vs. India),
  legal sign-off on Privacy Policy rewrite (S23).
- **Leadership bios/credentials, service substance notes, brand asset lock.**
