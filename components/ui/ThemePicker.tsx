'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';

export function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [triggerHovered, setTriggerHovered] = useState(false);

  const themeId = useThemeStore((s) => s.themeId);
  const setTheme = useThemeStore((s) => s.setTheme);
  const theme = THEMES[themeId] ?? THEMES.workshop;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // T = toggle, Escape = close, ArrowUp/Down = cycle themes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      ) return;

      if (e.key === 't' || e.key === 'T') {
        setIsOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }
      if (isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const ids = Object.keys(THEMES);
        const idx = ids.indexOf(themeId);
        const next = (idx + (e.key === 'ArrowDown' ? 1 : -1) + ids.length) % ids.length;
        setTheme(ids[next]);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, themeId, setTheme]);

  const drawerTransform = isOpen
    ? 'translateX(0) translateY(0)'
    : isMobile
    ? 'translateY(100%)'
    : 'translateX(100%)';

  const drawerPositioning = isMobile
    ? { left: 0, right: 0, bottom: 0, height: '70vh', top: 'auto' as const }
    : { top: 0, right: 0, bottom: 0, width: '340px', left: 'auto' as const };

  const drawerShadow = isMobile
    ? '0 -8px 60px rgba(0,0,0,0.4)'
    : '-8px 0 60px rgba(0,0,0,0.4)';

  const drawerRadius = isMobile ? '16px 16px 0 0' : '0';

  const portal = mounted
    ? createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 39,
              backgroundColor: 'rgba(0,0,0,0.35)',
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transition: 'opacity 200ms',
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: 'fixed',
              zIndex: 40,
              backgroundColor: 'var(--bg-center)',
              boxShadow: drawerShadow,
              borderRadius: drawerRadius,
              display: 'flex',
              flexDirection: 'column',
              overscrollBehavior: 'contain',
              transform: drawerTransform,
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms',
              ...drawerPositioning,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--border-soft)',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                Workshop themes
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                Persists across visits · press{' '}
                <kbd
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    padding: '1px 4px',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '3px',
                  }}
                >
                  T
                </kbd>{' '}
                to toggle
              </p>
            </div>

            {/* Theme list */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {Object.values(THEMES).map((t) => {
                const isActive = t.id === themeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`theme-card${isActive ? ' theme-card-active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '64px',
                      padding: '0 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    {/* 5 color swatches */}
                    <div
                      style={{
                        display: 'flex',
                        height: '36px',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {[t.bgSide, t.bgCenter, t.gearBase, t.accent1, t.accent2].map(
                        (color, i) => (
                          <div key={i} style={{ width: '14px', backgroundColor: color }} />
                        ),
                      )}
                    </div>

                    {/* Name + description */}
                    <div style={{ flex: 1, paddingLeft: '12px', minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          lineHeight: 1.3,
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: '10px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t.description}
                      </p>
                    </div>

                    {/* Active checkmark */}
                    {isActive && (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          backgroundColor: 'var(--gear-base)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 3.5L3.8 6.5L9 1"
                            stroke="var(--text-primary)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      {/* Trigger — renders in the navbar's DOM flow */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => setTriggerHovered(true)}
        onMouseLeave={() => setTriggerHovered(false)}
        aria-label="Open theme picker"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: `1.5px solid ${triggerHovered ? theme.gearHighlight : theme.borderSoft}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          transform: triggerHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'border-color 150ms, transform 150ms',
          flexShrink: 0,
        }}
      >
        {/* 2×2 dot palette */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2px',
            width: '12px',
            height: '12px',
          }}
        >
          {[theme.gearBase, theme.accent1, theme.accent2, theme.gearHighlight].map(
            (color, i) => (
              <div key={i} style={{ backgroundColor: color, borderRadius: '1px' }} />
            ),
          )}
        </div>
      </button>

      {portal}
    </>
  );
}
