'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { ThemePicker } from './ThemePicker';

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
        className="nav-bar-backdrop fixed top-0 left-0 right-0 z-30 px-7 md:px-12 py-4 flex items-center justify-between pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-3">
          <Link href="/" className="brand-link" aria-label="ADARSHRUST home">
            ADARSHRUST
          </Link>
          <span
            className="hidden sm:inline font-mono text-[11px] tracking-[0.32em]"
            style={{ color: 'var(--ui-text)', opacity: 0.7 }}
          >
            // v0.1 — FORGED
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-9">
            {LINKS.map((l) => (
              <a key={l.href} className="nav-link" href={l.href}>
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
              ? <X size={16} style={{ color: 'var(--ui-text)' }} />
              : <Menu size={16} style={{ color: 'var(--ui-text)' }} />
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
          className="nav-bar-backdrop fixed top-0 left-0 right-0 z-[29] pt-[48px] px-7 pb-6 flex flex-col gap-5 md:hidden pointer-events-auto"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              className="nav-link"
              href={l.href}
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
