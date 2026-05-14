'use client';

import { Section } from './Section';

const PRINCIPLES = [
  {
    n: '01',
    t: 'Ship the iron',
    d: 'Working software beats perfect ideas. Every project here ships before it impresses.',
  },
  {
    n: '02',
    t: 'Open the doors',
    d: 'Source is public by default. Notes are public by default. Mistakes too.',
  },
  {
    n: '03',
    t: 'Forge slowly',
    d: 'A bench, a file, and patience. Tools earn their place. Frameworks are not religions.',
  },
  {
    n: '04',
    t: 'Read the spec',
    d: 'Every byte deserves understanding. The borrow checker is a co-worker, not a wall.',
  },
];

export function Philosophy() {
  return (
    <Section id="philosophy" bay="BAY 03" label="PRINCIPLES" height="100vh">
      <div className="flex-1 flex items-center px-6">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
          style={{ maxWidth: 'min(720px, 56vw)' }}
        >
          {PRINCIPLES.map((p) => (
            <div key={p.n} className="principle">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-forge-glow">{p.n}</span>
                <span className="block h-px flex-1 bg-forge-oxide/20" />
              </div>
              <h3 className="font-display text-[20px] tracking-[0.08em] uppercase text-forge-bone mb-2">
                {p.t}
              </h3>
              <p className="font-sans text-[13px] leading-[1.7] text-forge-bone/55">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
