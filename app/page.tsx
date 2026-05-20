import dynamic from 'next/dynamic';
import { NavBar } from '@/components/ui/NavBar';
import { StatusBar } from '@/components/ui/StatusBar';
import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Workshop } from '@/components/sections/Workshop';
import { Philosophy } from '@/components/sections/Philosophy';
import { Contact } from '@/components/sections/Contact';
import { SunflowerScene } from '@/components/SunflowerScene';
import { GhibliScene } from '@/components/GhibliScene';
import { ThemeFilters } from '@/components/ThemeFilters';

// Canvas is client-only; SSR for WebGL is pointless
const Scene = dynamic(() => import('@/components/Scene').then((m) => m.Scene), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      {/* WebGL canvas welded to the viewport — gears live here */}
      <Scene />

      {/* Sunflower scene — renders null unless sunflower theme is active */}
      <SunflowerScene />

      {/* Ghibli windmills, clouds, hills, fluff — renders null unless ghibli theme is active */}
      <GhibliScene />

      {/* Fixed UI overlays */}
      <NavBar />
      <StatusBar />

      {/* Single cream rail — one continuous column for all sections */}
      <main className="relative z-10 flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: 'min(720px, 92vw)',
            backgroundColor: 'var(--bg-center)',
            color: 'var(--text-primary)',
            boxShadow: '0 0 80px 0 rgba(0,0,0,0.35)',
          }}
        >
          <Hero />
          <Manifesto />
          <Workshop />
          <Philosophy />
          <Contact />
          <footer className="pt-10 pb-24 text-center px-8">
            <p
              className="font-mono text-[10px] tracking-[0.32em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              MADE WITH GRIT — FOR THE CURIOUS
            </p>
            <p
              className="mt-2 font-mono text-[9px] tracking-[0.32em] uppercase"
              style={{ color: 'var(--text-muted)', opacity: 0.6 }}
            >
              © {new Date().getFullYear()} ADARSH RUST
            </p>
          </footer>
        </div>
      </main>

      {/* SVG filter defs — referenced by CSS url(#wobble-soft) anywhere on page */}
      <ThemeFilters />

      {/* Film grain over everything */}
      <div className="grain" />
    </>
  );
}
