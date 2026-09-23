# Homepage Swirl & Polish — Design

**Date:** 2026-09-23
**Status:** Approved in chat (design + asset downloads)
**App:** `violetop/` (Next.js 16.2, React 19.2, Tailwind 4, CSS modules)

## Goals

1. The homepage nav logo looks exactly like every other page: solid purple mark, white "Violet", purple-gradient "OP".
2. Inertial smooth scrolling across the site with Lenis.
3. Stash the colorway banner and replace it with a lightweight, swirling shader hero. Bonus: the swirl spins faster while the page scrolls.
4. Slightly round every component.
5. "What's Happening": each team's events show that team's full splash art, cards rise on hover, and the featured card lines up with the two stacked cards.

## Non-goals

- New homepage copy.
- Events page layout changes (it only inherits the new artwork, because both pages share `getEventArtwork`).
- Removing the unused `PrismCanvas.tsx` and legacy global CSS (separate cleanup).

## 1. Hero swap and header logo

### Why the logo looks dark today

`VopIntroBanner` renders `Header` with `homeAnimation` palettes. On the home header, `.brandBaseLogo`/`.brandOpBase` are faded to `--home-surface-opacity` (0 at the top of the page), and colorway accent layers draw the mark instead. The White/Black colorways produce the grey look. Every other page shows the base purple logo.

### Changes

- **`app/page.tsx`** renders `<Header overlay />` and `<SwirlHero />` in place of `<VopIntroBanner />`.
- **`VopIntroBanner.tsx` / `.module.css`** stay in the repo untouched and unmounted. Restoring the banner means swapping it back in `page.tsx`.
- **`Header`** separates its two homepage behaviours:
  - `overlay` (new): the transparent bar over `#hero-section` that fades to the normal surface as the hero scrolls away. This is the existing `--home-surface-opacity` logic.
  - `homeAnimation` (banner only): the colorway accent layers. It implies `overlay`.
  - The base logo and "OP" fade out only when `homeAnimation` is present. With `overlay` alone the logo is the standard solid one.
  - The overlay's legibility `text-shadow` is not applied to "OP": on gradient-clipped text with a transparent fill, a text shadow paints over the gradient and dulls it (part of the "slightly dark" logo).

### `SwirlHero` (new client component + CSS module)

- **Layout:** an inset panel with a 12px margin (8px at ≤760px), radius `--radius-xl`, and height `clamp(440px, 60vh, 640px)`. `id="hero-section"`, labelled section, and the screen-reader-only `<h1>Violet OP</h1>` is kept.
- **Content:** the solid VOP mark (`BrandLogo`) centred, about `clamp(112px, 13vw, 176px)`, with a soft purple glow.
- **Layers, bottom to top:**
  1. A static CSS gradient in the swirl colours. It covers server rendering, loading, and browsers without WebGL2.
  2. The Paper Shaders `Swirl` canvas, faded in once mounted.
  3. A vignette for mark and header legibility.
- **Library:** `@paper-design/shaders-react` pinned to `0.0.81` exactly (Apache-2.0, zero dependencies). The runtime:
  - pauses when off-screen or the tab is hidden;
  - stops its rAF loop at speed 0;
  - accumulates time, so speed changes are continuous;
  - exposes `element.paperShaderMount.setSpeed()`.
- **Swirl settings (starting point, tuned visually):**
  - `colorBack #09080d`, colours drawn from the brand purples (`#2a0b4d → #7100c7 → #a800f0 → #d9b8ff`).
  - Few, soft bands: `bandCount≈3`, `softness 1`, `twist≈0.3`, light noise.
  - Tuned result: the vortex's dark eye is centred behind the mark (offset 0, scale 1.25) with the arms swirling around it. The first, off-centre sweep left the purple mark low-contrast against the purple bands.
  - Base speed ≈0.18.
- **Performance:**
  - `minPixelRatio={1}` (the library default of 2 would supersample 1× screens) and `maxPixelCount≈1.6M`. The soft bands hide the upscaling.
  - Paper pauses the shader automatically when it's off-screen or the tab is hidden.
- **Scroll acceleration:**
  - A `useLenis` scroll callback maps `|lenis.velocity|` to a target speed: `base + min(|v| × k, boost)`, reaching about 6× base.
  - A small rAF loop runs only while easing: faster attack, roughly 1s release. It calls `setSpeed` on the mounted shader.
  - No React state updates per frame.
- **Reduced motion:** `prefers-reduced-motion: reduce` gives speed 0 (a static frame) and no acceleration. It reacts to preference changes.
- **No WebGL2:** detected up front, the shader is not mounted, and the CSS gradient remains. Paper would otherwise throw inside an async effect.

## 2. Lenis smooth scrolling

- **`app/components/SmoothScroll.tsx`** (client) renders `<ReactLenis root options={…} />` from `lenis/react`.
  - It has no children, so toggling it never remounts page content. `useLenis` falls back to the root store.
  - It is not rendered when the visitor prefers reduced motion.
- **Options:** `lerp≈0.1`, `smoothWheel: true`, `stopInertiaOnNavigate: true`, `anchors: false`. Native hash jumps keep the skip link's focus behaviour. Touch stays native (Lenis default).
- **`app/layout.tsx`** imports `lenis/dist/lenis.css` and renders `<SmoothScroll />`.
- **Nested scrollers** get `data-lenis-prevent`: the header mega menu and mobile nav, the only `overflow-y: auto` containers in use.
- **Delete** `app/hooks/useLenisScroll.ts` (unused, from the old scroll-container layout).

## 3. What's Happening cards

### Team artwork

`getEventArtwork` first matches `/\bvop\s+(white|purple|black|ruby|elder|baron)\b/i` in the event title and returns that team's splash. Otherwise it falls back to today's game/activity artwork.

| Team | Art | Source |
|---|---|---|
| VOP White | Vyse | Riot, VALORANT "Agent Mastery New Poses Wallpapers" kit, `V26_A5_AM_VYSE.jpg` |
| VOP Purple | Reyna | same kit, `V26_A5_AM_REYNA.jpg` |
| VOP Black | Omen | same kit, `Agent Mastery_16x9_Omen.png` |
| VOP Ruby | Clove | same kit, `V26_A5_AM_CLOVE.jpg` |
| VOP Elder | Elder Dragon | Riot, Legends of Runeterra Data Dragon, `08RU014-full.png` |
| VOP Baron | Baron Nashor | League of Legends Wiki, `Baron_Nashor_OriginalSkin.jpg` (chosen by the user) |

- **Files:** `public/images/events/{valorant-vyse, valorant-reyna, valorant-omen, valorant-clove, league-elder-dragon, league-baron-nashor}.webp`.
  - 1920px wide WebP.
  - The VALORANT crops keep x ≈ 2–83% of the frame. That drops the vertical "VALORANT" wordmark strip and re-centres the agent.
  - Per-image `objectPosition` keeps each character in frame in both tall and wide crops.
- **Provenance:** 6 entries appended to `public/images/events/sources.json`.

### Alignment

- The grid stretches (`align-items: stretch`).
- Featured and support cards are flex columns, and their `.eventVisual` keeps `aspect-ratio: 16/9` as its base size with `flex-grow: 1`. Whichever column is taller, the other column's images grow to match.
- Support cards share the height evenly.
- Mobile (≤760px) stays stacked at natural size.

### Hover

- Behind `@media (hover: hover)`: `translateY(-6px)`, a deeper shadow and a lavender border tint.
- `transform`/`box-shadow` transition of about 220ms.
- Reduced motion keeps the border/shadow change but drops the movement.

## 4. Rounded corners

- **Tokens:** defined once in `globals.css` as `@theme static` (`--radius-sm: 6px` for chips, crests and small controls; `--radius-md: 8px` for buttons, menu items and inputs; `--radius-lg: 12px` for cards, panels and media; `--radius-xl`/`--radius-2xl: 18px` for the hero and large feature panels). `static` makes Tailwind always emit them as `:root` variables, so CSS modules can use `var(--radius-*)` and the `rounded-*` utilities map to the same scale.
- **CSS modules:** applied across every module that has a bordered surface or media frame (Header, Home, GameOverview, AboutUs, TeamProfile). Footer and MemberPortrait need nothing: the footer has no framed components, and portraits are clipped by their rounded card. Rounded cards clip their media (`overflow: hidden`).
- **Tailwind pages** (Events, Join Us, Eboard, Highlights): the bare `rounded` class on cards and images becomes `rounded-lg`, and on inputs `rounded-md`. Square panels and buttons get `rounded-lg`/`rounded-md` respectively.
- **Unchanged:** circles and pills (`50%`, `rounded-full`), and full-width section bands (the closing CTA band, the mobile nav sheet, list rows separated only by rules).

## Risks

- **Paper Shaders is 0.0.x:** the version is pinned exactly, and only `Swirl`, `setSpeed` and sizing props are used.
- **WebGL2 missing, or context lost:** the CSS gradient fallback stays underneath.
- **Lenis vs. native behaviours:** anchors stay native, nested menus opt out, and it is disabled under reduced motion.
- **Artwork licensing:** Riot's media page states its kit files are free to use under Riot's "Legal Jibber Jabber"; the Baron image was supplied by the user. Provenance is recorded in `sources.json`.

## Verification

- `npm run lint` and `npm run build` are clean.
- **Browser (dev server `violetop-dev`)** at 1440px and 390px:
  - The hero renders and animates.
  - Scrolling speeds the swirl up; `paperShaderMount.getCurrentFrame()` deltas are sampled idle vs. scrolling.
  - It pauses off-screen.
  - The logo is identical to `/events`.
  - Lenis is active, with `html.lenis`.
  - The mega menu and mobile nav scroll natively.
  - Event cards align and rise on hover.
  - Rounded corners appear on every page.
  - No console errors.
