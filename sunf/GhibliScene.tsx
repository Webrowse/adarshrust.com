'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/scroll-store';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';

function Windmill({ rotation }: { rotation: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tower */}
      <path d="M34 72 L46 72 L43 128 L37 128 Z" fill="var(--gear-shadow)" opacity="0.7" />
      {/* Window */}
      <circle cx="40" cy="98" r="3.5" fill="var(--gear-highlight)" opacity="0.55" />
      {/* Door */}
      <rect x="37.5" y="118" width="5" height="10" rx="2.5" fill="var(--gear-highlight)" opacity="0.45" />
      {/* Blades — rotate around hub at (40, 72) */}
      <g transform={`rotate(${rotation}, 40, 72)`}>
        {[0, 90, 180, 270].map((angle) => (
          <g key={angle} transform={`rotate(${angle}, 40, 72)`}>
            <path d="M40 72 L36 46 Q40 36 44 46 Z" fill="var(--gear-base)" opacity="0.88" />
          </g>
        ))}
      </g>
      {/* Hub cap — drawn on top of blade roots */}
      <circle cx="40" cy="72" r="5.5" fill="var(--gear-shadow)" />
      <circle cx="40" cy="72" r="2.5" fill="var(--gear-highlight)" opacity="0.75" />
    </svg>
  );
}

function Cloud() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="42" rx="56" ry="20" fill="white" opacity="0.78" />
      <ellipse cx="48" cy="34" rx="32" ry="22" fill="white" opacity="0.86" />
      <ellipse cx="94" cy="36" rx="26" ry="18" fill="white" opacity="0.80" />
      <ellipse cx="70" cy="34" rx="22" ry="16" fill="white" opacity="0.55" />
    </svg>
  );
}

function Fluff() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="2.2" fill="var(--accent-1)" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 14 + Math.cos(rad) * 10;
        const y2 = 14 + Math.sin(rad) * 10;
        return (
          <g key={angle}>
            <line
              x1="14" y1="14"
              x2={x2} y2={y2}
              stroke="var(--text-muted)"
              strokeWidth="0.7"
              opacity="0.5"
            />
            <circle cx={x2} cy={y2} r="1.8" fill="white" opacity="0.88" />
          </g>
        );
      })}
    </svg>
  );
}

function Hills() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 pointer-events-none"
      style={{ zIndex: 3 }}
    >
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '200px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Far hill — light sage */}
        <path
          d="M0 155 Q200 75 400 125 Q600 175 800 85 Q1000 15 1200 105 Q1320 155 1440 125 L1440 200 L0 200 Z"
          fill="var(--gear-highlight)"
          opacity="0.55"
        />
        {/* Mid hill — mid sage */}
        <path
          d="M0 175 Q180 105 360 148 Q560 188 760 115 Q960 55 1160 145 Q1300 185 1440 158 L1440 200 L0 200 Z"
          fill="var(--gear-base)"
          opacity="0.72"
        />
        {/* Near hill — deep sage */}
        <path
          d="M0 200 Q140 152 280 172 Q480 196 660 155 Q860 122 1060 168 Q1260 200 1440 178 L1440 200 L0 200 Z"
          fill="var(--gear-shadow)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

type FluffPos = {
  left?: string;
  right?: string;
  top: string;
  dur: string;
  delay: string;
  anim: string;
};

const FLUFFS: FluffPos[] = [
  { left: '8%',   top: '62vh', dur: '12s', delay: '0s',  anim: 'ghibli-drift'   },
  { left: '23%',  top: '72vh', dur: '15s', delay: '3s',  anim: 'ghibli-drift-r' },
  { right: '10%', top: '65vh', dur: '11s', delay: '6s',  anim: 'ghibli-drift'   },
  { right: '26%', top: '74vh', dur: '14s', delay: '1s',  anim: 'ghibli-drift-r' },
  { left: '16%',  top: '55vh', dur: '18s', delay: '8s',  anim: 'ghibli-drift'   },
  { right: '19%', top: '58vh', dur: '13s', delay: '4s',  anim: 'ghibli-drift-r' },
];

export function GhibliScene() {
  const themeId = useThemeStore((s) => s.themeId);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = useScrollStore.subscribe((s) => setProgress(s.progress));
    return () => unsub();
  }, []);

  if (!mounted) return null;

  const theme = THEMES[themeId] ?? THEMES.workshop;
  if (theme.gearStyle !== 'svg-ghibli') return null;

  // Opposite spin directions per side
  const r1 = progress * 360 * 1.6;
  const r2 = progress * 360 * 2.4;

  return (
    <>
      {/* Rolling hills — in front of windmills (z-3 > z-1) */}
      <Hills />

      {/* Clouds + windmills + dandelion fluff */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Clouds drifting left→right */}
        <div style={{ position: 'absolute', top: '8vh', left: '-220px', width: '220px', height: '80px', animation: 'ghibli-cloud-r 60s linear infinite' }}>
          <Cloud />
        </div>
        <div style={{ position: 'absolute', top: '14vh', left: '-150px', width: '150px', height: '55px', animation: 'ghibli-cloud-r 80s linear infinite -35s' }}>
          <Cloud />
        </div>
        {/* Clouds drifting right→left */}
        <div style={{ position: 'absolute', top: '20vh', right: '-180px', width: '180px', height: '65px', animation: 'ghibli-cloud-l 70s linear infinite -15s' }}>
          <Cloud />
        </div>
        <div style={{ position: 'absolute', top: '28vh', right: '-130px', width: '130px', height: '48px', animation: 'ghibli-cloud-l 90s linear infinite -55s' }}>
          <Cloud />
        </div>

        {/* Left windmills — anchored at bottom, blades rise above hills */}
        <div style={{ position: 'absolute', left: '1vw', bottom: 0, width: 'clamp(160px, 20vw, 260px)', aspectRatio: '80 / 128' }}>
          <Windmill rotation={r1} />
        </div>
        <div style={{ position: 'absolute', left: '8vw', bottom: 0, width: 'clamp(110px, 14vw, 185px)', aspectRatio: '80 / 128' }}>
          <Windmill rotation={r2} />
        </div>

        {/* Right windmills — negate so they counter-rotate */}
        <div style={{ position: 'absolute', right: '1vw', bottom: 0, width: 'clamp(160px, 20vw, 260px)', aspectRatio: '80 / 128' }}>
          <Windmill rotation={-r1} />
        </div>
        <div style={{ position: 'absolute', right: '8vw', bottom: 0, width: 'clamp(110px, 14vw, 185px)', aspectRatio: '80 / 128' }}>
          <Windmill rotation={-r2} />
        </div>

        {/* Dandelion fluff drifting upward */}
        {FLUFFS.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: f.left,
              right: f.right,
              top: f.top,
              animation: `${f.anim} ${f.dur} ease-in-out infinite ${f.delay}`,
            }}
          >
            <Fluff />
          </div>
        ))}
      </div>
    </>
  );
}
