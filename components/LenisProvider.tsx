'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useScrollStore } from '@/lib/scroll-store';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    });

    let activityDecay = 0;
    const set = useScrollStore.getState().set;

    lenis.on('scroll', ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      const abs = Math.abs(velocity);
      activityDecay = Math.max(activityDecay, Math.min(1, abs / 80));
      set({ scroll, velocity });
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      // exponential decay of activity so it lingers a beat after scrolling stops
      activityDecay *= 0.94;
      set({ activity: activityDecay });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
