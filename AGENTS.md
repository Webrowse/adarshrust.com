# CLAUDE.md — adarshrust.com

Architecture notes for AI assistants working on this codebase.

## The one idea: the site is a plane

Every page exists simultaneously as a panel on a single 2D canvas. Navigation
does not swap pages — it moves the camera. `components/plane/Plane.tsx` owns
this entirely:

- Each node has a grid coordinate: home `(0,0)`; projects at `(i+1, 0)` (the
  BUILT row, to the right); the writing index at `(0,1)` (below home); posts at
  `(i+1, 1)` (to the right of writing).
- Panels are absolutely positioned via `translate(x·100%, y·100%)`; the plane
  wrapper carries one `translate3d(-x·100%, -y·100%, 0)` and a single long
  transition (`--dur-camera` / `--ease-camera` in globals.css) does all the
  animating.
- The URL hash names the coordinate (`#/osspath`, `#/writing/<slug>`). Panels
  navigate with plain anchors marked `data-plane`; a delegated click handler on
  `.viewport` converts them to `history.pushState` + a camera move. `popstate`
  handles browser back/forward, so back plays the move in reverse.
- Deep links land instantly: transitions stay disabled (`plane--live` class
  absent) until two rAFs after the initial hash jump.
- Inactive panels get `inert` + `aria-hidden` (set via ref callback — React 18
  has no `inert` prop). All panels stay visible so pass-through panels sweep
  past during multi-cell moves.
- `Escape` climbs to the parent node; arrow keys walk adjacent grid cells.

**Do not turn this into per-page routes or replace the transition with
enter/exit animations — the whole point is one continuous surface.**

## Content lives in `lib/content.tsx`

Projects (BUILT row), posts (JSX bodies), and elsewhere links are plain data.
Adding a project or post automatically places it on the grid and in the lists —
no component work needed.

## Screenshots

`Shot` in `components/plane/panels.tsx` renders the project's optional `shot`
image path (files live under `public/screens/`) inside a minimal browser
frame. Without a `shot`, or if the image 404s, it falls back to a typographic
cover — checked both via `onError` and a mount-time `naturalWidth` probe,
because a missing image errors before hydration.

## Design system

One light theme, defined as CSS custom properties in `app/globals.css`
(`--paper`, `--ink`, `--accent`, hairline `--line`). Fonts via `next/font`
(build-time self-hosted, no runtime requests): Instrument Serif (display),
Newsreader (body prose), JetBrains Mono (wayfinding labels/kickers).
No Tailwind — the reset and every class are hand-written in globals.css.

The document itself never scrolls (`html, body { overflow: hidden }`); each
panel scrolls internally via `.panel-scroll`. There is no smooth-scroll
library and no feature-flag service — both were removed deliberately for load
speed. Do not reintroduce them.

## Stack

- Next.js 14 (App Router, static export → `/out`, Cloudflare Pages)
- React 18, no other runtime dependencies
- Hand-written CSS (no Tailwind/PostCSS config)

The previous incarnation (Three.js gear scenes, theme system, Lenis, FFS
flags) was removed in the 2026-07 redesign; recover via git history if ever
needed.
