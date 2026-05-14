'use client';

import { Section } from './Section';

const LINKS = [
  { k: 'github', v: 'github.com/webrowse', href: 'https://github.com/webrowse' },
  { k: 'crates', v: 'crates.io/users/Webrowse', href: 'https://crates.io/users/Webrowse' },
  { k: 'x', v: '@Adarsh_Web3', href: 'https://x.com/Adarsh_Web3' },
  { k: 'email', v: 'Adarshtechjob@gmail.com', href: 'mailto:Adarshtechjob@gmail.com' },
];

export function Contact() {
  return (
    <Section id="contact" bay="BAY 04" label="CONTACT" height="100vh">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="mx-auto w-full" style={{ maxWidth: 'min(640px, 56vw)' }}>
          <div className="terminal-block">
            <div className="terminal-head">
              <span className="dot bg-red-500/70" />
              <span className="dot bg-yellow-500/70" />
              <span className="dot bg-green-500/70" />
              <span className="ml-3 font-mono text-[10px] tracking-[0.28em] text-forge-dim">~/adarshrust</span>
            </div>
            <div className="terminal-body">
              <p className="line">
                <span className="prompt">$</span> whoami
              </p>
              <p className="line text-forge-bone/85">adarsh — independent rust developer</p>
              <p className="line mt-4">
                <span className="prompt">$</span> ls -l ./contact/
              </p>
              {LINKS.map((l) => (
                <p key={l.k} className="line text-forge-bone/75">
                  <span className="text-forge-glow/80">{l.k.padEnd(8)}</span>
                  <a
                    href={l.href}
                    className="hover:text-forge-glow underline-offset-4 hover:underline"
                  >
                    {l.v}
                  </a>
                </p>
              ))}
              <p className="line mt-4">
                <span className="prompt">$</span> <span className="cursor">_</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
