'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

export function Hero() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const unsub = useScrollStore.subscribe((s) => {
      // Fade out the scroll cue between progress 0 and 0.04 (very first scroll)
      const t = Math.max(0, 1 - s.progress / 0.04);
      setScrollOpacity(t);
    });
    return () => unsub();
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <div className="hero-sub mb-6">BUILD &nbsp; · &nbsp; FORGE &nbsp; · &nbsp; SHIP</div>
      <h1 className="hero-title">ADARSHRUST</h1>
      <p className="mt-10 max-w-xl text-[13px] leading-[1.85] text-forge-bone/55 font-sans tracking-wide">
        A workshop of{' '}
        <span className="text-forge-glow/85">Rust projects, tools, and machinery</span>.
        <br />
        Built by an independent systems engineer.
      </p>

      {/* Scroll cue fades on first scroll */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-forge-dim transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        <div className="w-[18px] h-[28px] border border-forge-dim rounded-[9px] relative mb-3">
          <span className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[2px] h-[6px] bg-forge-glow rounded-[1px] animate-scroll-dot" />
        </div>
        <span className="font-mono text-[9.5px] tracking-[0.42em] uppercase">SCROLL</span>
      </div>
    </section>
  );
}
