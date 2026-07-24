import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { IBM_Plex_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransparencyBand from '@/components/TransparencyBand';
import { organizationJsonLd, SITE_NAME, SITE_URL } from '@/lib/metadata';
import './globals.css';

// Ownership boundary (CLAUDE.md §2): Srujana owns the `metadata` export, the
// headers() nonce read, and the JSON-LD script. Varsha owns the shell —
// <html>/<body> classes, font wiring, Header/TransparencyBand/Footer.

// Direction C type stack is system Helvetica Neue (see the @theme block in
// globals.css) — no webfont needed for display or body. Plex Mono stays
// self-hosted via next/font for legacy inner-page labels only.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

// Root metadata — page-specific overrides come from each page.tsx via
// createMetadata(). See src/lib/metadata.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Cyber security, IS audit, risk advisory`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Cyber security, IS/IT audit, risk management and digital forensics advisory for enterprises in India.',
  alternates: { canonical: '/' },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: ['/og-default.jpg'],
  },
  twitter: { card: 'summary_large_image' },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the per-request nonce that middleware.ts set. Every inline script we
  // emit must carry this nonce, otherwise the CSP will block it.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" className={`${plexMono.variable} h-full`}>
      <body className="flex min-h-full flex-col font-body">
        {/* Organization JSON-LD for Google rich results. Data lives in
            src/lib/metadata.ts — edit there, not here. */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-navy focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        {/* flex-1 keeps the footer at the bottom on short pages. */}
        <main id="main-content" className="flex-1">
          {children}
        </main>
        {/* Signature element 2 — transparency band on every page, above the footer. */}
        <TransparencyBand />
        <Footer />
      </body>
    </html>
  );
}
