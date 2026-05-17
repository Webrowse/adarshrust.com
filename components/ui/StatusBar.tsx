'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

export function StatusBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const unsub = useScrollStore.subscribe((s) => {
      setPct(Math.round(s.progress * 100));
    });
    return () => unsub();
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 px-7 md:px-12 py-3 flex items-center justify-between pointer-events-none"
      style={{
        background: 'linear-gradient(to top, var(--bg-side) 0%, color-mix(in srgb, var(--bg-side) 60%, transparent) 70%, transparent 100%)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className="terminal-text pointer-events-auto" style={{ color: 'var(--gear-highlight)' }}>
        <span className="live-dot" />
        SYSTEMS / ONLINE
      </div>
      <div className="terminal-text pointer-events-auto" style={{ color: 'var(--gear-highlight)' }}>
        SCROLL · {pct.toString().padStart(3, '0')}%
      </div>
      <div className="terminal-text pointer-events-auto hidden sm:block" style={{ color: 'var(--gear-highlight)' }}>
        © {new Date().getFullYear()} ADARSH RUST
      </div>
    </div>
  );
}
