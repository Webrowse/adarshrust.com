'use client';

import { Section } from './Section';
import { PORTALS } from '@/lib/portals';

export function Workshop() {
  return (
    <Section id="workshop" bay="BAY 02" label="THE WORKSHOP">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PORTALS.map((p, i) => {
            const Icon = p.icon;
            const isLast = i === PORTALS.length - 1;
            return (
              <a
                key={p.num}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`portal-card-large group${isLast ? ' sm:col-span-2' : ''}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="num">{p.num}</span>
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-forge-dim group-hover:text-forge-glow transition-colors">
                    open ↗
                  </span>
                </div>
                <div className="icon-wrap-large">
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
