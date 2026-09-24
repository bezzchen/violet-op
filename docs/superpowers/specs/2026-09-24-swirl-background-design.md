# Homepage Swirl Background, Section Cards & League Lane Icons — Design

**Date:** 2026-09-24
**Status:** Approved in chat
**App:** `violetop/` (Next.js 16.2, React 19.2, Tailwind 4, CSS modules)
**Builds on:** `2026-09-23-homepage-swirl-polish-design.md`

## Goals

1. The homepage swirl becomes the page background (homepage only): one fixed animated canvas behind everything.
2. The swirl itself is violetdiabolo's ribbon shader (the user's own site, `/Users/bezzchen/Documents/violetdiabolo`), ported nearly as-is but drifting a little slower.
3. Every homepage section becomes an inset, rounded card: solid near-black, dark glass, or violet-tinted glass, with swirl gaps between cards.
4. League team pages show each player's lane icon again (Top, Jungle, Middle, Bottom, Support).

## Non-goals

- Other pages keep their current backgrounds and layout.
- No new copy.
- Valorant rank emblems, which the same old commit added, stay out.

## 1. Swirl background

- **Engine:** port `src/gradient/shader.js`, `gradient.js`, `palette.js` and `src/render/budget.js` from violetdiabolo into TypeScript modules. That is Ashima's simplex noise plus two warp octaves plus three soft ribbons combined with `max()`, over a 3-stop palette: deep `#08060d`, mid `rgb(82,30,158)`, bright `rgb(128,36,255)`.
  - `app/utils/swirlGradient.ts`: the WebGL program.
  - `app/utils/swirlBudget.ts`: the frame cap and render size.
- **Context:** WebGL1, requested with `failIfMajorPerformanceCaveat` (software rendering gets the fallback), `powerPreference: "low-power"`, and no antialias, depth or stencil.
- **Budget:** 30 fps cap (accumulated time, so motion stays real-time) and half resolution (`max(1, dpr × 0.5)` framebuffer pixels per CSS pixel).
- **Pace:**
  - Resting drift is 2 shader-time units per second, a little calmer than violetdiabolo's 3.
  - The scroll boost multiplies the drift up to 4× (base 2 + boost 6).
  - The boost reuses `swirlSpeed.ts`: Lenis velocity is normalised to px per ms. Full boost is at 3.6 px/ms, which is violetdiabolo's 60 px/frame at 60 Hz. The attack is quick and the settle takes about a second.
- **Loop:**
  - One rAF loop reads `lenis.velocity` live, eases the speed, and draws only when the frame cap releases.
  - It is cancelled while the tab is hidden.
  - A resize refits the framebuffer and repaints at once.
- **Reduced motion:** one still frame, repainted on resize, and no loop.
- **No WebGL:** the canvas gets violetdiabolo's still ribbon, `linear-gradient(126deg, #08060d 0%, #08060d 34%, #291e52 46%, #8024fe 52%, #291e52 58%, #08060d 72%, #08060d 100%)`. Before the first frame it is plain `#08060d`, so there is no flash.
- **Component:** `app/components/SwirlBackground.tsx` (client) renders one `<canvas aria-hidden>`, `position: fixed; inset: 0; z-index: 0`, from the homepage only.
- **Removed:** `SwirlHero.tsx` / `.module.css` and the Paper Shaders packages (`@paper-design/shaders-react`, `@paper-design/shaders`). `SWIRL_SPEED_EPSILON` is dropped because the loop no longer settles and stops.

## 2. Top of the homepage

- There is no hero card. A transparent `#hero-section` (`clamp(420px, 62vh, 680px)` tall, `clamp(340px, 54vh, 520px)` at ≤760px) shows the swirl with the solid VOP mark centred.
- The mark has a soft violet glow, and the screen-reader-only `<h1>Violet OP</h1>` is kept.
- `<Header overlay />` is unchanged: transparent over the hero, solid once the hero scrolls away.
- The stashed `VopIntroBanner` stays untouched.

## 3. Section cards

- **Base:** `main` becomes transparent. Each section card is:
  - `width: min(100% - 2 × gutter, 1440px)`, with gutter `clamp(12px, 3vw, 40px)`;
  - centred, with `margin-bottom` gap `clamp(24px, 6vh, 64px)`;
  - padded `clamp(40px, 5vw, 72px) clamp(24px, 4.5vw, 64px)` (`36px 20px` at ≤760px);
  - `border: 1px solid #ffffff12` and `border-radius: var(--radius-xl)`.
- **Materials:**
  - Solid: `#0d0a14`.
  - Dark glass: `rgb(11 8 18 / 80%)`.
  - Violet glass: `rgb(37 21 56 / 76%)`.
  - Both glasses add `backdrop-filter: blur(22px) saturate(1.15)`. These are violetdiabolo's values, validated against the gradient's brightest pixel.
- **Mapping:**

  | Section | Material |
  |---|---|
  | What's Happening | dark glass |
  | Two Games. One Community. | solid |
  | More Than One Way In. | violet glass |
  | The Players Make the Moments. | solid |
  | A Few Common Questions. | dark glass |
  | Closing call to action | solid |

- **Removed:** the divider rules between sections (the `border-top`s) and the closing band's full-bleed padding and background. Rules inside lists (paths, FAQ) stay.
- **Footer:** unchanged.

## 4. League lane icons

- `app/data/laneRoles.ts`: `laneRole(role)` maps a roster role to `"Top" | "Jungle" | "Middle" | "Bottom" | "Support"` or `null`.
  - It uses the part before any `/`, so "Support / sub" maps to Support.
  - It accepts common short names (`mid`, `bot`, `adc`, `jg`, `supp`) in any case.
- `app/components/LaneIcon.tsx` holds the inline SVG glyphs from commit `99190fd`:
  - Top: up arrow.
  - Jungle: triangle and stem.
  - Middle: diamond.
  - Bottom: down arrow.
  - Support: shield.
  - All use `currentColor` at `strokeWidth` 1.75.
- On League team pages (`team.game === "league"`), each roster tile shows the lane icon, 24px in `var(--team-accent)`, instead of initials. Valorant rosters and staff tiles keep initials.

## Verification

- `npm test`: existing 13 tests, plus `laneRoles` and `swirlBudget` tests.
- `npm run lint` and `npm run build` are clean, and `/` stays static.
- **Browser:**
  - The canvas framebuffer is half resolution.
  - Sampling `u_time` through the page's own WebGL context shows about 2 units/s idle, up to about 8 while scrolling, and about 30 distinct values per second.
  - No long tasks, and no console errors.
  - Cards render at 1440 and 407 wide with no horizontal overflow, and the glass is legible.
  - `/league1` and `/league2` show lane icons; Valorant team pages still show initials.
