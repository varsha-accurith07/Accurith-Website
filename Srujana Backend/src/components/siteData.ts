import {
  ShieldCheck,
  ClipboardCheck,
  BrainCircuit,
  SearchCheck,
  Scale,
  Cog,
  type LucideIcon,
} from "lucide-react";

// Single source of truth for the six services — Header mega-menu, Footer,
// Services overview, Home grid, and the Contact dropdown all read from here.
export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  icon: LucideIcon;
  featured: boolean;
};

export const services: Service[] = [
  {
    slug: "cyber-security",
    name: "Cyber Security",
    shortDescription:
      "VAPT, security audits, cloud security review, and incident response.",
    icon: ShieldCheck,
    featured: true,
  },
  {
    slug: "is-it-audit",
    name: "IS / IT Audit",
    shortDescription:
      "IS audits, ITGC reviews, SOC 2 readiness, and control testing.",
    icon: ClipboardCheck,
    featured: true,
  },
  {
    slug: "ai-automation",
    name: "AI Automation",
    shortDescription:
      "Workpaper generation, continuous controls monitoring, anomaly detection.",
    icon: BrainCircuit,
    featured: true,
  },
  {
    slug: "digital-forensics",
    name: "Digital Forensics",
    shortDescription:
      "Computer, mobile, and cloud forensics with defensible chain of custody.",
    icon: SearchCheck,
    featured: true,
  },
  {
    slug: "risk-grc-advisory",
    name: "Risk & GRC Advisory",
    shortDescription:
      "Risk assessments, governance frameworks, and compliance programmes.",
    icon: Scale,
    featured: false,
  },
  {
    slug: "managed-services",
    name: "Managed Services",
    shortDescription:
      "Ongoing security and compliance operations, delivered as a service.",
    icon: Cog,
    featured: false,
  },
];

export const featuredServices = services.filter((s) => s.featured);
export const additionalServices = services.filter((s) => !s.featured);

// Leadership credentials — the #1 trust asset. Shown where a competitor would
// put a customer-logo wall (Home + About). House rule: name ONLY credentials
// actually held (confirmed in the 2026-07 design handoff).
export const credentials = ["DISA", "FAFD", "ISC2 CC", "DPCAC"];

// Frameworks Accurith aligns delivery to. Always rendered as text Badge chips.
export const frameworks = [
  "ISO 27001",
  "SOC 2",
  "NIST CSF",
  "COBIT",
  "DPDP",
  "GDPR",
  "PCI-DSS",
];

// Direction B header nav. Dropdown children carry a one-line desc, per the
// prototype. Every href must be a real route — no invented pages.
export type NavChild = { label: string; desc: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const companyLinks: NavChild[] = [
  { label: "About", desc: "Company & leadership", href: "/about" },
  { label: "Careers", desc: "Open roles", href: "/about/careers" },
  {
    label: "Trust & Security",
    desc: "How we handle your evidence",
    href: "/trust",
  },
  { label: "Contact", desc: "Book a consultation", href: "/contact" },
];

export const primaryNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.name,
      desc: s.shortDescription,
      href: `/services/${s.slug}`,
    })),
  },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Company", href: "/about", children: companyLinks },
];

export const legalPages = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Data Processing Agreement", href: "/legal/dpa" },
];
