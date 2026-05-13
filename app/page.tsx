import dynamic from 'next/dynamic';
import { NavBar } from '@/components/ui/NavBar';
import { HeroText } from '@/components/ui/HeroText';
import { PortalGrid } from '@/components/ui/PortalGrid';
import { StatusBar } from '@/components/ui/StatusBar';

// Canvas is client-only; SSR for WebGL is pointless
const Scene = dynamic(() => import('@/components/Scene').then((m) => m.Scene), {
  ssr: false,
});
const LoadingScreen = dynamic(
  () => import('@/components/LoadingScreen').then((m) => m.LoadingScreen),
  { ssr: false },
);

export default function HomePage() {
  return (
    <main>
      <Scene />
      <LoadingScreen />

      {/* Tall scrollable area so Lenis has somewhere to go.
          Visible content is fixed; this just provides scroll length to drive gears. */}
      <div className="relative" style={{ height: '420vh' }}>
        <NavBar />
        <HeroText />

        {/* scroll cue, fades after first scroll could be done; static for now */}
        <div className="scroll-cue">
          <div className="mouse" />
          SCROLL
        </div>

        <PortalGrid />
        <StatusBar />
      </div>

      {/* film grain over everything */}
      <div className="grain" />
    </main>
  );
}
