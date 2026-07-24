// Blog data layer. Reads MDX posts from /content/blog/ at BUILD time and
// exposes typed helpers Varsha's BlogCard and BlogPostLayout components will
// call from her page files.
//
// PUBLIC API (Varsha depends on these — do not change signatures without
// coordinating):
//   getAllPosts()            → BlogPostMeta[]  (sorted newest-first, drafts filtered)
//   getPostBySlug(slug)      → BlogPost | null (undefined slug returns null, not throw)
//   getAllSlugs()            → string[]        (feeds generateStaticParams)
//
// Read at build time only. This module imports Node fs/path and MUST NOT be
// imported into any Cloudflare Pages Function or into a React Client Component.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  /** Month-level display form of `date`, e.g. "July 2026". */
  displayDate: string;
  author: string;
  tags: string[];
  excerpt: string;
  draft: boolean;
  // ---- Display fields (J01). Varsha's cards and PostShell render these.
  /** Kicker above the title, e.g. "IS Audit". Falls back to the first tag. */
  category: string;
  /** Explicit frontmatter value wins; otherwise computed from word count. */
  readTime: string;
  featured: boolean;
  image?: string;
  imageAlt?: string;
  /** Crop side for wide artwork (maps to object-left/right, never style=). */
  imagePos?: 'left' | 'right';
}

export interface BlogPost extends BlogPostMeta {
  // Raw MDX source. Varsha's BlogPostLayout will pass this to
  // <MDXRemote source={source} /> from next-mdx-remote/rsc.
  source: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function readAllFrontmatter(): { file: string; slug: string; data: matter.GrayMatterFile<string> }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      const slug = file.replace(/\.mdx$/, '');
      return { file, slug, data: matter(raw) };
    });
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Parsed off the string rather than through `new Date()` on purpose: a bare
// "2026-07-18" is parsed as UTC midnight, which renders as the previous month
// for anyone west of Greenwich on the 1st.
function toDisplayDate(iso: string): string {
  const [year, month] = iso.split('-');
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : iso;
}

// ~200 wpm is the usual reading-speed assumption for prose of this kind.
function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Guardrails: every field the site expects must be present with the correct
// type. Throws loudly at build time — a missing `date` on a live post should
// break the build, not silently render as "undefined".
function toMeta(slug: string, fm: Record<string, unknown>, content: string): BlogPostMeta {
  const missing: string[] = [];
  const need = (k: string) => {
    if (fm[k] === undefined || fm[k] === null) missing.push(k);
  };
  need('title');
  need('date');
  need('author');
  need('excerpt');
  if (missing.length) {
    throw new Error(`content/blog/${slug}.mdx: missing frontmatter ${missing.join(', ')}`);
  }
  const rawTags = fm.tags;
  const tags = Array.isArray(rawTags) ? rawTags.map(String) : [];
  const date = String(fm.date);
  const imagePos = fm.imagePos === 'left' || fm.imagePos === 'right' ? fm.imagePos : undefined;
  return {
    slug,
    title: String(fm.title),
    date,
    displayDate: toDisplayDate(date),
    author: String(fm.author),
    tags,
    excerpt: String(fm.excerpt),
    draft: Boolean(fm.draft ?? false),
    category: fm.category ? String(fm.category) : tags[0] ? titleCase(tags[0]) : 'Notes',
    readTime: fm.readTime ? String(fm.readTime) : estimateReadTime(content),
    featured: Boolean(fm.featured ?? false),
    image: fm.image ? String(fm.image) : undefined,
    imageAlt: fm.imageAlt ? String(fm.imageAlt) : undefined,
    imagePos,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return readAllFrontmatter()
    .map(({ slug, data }) => toMeta(slug, data.data, data.content))
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string | undefined): BlogPost | null {
  if (!slug) return null;
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  const meta = toMeta(slug, parsed.data, parsed.content);
  if (meta.draft) return null;
  return { ...meta, source: parsed.content };
}
