import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { LenisProvider } from '@/components/LenisProvider';

// Self-hosted fonts (npm packages, no Google Fonts runtime dependency)
import '@fontsource/orbitron/900.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';

import './globals.css';

export const metadata: Metadata = {
  title: 'ADARSHRUST — Forged in Rust',
  description: 'A workshop of Rust projects, tools, and machinery.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-forge-steel text-forge-bone antialiased font-sans">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
