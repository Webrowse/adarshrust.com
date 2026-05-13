'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const { progress, active } = useProgress();
  // Keep the loader visible for a beat after `active` flips false, so it fades
  // out gracefully instead of pop-disappearing
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!active && progress === 100) {
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, #1a120a 0%, #0a0807 70%)',
        opacity: active || progress < 100 ? 1 : 0,
      }}
    >
      <div className="text-center" style={{ fontFamily: 'var(--font-mono)' }}>
        <div
          className="mb-4 text-xs tracking-[0.5em]"
          style={{ color: '#ff8a3a' }}
        >
          FORGING
        </div>
        <div className="relative w-64 h-px mx-auto bg-forge-ash/60 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: `${progress}%`,
              background:
                'linear-gradient(90deg, #6b2a08 0%, #ff8a3a 50%, #ffd28a 100%)',
              boxShadow: '0 0 12px rgba(255, 130, 40, 0.7)',
              transition: 'width 200ms ease-out',
            }}
          />
        </div>
        <div
          className="mt-4 text-[9.5px] tracking-[0.4em]"
          style={{ color: '#5a4a38' }}
        >
          {progress.toFixed(0).padStart(3, '0')} / 100
        </div>
      </div>
    </div>
  );
}
