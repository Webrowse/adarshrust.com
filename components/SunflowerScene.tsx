'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/scroll-store';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';

// ─── Sun ─────────────────────────────────────────────────────────────────────

function Sun({ xPct, yPct }: { xPct: number; yPct: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Glow halo */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(120px, 16vw, 220px)',
          height: 'clamp(120px, 16vw, 220px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,220,40,0.55) 0%, rgba(255,200,0,0.20) 50%, transparent 70%)',
        }}
      />
      <svg
        viewBox="0 0 100 100"
        style={{
          display: 'block',
          width: 'clamp(54px, 7vw, 100px)',
          height: 'clamp(54px, 7vw, 100px)',
          overflow: 'visible',
        }}
      >
        {/* Slowly spinning rays */}
        <g
          style={{
            animation: 'sf-sun-spin 20s linear infinite',
            transformOrigin: '50px 50px',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 43}
                y1={50 + Math.sin(a) * 43}
                x2={50 + Math.cos(a) * 57}
                y2={50 + Math.sin(a) * 57}
                stroke="#FFD700"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.88"
              />
            );
          })}
        </g>
        {/* Disc */}
        <circle cx="50" cy="50" r="36" fill="#FFE135" />
        <circle cx="50" cy="50" r="29" fill="#FFD700" />
        {/* Face */}
        <circle cx="42" cy="46" r="3" fill="#c87c00" />
        <circle cx="58" cy="46" r="3" fill="#c87c00" />
        <path
          d="M41 57 Q50 65 59 57"
          stroke="#c87c00"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─── Cloud ───────────────────────────────────────────────────────────────────

function Cloud() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 70" fill="none">
      <ellipse cx="80" cy="50" rx="62" ry="24" fill="white" opacity="0.88" />
      <ellipse cx="56" cy="40" rx="36" ry="26" fill="white" opacity="0.92" />
      <ellipse cx="108" cy="43" rx="30" ry="22" fill="white" opacity="0.90" />
      <ellipse cx="80" cy="38" rx="24" ry="18" fill="white" opacity="0.55" />
    </svg>
  );
}

// ─── Tree ────────────────────────────────────────────────────────────────────

function Tree({ scale = 1 }: { scale?: number }) {
  const w = Math.round(80 * scale);
  const h = Math.round(160 * scale);
  return (
    <svg width={w} height={h} viewBox="0 0 80 160" style={{ display: 'block' }}>
      <rect x="34" y="108" width="12" height="52" rx="4" fill="#8B6340" opacity="0.82" />
      <ellipse cx="40" cy="102" rx="30" ry="32" fill="#527a38" opacity="0.72" />
      <ellipse cx="40" cy="80"  rx="25" ry="28" fill="#609040" opacity="0.82" />
      <ellipse cx="40" cy="60"  rx="19" ry="22" fill="#6ea848" opacity="0.90" />
      <ellipse cx="32" cy="60"  rx="7"  ry="9"  fill="#8cc858" opacity="0.35" />
    </svg>
  );
}

// ─── Bird ────────────────────────────────────────────────────────────────────

function Bird({ flapDur = '0.58s' }: { flapDur?: string }) {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" style={{ overflow: 'visible' }}>
      {/* Single path morphs between wings-up and wings-down via CSS d animation */}
      <path
        d="M0 12 Q6 3 12 7 Q18 3 24 12"
        stroke="#3d4e5e"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.72"
        style={{ animation: `sf-bird-flap ${flapDur} ease-in-out infinite` }}
      />
      {/* Small body dot at wing join */}
      <ellipse cx="12" cy="8.5" rx="1.8" ry="1.2" fill="#3d4e5e" opacity="0.6" />
    </svg>
  );
}

// ─── Rabbit ──────────────────────────────────────────────────────────────────

function Rabbit() {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" style={{ display: 'block' }}>
      <ellipse cx="17" cy="21" rx="10" ry="8"   fill="#f4f2ee" stroke="#ccc8be" strokeWidth="0.6" />
      <circle  cx="23" cy="13" r="7"             fill="#f4f2ee" stroke="#ccc8be" strokeWidth="0.6" />
      <ellipse cx="19" cy="4"  rx="2.4" ry="5.5" fill="#f4f2ee" stroke="#ccc8be" strokeWidth="0.6" />
      <ellipse cx="27" cy="3"  rx="2.4" ry="5.5" fill="#f4f2ee" stroke="#ccc8be" strokeWidth="0.6" />
      <ellipse cx="19" cy="4"  rx="1.1" ry="3.5" fill="#f0b0b8" opacity="0.7" />
      <ellipse cx="27" cy="3"  rx="1.1" ry="3.5" fill="#f0b0b8" opacity="0.7" />
      <circle  cx="25.5" cy="11.5" r="1.2"        fill="#4a3030" />
      <ellipse cx="28.5" cy="15"   rx="0.9" ry="0.7" fill="#e898a8" />
      <circle  cx="8" cy="20" r="3" fill="white" />
      <ellipse cx="11" cy="28.5" rx="5" ry="2.2" fill="#eeeae4" stroke="#ccc8be" strokeWidth="0.5" />
      <ellipse cx="21" cy="28.5" rx="5" ry="2.2" fill="#eeeae4" stroke="#ccc8be" strokeWidth="0.5" />
    </svg>
  );
}

// ─── Bee ─────────────────────────────────────────────────────────────────────

function Bee() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <ellipse cx="9"    cy="8" rx="5.5" ry="3.5" fill="#FFD02F" />
      <rect    x="6.5"  y="5"  width="1.5" height="6" rx="0.5" fill="#2a2a0a" opacity="0.7" />
      <rect    x="9.5"  y="5"  width="1.5" height="6" rx="0.5" fill="#2a2a0a" opacity="0.7" />
      <circle  cx="14.5" cy="7" r="2.8" fill="#FFD02F" />
      <circle  cx="15.2" cy="5.8" r="0.9" fill="#2a2a0a" />
      <ellipse cx="7"   cy="3.5" rx="4.5" ry="2.5" fill="white" opacity="0.75" />
      <ellipse cx="11"  cy="3"   rx="4"   ry="2.5" fill="white" opacity="0.75" />
    </svg>
  );
}

// ─── Pollen seed ─────────────────────────────────────────────────────────────

function Pollen() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="1.5" fill="#FFD02F" opacity="0.9" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const x = 5 + Math.cos(r) * 3.8;
        const y = 5 + Math.sin(r) * 3.8;
        return (
          <g key={deg}>
            <line x1="5" y1="5" x2={x} y2={y} stroke="#c8a020" strokeWidth="0.5" opacity="0.55" />
            <circle cx={x} cy={y} r="1.2" fill="#fff8c0" opacity="0.88" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Sunflower with tracking head ────────────────────────────────────────────

function FieldFlower({
  stemVh,
  headAngle,
  swayDelay,
  swayAmp,
}: {
  stemVh: number;
  headAngle: number;
  swayDelay: number;
  swayAmp: number;
}) {
  // viewBox: 100 wide × 228 tall. Head attachment at (50, 25). Stem base at (50, 228).
  const headCY = 25;
  const stemSW = Math.max(2.5, 5 * (stemVh / 22));

  return (
    <svg
      viewBox="0 0 100 228"
      style={{
        display: 'block',
        overflow: 'visible',
        height: `clamp(48px, ${stemVh}vh, 260px)`,
        animation: `sf-sway ${2.5 + swayDelay * 0.4}s ease-in-out infinite alternate`,
        animationDelay: `${swayDelay}s`,
        transformOrigin: '50% 100%',
        // Dynamic sway amplitude driven by scroll activity
        ['--sf-sway-deg' as string]: `${swayAmp}deg`,
      }}
    >
      {/* Stem */}
      <line
        x1="50" y1="228"
        x2="50" y2={headCY + 20}
        stroke="#5a8a28"
        strokeWidth={stemSW}
        strokeLinecap="round"
      />
      {/* Leaves */}
      <ellipse cx="33" cy="162" rx="16" ry="6"
        transform="rotate(-38, 33, 162)" fill="#6a9a30" opacity="0.82"
      />
      <ellipse cx="67" cy="108" rx="16" ry="6"
        transform="rotate(38, 67, 108)" fill="#6a9a30" opacity="0.82"
      />
      {/* Head — gear-driven rotation + sun lean */}
      <g transform={`rotate(${headAngle}, 50, ${headCY})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy={headCY - 16}
            rx="5.5"
            ry="14"
            transform={`rotate(${i * 30}, 50, ${headCY})`}
            fill="#FFD02F"
            stroke="#C8900A"
            strokeWidth="0.6"
            opacity="0.96"
          />
        ))}
        <circle cx="50" cy={headCY} r="10"  fill="#6A4825" />
        <circle cx="50" cy={headCY} r="6.5" fill="#4A2E18" />
        {([[-3,-3],[0,-4],[3,-3],[-4,0],[4,0],[-3,3],[0,4],[3,3]] as [number,number][]).map(([dx, dy], i) => (
          <circle key={i} cx={50 + dx} cy={headCY + dy} r="1.1" fill="#3a2010" opacity="0.7" />
        ))}
      </g>
    </svg>
  );
}

// ─── Types & data ─────────────────────────────────────────────────────────────

type FlowerDef = {
  side: 'left' | 'right';
  xVw: number;
  stemVh: number;
  swayDelay: number;
  // Gear-chain ratio — mirrors the ωLarge/ωMedium/ωSmall math in GearColumns.
  // Adjacent flowers counter-rotate; inner flowers spin faster (smaller effective radius).
  gearRatio: number;
};

const FLOWERS: FlowerDef[] = [
  // Left column — outer→inner, CW / CCW / CW / CCW
  { side: 'left',  xVw: 1.5, stemVh: 21, swayDelay: 0.0, gearRatio:  0.6  },
  { side: 'left',  xVw: 5.5, stemVh: 16, swayDelay: 0.5, gearRatio: -1.04 }, // 0.6 × 1.733
  { side: 'left',  xVw: 9.5, stemVh: 11, swayDelay: 0.9, gearRatio:  1.73 }, // 0.6 × 2.889
  { side: 'left',  xVw: 14,  stemVh: 7,  swayDelay: 0.3, gearRatio: -2.5  },
  // Right column — all signs flipped so both columns sweep outward symmetrically
  { side: 'right', xVw: 1.5, stemVh: 21, swayDelay: 0.2, gearRatio: -0.6  },
  { side: 'right', xVw: 5.5, stemVh: 16, swayDelay: 0.7, gearRatio:  1.04 },
  { side: 'right', xVw: 9.5, stemVh: 11, swayDelay: 1.1, gearRatio: -1.73 },
  { side: 'right', xVw: 14,  stemVh: 7,  swayDelay: 0.4, gearRatio:  2.5  },
];

function computeSunAngle(f: FlowerDef, sunXVw: number, sunYVh: number): number {
  const headXVw = f.side === 'left' ? f.xVw + 2 : 100 - f.xVw - 2;
  const headYVh = 100 - f.stemVh;
  const dx = sunXVw - headXVw;
  const dy = headYVh - sunYVh; // positive = sun is above flower
  return Math.atan2(dx, dy) * (180 / Math.PI);
}

type CloudDef = { top: string; w: number; h: number; anim: string; dur: string; delay: string };
const CLOUDS: CloudDef[] = [
  { top: '5vh',  w: 200, h: 74, anim: 'sf-cloud-r', dur: '52s', delay: '0s'   },
  { top: '13vh', w: 150, h: 56, anim: 'sf-cloud-r', dur: '73s', delay: '-22s' },
  { top: '9vh',  w: 175, h: 65, anim: 'sf-cloud-l', dur: '63s', delay: '-38s' },
];

type BirdDef = { top: string; anim: string; dur: string; delay: string; scale: number; flapDur: string };
const BIRDS: BirdDef[] = [
  { top: '10vh', anim: 'sf-bird-r', dur: '30s', delay: '0s',   scale: 1.0,  flapDur: '0.52s' },
  { top: '17vh', anim: 'sf-bird-r', dur: '40s', delay: '-14s', scale: 0.72, flapDur: '0.44s' },
  { top: '7vh',  anim: 'sf-bird-l', dur: '35s', delay: '-22s', scale: 0.88, flapDur: '0.60s' },
];

type PollenDef = { left?: string; right?: string; bottom: string; dur: string; delay: string };
const POLLEN: PollenDef[] = [
  { left: '2vw',   bottom: '20vh', dur: '9s',  delay: '0s'   },
  { left: '7vw',   bottom: '23vh', dur: '12s', delay: '2.5s' },
  { left: '12vw',  bottom: '16vh', dur: '8s',  delay: '5.5s' },
  { right: '3vw',  bottom: '19vh', dur: '10s', delay: '1.2s' },
  { right: '9vw',  bottom: '24vh', dur: '11s', delay: '4.0s' },
  { right: '14vw', bottom: '17vh', dur: '7s',  delay: '7.0s' },
];

type BeeDef = { left?: string; right?: string; top: string; delay: string; dur: string };
const BEES: BeeDef[] = [
  { left: '5vw',  top: '72vh', delay: '0s',   dur: '4.8s' },
  { right: '7vw', top: '67vh', delay: '-2.2s', dur: '6.2s' },
];

// ─── Scene ────────────────────────────────────────────────────────────────────

export function SunflowerScene() {
  const themeId = useThemeStore((s) => s.themeId);
  const [progress, setProgress] = useState(0);
  const [activity, setActivity] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return useScrollStore.subscribe((s) => {
      setProgress(s.progress);
      setActivity(s.activity);
    });
  }, []);

  if (!mounted) return null;
  const theme = THEMES[themeId] ?? THEMES.workshop;
  if (theme.gearStyle !== 'svg-sunflower') return null;

  // Sun arcs bottom-left → top-center → bottom-right
  const sunXVw = 8 + progress * 84;
  const sunYVh = 70 - Math.sin(progress * Math.PI) * 56;

  // Sway amplitude scales with scroll activity (calm at rest, windswept when scrolling fast)
  const swayAmp = 2 + activity * 6;

  return (
    <>
      {/* Sky gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(180deg, #4fb8e8 0%, #80d0f2 28%, #c0ecf2 58%, #ddf0c0 78%, #eee888 100%)',
        }}
      />

      {/* Background: sun, clouds, birds, distant trees */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Sun xPct={sunXVw} yPct={sunYVh} />

        {CLOUDS.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: c.top,
              ...(c.anim === 'sf-cloud-r' ? { left: `-${c.w}px` } : { right: `-${c.w}px` }),
              width: `${c.w}px`,
              height: `${c.h}px`,
              animation: `${c.anim} ${c.dur} linear infinite ${c.delay}`,
            }}
          >
            <Cloud />
          </div>
        ))}

        {BIRDS.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: b.top,
              ...(b.anim === 'sf-bird-r' ? { left: '-30px' } : { right: '-30px' }),
              transform: `scale(${b.scale})`,
              transformOrigin: 'top left',
              animation: `${b.anim} ${b.dur} linear infinite ${b.delay}`,
            }}
          >
            <Bird flapDur={b.flapDur} />
          </div>
        ))}

        {/* Trees — rendered here so flowers (z=3) appear in front */}
        <div style={{ position: 'absolute', left: 0,      bottom: '5vh' }}><Tree scale={1.2} /></div>
        <div style={{ position: 'absolute', left: '10vw', bottom: '5vh', opacity: 0.65 }}><Tree scale={0.88} /></div>
        <div style={{ position: 'absolute', right: 0,      bottom: '5vh' }}><Tree scale={1.2} /></div>
        <div style={{ position: 'absolute', right: '10vw', bottom: '5vh', opacity: 0.65 }}><Tree scale={0.88} /></div>
      </div>

      {/* Foreground: flowers, ground, rabbit, bees, pollen */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        {/* Sunflowers — rendered before ground so bases are hidden by ground */}
        {FLOWERS.map((f, i) => {
          // Gear-driven rotation: same mechanism as windmill blades / 3D gear columns.
          // Sun lean is a small additive bias so heads face the sun across the arc.
          const gearAngle = progress * 360 * f.gearRatio;
          const sunLean   = computeSunAngle(f, sunXVw, sunYVh) * 0.28;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                [f.side]: `${f.xVw}vw`,
                bottom: '5vh',
              }}
            >
              <FieldFlower
                stemVh={f.stemVh}
                headAngle={gearAngle + sunLean}
                swayDelay={f.swayDelay}
                swayAmp={swayAmp}
              />
            </div>
          );
        })}

        {/* Pollen seeds floating up through flower zone */}
        {POLLEN.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.left,
              right: p.right,
              bottom: p.bottom,
              animation: `sf-pollen ${p.dur} ease-out infinite ${p.delay}`,
            }}
          >
            <Pollen />
          </div>
        ))}

        {/* Ground strip — covers flower bases, sits over pollen roots */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '7vh',
            background:
              'linear-gradient(to top, #3d6a18 0%, #58981e 55%, #78b828 82%, transparent 100%)',
          }}
        />

        {/* Rabbit — hops along the ground surface */}
        <div
          style={{
            position: 'absolute',
            bottom: '6.5vh',
            left: 0,
            animation: 'sf-rabbit-x 48s linear infinite',
          }}
        >
          <div style={{ animation: 'sf-rabbit-y 1.0s ease-in-out infinite' }}>
            <Rabbit />
          </div>
        </div>

        {/* Bees hovering near flower heads */}
        {BEES.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              right: b.right,
              animation: `sf-bee ${b.dur} ease-in-out infinite alternate ${b.delay}`,
            }}
          >
            <Bee />
          </div>
        ))}
      </div>
    </>
  );
}
