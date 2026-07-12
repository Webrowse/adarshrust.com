'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS, POSTS } from '@/lib/content';
import { HomePanel, ProjectPanel, WritingPanel, PostPanel } from './panels';

/* ------------------------------------------------------------------ */
/* The map. Every page is a coordinate on one plane:                   */
/*                                                                     */
/*   home(0,0)    osspath(1,0)   romyq(2,0)   loopupward(3,0)          */
/*   writing(0,1) post₁(1,1)     post₂(2,1)   …                        */
/*                                                                     */
/* Navigating translates the plane; the URL hash names the coordinate  */
/* so browser back/forward replays the move in reverse.                */
/* ------------------------------------------------------------------ */

type PlaneNode = {
  id: string;
  x: number;
  y: number;
  hash: string; // '' for home
  parent: string | null;
  locator: string; // mono wayfinding label, top-right
  content: React.ReactNode;
};

function buildNodes(): PlaneNode[] {
  const nodes: PlaneNode[] = [
    {
      id: 'home',
      x: 0,
      y: 0,
      hash: '',
      parent: null,
      locator: 'index',
      content: <HomePanel />,
    },
    {
      id: 'writing',
      x: 0,
      y: 1,
      hash: '#/writing',
      parent: 'home',
      locator: 'writing',
      content: <WritingPanel />,
    },
  ];
  PROJECTS.forEach((p, i) => {
    nodes.push({
      id: p.slug,
      x: i + 1,
      y: 0,
      hash: `#/${p.slug}`,
      parent: 'home',
      locator: `built · ${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}`,
      content: <ProjectPanel project={p} index={i} />,
    });
  });
  POSTS.forEach((p, i) => {
    nodes.push({
      id: `post:${p.slug}`,
      x: i + 1,
      y: 1,
      hash: `#/writing/${p.slug}`,
      parent: 'writing',
      locator: `writing · ${String(i + 1).padStart(2, '0')} / ${String(POSTS.length).padStart(2, '0')}`,
      content: <PostPanel post={p} />,
    });
  });
  return nodes;
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
  const current = byId.get(currentId) ?? nodes[0];

  const navigate = useCallback(
    (id: string, push = true) => {
      const node = byId.get(id);
      if (!node) return;
      setCurrentId(id);
      if (push) {
        history.pushState(null, '', node.hash || window.location.pathname + window.location.search);
      }
    },
    [byId],
  );

  useEffect(() => {
    const fromHash = () => byHash.get(window.location.hash)?.id ?? 'home';
    setCurrentId(fromHash());
    // Two frames: let the jump paint before transitions switch on.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)));
    const onPop = () => setCurrentId(fromHash());
    window.addEventListener('popstate', onPop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('popstate', onPop);
    };
  }, [byHash]);

  // Keyboard: Escape climbs to the parent, arrows walk the plane.
  const currentRef = useRef(current);
  currentRef.current = current;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const c = currentRef.current;
      if (e.key === 'Escape' && c.parent) {
        e.preventDefault();
        navigate(c.parent);
        return;
      }
      const step: Record<string, [number, number]> = {
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
        ArrowDown: [0, 1],
        ArrowUp: [0, -1],
      };
      const d = step[e.key];
      if (!d) return;
      const target = nodes.find((n) => n.x === c.x + d[0] && n.y === c.y + d[1]);
      if (target) {
        e.preventDefault();
        navigate(target.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nodes, navigate]);

  // Panels navigate with plain hash anchors (<a data-plane href="#/…">).
  // One delegated handler turns them into camera moves; unhandled clicks
  // (middle-click, new tab) still resolve as deep links via the hash.
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
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

  const parent = current.parent ? byId.get(current.parent) : null;

  return (
    <div className="viewport" onClick={onClick}>
      <div
        className={`plane${settled ? ' plane--live' : ''}`}
        style={{ transform: `translate3d(${-current.x * 100}%, ${-current.y * 100}%, 0)` }}
      >
        {/* One dot-grid surface spanning the full extent of the plane, so
            the camera move reads against something. */}
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
              aria-hidden={!active}
              ref={(el) => {
                if (el) (el as HTMLElement & { inert: boolean }).inert = !active;
              }}
              style={{ transform: `translate(${node.x * 100}%, ${node.y * 100}%)` }}
            >
              <div className="panel-scroll">{node.content}</div>
            </section>
          );
        })}
      </div>

      {/* Fixed chrome — wayfinding only, everything else lives on the plane */}
      <button
        type="button"
        className={`chrome chrome-back${parent ? ' chrome--on' : ''}`}
        onClick={() => parent && navigate(parent.id)}
        tabIndex={parent ? 0 : -1}
        aria-hidden={!parent}
      >
        <span className="chrome-arrow">{parent && parent.y < current.y ? '↑' : '←'}</span>{' '}
        {parent ? parent.locator : ''}
      </button>
      <div className="chrome chrome-locator chrome--on" aria-hidden>
        {current.locator}
      </div>
    </div>
  );
}
