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
  author: string;
  tags: string[];
  excerpt: string;
  draft: boolean;
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

// Guardrails: every field the site expects must be present with the correct
// type. Throws loudly at build time — a missing `date` on a live post should
// break the build, not silently render as "undefined".
function toMeta(slug: string, fm: Record<string, unknown>): BlogPostMeta {
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
  return {
    slug,
    title: String(fm.title),
    date: String(fm.date),
    author: String(fm.author),
    tags,
    excerpt: String(fm.excerpt),
    draft: Boolean(fm.draft ?? false),
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return readAllFrontmatter()
    .map(({ slug, data }) => toMeta(slug, data.data))
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
  const meta = toMeta(slug, parsed.data);
  if (meta.draft) return null;
  return { ...meta, source: parsed.content };
}
