'use client';

import { Section } from './Section';

export function Manifesto() {
  return (
    <Section id="manifesto" bay="BAY 01" label="MANIFESTO">
      <div className="text-center">
        <p className="font-display text-[clamp(20px,3vw,32px)] leading-[1.4] tracking-[0.04em]" style={{ color: 'var(--text-primary)' }}>
          Built in Rust.
          <br />
          Built to last.
          <br />
          <span style={{ color: 'var(--gear-base)' }}>Built in the open.</span>
        </p>
        <p className="mt-10 text-[13px] leading-[1.85] font-sans tracking-wide max-w-[520px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
          This site is a workshop, not a portfolio. Every project here is a
          small piece of machinery — some shipped, some still being filed
          down. Pick a door and walk in.
        </p>
      </div>
    </Section>
  );
}
