import { create } from 'zustand';

type ScrollState = {
  /** Lenis scroll position in px */
  scroll: number;
  /** Normalized scroll progress, 0 at top to 1 at bottom */
  progress: number;
  /** Smoothed scroll velocity */
  velocity: number;
  /** Rate of mechanical activity, 0..1 — drives spark and ember spawn rate */
  activity: number;
  set: (s: Partial<ScrollState>) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  scroll: 0,
  progress: 0,
  velocity: 0,
  activity: 0,
  set: (s) => set(s),
}));
