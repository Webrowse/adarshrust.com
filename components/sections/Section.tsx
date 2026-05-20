'use client';

import { ReactNode } from 'react';

type Props = {
  id: string;
  bay: string;
  label: string;
  children: ReactNode;
};

export function Section({ id, bay, label, children }: Props) {
  return (
    <section id={id} className="relative w-full scroll-mt-16">
      <div className="flex items-center gap-4 px-8 pt-16 pb-10">
        <span className="block h-px flex-1" style={{ backgroundColor: 'var(--border-soft)', opacity: 0.5 }} />
        <span
          className="font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          {bay}
        </span>
        <span className="block h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--gear-base)' }} />
        <h2
          className="font-mono text-[10px] tracking-[0.4em] uppercase m-0"
          style={{ color: 'var(--text-secondary)', fontWeight: 'inherit' }}
        >
          {label}
        </h2>
        <span className="block h-px flex-1" style={{ backgroundColor: 'var(--border-soft)', opacity: 0.5 }} />
      </div>
      <div className="px-8 pb-20">{children}</div>
    </section>
  );
}
