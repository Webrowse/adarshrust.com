import type { Metadata } from 'next';
import { Instrument_Serif, Newsreader, JetBrains_Mono } from 'next/font/google';

import { PROFILE } from '@/lib/content';
import './globals.css';

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  // Next 14 lacks size-adjust metrics for Newsreader; explicit fallback above
  adjustFontFallback: false,
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jbmono',
  display: 'swap',
});

const DESCRIPTION =
  'Rust backend and systems engineer. Changes merged into Hickory DNS and oxish, plus the services I build and run.';

export const metadata: Metadata = {
  title: 'Adarsh — Rust backend and systems engineer',
  description: DESCRIPTION,
  metadataBase: new URL('https://adarshrust.com'),
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'profile',
    url: 'https://adarshrust.com',
    title: 'Adarsh — Rust backend and systems engineer',
    description: DESCRIPTION,
    siteName: 'adarshrust.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${newsreader.variable} ${jbMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': 'https://adarshrust.com/#person',
                  name: PROFILE.name,
                  url: 'https://adarshrust.com',
                  jobTitle: PROFILE.role,
                  description: PROFILE.focus,
                  email: `mailto:${PROFILE.email}`,
                  knowsAbout: [
                    'Rust',
                    'DNS',
                    'Backend engineering',
                    'Systems programming',
                    'Developer infrastructure',
                  ],
                  sameAs: [PROFILE.github, PROFILE.crates, 'https://blog.adarshrust.com'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://adarshrust.com/#website',
                  url: 'https://adarshrust.com',
                  name: 'Adarsh',
                  description: DESCRIPTION,
                  author: { '@id': 'https://adarshrust.com/#person' },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
