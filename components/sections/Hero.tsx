'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

export function Hero() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const unsub = useScrollStore.subscribe((s) => {
      const t = Math.max(0, 1 - s.progress / 0.04);
      setScrollOpacity(t);
    });
    return () => unsub();
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-8 py-20"
    >
      <div className="hero-sub mb-6">BUILD &nbsp; · &nbsp; FORGE &nbsp; · &nbsp; SHIP</div>
      <h1 className="hero-title">ADARSHRUST</h1>
      <p
        className="mt-10 max-w-xl mx-auto text-[13px] leading-[1.85] font-sans tracking-wide"
        style={{ color: 'var(--text-secondary)' }}
      >
        A workshop of{' '}
        <span style={{ color: 'var(--gear-base)' }}>Rust projects, tools, and machinery</span>.
        <br />
        Built by an independent systems engineer.
      </p>

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-300"
        style={{ opacity: scrollOpacity, color: 'var(--text-muted)' }}
      >
        <div
          className="w-[18px] h-[28px] border rounded-[9px] relative mb-3"
          style={{ borderColor: 'var(--text-muted)' }}
        >
          <span
            className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[2px] h-[6px] rounded-[1px] animate-scroll-dot"
            style={{ backgroundColor: 'var(--gear-base)' }}
          />
        </div>
        <span className="font-mono text-[9.5px] tracking-[0.42em] uppercase">SCROLL</span>
      </div>
    </section>
  );
}
