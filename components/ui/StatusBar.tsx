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
    <div className="fixed bottom-0 left-0 right-0 z-30 px-7 md:px-12 py-3 flex items-center justify-between pointer-events-none border-t border-forge-oxide/10 bg-gradient-to-t from-black/65 to-transparent backdrop-blur-sm">
      <div className="terminal-text pointer-events-auto">
        <span className="live-dot" />
        SYSTEMS / ONLINE
      </div>
      <div className="terminal-text pointer-events-auto" style={{ color: '#5a4a38' }}>
        SCROLL · {pct.toString().padStart(3, '0')}%
      </div>
      <div className="terminal-text pointer-events-auto hidden sm:block" style={{ color: '#5a4a38' }}>
        © {new Date().getFullYear()} ADARSH RUST
      </div>
    </div>
  );
}
