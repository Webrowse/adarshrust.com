# AGENTS.md — adarshrust.com

Architecture notes for AI assistants working on this codebase.

## Theme system

Themes are config objects in `lib/themes.ts`. The active theme ID lives in `lib/theme-store.ts` (Zustand) with localStorage persistence under `arust-theme`. `components/ThemeProvider.tsx` writes each Theme field as a CSS custom property on `document.documentElement` whenever the active theme changes, and sets `data-theme="<id>"` on `<html>`.

Three.js components (Scene, Gear, Sparks, Embers) read directly from `useThemeStore` inside their components so they re-render on theme change.

To add a theme: add an entry to `THEMES` in `lib/themes.ts`. Field names map to CSS vars: `gearBase` → `--gear-base`, `bgSide` → `--bg-side`, nested `lightIntensity.ambient` → `--light-intensity-ambient`.

### Default: Workshop
Bright sunlit warm. Cream center on stone-gray sides. Sunlit gold gears. Sky blue and peach accents. No embers (showEmbers: false).

### Adding a new theme

1. Add a config entry to `THEMES` in `lib/themes.ts` matching the `Theme` interface exactly.
2. The picker UI auto-discovers themes via `Object.values(THEMES)` — no UI work needed for color-only themes.
3. For themes that need unique geometry, fonts, or patterns (Sunflower, Cel, etc.), additional component work is required — those are stage-by-stage builds, not config-only.

### Verdigris
Cool coastal patina. Slate navy side bg, bone center, polished copper gears with implicit patina via theme tint. Sage and dusty rose accents. No embers, no halftone.

### Sunflower
Bright, chunky, kids-show register (Cocomelon direction). White center, soft cream sides, deep navy text. SVG sunflowers replace 3D gears. Five-color rotation on portal cards (yellow, sky blue, green, red, pink) via nth-child — controlled by `--card-c1` through `--card-c5` CSS vars in the Sunflower block of globals.css. Fonts: Bagel Fat One (`--font-bagel`) for hero/headlines, Fredoka (`--font-fredoka`) for body. Cards have flat 4px drop-shadow that lifts on hover. No wobble filter (removed — it made text fuzzy).

Theme-style architecture: `theme.gearStyle === 'svg-sunflower'` triggers the SVG overlay component and hides 3D gear components in `Scene.tsx`. To add more non-3D themes (Cel, etc.) follow the same pattern: gate Three.js components on `gearStyle === '3d'`, mount a new DOM overlay component at the page level that renders null when its theme isn't active.

`components/ThemeFilters.tsx` holds SVG filter defs (wobble-soft, wobble-medium). Mount once in page.tsx. Filters are referenced by `url(#wobble-soft)` from CSS or SVG anywhere on the page.

### Ghibli
Pastoral meadow, Studio Ghibli-inspired. Sky blue (`#a8d8e8`) side columns, warm cream center, deep forest green text. SVG windmills replace 3D gears — 4 windmills (2 per side) at `bottom: 0`, blades scroll-driven (`r1 = progress × 360 × 1.6`, `r2 = progress × 360 × 2.4`), opposite spin per side. Three-layer rolling hills SVG fixed to viewport bottom (z-3, in front of windmill bases at z-1, creating depth). Drifting clouds (4 instances, CSS-only, 60–90s periods with negative delays for mid-flight start). Six dandelion fluff particles with `ghibli-drift` / `ghibli-drift-r` keyframes for L/R variation. Fonts: DM Serif Display (`--font-dm-serif`) for hero/headlines, Quicksand (`--font-quicksand`) for body. Cards: 4-color pastel rotation (yellow, sky, sage, rose) via `--card-c1`–`--card-c4` and `nth-child(4n+k)`.

`gearStyle: 'svg-ghibli'` gates the overlay component. `Hills` renders at z-3 intentionally — in front of windmill towers (z-1) so only blade tips emerge above the horizon. Both behind main content rail (z-10).

## Critical architecture decisions

### Gear pivot stripping (Gear.tsx)

The GLB files exported from Blender carry residual transform data on their root nodes (translation + rotation baked into the scene graph). If you don't strip these, `rotation.z` on the outer group causes the mesh to ORBIT around an offset pivot instead of spinning on its own axis — the "gears flying everywhere" bug.

Fix: `clone.traverse()` zeroes every node's position, quaternion, and scale before applying material. Mesh vertices are already centered on origin in the GLB, so this is safe.

The inner `<group rotation={[Math.PI / 2, 0, 0]}>` reorients the gear face from glTF's XZ-plane to the XY-plane so it faces the +Z camera. The OUTER group's `rotation.z` then spins it cleanly around the axle.

**Do not remove or reorder these two groups.**

### Native scroll architecture

The page uses **Lenis** for smooth scrolling but the underlying scroll events are native browser scroll — not a fake/hijacked scroll container. R3F's canvas is `position: fixed; inset: 0; z-index: 0` so it renders behind the HTML content, which scrolls normally on top.

`LenisProvider.tsx` feeds scroll position, velocity, and `activity` (smoothed velocity magnitude) into a Zustand store (`lib/scroll-store.ts`). The gear `useFrame` callbacks read from this store.

**Do not replace this with scroll hijacking or a scroll container.**

### Gear chain math

Column geometry (both left and right sides mirror these):

```
yLarge  =  1.4
yMedium = -0.65   (yLarge - 2.05,  Large R=1.30, Medium R=0.75, gap = 2.05)
ySmall  = -1.85   (yMedium - 1.20, Medium R=0.75, Small  R=0.45, gap = 1.20)
```

Speed ratios (rim velocity must match at contact):
```
ω_Large  = ±1.000
ω_Medium = ∓1.733   (= ±1.000 × 1.30/0.75)
ω_Small  = ±2.889   (= ∓1.733 × −0.75/0.45)
```

Right column negates all signs so both columns sweep symmetrically outward. The `phase={0.157}` on the medium gear is a half-tooth-pitch offset for visual interlock.

**Do not change these numbers.**

### Spark emit points

`Sparks.tsx` uses the same `viewport.width * 0.15` inset formula as `GearColumns.tsx`. Both must stay in sync so sparks appear at the actual gear meshing points (between Large/Medium and Medium/Small).

## Stack

- Next.js 14 (App Router, static export)
- React Three Fiber + drei + postprocessing
- Lenis smooth scroll
- Tailwind CSS (UI overlay only)
- Zustand (scroll store + theme store)
- Geist Sans / Orbitron / JetBrains Mono
