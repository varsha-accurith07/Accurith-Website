// Single source of truth for blog posts — the /blog index, the home
// FeaturedStory band, and per-post metadata all read from here. Posts are
// TSX pages under /app/blog/<slug> for now; when Srujana's MDX pipeline
// (S-track) lands, this list becomes derived from /content/blog frontmatter.
//
// House rules apply to every post: honest framing only (no invented numbers,
// no certification claims), specific terminology, plain-spoken tone.

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  /** Display date, e.g. "July 2026" — month-level until cadence is real. */
  date: string;
  readTime: string;
  featured?: boolean;
  /** Optional card/hero image under /public/images. */
  image?: string;
  imageAlt?: string;
  /** Crop side for wide artwork (maps to object-left/right, never style=). */
  imagePos?: "left" | "right";
};

export const blogPosts: BlogPost[] = [
  {
    slug: "india-regulatory-audit-opportunity",
    category: "Analysis",
    title: "The India regulatory-audit opportunity, mapped.",
    excerpt:
      "Where RBI, SEBI, IRDAI, CERT-In, the Companies Act, IBC and the DPDP Act force IS, risk and forensic audits — and how credentialed firms capture that mandated demand with the right tooling.",
    date: "July 2026",
    readTime: "9 min read",
    featured: true,
    image: "/images/home/featured-robot.jpg",
    imageAlt:
      "Humanoid robot in a thinking pose against a deep blue ground with an electric-blue glow",
  },
  {
    slug: "what-a-first-is-audit-covers",
    category: "IS Audit",
    title: "What a first IS audit actually covers",
    excerpt:
      "If you've never been through an information systems audit, the scope can look opaque. Here's what auditors look at, in the order they look at it.",
    date: "July 2026",
    readTime: "6 min read",
  },
  {
    slug: "dpdp-readiness-data-inventory",
    category: "Privacy",
    title: "DPDP readiness starts with a data inventory",
    excerpt:
      "Most DPDP conversations jump straight to consent banners. The harder, more valuable first step is knowing what personal data you hold, where it lives, and who touches it.",
    date: "July 2026",
    readTime: "5 min read",
  },
];

export const featuredPost =
  blogPosts.find((p) => p.featured) ?? blogPosts[0];

export const regularPosts = blogPosts.filter((p) => p !== featuredPost);

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
