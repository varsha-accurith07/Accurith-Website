// Homepage content — Direction C "Marsal" (client-approved mockup,
// 2026-07-22). Copy obeys the house rules: no invented metrics, only real
// credentials (DISA · FAFD · ISC2 CC · DPCAC), frameworks as plain text.

export type HeroSlide = {
  kicker: string;
  title: string;
  summary: string;
  image: string; // small inset art card (kept per client, 2026-07-22)
  href: string;
  cta: string;
};

// Slide 1 speaks for the company (client request 2026-07-22 — "talk about my
// company", Big-4 style); the rest carry the practice lines.
export const heroSlides: HeroSlide[] = [
  {
    kicker: "Accurith Technologies · Bengaluru",
    title: "Assurance, Cyber Security and Risk Advisory, Built on Evidence",
    summary:
      "Six connected practices helping organisations answer to RBI, SEBI, IRDAI, CERT-In and the DPDP Act — every finding documented to the standard a regulator, board or court will accept.",
    image: "/images/home/hero-monument.jpg",
    href: "/services",
    cta: "What we do",
  },
  {
    kicker: "What we do · IS/IT Audit",
    title: "IS & IT Audit, Built for the Regulator's Desk",
    summary:
      "IS audits mapped to RBI ITGRCA, SEBI CSCRF and IRDAI — with findings and evidence a regulator will accept.",
    image: "/images/home/hero-audit.jpg",
    href: "/services/is-it-audit",
    cta: "Explore more",
  },
  {
    kicker: "What we do · Cyber Security",
    title: "Security Testing That Stands Up to Scrutiny",
    summary:
      "CERT-In-aligned security audits, VAPT and resilience testing — documented to a standard that stands up to scrutiny.",
    image: "/images/home/hero-cyber.jpg",
    href: "/services/cyber-security",
    cta: "Explore more",
  },
  {
    kicker: "What we do · Risk, GRC & Forensics",
    title: "Risk, GRC & Forensics on One Evidence Trail",
    summary:
      "ISO 27001, SOC 2, internal controls, DPDP readiness and FAFD-led digital forensics with defensible chain-of-custody.",
    image: "/images/home/hero-forensics.jpg",
    href: "/services/risk-grc-advisory",
    cta: "Explore more",
  },
];

// Expertise tiles — all six service lines, linking to their real pages.
// Tiles 03/06 crop opposite ends of the wide skyline artwork (imagePos) so
// all six read as photo tiles without repeating a frame.
export const expertise: {
  no: string;
  title: string;
  desc: string;
  href: string;
  image?: string;
  imagePos?: "left" | "right";
}[] = [
  {
    no: "01",
    title: "IS & IT Audit",
    desc: "RBI ITGRCA, SEBI CSCRF and IRDAI assurance, evidence attached.",
    href: "/services/is-it-audit",
    image: "/images/home/hero-audit.jpg",
  },
  {
    no: "02",
    title: "Cyber Security",
    desc: "CERT-In-aligned security audits, VAPT and resilience testing.",
    href: "/services/cyber-security",
    image: "/images/home/hero-cyber.jpg",
  },
  {
    no: "03",
    title: "Risk & GRC",
    desc: "ISO 27001, SOC 2, NIST, COBIT and internal controls.",
    href: "/services/risk-grc-advisory",
    image: "/images/home/hero-grc.jpg",
  },
  {
    no: "04",
    title: "AI Automation",
    desc: "Evidence collection, monitoring and workpaper drafting.",
    href: "/services/ai-automation",
    image: "/images/home/hero-ai.jpg",
  },
  {
    no: "05",
    title: "Digital Forensics",
    desc: "Fraud examination and defensible chain-of-custody.",
    href: "/services/digital-forensics",
    image: "/images/home/hero-forensics.jpg",
  },
  {
    no: "06",
    title: "Managed Services",
    desc: "Ongoing security and compliance operations, as a service.",
    href: "/services/managed-services",
    image: "/images/home/hero-managed.jpg",
  },
];

// Real counts only — regulators, credentials, practices. No invented metrics.
export const impact = [
  { num: "5", label: "regulators covered — RBI, SEBI, IRDAI, CERT-In, DPDP" },
  { num: "4", label: "credentials: DISA, FAFD, ISC2 CC, DPCAC" },
  { num: "6", label: "connected practices, one evidence trail" },
  { num: "AI", label: "automation across audit and risk" },
];

export const industries = [
  { reg: "RBI", name: "Banking & NBFC" },
  { reg: "SEBI", name: "Capital Markets" },
  { reg: "IRDAI", name: "Insurance" },
  { reg: "ICAI", name: "CA & Attestation Firms" },
  { reg: "MCA", name: "Enterprises" },
  { reg: "IBC", name: "Lenders & IPs" },
];
