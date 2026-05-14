'use client';

import { useEffect } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

/**
 * Native scroll provider. No smoothing, no inertia.
 *
 * Why not Lenis? Lenis animates the scroll position to a target over time,
 * which makes the gears keep rotating after the wheel stops — feels like
 * the page is sliding when you wanted it locked. Romy wants rigid 1:1:
 * wheel stops, scroll stops, gears stop, same frame.
 *
 * On Mac trackpads native scroll already has natural finger-inertia, which
 * reads as physical deceleration on the gears (the right thing).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const set = useScrollStore.getState().set;
    let activityDecay = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();

    const updateScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const scroll = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(1, Math.max(0, scroll / maxScroll));
      const velocity = ((scroll - lastScroll) / dt) * 1000; // px/sec

      const abs = Math.abs(velocity);
      // Activity drives sparks. ~2000 px/sec = full intensity.
      activityDecay = Math.max(activityDecay, Math.min(1, abs / 2000));

      set({ scroll, progress, velocity });

      lastScroll = scroll;
      lastTime = now;
    };

    let raf = 0;
    const loop = () => {
      // exponential decay so activity lingers a beat after scrolling stops
      activityDecay *= 0.92;
      set({ activity: activityDecay });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    // initial sync
    updateScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return <>{children}</>;
}
