'use client';

import { ReactNode } from 'react';

type Props = {
  id: string;
  bay: string; // e.g. "BAY 02"
  label: string; // e.g. "MANIFESTO"
  children: ReactNode;
  height?: string; // e.g. '100vh' | '180vh'
};

export function Section({ id, bay, label, children, height = '100vh' }: Props) {
  return (
    <section
      id={id}
      style={{ minHeight: height }}
      className="relative w-full flex flex-col"
    >
      {/* Bay header strip */}
      <div
        className="mx-auto mt-16 mb-10 flex items-center gap-4 px-4 w-full"
        style={{ maxWidth: 'min(720px, 56vw)' }}
      >
        <span className="block h-px flex-1 bg-forge-oxide/25" />
        <span
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-forge-glow/85"
        >
          {bay}
        </span>
        <span className="block h-1 w-1 bg-forge-glow/70 rounded-full" />
        <span
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-forge-bone/70"
        >
          {label}
        </span>
        <span className="block h-px flex-1 bg-forge-oxide/25" />
      </div>
      {children}
    </section>
  );
}
