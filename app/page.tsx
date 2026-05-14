import dynamic from 'next/dynamic';
import { NavBar } from '@/components/ui/NavBar';
import { StatusBar } from '@/components/ui/StatusBar';
import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Workshop } from '@/components/sections/Workshop';
import { Philosophy } from '@/components/sections/Philosophy';
import { Contact } from '@/components/sections/Contact';

// Canvas is client-only; SSR for WebGL is pointless
const Scene = dynamic(() => import('@/components/Scene').then((m) => m.Scene), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      {/* WebGL canvas welded to the viewport — gears live here */}
      <Scene />

      {/* Fixed UI overlays */}
      <NavBar />
      <StatusBar />

      {/* Document body — scrolls under the fixed canvas */}
      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Workshop />
        <Philosophy />
        <Contact />
        <footer className="relative pt-10 pb-24 text-center">
          <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-forge-dim">
            MADE WITH GRIT — FOR THE CURIOUS
          </p>
          <p className="mt-2 font-mono text-[9px] tracking-[0.32em] uppercase text-forge-dim/50">
            © {new Date().getFullYear()} ADARSH RUST
          </p>
        </footer>
      </main>

      {/* Film grain over everything */}
      <div className="grain" />
    </>
  );
}
