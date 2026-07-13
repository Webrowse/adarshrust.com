import type { Metadata } from 'next';
import { Instrument_Serif, Newsreader, JetBrains_Mono } from 'next/font/google';

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

export const metadata: Metadata = {
  title: 'Adarsh — I build software tools',
  description:
    'Rust systems, developer infrastructure, and products that turn messy workflows into something usable.',
  metadataBase: new URL('https://adarshrust.com'),
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
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
                  name: 'Adarsh',
                  url: 'https://adarshrust.com',
                  description: 'I build software tools.',
                  sameAs: [
                    'https://github.com/webrowse',
                    'https://crates.io/users/Webrowse',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://adarshrust.com/#website',
                  url: 'https://adarshrust.com',
                  name: 'Adarsh',
                  description:
                    'Rust systems, developer infrastructure, and products that turn messy workflows into something usable.',
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
