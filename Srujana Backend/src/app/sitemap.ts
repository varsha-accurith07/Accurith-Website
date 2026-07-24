import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/metadata';
import { getAllPosts } from '@/lib/blog';

// Build-time artifact rather than a runtime route handler.
export const dynamic = 'force-static';

// Static routes we always want indexed. Keep this list in sync with the
// /src/app/**/page.tsx tree — a sitemap that advertises 404s is worse than no
// sitemap. Anything missing here is NOT excluded from indexing (robots
// controls that), it just isn't submitted to Google as a preferred URL.
//
// Deliberately absent: /kitchen-sink, which is an internal component gallery.
const STATIC_ROUTES = [
  '/',
  '/services',
  '/services/cyber-security',
  '/services/is-it-audit',
  '/services/ai-automation',
  '/services/digital-forensics',
  '/services/risk-grc-advisory',
  '/services/managed-services',
  '/products',
  '/trust',
  '/trust/report-vulnerability',
  '/about',
  '/about/careers',
  '/blog',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
  '/legal/dpa',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1.0 : 0.7,
  }));
  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: new URL(`/blog/${p.slug}`, SITE_URL).toString(),
    lastModified: new Date(p.date),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));
  return [...staticEntries, ...blogEntries];
}
