# CLAUDE.md — Accurith Website Project Knowledge

> **⚠️ INSTRUCTION TO CLAUDE (READ FIRST):**
> This file is **PROJECT KNOWLEDGE ONLY**. Do **NOT** implement, scaffold, generate, or modify any code based on this file on your own initiative.
> Development has **not started yet**. Until Varsha or Srujana explicitly asks you to build a specific task (e.g., "implement V05" or "help me with S08"), your only job is to **know** this context and use it to answer questions accurately.
> - ❌ Do NOT create files, folders, components, or configs unprompted.
> - ❌ Do NOT run `create-next-app`, install packages, or scaffold anything "to get started."
> - ❌ Do NOT suggest "shall I set this up for you?" proactively.
> - ✅ DO use this knowledge when the team asks questions or explicitly requests implementation of a named task.
> - ✅ DO reference task IDs (V01–V33, S01–S30, J01–J07) when discussing work.

---

## 1. What This Project Is

We are building the **Phase 1 launch website for Accurith Technologies Private Limited** — a newly formed company in Bengaluru, India. Domain: **accurith.com**.

**What Accurith does:**
1. **Advisory** — cybersecurity, IS/IT audit, risk management, GRC, and digital forensics consulting.
2. **Products** — software platforms to automate audit/risk work (still in testing, NOT launched — presented as "Launching Soon" on the site).

**The client's north star (their exact words):** *"Develop it as if it is one of the top-most recognised, trustworthy, secure firms — a client who sees the site should never wonder whether it's secure; they should reach out without any confusion."*

---

## 2. The Core Strategy (most important thing to understand)

Accurith is brand new: **no certifications, no client logos, no case studies, no awards.** So the website itself becomes the proof of trustworthiness:

1. **The site must BE secure, not just say it.** Target buyers (CISOs, auditors, CROs) will run security scanners on the site. We build to score **A+ on SSL Labs, securityheaders.com, and Mozilla Observatory** deliberately.
2. **Honest framing — NEVER fake claims.** We write *"we help clients achieve ISO 27001"* — NEVER *"we are ISO 27001 certified"* (they are not). Frameworks appear as **plain text chips, never badge/seal images**. Getting caught overstating anything would be catastrophic for a trust-based business.
3. **Team credentials are the #1 trust asset.** Leadership holds CISA, CISSP, CISM, CEH, CA. Personal credentials matter more than a new company's name — featured prominently on About/Leadership.
4. **Design = credibility.** Clean, spacious, precise. Light theme, **teal accent (#0E9E82)**, deep navy (#1B2A4A) for text/contrast bands. Fonts: **Inter** (body) + **Sora** (headings). Abstract geometric graphics only — NO hooded-hacker stock photos. Subtle motion only.
5. **Privacy-first everything.** NO Google Analytics — use **Plausible or Umami**. Proper GDPR/DPDP cookie consent. Minimal third-party scripts. `security.txt` + responsible-disclosure page.

**Wording rules that apply to ALL copy on ALL pages:**
- "align to" / "help clients achieve" — never "certified" / "we hold" unless literally true
- No invented numbers ("500+ audits delivered"), no fake testimonials, no fake client logos
- Specific, correct terminology (VAPT, ITGC, COBIT, SOC 2 Type II) — vague hype destroys credibility with this audience

---

## 3. Tech Stack (confirmed decisions — do not substitute)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router, TypeScript), static export** (`output: 'export'`) | Pre-built HTML = fast + minimal attack surface |
| Styling | **Tailwind CSS** | Speed + consistency; design tokens in `tailwind.config.ts` |
| Hosting | **Cloudflare Pages** (free tier) | Global CDN, auto-HTTPS, WAF/DDoS baseline, auto-deploy from GitHub |
| Forms/CRM | **Zoho CRM** via API (leads) — using **Cloudflare Pages Functions** (static export means no Next.js API routes in production) | Client's existing tool |
| Email | **Google Workspace** (client's existing) + Zoho workflow rules for lead alerts | |
| Blog | **MDX files** in `/content/blog/` (next-mdx-remote + gray-matter) | No database, nothing to hack |
| Analytics | **Plausible or Umami**, loaded only after cookie consent | Privacy-first, on-brand |
| Database | **NONE in Phase 1** | Forms → Zoho; blog → files |
| Repo | GitHub, under **Accurith's own org** (client owns the code) | Contractual requirement |

**Security headers (must all be present — task S04):** HSTS (`max-age=63072000; includeSubDomains; preload`), strict CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`. Plus `/.well-known/security.txt` (RFC 9116).

---

## 4. Sitemap (~25 pages, Phase 1)

```
Home (9 sections: hero, trust strip, 4 service cards, methodology,
      solutions-by-role, AI highlight, products teaser, security band, final CTA)
├── Services (overview)
│   ├── Cyber security          ★ featured
│   ├── IS / IT audit           ★ featured
│   ├── AI automation           ★ featured
│   ├── Digital forensics       ★ featured
│   ├── Risk & GRC advisory
│   └── Managed services
├── Solutions
│   ├── By use case ×4 (IS audit · continuous monitoring · compliance readiness · incident response)
│   ├── By role ×4 (CISO · Head of Internal Audit · CRO · CFO)
│   └── By industry ×3 (Banking & fintech · Insurance · Healthcare)
├── Products → "Launching soon" + Request early access form
├── Trust & Security  ← THE key credibility page
│   ├── Frameworks we align to (text chips + honest-framing statement)
│   ├── Our security posture (incl. this site's own security)
│   └── Report a vulnerability (responsible disclosure)
├── About (company + leadership w/ credentials) · Careers
├── Resources → Blog (1–2 MDX posts at launch)
├── Contact / Book a consultation  ← PRIMARY conversion → Zoho CRM
└── Legal (Privacy · Terms · Cookies · DPA — drafts for counsel review)
```

**Primary CTA everywhere:** "Book a Consultation" → form fields: name, work email, company, role, service of interest (dropdown), message → Zoho CRM lead + email alert. Promise shown: *"We respond within one business day."* No gated content in Phase 1.

---

## 5. The Team — Who Owns What

Two developers, one repo, parallel tracks. **Respect this ownership when either person asks you for help — never write into the other person's folders.**

### 👩‍💻 Varsha — Frontend & Design (tasks V01–V33, ~47.5 hrs)
Owns everything the visitor **sees**: all React components, all pages, the design system, responsiveness, accessibility (WCAG 2.1 AA), animations, images.

**Her folders (only she touches):**
- `/src/components/` and `/src/components/ui/` (Button, Badge, Container, Section, Header, Footer, cards, forms UI)
- `/src/app/(pages)/` — all page routes
- `/src/styles/` — global CSS, font loading
- `/public/images/`, `/public/icons/`
- `tailwind.config.ts` — design tokens (colors, fonts, spacing)

**Her success metrics:** Lighthouse 90+ (performance, accessibility), flawless responsive behavior at 375/768/1280px, top-tier visual polish.

### 👩‍💻 Srujana — Backend, Security & Infrastructure (tasks S01–S30, ~44.5 hrs)
Owns everything **under the hood**: repo/hosting setup, ALL security headers, Zoho CRM API integration, MDX blog pipeline, SEO metadata + JSON-LD, cookie consent, analytics, legal page drafts, DNS, deployment, documentation.

**Her folders (only she touches):**
- `/src/app/api/` (dev) and `/functions/` (Cloudflare Pages Functions for production)
- `/src/lib/` — zoho.ts, metadata.ts, blog.ts utilities
- `/content/blog/` — MDX posts
- `/public/.well-known/` — security.txt
- `next.config.js`, `.env` / `.env.local`
- Cloudflare, DNS, deployment config

**Her success metrics:** A+ on all three security scanners, forms creating leads in Zoho with email alerts, Google indexing correctly.

### 🤝 Joint tasks (J01–J07, ~11 hrs)
Form↔API integration test (agreed contract: `POST /api/contact` with JSON `{name, email, company, role, service, message}` → `{success: boolean}`), copy refinement, client review session, final walkthrough, launch, hotfixes.

---

## 6. Git Workflow (both must follow)

- Branches: `main` (production, protected, PR-review required) ← `staging` (integration, auto-deploys preview) ← `feat/xxx` (daily work)
- **Never push directly to `main`.**
- Pull `staging` every morning and before every push; resolve conflicts locally.
- Merge small and often — at least once per day.
- Agree component/API contracts **before** building across the boundary.
- Shared files (`tailwind.config.ts`, `layout.tsx`, `package.json`) — flag changes in the daily 10-min standup: *done / doing / need from the other / blocked / shared files touched.*

---

## 7. Timeline (Phase 1 sprint)

| Day | Focus | Hours (V / S / Joint) |
|---|---|---|
| Mon | Setup: repo, design system, Header/Footer, security headers, Cloudflare | 7.5 / 5.5 / 0.5 |
| Tue | Home page + service template + Zoho integration + blog pipeline + SEO utils | 12 / 11.5 / – |
| Wed | All remaining pages + Trust page + form wiring + cookie consent + analytics | 12 / 11 / 1.5 |
| Thu | Legal drafts + responsive QA + animations + copy + **client review** | 8 / 8.5 / 3.5 |
| Fri | Accessibility + performance + **final security pass (A+ targets)** + DNS | 8 / 6 / 1.5 |
| Sat | **Launch** — merge to main, production tests, monitoring | – / – / 4 |
| Sun | Hotfixes + handover README | – / 2 / 2 |

**Total: ~103 hours.** Full task detail (WHY / steps / skills per task) lives in `Varsha_Srujana_Task_Breakdown.xlsx`.

---

## 8. Hard Rules Claude Must Enforce When Implementation Starts

When (and only when) a team member asks you to implement something, always honor these:

1. **Never render framework names as badge/seal images** — text chips only (V08, V21).
2. **Never write copy claiming certifications Accurith doesn't hold** — enforce the honest-framing wording rules from §2.
3. **Never add invasive analytics or unnecessary third-party scripts** — privacy-first stack only.
4. **Never weaken security headers to "make something work"** without flagging the trade-off explicitly (CSP `'unsafe-inline'` for Tailwind styles is the one accepted trade-off).
5. **Never expose Zoho secrets to the browser** — no `NEXT_PUBLIC_` prefix on API credentials; server-side (Pages Functions) only.
6. **Never put code in the other developer's folders** — check §5 ownership before creating/editing any file.
7. **Static export constraint** — no runtime server features; Zoho calls go through Cloudflare Pages Functions.
8. **Legal pages are drafts for counsel** — always keep the "pending legal review" framing; never present them as final legal advice.
9. **No fake content** — no placeholder client logos, testimonials, metrics, or product screenshots that could be mistaken for real ones.
10. **Scope discipline** — anything not in the Phase 1 sitemap (§4) goes to Phase 2; flag scope creep instead of building it.

---

## 9. Current Status

- [x] Requirements gathered and confirmed with client
- [x] Build plan approved (see `Accurith_Website_Build_Plan.md`)
- [x] Task breakdown created (`Varsha_Srujana_Task_Breakdown.xlsx`)
- [ ] Client inputs pending: leadership bios/certs, service substance notes, brand confirmation, DNS + Zoho access, legal sign-off approach
- [ ] **Development NOT started** ← Claude: this is why you build nothing yet

*Last updated: July 2026 · Update the checkboxes above as the project progresses.*
