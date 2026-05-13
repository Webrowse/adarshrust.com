'use client';

import { Menu } from 'lucide-react';

export function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-7 md:px-12 py-5 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <span className="terminal-text" style={{ color: '#ff8a3a' }}>
          ADARSHRUST
        </span>
        <span className="terminal-text" style={{ color: '#3a2d22' }}>
          //
        </span>
        <span className="terminal-text" style={{ color: '#5a4a38' }}>
          v0.1 — FORGED
        </span>
      </div>
      <nav className="pointer-events-auto hidden md:flex items-center gap-9">
        <a className="nav-link" href="#about">About</a>
        <a className="nav-link" href="#philosophy">Philosophy</a>
        <a className="nav-link" href="#contact">Contact</a>
        <Menu size={16} className="text-forge-glow opacity-60" />
      </nav>
    </header>
  );
}
