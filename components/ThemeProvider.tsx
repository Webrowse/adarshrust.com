'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES, DEFAULT_THEME_ID } from '@/lib/themes';

function camelToKebab(s: string): string {
  return s.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());
}

function applyTheme(themeId: string) {
  const theme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];
  const root = document.documentElement;
  root.dataset.theme = themeId;

  for (const [key, value] of Object.entries(theme)) {
    if (key === 'lightIntensity' && typeof value === 'object' && value !== null) {
      for (const [subKey, subVal] of Object.entries(value as Record<string, number>)) {
        root.style.setProperty(`--light-intensity-${camelToKebab(subKey)}`, String(subVal));
      }
    } else if (typeof value === 'string') {
      root.style.setProperty(`--${camelToKebab(key)}`, value);
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useThemeStore((s) => s.themeId);

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  return <>{children}</>;
}
