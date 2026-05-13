# adarshrust.com — root site

Cinematic dark-forge landing page that surfaces the 9 subdomain portals.
The scroll wheel rotates the 3D iron gears on either side; spark particles
emit at the meshing points when scroll is active.

## Stack

- Next.js 14 (App Router) + TypeScript
- React Three Fiber + drei + postprocessing
- Lenis (smooth scroll)
- Tailwind CSS (UI overlay only — the canvas is pure R3F)
- Zustand (shared scroll-velocity store)
- Geist Sans / Orbitron / JetBrains Mono (via `next/font`)

## Run

```
npm install
npm run dev
```

Open <http://localhost:3000>.

## Project layout

```
app/
  layout.tsx        — fonts, Lenis provider
  page.tsx          — full-page composition
  globals.css       — forge palette, hero-title metal gradient, portal-card styles
components/
  Scene.tsx         — main R3F <Canvas>: gears, lights, particles, post-fx
  Gear.tsx          — single gear, loads shared .glb + applies baked PBR textures
  Sparks.tsx        — GPU-instanced sparks at meshing points (scroll-driven)
  Embers.tsx        — slow ambient drifting embers (always on)
  PostFX.tsx        — Bloom / Vignette / Noise / ChromaticAberration
  LenisProvider.tsx — sets up Lenis, writes scroll/velocity/activity to store
  ui/               — NavBar, HeroText, PortalGrid, StatusBar
lib/
  portals.ts        — 9-subdomain portal data
  scroll-store.ts   — Zustand store
public/
  models/           — gear_large.glb, gear_medium.glb, gear_small.glb
  textures/         — gear_basecolor.png, gear_normal.png, gear_roughness.png, gear_metallic.png
```

## Tuning knobs

- **Scroll → rotation gain**: `Gear.tsx`, the `8` in `Math.PI * 8 * speed`. Lower = lazier, higher = spins more per scroll.
- **Scroll inertia**: `Gear.tsx`, the `0.07` lerp factor. Lower = heavier feel.
- **Spark emit rate**: `Sparks.tsx`, the `80` in `1 + activity * 80`. Higher = more sparks at peak scroll.
- **Bloom intensity**: `PostFX.tsx` `<Bloom intensity={0.9}>`. Crank to 1.4 for more "hot" look.
- **Forge palette**: `tailwind.config.ts` `forge.*` colors.

## Portal subdomains

Defined in `lib/portals.ts`. Edit there to change titles, descriptions, or icons. Icons come from `lucide-react`.

## Asset pipeline

The gear `.glb` files and PBR `.png` textures were baked from Blender (see the
separate `phase1_gear_v2.py` / `phase2a_bake.py` scripts). To regenerate:

1. Install Blender 4.x
2. Run `blender --background --python phase1_gear_v2.py`
3. Run `blender --background --python phase2a_bake.py`
4. Run `blender --background --python phase2b_export.py`
5. Copy the new files into `public/models/` and `public/textures/`

## Performance notes

- Each gear glb is ~1.4MB (geometry only, no embedded textures)
- 4 PBR textures total ~5.5MB (the 2K normal map dominates at 3.8MB)
- For production, run the textures through a KTX2/Basis Universal encoder
  (e.g. `gltfpack -tc`) to shrink them ~5x with minimal quality loss
- Six gears share one material and one set of textures — no duplication
- Target: 60fps on M1 MacBook Air. If you see hitches, drop the gear count or
  reduce Bloom mipmap levels.

## Deploy to Cloudflare Pages

The site is configured for **static export** (`output: 'export'` in `next.config.mjs`).
`npm run build` produces a fully static `/out` directory that any CDN can serve.

### Build settings (paste these into the CF Pages dashboard)

| Setting | Value |
|---|---|
| Framework preset | `Next.js (Static HTML Export)` (or `None`) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(leave empty)* |
| Node version env var | `NODE_VERSION` = `20` |

### Step-by-step

1. **Push to GitHub** (any name — e.g. `adarshrust-root`).
2. **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. **Build config**: use the table above.
4. **Add environment variable**: `NODE_VERSION` = `20` (CF Pages defaults to Node 18 which can hit edge cases with Next 14).
5. Click **Save and Deploy**. First build takes ~3 min.
6. Once deployed, you'll get a `*.pages.dev` preview URL — verify the gears render and scroll works.

### Custom domain (adarshrust.com)

Since your domain is already on Cloudflare:

1. **Pages project → Custom domains → Set up a custom domain**
2. Add `adarshrust.com` — CF auto-creates the CNAME record.
3. Add `www.adarshrust.com` — same.
4. Wait ~30 seconds for cert provision. Done.

### Subdomain portals

The 9 portal links (`portfolio.adarshrust.com`, etc.) won't resolve until you point
them somewhere. Each subdomain needs its own DNS record in the Cloudflare DNS panel.

For now, the easiest pattern:

- Create a placeholder Pages project for each subdomain that just shows
  "Coming soon — go back to adarshrust.com", OR
- Add a CNAME from each subdomain to your root Pages project — every link
  will land on the same site until you replace it.

Edit `lib/portals.ts` to add/remove portals or update URLs.

### CLI alternative (if you want it later)

```
npm i -D wrangler
npx wrangler pages deploy out --project-name=adarshrust-root
```
