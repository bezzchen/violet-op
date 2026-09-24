# Hero Orb & Site-wide Swirl Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage V larger on a dark, semi-transparent orb, and run the swirl behind every page, dimmed everywhere except the homepage.

**Architecture:**
- **The orb:** a decorative `<span>` that uses a locally saved Riot PNG as a CSS mask, filled with the swirl's deep colour at 70%. It shares the hero's single grid cell with the V.
- **The swirl:** `SwirlBackground` moves from the homepage into the root layout, so one canvas lives for the whole visit. It adds a fixed dim layer driven by `usePathname()`.
- **The pages:** the two opaque page backgrounds become transparent so the swirl shows through.

**Tech Stack:** Next.js 16.2 App Router (Turbopack), React 19.2, TypeScript, CSS modules, WebGL1.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-24-hero-orb-sitewide-swirl-design.md`.
- This is not the Next.js you know: read the relevant guide in `violetop/node_modules/next/dist/docs/` before using an unfamiliar API. For `usePathname`: `01-app/03-api-reference/04-functions/use-pathname.md`.
- The V is `clamp(136px, 16vw, 216px)` wide, held once in `--hero-mark-width` on `.hero`. The orb is square at `calc(var(--hero-mark-width) * 1.42)`.
- The orb fill is `rgb(8 6 13 / 70%)`, and its mask is `url("/images/hero-orb.png") center / contain no-repeat`, in both `-webkit-mask` and `mask`. The slit stays open.
- The dim layer is `rgb(9 8 13 / 72%)`, fixed, `inset: 0`, `z-index: 0`, and `pointer-events: none`.
  - It is shown (`opacity: 1`) on every route except `/`, where it is `0`.
  - It fades over `400ms ease`, with no transition under `prefers-reduced-motion: reduce`.
- The swirl's look, pace, budget, reduced-motion still frame, fallback, hidden-tab stop and context-loss handling are unchanged.
- No layout, copy or card changes on any page. The header and footer are unchanged.
- Don't modify `app/components/VopIntroBanner.tsx` or `VopIntroBanner.module.css`.
- **Git:** stage by explicit path. Never stage `.DS_Store`, `.claude/` or `.superpowers/`. Never run `git restore`, `git checkout -- <file>`, `git reset`, `git stash` or `git clean`. Never push.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Paths are relative to the repo root `/Users/bezzchen/Documents/violet-op`. Run npm commands from `violetop/`.
- `npm test` runs 27 tests today, and none are added here: the changes are markup and CSS, verified in the browser.

---

### Task 1: A larger V on a semi-transparent orb

**Files:**
- Create: `violetop/public/images/hero-orb.png` (downloaded, user-approved)
- Modify: `violetop/app/Home.module.css:22-23`
- Modify: `violetop/app/page.tsx` (the hero `<section id="hero-section">`)

**Interfaces:**
- Consumes: the hero markup: `<section … className={styles.hero} id="hero-section">` holding the screen-reader `<h1>` and `<div aria-hidden="true" className={styles.heroMark}>` with `<BrandLogo className={styles.heroMarkImage} priority />`.
- Produces: the class `.heroOrb` and the custom property `--hero-mark-width`, which nothing else uses.

- [ ] **Step 1: Save the orb image.** The user approved this download in chat: 256×256 PNG, 4,931 bytes, from Riot's CMS.

```bash
curl -fsSL -o /Users/bezzchen/Documents/violet-op/violetop/public/images/hero-orb.png "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/9d295b17382acbc17bdb4e45e0be74d58e94e6c5-256x256.png"
file /Users/bezzchen/Documents/violet-op/violetop/public/images/hero-orb.png
wc -c < /Users/bezzchen/Documents/violet-op/violetop/public/images/hero-orb.png
```

Expected: `PNG image data, 256 x 256, 8-bit colormap, non-interlaced` and `4931`. It is an indexed PNG whose palette carries the transparency, and a CSS mask reads that alpha.

- [ ] **Step 2: Size and orb styles** in `violetop/app/Home.module.css`. Replace:

```css
.hero { position: relative; z-index: 1; display: grid; place-items: center; height: clamp(420px, 62vh, 680px); }
.heroMark { width: clamp(112px, 13vw, 176px); aspect-ratio: 896 / 802; filter: drop-shadow(0 0 30px #8024ff99) drop-shadow(0 12px 28px #000000b3); }
```

with:

```css
.hero { --hero-mark-width: clamp(136px, 16vw, 216px); position: relative; z-index: 1; display: grid; place-items: center; height: clamp(420px, 62vh, 680px); }
/* The V and its orb share the hero's one grid cell; the orb comes first, so it sits underneath. */
.heroOrb, .heroMark { grid-area: 1 / 1; }
/* Riot's orb as a mask, filled with the swirl's deep colour at 70%: dark enough that the V never blends into a ribbon, while the ribbons still show faintly through it and its open slit. */
.heroOrb { width: calc(var(--hero-mark-width) * 1.42); aspect-ratio: 1; background: rgb(8 6 13 / 70%); -webkit-mask: url("/images/hero-orb.png") center / contain no-repeat; mask: url("/images/hero-orb.png") center / contain no-repeat; }
.heroMark { width: var(--hero-mark-width); aspect-ratio: 896 / 802; filter: drop-shadow(0 0 30px #8024ff99) drop-shadow(0 12px 28px #000000b3); }
```

Leave `.heroMarkImage`, `.screenReaderOnly` and the `@media (max-width: 760px)` `.hero { height: … }` override as they are.

- [ ] **Step 3: The orb element** in `violetop/app/page.tsx`. Replace:

```tsx
        <h1 className={styles.screenReaderOnly} id="hero-title">Violet OP</h1>
        <div aria-hidden="true" className={styles.heroMark}>
```

with:

```tsx
        <h1 className={styles.screenReaderOnly} id="hero-title">Violet OP</h1>
        <span aria-hidden="true" className={styles.heroOrb} />
        <div aria-hidden="true" className={styles.heroMark}>
```

- [ ] **Step 4: Lint and build.** From `violetop/`, run `npm run lint && npm run build`.

Expected: clean lint, and a successful build with `/` still static (`○`).

- [ ] **Step 5: Verify in the browser (controller).** At 1440×900 on `/`, run:

```js
(() => {
  const orb = document.querySelector("#hero-section > span");
  const mark = document.querySelector("#hero-section > div");
  const style = getComputedStyle(orb);
  const o = orb.getBoundingClientRect();
  const m = mark.getBoundingClientRect();
  return {
    markWidth: Math.round(m.width),
    orb: `${Math.round(o.width)}x${Math.round(o.height)}`,
    centred: Math.abs(o.left + o.width / 2 - (m.left + m.width / 2)) < 1 && Math.abs(o.top + o.height / 2 - (m.top + m.height / 2)) < 1,
    mask: style.maskImage || style.webkitMaskImage,
    background: style.backgroundColor,
  };
})()
```

Expected:
- `markWidth: 216`, `orb: "307x307"` and `centred: true`.
- `mask` contains `hero-orb.png`, and `background` is `rgba(8, 6, 13, 0.7)`.
- At 407×454: `markWidth: 136` and `orb: "193x193"`.
- `/images/hero-orb.png` loads with status 200.
- Screenshot the hero while a ribbon passes behind the V.

- [ ] **Step 6: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/public/images/hero-orb.png violetop/app/Home.module.css violetop/app/page.tsx
git -C /Users/bezzchen/Documents/violet-op commit -m "Set the homepage V larger on a dark, see-through orb

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: The swirl behind every page, dimmed off the homepage

**Files:**
- Modify: `violetop/app/components/SwirlBackground.tsx`
- Modify: `violetop/app/components/SwirlBackground.module.css`
- Modify: `violetop/app/layout.tsx`
- Modify: `violetop/app/page.tsx`: remove the `SwirlBackground` import and element.
- Modify: `violetop/app/globals.css`: the `.page-scroll-container` rule.
- Modify: `violetop/app/components/GameOverview.module.css:1`: the `.main` rule.

**Interfaces:**
- Consumes: `SwirlBackground` as it stands, a client component returning one `<canvas>` with two effects: GPU setup keyed on `contextGeneration`, and the motion loop keyed on `prefersReducedMotion` and `contextGeneration`. Also `SmoothScroll` in the root layout (`<ReactLenis root />`). `useLenis()` already reads that root instance from anywhere.
- Produces: the class `.dim` in `SwirlBackground.module.css`, and the attribute `data-dimmed` on the element right after the canvas.

- [ ] **Step 1: The dim layer** in `violetop/app/components/SwirlBackground.tsx`.

  1. Add this import directly below `import { useLenis } from "lenis/react";`:

```tsx
import { usePathname } from "next/navigation";
```

  2. Replace:

```tsx
/** The homepage's animated backdrop: violetdiabolo's ribbons, drifting faster while the page scrolls. */
```

with:

```tsx
/** The site's animated backdrop: violetdiabolo's ribbons, drifting faster while the page scrolls and dimmed on every page but the homepage. */
```

  3. Replace:

```tsx
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
```

with:

```tsx
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  // Every page but the homepage dims the swirl, so it stays behind their content.
  const dimmed = usePathname() !== "/";
```

  4. Replace:

```tsx
  return <canvas aria-hidden="true" className={styles.canvas} ref={canvasRef} />;
```

with:

```tsx
  return (
    <>
      <canvas aria-hidden="true" className={styles.canvas} ref={canvasRef} />
      <div aria-hidden="true" className={styles.dim} data-dimmed={dimmed ? "" : undefined} />
    </>
  );
```

Change nothing else in the component.

- [ ] **Step 2: Dim layer styles** in `violetop/app/components/SwirlBackground.module.css`.

  1. Replace the first line:

```css
/* Fixed behind the homepage. Plain near-black until the first frame, so nothing flashes. */
```

with:

```css
/* Fixed behind every page. Plain near-black until the first frame, so nothing flashes. */
```

  2. Append at the end of the file:

```css

/* Other pages dim the swirl so it stays a backdrop; the homepage shows it at full strength. */
.dim {
  position: fixed;
  z-index: 0;
  inset: 0;
  background: rgb(9 8 13 / 72%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 400ms ease;
}

.dim[data-dimmed] {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .dim {
    transition: none;
  }
}
```

- [ ] **Step 3: Render it once for the whole site** in `violetop/app/layout.tsx`.

  1. Add this import directly below `import SmoothScroll from "./components/SmoothScroll";`:

```tsx
import SwirlBackground from "./components/SwirlBackground";
```

  2. Replace:

```tsx
        <SmoothScroll />
        {children}
```

with:

```tsx
        <SmoothScroll />
        <SwirlBackground />
        {children}
```

- [ ] **Step 4: Remove it from the homepage** in `violetop/app/page.tsx`. Delete the line `import SwirlBackground from "./components/SwirlBackground";` and the line `      <SwirlBackground />` directly above the colorway-banner comment. Keep the comment and `<Header overlay />`.

- [ ] **Step 5: See-through page backgrounds**

  1. In `violetop/app/globals.css`, replace:

```css
.page-scroll-container {
  min-height: 100vh;
  overflow: visible;
  background: var(--site-bg);
}
```

with:

```css
/* No background of its own: the site-wide swirl, dimmed on this page, shows through. */
.page-scroll-container {
  min-height: 100vh;
  overflow: visible;
}
```

  2. In `violetop/app/components/GameOverview.module.css`, replace line 1:

```css
.main { position: relative; z-index: 1; min-height: 100vh; padding: 72px 0 90px; background: var(--site-bg); color: var(--site-text); }
```

with:

```css
.main { position: relative; z-index: 1; min-height: 100vh; padding: 72px 0 90px; color: var(--site-text); }
```

- [ ] **Step 6: Checks.** From `violetop/`:
  - Run `npm test`. Expected: 27 passing.
  - Run `npm run lint`. Expected: clean.
  - Run `npm run build`. Expected: success, with the route table's rendering symbols unchanged from the build before this task (`/` and the other pages stay `○`, static).
  - Run `grep -n "SwirlBackground" app/page.tsx`. Expected: no output.

- [ ] **Step 7: Verify in the browser (controller).** At 1440×900 and 407×454, on `/` and on each of `/events`, `/join-us`, `/about-us`, `/highlights`, `/eboard`, `/teams/valorant`, `/teams/league-of-legends`, `/league1` and `/vop-white`, run:

```js
(() => {
  const canvases = document.querySelectorAll("canvas");
  const dim = canvases[0]?.nextElementSibling;
  const dimStyle = dim && getComputedStyle(dim);
  return {
    canvases: canvases.length,
    dimmed: dim?.hasAttribute("data-dimmed"),
    dimOpacity: dimStyle?.opacity,
    dimBackground: dimStyle?.backgroundColor,
    mainBackground: getComputedStyle(document.querySelector("main")).backgroundColor,
    overflow: document.documentElement.scrollWidth > innerWidth,
  };
})()
```

Expected:
- **Every page:** `canvases: 1`, `mainBackground: "rgba(0, 0, 0, 0)"` and `overflow: false`.
- **On `/`:** `dimmed: false` and `dimOpacity: "0"`.
- **Elsewhere:** `dimmed: true`, `dimOpacity: "1"` and `dimBackground: "rgba(9, 8, 13, 0.72)"`.
- **Console:** no errors.

Then, with `linkProgram` counted from the first script, and with `window.__canvas = document.querySelector("canvas")` recorded on `/`:
- Click the header's Events link, then its Home link.
- Expected: `document.querySelector("canvas") === window.__canvas`, one program link for the whole trip, and the swirl still advancing about 2 units/s.

Screenshot `/events` and a team page.

- [ ] **Step 8: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/components/SwirlBackground.tsx violetop/app/components/SwirlBackground.module.css violetop/app/layout.tsx violetop/app/page.tsx violetop/app/globals.css violetop/app/components/GameOverview.module.css
git -C /Users/bezzchen/Documents/violet-op commit -m "Run the swirl behind every page, dimmed off the homepage

The swirl now lives in the root layout, so one canvas lasts the whole visit
and keeps drifting between pages. Every page but the homepage lays a 72%
dark layer over it.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: End-to-end verification (controller)

**Files:** none, unless a check fails. In that case, fix the file it points at and commit with a descriptive message.

- [ ] **Step 1:** From `violetop/`, run `npm test && npm run lint && npm run build`. Expected: 27 passing, clean lint, and a successful build with routes static as before.
- [ ] **Step 2:** Main-thread health on `/` and `/join-us`, at both widths. Run in the page:

```js
(async () => {
  let longTasks = 0;
  const observer = new PerformanceObserver((list) => { longTasks += list.getEntries().length; });
  observer.observe({ type: "longtask", buffered: false });
  const times = [];
  await new Promise((resolve) => {
    const start = performance.now();
    const tick = (now) => { times.push(now); now - start < 3000 ? requestAnimationFrame(tick) : resolve(); };
    requestAnimationFrame(tick);
  });
  observer.disconnect();
  const gaps = times.slice(1).map((t, i) => t - times[i]);
  return { longTasks, avgFrameMs: +(gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1), worstFrameMs: Math.round(Math.max(...gaps)) };
})()
```

Expected: `longTasks: 0`, `avgFrameMs` near the refresh interval (about 16.7 at 60 Hz), and `worstFrameMs` < 50.
- [ ] **Step 3:** Reduced motion, emulated, on `/` and `/events`: one still frame and no loop. `/events` is still dimmed, with no fade on navigation.
- [ ] **Step 4:** Report to the user with screenshots of the homepage hero with the orb, `/events`, and a team page.
