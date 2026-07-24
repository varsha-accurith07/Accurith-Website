// SEO / OG / Twitter card helper.
//
// PUBLIC API (Varsha calls this from every page.tsx — do not change signature
// without coordinating):
//
//   import { createMetadata } from '@/lib/metadata';
//
//   export const metadata = createMetadata({
//     title: 'Cyber security',                    // required — page-specific title
//     description: 'One-line summary...',         // required — max ~160 chars
//     path: '/services/cyber-security',           // required — leading slash, no trailing
//     image: '/og/cyber-security.png',            // optional — absolute path under /public
//   });
//
// The helper injects the site name, canonical URL, OpenGraph tags, and a
// Twitter summary_large_image card. Everything else (viewport, icons,
// theme-color) belongs in the ROOT layout metadata export.

import type { Metadata } from 'next';

// Set NEXT_PUBLIC_SITE_URL in .env.local. Falling back is deliberate: it lets
// preview branches build without a hard failure, but everything indexed will
// carry the placeholder until the env var is set — visible in a Search Console
// audit, so it will be caught.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://accurith.com';
export const SITE_NAME = 'Accurith Technologies';
const DEFAULT_OG_IMAGE = '/og/default.png';

// Organization schema — feeds Google's Knowledge Panel + rich results. Rendered
// as JSON-LD in the root layout. Update the address once the office is
// registered; the phone/email are placeholders pending client confirmation.
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Accurith Technologies Private Limited',
  alternateName: 'Accurith',
  url: SITE_URL,
  logo: `${SITE_URL}/icons/logo.png`,
  description:
    'Cyber security, IS/IT audit, risk management and digital forensics advisory, based in Bengaluru.',
  email: 'hello@accurith.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  sameAs: [] as string[], // Add LinkedIn / X URLs once created.
} as const;

interface CreateMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function createMetadata({ title, description, path, image }: CreateMetadataInput): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const ogImage = new URL(image ?? DEFAULT_OG_IMAGE, SITE_URL).toString();
  const fullTitle = `${title} — ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}
