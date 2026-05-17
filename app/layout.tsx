import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Fredoka, Bagel_Fat_One, DM_Serif_Display, Quicksand } from 'next/font/google';
import { LenisProvider } from '@/components/LenisProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fredoka',
  display: 'swap',
});

const bagelFat = Bagel_Fat_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bagel',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-quicksand',
  display: 'swap',
});

// Self-hosted fonts (npm packages, no Google Fonts runtime dependency)
import '@fontsource/orbitron/900.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';

import './globals.css';

export const metadata: Metadata = {
  title: 'ADARSHRUST — Forged in Rust',
  description: 'A workshop of Rust projects, tools, and machinery.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${fredoka.variable} ${bagelFat.variable} ${dmSerifDisplay.variable} ${quicksand.variable}`}>
      <head>
        {/* Preload critical 3D assets so they download in parallel with JS, not after.
            These are the dominant first-paint costs — getting them on the wire
            as early as possible cuts perceived load time substantially. */}
        <link
          rel="preload"
          href="/models/gear_large.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/models/gear_medium.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/models/gear_small.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/textures/gear_normal.webp" as="image" type="image/webp" />
        <link rel="preload" href="/textures/gear_roughness.webp" as="image" type="image/webp" />
        <link rel="preload" href="/textures/gear_metallic.webp" as="image" type="image/webp" />
      </head>
      <body className="bg-forge-steel text-forge-bone antialiased font-sans">
        <ThemeProvider>
          <LenisProvider>{children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
