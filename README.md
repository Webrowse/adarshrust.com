# adarshrust.com

Personal engineering site. Rust backend and systems work: upstream
contributions, the services I build and run, and write-ups.

Static Next.js export, deployed on Cloudflare Pages.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm test` | Playwright suite — starts the dev server itself |
| `npm run check` | lint, then `tsc --noEmit`, then build |

There is no `start` script: `output: 'export'` produces plain files, so
serve `out/` with any static server.

The first `npm test` on a machine needs browsers: `npx playwright install chromium`.

## The idea: the site is one plane

Every page exists at the same time, as a panel at a coordinate on one
surface. Navigating does not swap a document — it moves the camera.

```
          x=0            x=1              x=2            …
  y=0   home
  y=1   open source
  y=2   work           feature-flag-…   osspath         …
  y=3   writing        (empty — see POSTS below)
  y=4   profile
```

Column 0 is the spine: the five destinations in the navigation rail, in the
order the rail lists them. A section's detail pages run off to its right.
So the rail *is* a map of the plane, which is what keeps the spatial idea
from being something a visitor has to work out before they can use the site.

Mechanically:

- Panels are absolutely positioned via `translate(x·100%, y·100%)`. The
  plane wrapper carries one `translate3d(-x·100%, -y·100%, 0)` and a single
  transition does all the animating. Duration scales with distance
  (`duration()` in `Plane.tsx`), capped at 1180ms.
- The URL hash names the coordinate (`#/work/osspath`, `#/open-source`).
  Panels and the rail navigate with ordinary `<a data-plane href="#/…">`
  anchors; one delegated click handler on `.viewport` turns a plain
  left-click into `history.pushState` plus a camera move. Modified clicks
  are left alone, so cmd-click and "copy link address" still work.
- `popstate` drives back and forward, so the browser's back button plays
  the move in reverse.
- Deep links land instantly: transitions stay off (`plane--live` absent)
  until two frames after the initial hash jump.
- An unknown hash falls back to home rather than an empty cell.

## Layout of the source

| Path | What is in it |
| --- | --- |
| `app/layout.tsx` | Fonts, metadata, Person/WebSite JSON-LD |
| `app/page.tsx` | Renders `<Plane />`, nothing else |
| `app/globals.css` | The whole design system. Hand-written, no Tailwind |
| `components/plane/Plane.tsx` | The grid, the camera, navigation, keyboard, focus |
| `components/plane/panels.tsx` | One component per kind of panel |
| `lib/content.tsx` | All content as data |
| `tests/navigation.spec.ts` | Playwright: navigation, keyboard, a11y, layout |
| `public/screens/` | Project screenshots |

## The content model

Everything the site says lives in `lib/content.tsx`. Adding to an array
places the item on the grid and in the relevant index; no component work.

- **`PROFILE`** — name, role, focus, contact. `PROFILE.resume` is `null`:
  set it to a path or URL and the "Download CV" control appears on the
  profile panel. While it is null, nothing links to a file that is not
  there.
- **`UPSTREAM`** — contributions to projects I do not own. One entry per
  *distinct change*. A backport of an entry goes in that entry's
  `backport` field, so the same work is never counted twice. `state` is
  `merged` or `open`, and open work carries a `reviewNote` saying where
  review actually stands. `diff` holds the pull request's own numbers.
  Every field is checkable against the linked PR — keep it that way.
- **`PROJECTS`** — things I built, ordered by how much backend and systems
  engineering they evidence, not by recency. Each carries `built` (what is
  mine) and `decisions` (choices worth defending).
- **`POSTS`** — a post with an `href` lives on the blog and the writing
  index links straight out to it; a post with a `body` instead renders on
  this site, at its own coordinate on row 3. `featured: true` pulls it to
  the top. Every current post is an `href`, so row 3 holds only the index —
  `LOCAL_POSTS` is empty and `PostPanel` is unused until a post is given a
  `body`.
- **`SMALLER`** — published repositories and crates that do not warrant a
  full case study.

Numbers in prose come from the data (`count()`), so adding a contribution
updates the home page sentence too.

### Claims

Nothing on the site asserts a figure that cannot be checked from the linked
pull request, repository, or the live product. Diff stats, PR states, dates
and issue numbers come from the GitHub API. No performance numbers, usage
figures or endorsements. Keep new entries to the same rule.

## Interaction and accessibility decisions

- **The rail is always visible.** Fixed to the left edge on wide screens, a
  bar across the top below `56rem`. Nothing important depends on noticing
  the animation.
- **Every panel is server-rendered.** The static HTML contains all content
  and all external links, so the site is readable and its links work with
  JavaScript off.
- **Arrow keys are not bound to navigation.** They scroll, which is what
  everyone already expects. Each panel is its own scroll container and
  takes focus when the camera arrives, so Down, PageDown and Space act on
  it. From a cold load, "Skip to content" hands the keyboard that panel.
  *Do not* re-bind arrow keys to move the camera.
- **Escape climbs** to the parent section, and ignores the key while focus
  is in a text field.
- **Inactive panels get `inert` + `aria-hidden`**, set through a ref
  callback because React 18 has no `inert` prop. They stay rendered so
  pass-through panels sweep past during multi-cell moves.
- **Focus** moves to the destination panel on navigation but never on first
  paint — that would put focus past the rail and leave the site's own
  navigation reachable only by Shift+Tab. A polite live region announces
  the destination.
- **Reduced motion** cuts the camera instead of travelling it, and disables
  every other transition. All content stays reachable.
- **Contrast**: every text/background pair in the palette clears WCAG AA
  4.5:1, including text on the hover surface.

## Design system

One light theme, defined as custom properties at the top of
`app/globals.css`: `--paper` ground, `--ink` text in three weights,
`--line` hairlines, `--accent` copper. One second hue, `--moss`, used only
for "this landed" — the merged state marker and lines added in a diff stat.

Fonts via `next/font` (self-hosted at build time, no runtime requests):
Instrument Serif for display, Newsreader for prose, JetBrains Mono for data
— PR numbers, diff stats, repository paths, stack lists. Mono is for things
that are literally code or figures, not for decorating headings.

The document itself never scrolls (`html, body { overflow: hidden }`); each
panel scrolls internally. There is no smooth-scroll library, no CSS
framework, and no runtime service calls. All three were removed
deliberately — do not reintroduce them.

## Screenshots

`Shot` in `panels.tsx` renders a project's optional `shot` path inside a
minimal browser frame. Without one — or if the file 404s — it falls back to
a typographic cover. The fallback is checked both via `onError` and a
mount-time `naturalWidth` probe, because a missing image errors before
hydration. The Playwright suite asserts the real screenshots load, so a
silent fallback fails the build rather than shipping.

## Deployment

Cloudflare Pages, from this repository.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `out` |
| Framework preset | Next.js (Static HTML Export), or None |
| `NODE_VERSION` | `20` |

`adarshrust.com` and `www.adarshrust.com` are custom domains on the Pages
project. The subdomains (`blog.`, `notes.`, `ffs.`) are separate projects
with their own DNS records; this site only links to them.

## History

The 2026-07 rewrite replaced a Three.js gear scene — WebGL, Lenis smooth
scroll, a theme system and runtime feature flags — with the plane. The
2026-10 pass added the open-source ledger and the navigation rail, retired
the arrow-key camera controls, and removed two posts about this website in
favour of linking the writing that exists. Recover anything from git
history if it is ever wanted; do not restore it because old documentation
mentions it.
