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
  metadataBase: new URL('https://adarshrust.com'),
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${fredoka.variable} ${bagelFat.variable} ${dmSerifDisplay.variable} ${quicksand.variable}`}>
      <head>
        {/* JSON-LD — person + website schema for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': 'https://adarshrust.com/#person',
                  name: 'Adarsh Rust',
                  url: 'https://adarshrust.com',
                  jobTitle: 'Independent Rust Developer',
                  sameAs: [
                    'https://github.com/webrowse',
                    'https://crates.io/users/Webrowse',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://adarshrust.com/#website',
                  url: 'https://adarshrust.com',
                  name: 'ADARSHRUST',
                  description: 'A workshop of Rust projects, tools, and machinery.',
                  author: { '@id': 'https://adarshrust.com/#person' },
                },
              ],
            }),
          }}
        />
        {/* Applies the saved (or default) theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var T={workshop:{bgSide:'#4f4944',bgCenter:'#f8f3e6',bgCard:'#fffaee',textPrimary:'#2a241e',textSecondary:'#665849',textMuted:'#a87830',borderSoft:'#e6b048',borderStrong:'#c89a30',gearBase:'#e6b048',gearHighlight:'#f5d088',gearShadow:'#5a3f12',accent1:'#80b8d8',accent2:'#f5a878',sceneBackground:'#4f4944',sceneFog:'#4f4944',lightAmbient:'#fff4d8',lightKey:'#ffefb8',lightForge:'#f5d088',lightCool:'#cdd4dc',sparkColor:'#f5d088',lightIntensity:{ambient:0.45,key:1.6,forge:2.2,cool:0.45,envMap:1.4}},sunflower:{bgSide:'#80ccf0',bgCenter:'#ffffff',bgCard:'#ffffff',textPrimary:'#1a3a52',textSecondary:'#3a5a72',textMuted:'#5a7a92',borderSoft:'#1cb0f6',borderStrong:'#0a90d6',gearBase:'#ffd02f',gearHighlight:'#ffe066',gearShadow:'#6a4825',accent1:'#ff5d5d',accent2:'#5dca3e',sceneBackground:'#80ccf0',sceneFog:'#80ccf0',lightAmbient:'#ffffff',lightKey:'#fffae8',lightForge:'#ffd02f',lightCool:'#cde8f5',sparkColor:'#ffd02f',lightIntensity:{ambient:0.6,key:0.7,forge:0,cool:0.4,envMap:1.0}},ghibli:{bgSide:'#a8d8e8',bgCenter:'#fef7ea',bgCard:'#fffdf7',textPrimary:'#2c3e2d',textSecondary:'#4d6050',textMuted:'#7a9878',borderSoft:'#b8d4a8',borderStrong:'#88b880',gearBase:'#88b880',gearHighlight:'#bce0a0',gearShadow:'#3d5a30',accent1:'#f5c030',accent2:'#e890b8',sceneBackground:'#a8d8e8',sceneFog:'#a8d8e8',lightAmbient:'#f0f8ff',lightKey:'#fffae8',lightForge:'#88b880',lightCool:'#c8e8f8',sparkColor:'#fafaf5',lightIntensity:{ambient:0.7,key:0.6,forge:0,cool:0.5,envMap:1.0}}};var D='ghibli',id;try{id=localStorage.getItem('arust-theme')||D}catch(e){id=D}var t=T[id]||T[D],r=document.documentElement;r.dataset.theme=id;function kb(s){return s.replace(/([A-Z])/g,function(m){return'-'+m.toLowerCase()})}for(var k in t){var v=t[k];if(k==='lightIntensity'){for(var s in v)r.style.setProperty('--light-intensity-'+kb(s),String(v[s]))}else if(typeof v==='string')r.style.setProperty('--'+kb(k),v)}})();` }} />
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
