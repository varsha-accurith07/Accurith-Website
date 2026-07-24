# Accurith Website

Marketing + backend for **Accurith Technologies Private Limited** (Bengaluru).
Cyber security, IS/IT audit, risk advisory, digital forensics.

Read **`CLAUDE.md`** first — it explains the architecture, ownership
boundaries, and privacy open questions.

---

## Stack

- **Next.js 16** with `output: 'standalone'` — TS, App Router, Tailwind v4
- **Postgres** on Railway, **Prisma** as client + migrations
- **nodemailer** → SMTP → team inbox
- **Cloudflare** in front of Railway for DNS + WAF + TLS
- **Per-request CSP nonces** via `src/middleware.ts` for an A-grade CSP

---

## Local development

### Prerequisites

- Node.js ≥ 20 (tested on 25.8.1)
- npm ≥ 10
- Docker (for a local Postgres)

### First-time setup

```bash
npm install
cp .env.example .env.local
# then edit .env.local — set DATABASE_URL, SMTP_*, MAIL_TO
```

**Start a local Postgres (Docker):**

```bash
docker run -d --name accurith-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=accurith \
  -p 5433:5432 postgres:16-alpine
```

Then in `.env.local`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/accurith
```

**Apply migrations and seed sample job openings:**

```bash
npm run db:migrate       # applies pending migrations + regenerates client
npm run db:seed          # inserts 3 sample job openings
npm run db:studio        # optional — GUI for browsing/editing rows
```

### Run the app

```bash
npm run dev              # Next.js dev on :3000 (hot reload, uses .env.local)
```

Or, to mirror production exactly:

```bash
npm run build && npm start   # standalone build served by `next start`
```

---

## Testing the endpoints

With the app running and a real (or fake) SMTP in `.env.local`:

```bash
# --- GET a real openingId to use below -----------------------------------
OPENING_ID=$(curl -s http://127.0.0.1:3000/api/careers/openings \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['openings'][0]['id'])")
echo $OPENING_ID

# --- 1. Consultation, happy path -----------------------------------------
curl -i -X POST http://127.0.0.1:3000/api/consultation \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"t@example.com","company":"Acme","role":"CTO",
       "service":"Cyber security","message":"Hello."}'
# → HTTP 200 {"success":true}   (row saved in Consultation)

# --- 2. Consultation, bad payload ----------------------------------------
curl -i -X POST http://127.0.0.1:3000/api/consultation \
  -H 'Content-Type: application/json' -d '{}'
# → HTTP 400 {"success":false,"error":"Please check the form and try again."}

# --- 3. Consultation, honeypot filled ------------------------------------
curl -i -X POST http://127.0.0.1:3000/api/consultation \
  -H 'Content-Type: application/json' \
  -d '{"name":"S","email":"s@s.com","company":"C","role":"R","service":"X",
       "message":"m","website":"bot"}'
# → HTTP 200 {"success":true}   (dropped silently, no row written)

# --- 4. Application, happy path ------------------------------------------
curl -i -X POST http://127.0.0.1:3000/api/careers/apply \
  -H 'Content-Type: application/json' \
  -d "{\"openingId\":\"$OPENING_ID\",\"name\":\"Applicant\",\"email\":\"a@ex.com\",
       \"phone\":\"+91 98765 43210\",\"linkedinUrl\":\"https://linkedin.com/in/x\",
       \"coverNote\":\"Interested\"}"
# → HTTP 200 {"success":true}

# --- 5. Application to a bogus opening -----------------------------------
curl -i -X POST http://127.0.0.1:3000/api/careers/apply \
  -H 'Content-Type: application/json' \
  -d '{"openingId":"nope","name":"A","email":"a@ex.com","phone":"+911",
       "linkedinUrl":"https://linkedin.com/in/x","coverNote":"Y"}'
# → HTTP 404 {"success":false,"error":"This role is no longer accepting applications."}

# --- 6. Application with javascript: URL (should reject) -----------------
curl -i -X POST http://127.0.0.1:3000/api/careers/apply \
  -H 'Content-Type: application/json' \
  -d "{\"openingId\":\"$OPENING_ID\",\"name\":\"A\",\"email\":\"a@ex.com\",
       \"phone\":\"+911\",\"linkedinUrl\":\"javascript:alert(1)\",
       \"coverNote\":\"Y\"}"
# → HTTP 400 {"success":false,"error":"Please check the form and try again."}

# --- 7. Rate limit — 6 identical enquiries from the same IP --------------
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "$i=%{http_code} " -X POST http://127.0.0.1:3000/api/consultation \
    -H 'Content-Type: application/json' \
    -d "{\"name\":\"S$i\",\"email\":\"s$i@ex.com\",\"company\":\"C\",
         \"role\":\"R\",\"service\":\"X\",\"message\":\"m\"}"; done; echo
# → 1=200 2=200 3=200 4=200 5=200 6=429   (429 = Too Many Requests)
```

**With a fake SMTP host** (e.g. `SMTP_HOST=smtp.invalid`): the DB row IS
written, the mail send fails, we log the error server-side, and the client
still gets `200 {"success":true}` — by design, so a mail hiccup does not
lose the enquiry.

**Verify a row landed:**

```bash
docker exec accurith-pg psql -U postgres -d accurith \
  -c 'SELECT id, email, service, "createdAt" FROM "Consultation" ORDER BY "createdAt" DESC LIMIT 5;'
```

---

## Adding a job opening

Two ways:

1. **Locally, via Prisma Studio (GUI):**

   ```bash
   npm run db:studio
   ```

   Then edit `JobOpening` rows in the browser.

2. **On Railway, via the Postgres data tab:** click the plugin, "Data",
   `JobOpening`, add row.

Required fields: `slug` (URL-safe, unique), `title`, `department`, `location`,
`employmentType`, `descriptionMd` (Markdown). `isOpen: true` to show it on
the careers page.

---

## Adding a blog post

Create `content/blog/<slug>.mdx`:

```mdx
---
title: 'Your title'
date: '2026-07-17'
author: 'Your Name'
tags: ['optional', 'tags']
excerpt: 'One sentence, ~160 chars.'
draft: false      # true hides from the blog list + sitemap
---

Your MDX body. Standard Markdown plus any React components Varsha exposes.
```

The pipeline (`src/lib/blog.ts`) throws at build time if any required
frontmatter field is missing.

---

## Deploy — Railway

### One-time project setup

1. Create a new Railway project.
2. Add the **Postgres** plugin. Railway injects `${{Postgres.DATABASE_URL}}`.
3. Add this repo as a service. Set:
   - **Root directory:** `Srujana Backend` (until the two scaffolds merge).
   - **Build command:** `npm ci && npx prisma generate && npm run build`
   - **Start command:** `npx prisma migrate deploy && node .next/standalone/server.js`
   - **Healthcheck path:** `/robots.txt` (200 OK, no DB required)
4. **Variables** tab — paste:

   | Var | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Reference the plugin, don't paste raw |
   | `NEXT_PUBLIC_SITE_URL` | `https://accurith.com` | |
   | `SMTP_HOST` | e.g. `smtp.gmail.com` | Provider-agnostic |
   | `SMTP_PORT` | `465` or `587` | Never 25 |
   | `SMTP_USER` | full mailbox address | |
   | `SMTP_PASS` | app password | **Mark as sealed/private** |
   | `MAIL_TO` | shared inbox | |

5. Deploy. Watch logs — first deploy runs migrations automatically via the
   start command.

### Cloudflare DNS

1. Add `accurith.com` in Cloudflare.
2. Point `A` / `CNAME` records at Railway's provided domain
   (`<project>.up.railway.app`).
3. **Grey-cloud (DNS-only) at first** so Railway's cert issues cleanly.
4. Once TLS is verified, **flip to orange cloud (proxied)**. Cloudflare
   now handles CDN + WAF + DDoS.
5. Add Rate Limiting rules on `/api/consultation` and `/api/careers/apply`
   (5 req / IP / min → block 10 min).

### Post-deploy checks

- `curl -I https://accurith.com/` → all six security headers present.
- `curl https://accurith.com/.well-known/security.txt` → text/plain, RFC 9116.
- `curl https://accurith.com/api/careers/openings` → JSON list.
- SSL Labs, securityheaders.com, Mozilla Observatory. Grades expected:
  A+ / A+ / A–A+ (see CLAUDE.md §6 for detail).

---

## Env var reference

Every variable is annotated in `.env.example`. Quick summary:

| Var | Where set | Purpose |
|-----|-----------|---------|
| `DATABASE_URL` | Railway plugin auto, or local `.env.local` | Postgres connection string |
| `NEXT_PUBLIC_SITE_URL` | Railway + `.env.local` | Public site origin (canonical, OG, sitemap) |
| `SMTP_HOST` | Railway + `.env.local` | SMTP server hostname |
| `SMTP_PORT` | Railway + `.env.local` | 465 (implicit TLS) or 587 (STARTTLS) |
| `SMTP_USER` | Railway + `.env.local` | SMTP auth user (usually a full email) |
| `SMTP_PASS` | Railway + `.env.local` | SMTP auth password (mark sealed in Railway) |
| `MAIL_TO` | Railway + `.env.local` | Team inbox for alerts |

`.env.local` is git-ignored. `.env.example` is committed.

---

## Troubleshooting

**`Environment variable not found: DATABASE_URL` during a Prisma command.**
Prisma reads `.env`, not `.env.local`, by default. Either duplicate the value
into `.env`, or prefix the command: `DATABASE_URL="..." npx prisma ...`.

**Route returns 200 in prod but no row in DB.**
Look at Railway logs. Two paths: (a) honeypot triggered — legitimate silent-drop;
(b) DB insert failed and returned 500 — logs will say `db insert failed`.

**Route returns 200 but no email arrived.**
By design. Mail send is best-effort — if it fails after the DB save, we log
loudly (`mail send failed (record saved)`) and still return success. Check
Railway logs, fix SMTP creds, catch up manually.

**Rate-limit resets after every deploy.**
Yes, expected. In-memory counter. See CLAUDE.md §5.

**CSP blocks something Varsha added.**
Add a nonce, or move the resource to a first-party path. Do NOT add
`'unsafe-inline'` to `script-src` — that regresses our Observatory grade.
Look at `src/middleware.ts` for the current allowlist.

**Path has a space (`Srujana Backend/`).**
Live with it or `git mv "Srujana Backend" srujana-backend`. Every tool quotes
paths internally but shell one-liners need care.

---

## Where things live

```
├── content/blog/              Srujana — MDX posts
├── prisma/                    Srujana — schema, migrations, seed
├── public/.well-known/        Srujana — security.txt
├── public/images/, icons/     Varsha  — brand assets
├── src/
│   ├── app/
│   │   ├── layout.tsx         Shared (Srujana: metadata + nonce; Varsha: JSX)
│   │   ├── globals.css        Varsha — Tailwind v4 tokens
│   │   ├── page.tsx           Varsha — all pages
│   │   ├── api/               Srujana — route handlers
│   │   ├── sitemap.ts         Srujana
│   │   └── robots.ts          Srujana
│   ├── components/            Varsha — all React UI
│   ├── lib/                   Srujana — db, mail, validation, abuse, metadata, blog
│   └── middleware.ts          Srujana — per-request CSP nonce
├── .env.example               Srujana — committed template
├── next.config.ts             Srujana — standalone build + static headers
├── CLAUDE.md                  Read first
└── TASKS.md                   S01–S30 tracker
```
