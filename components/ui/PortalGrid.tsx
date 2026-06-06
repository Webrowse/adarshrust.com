'use client';

import { PORTALS } from '@/lib/portals';
import { useFlagsStore, isEnabled } from '@/lib/flags-store';

export function PortalGrid() {
  const flags = useFlagsStore((s) => s.flags);

  const visible = PORTALS.filter((p) => isEnabled(flags, p.flagKey));

  return (
    <section className="fixed bottom-[58px] left-1/2 -translate-x-1/2 z-20 w-[96vw] max-w-[1640px] pointer-events-none">
      <div className="flex items-center justify-center gap-4 mb-3 pointer-events-auto">
        <span className="block h-px w-12 bg-forge-glow/30" />
        <span
          className="terminal-text"
          style={{ color: '#a8896a', letterSpacing: '0.5em' }}
        >
          PROJECT PORTALS
        </span>
        <span className="block h-px w-12 bg-forge-glow/30" />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5 pointer-events-auto">
        {visible.map((p, i) => {
          const Icon = p.icon;
          const num = String(i + 1).padStart(2, '0');
          return (
            <a
              key={p.flagKey}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="portal-card group"
            >
              <div className="num">{num}</div>
              <div className="icon-wrap">
                <Icon size={28} strokeWidth={1.4} />
              </div>
              <div className="title">{p.title}</div>
              <div className="desc">{p.desc}</div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
