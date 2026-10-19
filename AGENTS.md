# AGENTS.md — adarshrust.com

Engineering constraints for anyone, human or automated, changing this
codebase. The README explains how the site works; this file is the list of
things not to undo.

## 1. The site is one plane. Keep it that way.

Every page is a panel at a coordinate on a single surface. Navigation moves
the camera. `components/plane/Plane.tsx` owns the grid, the URL hash, the
history integration, focus and the keyboard.

Column 0 is the spine — the five navigation destinations, in rail order.
Detail panels run to the right of the section they belong to.

**Do not** convert this to per-page routes, and **do not** replace the
single plane transition with per-panel enter/exit animations. The point is
one continuous surface.

## 2. Usability outranks the concept

The plane is the presentation, not the mechanism. Three things have to stay
true, and the Playwright suite enforces all three:

- The navigation rail is visible on every panel and every screen size. No
  destination may depend on discovering a gesture or an animation.
- Every destination has a real URL that works when pasted, and back and
  forward replay the moves.
- With JavaScript off, the static HTML still carries all content and all
  external links. Panels are server-rendered; keep them that way.

## 3. Keyboard rules

- **Arrow keys scroll. They do not navigate.** Each panel is its own scroll
  container and takes focus on arrival so Down/PageDown/Space work. An
  earlier version bound arrows to camera moves; that made long panels
  unscrollable from the keyboard. Do not bring it back.
- Escape climbs to the parent, and is ignored while focus is in an input,
  textarea, select or contenteditable. Any new global shortcut needs the
  same guard.
- Focus moves to the destination panel on navigation, never on first paint.
  Focusing on load puts focus past the rail and leaves the site's own
  navigation reachable only by Shift+Tab.
- "Skip to content" hands focus to the active panel. It is the keyboard
  route to scrolling from a cold load — not decoration.

## 4. Content is data, and every claim is checkable

All content lives in `lib/content.tsx`. Adding to an array places the item
on the grid and in the relevant index. No component work, no new route.

The rule for `UPSTREAM` especially:

- One entry per **distinct change**. A backport belongs in its parent
  entry's `backport` field. Never list a backport as separate work, and
  never let a count treat it as one.
- `state` must match the pull request right now. Open work carries a
  `reviewNote` stating where review actually stands, including objections.
- `diff` holds the pull request's own numbers.
- Describe the contribution, not the host project's capabilities. The
  reader must be able to tell which is which.
- No performance figures, adoption numbers, test results, endorsements or
  other impact metrics unless they are published and linked.

Before changing any entry, read the pull request.

`POSTS` follows the same principle: list a piece only if it exists and the
link resolves. Prefer an `href` to the blog over writing filler on the site
— two posts about this website itself were removed in 2026-10 for exactly
that reason. Removing a post also means checking nothing still links to it;
`npm test` has a guard that walks every in-site link and fails on one that
has no panel.

## 5. Design system

One light theme, custom properties at the top of `app/globals.css`:
`--paper`, `--ink` / `--ink-soft` / `--ink-faint`, `--line`, `--accent`
copper. `--moss` is the only second hue and means exactly one thing:
"this landed" — the merged marker and lines added. Do not spend it
elsewhere.

Fonts via `next/font`, self-hosted at build time: Instrument Serif
(display), Newsreader (prose), JetBrains Mono (data — PR numbers, diff
stats, repository paths, stack lists). Mono is for things that are code or
figures. It is not a styling device for headings, and labels are sentence
case, not tracked-out capitals.

Every text/background pair must clear WCAG AA 4.5:1, including on the
`--paper-deep` hover surface. `--ink-faint` was darkened once already for
exactly this; check before lightening it.

The document never scrolls. There is no CSS framework, no smooth-scroll
library, and no runtime service calls. All were removed deliberately. Do
not reintroduce them, and do not add a dependency that brings one back.

## 6. Checks

```bash
npm run check    # lint, tsc --noEmit, production build
npm test         # Playwright, desktop + mobile
```

Both must pass. Do not disable a rule or weaken an assertion to make them
pass. The suite covers navigation, history, deep links, Escape, arrow-key
scrolling, focus order, `inert`, reduced motion, horizontal overflow, link
accessible names, and that project screenshots actually load.

## 7. Repository hygiene

- No coding-tool or vendor branding in source, comments, UI, metadata,
  documentation or commit messages. No AI-generated notices, agent
  signatures, session URLs, or `Co-Authored-By` trailers naming a tool.
- Local tool configuration stays out of the repository; `.gitignore` covers
  it.
- Do not create commits, tags, releases or pull requests unless asked, and
  do not rewrite published history.
- Never commit secrets, credentials, environment files or private data.
- The site's contact address is `hello@adarshrust.com`. Do not publish a
  personal address anywhere in the UI or metadata.

## 8. Stack

- Next.js 14 (App Router), static export to `out/`, Cloudflare Pages
- React 18. No other runtime dependencies — keep it that way
- Hand-written CSS; TypeScript strict; Playwright for tests (dev only)
