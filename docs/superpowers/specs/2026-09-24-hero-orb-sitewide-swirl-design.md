# Hero Orb & Site-wide Swirl — Design

**Date:** 2026-09-24
**Status:** Choices made in chat; awaiting spec review
**App:** `violetop/` (Next.js 16.2, React 19.2, Tailwind 4, CSS modules)
**Builds on:** `2026-09-24-swirl-background-design.md`

## Goals

1. The homepage V is a little larger and sits on a dark, semi-transparent orb, so it never blends into a bright ribbon passing behind it.
2. The swirl runs behind every page. Every page except the homepage dims it under a 72% dark layer.

## Non-goals

- No layout, copy or card changes on any page.
- The swirl's look, pace and frame budget (30 fps, half resolution) are unchanged.
- The header and footer are unchanged.

## 1. Hero mark and orb

- **Size:** the V (`.heroMark`) grows from `clamp(112px, 13vw, 176px)` to `clamp(136px, 16vw, 216px)`, about 23% larger. Its aspect ratio and violet glow are unchanged.
  - The width lives in one custom property on `.hero`, `--hero-mark-width`, shared by the V and the orb.
- **Asset:** `violetop/public/images/hero-orb.png`. It is Riot's `9d295b17382acbc17bdb4e45e0be74d58e94e6c5-256x256.png` from `cmsassets.rgpub.io` (256×256 PNG, 4.9 KB): a white orb with an almond slit and flame wisps on a transparent background.
  - It is saved locally because the CDN sends no CORS headers, so it can't be a cross-origin CSS mask. The download is approved in chat.
- **Dark version:** the PNG is used as a CSS mask, not shown as an image.
  - The markup is a decorative `<span aria-hidden="true" className={styles.heroOrb} />` in the hero, before the V.
  - The mask is `mask: url("/images/hero-orb.png") center / contain no-repeat`, plus the `-webkit-mask` form.
  - The span's background is `rgb(8 6 13 / 70%)`, the swirl's deep colour at 70%.
  - The orb is semi-transparent: ribbons show through it dimly, and through the open slit at full strength.
  - At 70% the V still reads clearly over the brightest ribbon; at 55% the ribbon competes with the bottom of the V. Both were checked in a prototype.
- **Slit:** left open, exactly the image's shape.
- **Placement:** the orb and the V share the hero's single grid cell (`grid-area: 1 / 1`), with the orb underneath.
  - The orb is square, `calc(var(--hero-mark-width) * 1.42)` wide.
  - The V keeps its `drop-shadow` glow; the orb has none.
- The orb is static, so reduced motion and the no-WebGL fallback don't affect it.

## 2. Site-wide swirl

- **One canvas for the whole visit:**
  - `<SwirlBackground />` moves from `app/page.tsx` to `app/layout.tsx`, rendered once in `<body>` after `<SmoothScroll />`.
  - It stays mounted across client navigations. The ribbons keep drifting from page to page, and the WebGL program is built once per visit.
- **Dim layer:** `SwirlBackground` also renders `<div aria-hidden="true" className={styles.dim} data-dimmed={dimmed ? "" : undefined} />` right after the canvas, styled in `SwirlBackground.module.css`.
  - `dimmed` is `usePathname() !== "/"` (from `next/navigation`), so every route except the homepage is dimmed. That covers the 404 page and future pages.
  - `.dim` is fixed, `inset: 0`, `z-index: 0` (painted over the canvas by DOM order), `pointer-events: none`, with `background: rgb(9 8 13 / 72%)` (`--site-bg` at 72%).
  - It fades between `opacity: 0` and `1` with a `400ms` transition, which is removed under `prefers-reduced-motion: reduce`.
  - The server render already knows the route, so a dimmed page never flashes bright.
- **See-through pages:** drop `background: var(--site-bg)` from:
  - `.page-scroll-container` in `app/globals.css`, the `<main>` of `PageShell`, used by About, Events, Join Us, Highlights, E-Board and the team pages;
  - `.main` in `app/components/GameOverview.module.css`, used by `/teams/valorant` and `/teams/league-of-legends`.

  `html` and `body` keep `--site-bg` underneath the canvas.
- **Stacking, bottom to top:**
  1. The body's `flow-pattern` `::before` layer, already hidden today and left alone.
  2. The canvas (fixed, z 0).
  3. The dim layer (fixed, z 0, later in the DOM).
  4. Page content.
  5. The header.
- **Unchanged:**
  - The scroll boost, now on every page.
  - The reduced-motion still frame and the no-WebGL fallback gradient, both still dimmed on other pages.
  - Hidden-tab stop, context-loss recovery, and releasing the context when the canvas is removed.

## Verification

- `npm test`, `npm run lint` and `npm run build` are clean, and every route stays static.
- **Browser, at 1440 and 407 wide:**
  - **Homepage `/`:**
    - At 1440, the V is 216px wide and the orb 307px.
    - The orb computes a `mask-image` of `hero-orb.png` and a background of `rgba(8, 6, 13, 0.7)`.
    - The dim layer has opacity 0.
    - Take a screenshot while a ribbon passes behind the V.
  - **Every other page** (`/events`, `/join-us`, `/about-us`, `/highlights`, `/eboard`, `/teams/valorant`, `/teams/league-of-legends`, `/league1`, `/vop-white`):
    - There is exactly one `canvas`.
    - The dim layer has opacity 1 over `rgba(9, 8, 13, 0.72)`.
    - The page's `main` is transparent.
    - There is no horizontal overflow and no console errors.
    - Take screenshots.
  - **Client navigation** `/` → `/events` → `/`: the same canvas element stays, one program link covers the whole trip, and the dim layer fades in and out.
  - **Main-thread health** on `/join-us` (images) and `/` (glass cards): 0 long tasks over 3 s, and an average frame near the refresh interval.
