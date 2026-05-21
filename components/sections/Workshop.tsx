'use client';

import { Section } from './Section';
import { PORTALS } from '@/lib/portals';
import { useFlagsStore, isEnabled } from '@/lib/flags-store';

export function Workshop() {
  const flags = useFlagsStore((s) => s.flags);
  const portals = PORTALS.filter((p) => isEnabled(flags, p.flagKey));

  return (
    <Section id="workshop" bay="BAY 02" label="THE WORKSHOP">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {portals.map((p, i) => {
          const isLast = i === portals.length - 1;
          const Icon = p.icon;
          return (
              <a
                key={p.num}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.title} — ${p.href.replace('https://', '')}`}
                className={`portal-card-large group${isLast ? ' sm:col-span-2' : ''}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="num">{p.num}</span>
                  <span aria-hidden="true" className="font-mono text-[9px] tracking-[0.3em] uppercase text-forge-dim group-hover:text-forge-glow transition-colors">
                    open ↗
                  </span>
                </div>
                <div className="icon-wrap-large" aria-hidden="true">
                  <Icon size={42} strokeWidth={1.3} />
                </div>
                <div className="title-large mt-6">{p.title}</div>
                <div className="desc-large mt-3">{p.desc}</div>
                <div className="mt-6 pt-4 border-t border-forge-oxide/15 font-mono text-[9px] tracking-[0.28em] uppercase text-forge-dim/70">
                  {p.href.replace('https://', '')}
                </div>
              </a>
            );
          })}
      </div>
    </Section>
  );
}
