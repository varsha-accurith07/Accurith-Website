// Display-shaped view over the MDX blog pipeline (J01).
//
// Posts live in /content/blog/*.mdx and are parsed by src/lib/blog.ts. This
// module adapts that data to the shape the cards and PostShell already
// expect — notably `date` here is the month-level display string ("July
// 2026"), not the ISO date used for sorting.
//
// Server-only: src/lib/blog.ts reads from disk at build time, so nothing that
// imports this file may be a Client Component.
//
// House rules apply to every post: honest framing only (no invented numbers,
// no certification claims), specific terminology, plain-spoken tone.

import { getAllPosts, type BlogPostMeta } from '@/lib/blog';

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
  imagePos?: 'left' | 'right';
};

function toCard(meta: BlogPostMeta): BlogPost {
  return {
    slug: meta.slug,
    category: meta.category,
    title: meta.title,
    excerpt: meta.excerpt,
    date: meta.displayDate,
    readTime: meta.readTime,
    featured: meta.featured,
    image: meta.image,
    imageAlt: meta.imageAlt,
    imagePos: meta.imagePos,
  };
}

/** Newest-first, drafts already filtered out by the pipeline. */
export const blogPosts: BlogPost[] = getAllPosts().map(toCard);

export const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];

export const regularPosts = blogPosts.filter((p) => p !== featuredPost);

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
