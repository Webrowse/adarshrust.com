'use client';

import { useEffect } from 'react';
import { evaluateFlags } from '@/lib/flags';
import { useFlagsStore } from '@/lib/flags-store';

export function FlagsProvider({ children }: { children: React.ReactNode }) {
  const setFlags = useFlagsStore((s) => s.setFlags);

  useEffect(() => {
    evaluateFlags().then(setFlags);
  }, [setFlags]);

  return <>{children}</>;
}
