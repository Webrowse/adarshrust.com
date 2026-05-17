'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/scroll-store';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';
import { Sunflower } from './Sunflower';

export function SunflowerColumns() {
  const themeId = useThemeStore((s) => s.themeId);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = useScrollStore.subscribe((s) => setProgress(s.progress));
    return () => unsub();
  }, []);

  // Return null until after hydration so server and initial client renders match.
  // Without this, localStorage-persisted 'sunflower' theme causes a mismatch
  // because the server always sees the default theme (no localStorage on server).
  if (!mounted) return null;

  const theme = THEMES[themeId] ?? THEMES.workshop;
  if (theme.gearStyle !== 'svg-sunflower') return null;

  // 1 rev per page scroll, direction varies per flower, sides mirrored
  const r1 = progress * 360 * 0.8;
  const r2 = progress * 360 * -1.1;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Left column */}
      <div
        className="absolute"
        style={{
          left: '3vw',
          top: '14vh',
          width: 'clamp(110px, 16vw, 200px)',
          height: 'clamp(110px, 16vw, 200px)',
        }}
      >
        <Sunflower rotation={r1} className="w-full h-full" />
      </div>
      <div
        className="absolute"
        style={{
          left: '5vw',
          top: '74vh',
          width: 'clamp(80px, 11vw, 140px)',
          height: 'clamp(80px, 11vw, 140px)',
        }}
      >
        <Sunflower rotation={r2} className="w-full h-full" />
      </div>

      {/* Right column — mirrored rotation */}
      <div
        className="absolute"
        style={{
          right: '3vw',
          top: '14vh',
          width: 'clamp(110px, 16vw, 200px)',
          height: 'clamp(110px, 16vw, 200px)',
        }}
      >
        <Sunflower rotation={-r1} className="w-full h-full" />
      </div>
      <div
        className="absolute"
        style={{
          right: '5vw',
          top: '74vh',
          width: 'clamp(80px, 11vw, 140px)',
          height: 'clamp(80px, 11vw, 140px)',
        }}
      >
        <Sunflower rotation={-r2} className="w-full h-full" />
      </div>
    </div>
  );
}
