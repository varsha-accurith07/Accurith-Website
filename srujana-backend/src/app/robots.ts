import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/metadata';

// Required under `output: 'export'` — tells Next.js this is a build-time
// artifact, not a runtime route handler.
export const dynamic = 'force-static';

// Robots policy — permissive by default. If a route ever needs to be hidden
// from search (e.g. a client-only preview page), add it to disallow here AND
// remove it from sitemap.ts. Two-sided defense.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api/ is a Cloudflare Pages Function, not a page — no crawler should
        // spend budget on it, and worker responses aren't cache-friendly.
        disallow: ['/api/'],
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  };
}
