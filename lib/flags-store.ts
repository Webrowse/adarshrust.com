import { create } from 'zustand';
import type { FlagMap } from './flags';

type FlagsStore = {
  flags: FlagMap;
  loaded: boolean;
  setFlags: (flags: FlagMap) => void;
};

export const useFlagsStore = create<FlagsStore>((set) => ({
  flags: {},
  loaded: false,
  setFlags: (flags) => set({ flags, loaded: true }),
}));

// Returns flag's enabled value, or defaultValue if the flag isn't defined.
// Defaults to true so unrecognised keys show their portal (fail open).
export function isEnabled(flags: FlagMap, key: string, defaultValue = true): boolean {
  if (!(key in flags)) return defaultValue;
  return flags[key].enabled;
}
