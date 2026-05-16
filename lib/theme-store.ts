import { create } from 'zustand';
import { DEFAULT_THEME_ID } from './themes';

type ThemeStore = {
  themeId: string;
  setTheme: (id: string) => void;
};

function readStorage(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID;
  try {
    return localStorage.getItem('arust-theme') ?? DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export const useThemeStore = create<ThemeStore>((set) => ({
  themeId: readStorage(),
  setTheme: (id) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('arust-theme', id);
      } catch {
        // ignore
      }
    }
    set({ themeId: id });
  },
}));
