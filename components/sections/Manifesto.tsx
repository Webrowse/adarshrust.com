'use client';

import { Section } from './Section';

export function Manifesto() {
  return (
    <Section id="manifesto" bay="BAY 01" label="MANIFESTO" height="100vh">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="mx-auto text-center" style={{ maxWidth: 'min(640px, 56vw)' }}>
          <p className="font-display text-[clamp(20px,3vw,32px)] leading-[1.4] text-forge-bone/90 tracking-[0.04em]">
            Built in Rust.
            <br />
            Built to last.
            <br />
            <span className="text-forge-glow">Built in the open.</span>
          </p>
          <p className="mt-10 text-[13px] leading-[1.85] text-forge-bone/55 font-sans tracking-wide max-w-[520px] mx-auto">
            This site is a workshop, not a portfolio. Every project here is a
            small piece of machinery — some shipped, some still being filed
            down. Pick a door and walk in.
          </p>
        </div>
      </div>
    </Section>
  );
}
