'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemePicker } from './ThemePicker';

const backdropStyle = {
  background:
    'linear-gradient(to bottom, var(--bg-side) 0%, color-mix(in srgb, var(--bg-side) 60%, transparent) 70%, transparent 100%)',
  backdropFilter: 'blur(6px)',
};

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Contact', href: '#contact' },
];

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [isMenuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 px-7 md:px-12 py-4 flex items-center justify-between pointer-events-none"
        style={backdropStyle}
      >
        <div className="pointer-events-auto flex items-center gap-3">
          <span className="terminal-text" style={{ color: 'var(--gear-base)' }}>
            ADARSHRUST
          </span>
          <span className="terminal-text hidden sm:inline" style={{ color: 'var(--gear-highlight)' }}>
            //
          </span>
          <span className="terminal-text hidden sm:inline" style={{ color: 'var(--gear-highlight)' }}>
            v0.1 — FORGED
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-9">
            {LINKS.map((l) => (
              <a
                key={l.href}
                className="nav-link"
                href={l.href}
                style={{ color: 'var(--gear-highlight)' }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <ThemePicker />
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen
              ? <X size={16} style={{ color: 'var(--gear-highlight)' }} />
              : <Menu size={16} style={{ color: 'var(--gear-highlight)' }} />
            }
          </button>
        </div>
      </header>

      {/* Invisible backdrop — click outside panel to close */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[28]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 right-0 z-[29] pt-[48px] px-7 pb-6 flex flex-col gap-5 md:hidden pointer-events-auto"
          style={backdropStyle}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              className="nav-link"
              href={l.href}
              style={{ color: 'var(--gear-highlight)' }}
              onClick={() => setIsMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
