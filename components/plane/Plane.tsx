'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS, LOCAL_POSTS, PROFILE } from '@/lib/content';
import {
  HomePanel,
  OpenSourcePanel,
  WorkPanel,
  ProjectPanel,
  WritingPanel,
  PostPanel,
  ProfilePanel,
} from './panels';

/* ------------------------------------------------------------------ */
/* The map.                                                            */
/*                                                                     */
/* Column 0 is the spine — the five destinations in the navigation,    */
/* in the order they appear there. Detail pages run off to the right   */
/* of the section they belong to:                                      */
/*                                                                     */
/*   (0,0) home                                                        */
/*   (0,1) open source                                                 */
/*   (0,2) work        (1,2) project₁  (2,2) project₂  …               */
/*   (0,3) writing     (1,3) post₁     (2,3) post₂     …               */
/*   (0,4) profile                                                     */
/*                                                                     */
/* Navigating translates the plane; the URL hash names the coordinate, */
/* so browser back/forward replays the move in reverse and a pasted    */
/* link lands on the right cell.                                       */
/*                                                                     */
/* The navigation rail is the same column read top to bottom, which is */
/* what keeps the spatial idea from being something a visitor has to   */
/* work out before they can use the site.                              */
/* ------------------------------------------------------------------ */

type PlaneNode = {
  id: string;
  x: number;
  y: number;
  hash: string; // '' for home
  parent: string | null;
  /** accessible name of the panel, and what the back control says */
  title: string;
  content: React.ReactNode;
};

/** The spine, in navigation order. `id` doubles as the section key. */
export const SECTIONS = [
  { id: 'home', label: 'Home', hash: '' },
  { id: 'open-source', label: 'Open source', hash: '#/open-source' },
  { id: 'work', label: 'Work', hash: '#/work' },
  { id: 'writing', label: 'Writing', hash: '#/writing' },
  { id: 'profile', label: 'Profile', hash: '#/profile' },
] as const;

function buildNodes(): PlaneNode[] {
  const nodes: PlaneNode[] = [
    { id: 'home', x: 0, y: 0, hash: '', parent: null, title: PROFILE.name, content: <HomePanel /> },
    {
      id: 'open-source',
      x: 0,
      y: 1,
      hash: '#/open-source',
      parent: 'home',
      title: 'Open source',
      content: <OpenSourcePanel />,
    },
    { id: 'work', x: 0, y: 2, hash: '#/work', parent: 'home', title: 'Work', content: <WorkPanel /> },
    {
      id: 'writing',
      x: 0,
      y: 3,
      hash: '#/writing',
      parent: 'home',
      title: 'Writing',
      content: <WritingPanel />,
    },
    {
      id: 'profile',
      x: 0,
      y: 4,
      hash: '#/profile',
      parent: 'home',
      title: 'Profile',
      content: <ProfilePanel />,
    },
  ];
  PROJECTS.forEach((p, i) => {
    nodes.push({
      id: `work:${p.slug}`,
      x: i + 1,
      y: 2,
      hash: `#/work/${p.slug}`,
      parent: 'work',
      title: p.name,
      content: <ProjectPanel project={p} index={i} />,
    });
  });
  LOCAL_POSTS.forEach((p, i) => {
    nodes.push({
      id: `post:${p.slug}`,
      x: i + 1,
      y: 3,
      hash: `#/writing/${p.slug}`,
      parent: 'writing',
      title: p.title,
      content: <PostPanel post={p} />,
    });
  });
  return nodes;
}

/** How long the camera takes, given how far it travels. */
function duration(from: PlaneNode, to: PlaneNode) {
  const dist = Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
  if (dist <= 1) return 760;
  return Math.min(760 + (dist - 1) * 150, 1180);
}

export function Plane() {
  const nodes = useMemo(buildNodes, []);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const byHash = useMemo(() => new Map(nodes.map((n) => [n.hash, n])), [nodes]);
  const cols = Math.max(...nodes.map((n) => n.x)) + 1;
  const rows = Math.max(...nodes.map((n) => n.y)) + 1;

  const [currentId, setCurrentId] = useState('home');
  // Transitions stay off until after the initial hash jump, so a deep link
  // lands on its panel instead of flying there from home.
  const [settled, setSettled] = useState(false);
  const [dur, setDur] = useState(760);
  const current = byId.get(currentId) ?? nodes[0];

  const panelRefs = useRef(new Map<string, HTMLElement>());
  // True once a navigation has happened, which is what distinguishes
  // "arrived here" (reset the scroll) from the first paint (leave it).
  const shouldFocus = useRef(false);

  const go = useCallback(
    (id: string, push: boolean) => {
      const node = byId.get(id);
      if (!node) return;
      setCurrentId((prev) => {
        const from = byId.get(prev);
        if (from) setDur(duration(from, node));
        return id;
      });
      if (push) {
        history.pushState(null, '', node.hash || window.location.pathname + window.location.search);
      }
    },
    [byId],
  );

  const navigate = useCallback(
    (id: string) => {
      if (id === currentId) return;
      shouldFocus.current = true;
      go(id, true);
    },
    [currentId, go],
  );

  useEffect(() => {
    const fromHash = () => byHash.get(window.location.hash)?.id ?? 'home';
    setCurrentId(fromHash());
    // Two frames: let the jump paint before transitions switch on.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)));
    const onPop = () => {
      shouldFocus.current = true;
      go(fromHash(), false);
    };
    window.addEventListener('popstate', onPop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('popstate', onPop);
    };
  }, [byHash, go]);

  // Each panel is its own scroll container, so arriving at one has to start
  // it at the top, and focus has to land on it: the document behind never
  // scrolls, so without focus here Down, PageDown and Space have nothing to
  // act on. Not on the first paint, though — that would put focus past the
  // rail, leaving the site's own navigation reachable only by Shift+Tab.
  // "Skip to content" is how a keyboard visitor gets there from a cold load.
  useEffect(() => {
    const el = panelRefs.current.get(currentId);
    if (!el || !shouldFocus.current) return;
    shouldFocus.current = false;
    el.scrollTop = 0;
    el.focus({ preventScroll: true });
  }, [currentId]);

  const focusPanel = useCallback(() => {
    panelRefs.current.get(currentId)?.focus({ preventScroll: true });
  }, [currentId]);

  // Panels and the rail navigate with ordinary hash anchors. One delegated
  // handler turns a plain left-click into a camera move; everything else —
  // middle-click, cmd-click, "copy link address" — is left alone and still
  // resolves, because the href is a real deep link.
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;
      const a = (e.target as HTMLElement).closest('a[data-plane]');
      const href = a?.getAttribute('href');
      if (!href) return;
      const node = byHash.get(href === '#/' ? '' : href);
      if (node) {
        e.preventDefault();
        navigate(node.id);
      }
    },
    [byHash, navigate],
  );

  // Escape climbs one level. Arrow keys are deliberately not bound: they
  // scroll the panel, which is what every visitor already expects them to do.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'))
        return;
      const parent = byId.get(currentId)?.parent;
      if (!parent) return;
      e.preventDefault();
      navigate(parent);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [byId, currentId, navigate]);

  const section = current.parent && current.parent !== 'home' ? current.parent : current.id;

  return (
    <div className="viewport" onClick={onClick}>
      {/* Hands focus to the panel itself, which is the scroll container —
          so arrow keys, PageDown and Space work from here on. The href is
          the no-JS fallback. */}
      <a
        href="#plane-main"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          focusPanel();
        }}
      >
        Skip to content
      </a>

      <nav className="rail" aria-label="Sections">
        <a data-plane href="#/" className="rail-name">
          {PROFILE.name}
          <span className="rail-role">{PROFILE.role}</span>
        </a>

        <ul className="rail-list">
          {SECTIONS.filter((s) => s.id !== 'home').map((s) => (
            <li key={s.id}>
              <a
                data-plane
                href={s.hash}
                className="rail-link"
                aria-current={section === s.id ? 'page' : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="rail-foot">
          <a href={`mailto:${PROFILE.email}`} className="rail-out">
            Email
          </a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" className="rail-out">
            GitHub
          </a>
        </div>
      </nav>

      <div className="stage" id="plane-main">
        <div
          className={`plane${settled ? ' plane--live' : ''}`}
          style={
            {
              transform: `translate3d(${-current.x * 100}%, ${-current.y * 100}%, 0)`,
              '--dur-camera': `${dur}ms`,
            } as React.CSSProperties
          }
        >
          {/* One ruled surface spanning the whole plane, so the camera move
              reads as travel across a sheet rather than a cross-fade. */}
          <div
            className="plane-surface"
            aria-hidden
            style={{ width: `${cols * 100}%`, height: `${rows * 100}%` }}
          />
          {nodes.map((node) => {
            const active = node.id === currentId;
            return (
              <section
                key={node.id}
                className="panel"
                aria-label={node.title}
                aria-hidden={!active}
                tabIndex={-1}
                ref={(el) => {
                  if (el) {
                    panelRefs.current.set(node.id, el);
                    (el as HTMLElement & { inert: boolean }).inert = !active;
                  } else {
                    panelRefs.current.delete(node.id);
                  }
                }}
                style={{ transform: `translate(${node.x * 100}%, ${node.y * 100}%)` }}
              >
                {node.content}
              </section>
            );
          })}
        </div>
      </div>

      <p className="sr-live" aria-live="polite">
        {current.title}
      </p>
    </div>
  );
}
