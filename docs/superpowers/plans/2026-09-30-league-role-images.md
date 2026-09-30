# League Role Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** League roster tiles show Riot's official position icons again, served as image files and tinted to each team's accent.

**Architecture:**
- The five SVG files in `violetop/public/images/lanes/` were restored verbatim from history by the controller.
- `LaneIcon` keeps its API but becomes a `<span>` that uses its role's file as a CSS mask filled with `currentColor`.

**Tech Stack:** Next.js 16.2 App Router, React 19.2, TypeScript, CSS modules; `node --test` for tests.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-30-league-role-images-design.md`.
- The icon files are `violetop/public/images/lanes/{top,jungle,middle,bottom,support}.svg`.
  - They already exist; the controller wrote them from history.
  - Do not edit or regenerate them.
- `LaneIcon({ className, role })` keeps its signature.
  - Its mask is `url("/images/lanes/${role.toLowerCase()}.svg")`, set inline as `maskImage` and `WebkitMaskImage`.
  - It is filled with `currentColor`.
- The icon is 28px: `.laneIcon` in `TeamProfile.module.css` goes from `24px` to `28px`, keeping `color: var(--team-accent)`.
- The `laneRole()` mapping, the tile size and background, and the Valorant and staff initials are unchanged.
- **Git:** stage by explicit path. Never stage `.DS_Store`, `.claude/` or `.superpowers/`. Never run `git restore`, `git checkout -- <file>`, `git reset`, `git stash` or `git clean`. Don't push; the controller does.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Paths are relative to the repo root `/Users/bezzchen/Documents/violet-op`. Run npm commands from `violetop/`, where `npm test` runs 27 tests today.

---

### Task 1: Draw League roles with the restored image files

**Files:**
- Commit (already on disk): `violetop/public/images/lanes/top.svg`, `jungle.svg`, `middle.svg`, `bottom.svg`, `support.svg`
- Modify: `violetop/app/data/laneRoles.test.ts` (one new test)
- Modify: `violetop/app/components/LaneIcon.tsx` (whole file)
- Create: `violetop/app/components/LaneIcon.module.css`
- Modify: `violetop/app/[teamSlug]/TeamProfile.module.css:46`

**Interfaces:**
- Consumes: `LaneRole` (`"Top" | "Jungle" | "Middle" | "Bottom" | "Support"`) from `violetop/app/data/laneRoles.ts`.
  - The one caller is in `violetop/app/[teamSlug]/page.tsx`: `<LaneIcon className={styles.laneIcon} role={lane} />`, which stays as is.
- Produces: the same default export `LaneIcon({ className?: string; role: LaneRole })`.

- [ ] **Step 1: The test.** Append to `violetop/app/data/laneRoles.test.ts`, and add `import { readFileSync } from "node:fs";` directly below the existing `import { test } from "node:test";` line:

```ts
test("every lane has its icon file", () => {
  for (const role of ["Top", "Jungle", "Middle", "Bottom", "Support"] as const) {
    const svg = readFileSync(new URL(`../../public/images/lanes/${role.toLowerCase()}.svg`, import.meta.url), "utf8");
    assert.match(svg, /viewBox="0 0 136 136"/, `${role} icon`);
  }
});
```

- [ ] **Step 2:** Run `npm test`. Expected: 28 passing. The icon files already exist, so the new test passes straight away; it guards against a missing or renamed file.

- [ ] **Step 3: The component.** Replace the whole of `violetop/app/components/LaneIcon.tsx` with:

```tsx
import type { LaneRole } from "../data/laneRoles";
import styles from "./LaneIcon.module.css";

/**
 * Riot's official League position icon for a lane (the files in public/images/lanes), drawn as a
 * mask so it takes the surrounding colour through currentColor and keeps its two-tone frame.
 */
export default function LaneIcon({ className, role }: { className?: string; role: LaneRole }) {
  const mask = `url("/images/lanes/${role.toLowerCase()}.svg")`;
  return (
    <span
      aria-hidden="true"
      className={className ? `${styles.icon} ${className}` : styles.icon}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}
```

- [ ] **Step 4: Its styles.** Create `violetop/app/components/LaneIcon.module.css`:

```css
/* The icon is its file's alpha filled with currentColor, so the team accent tints it and the 37.5% frame stays two-tone. */
.icon {
  display: inline-block;
  flex: none;
  background-color: currentColor;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
```

- [ ] **Step 5: The June size.** In `violetop/app/[teamSlug]/TeamProfile.module.css`, replace:

```css
.laneIcon { width: 24px; height: 24px; color: var(--team-accent); }
```

with:

```css
.laneIcon { width: 28px; height: 28px; color: var(--team-accent); }
```

- [ ] **Step 6: Checks.** From `violetop/`:
  - `npm test`: 28 passing.
  - `npm run lint`: clean.
  - `npm run build`: succeeds, with the route table's symbols unchanged (`○` pages, `●` `/[teamSlug]`, `ƒ` `/api/eboard-events`).
  - `grep -n "strokeWidth\|viewBox" app/components/LaneIcon.tsx`: no output, since the inline glyphs are gone.

- [ ] **Step 7: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/public/images/lanes/top.svg violetop/public/images/lanes/jungle.svg violetop/public/images/lanes/middle.svg violetop/public/images/lanes/bottom.svg violetop/public/images/lanes/support.svg violetop/app/data/laneRoles.test.ts violetop/app/components/LaneIcon.tsx violetop/app/components/LaneIcon.module.css "violetop/app/[teamSlug]/TeamProfile.module.css"
git -C /Users/bezzchen/Documents/violet-op commit -m "Show Riot's position icons for League roles again

Restores the official position icons supplied in June (inlined in f8d29bc,
removed in ccbd424) as image files in public/images/lanes, drawn as masks so
they take each team's accent. Replaces the hand-drawn glyphs brought back by
mistake in f9f6d59.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Verify in the browser (controller)

**Files:** none, unless a check fails.

- [ ] **Step 1:** On a production build (`next start`), at 1440×900 and 407×454, open `/league1`, `/league2` and `/vop-white` and run:

```js
(() => [...document.querySelectorAll("[class*='rosterGrid'] [class*='avatar']")].map((tile) => {
  const icon = tile.querySelector("span");
  if (!icon) return { text: tile.textContent.trim() };
  const style = getComputedStyle(icon);
  const box = icon.getBoundingClientRect();
  return { mask: style.maskImage || style.webkitMaskImage, size: `${Math.round(box.width)}x${Math.round(box.height)}`, color: style.backgroundColor };
}))()
```

Expected:
- **`/league1`:** 5 tiles, each with a `mask` of `…/images/lanes/<role>.svg` matching its role, `size: "28x28"` and `color: "rgb(128, 220, 209)"`.
- **`/league2`:** 6 tiles, the same checks, with `color: "rgb(188, 221, 117)"`. "Support / Substitute" uses `support.svg`.
- **`/vop-white`:** 7 `{ text }` entries holding initials.
- Every `/images/lanes/*.svg` request returns 200.
- No console errors and no horizontal overflow.
- Screenshot the `/league2` roster and compare it with the comparison image's bottom row: the two-tone frame must show.

---

## As built

- The branch base already had 35 tests (a teammate's commits added `eventGroups` and `mainEvents` tests), so the counts above read 36 after Task 1, not 28.
- After the final review, `LaneIcon.module.css` gained a `forced-colors` rule (the icon draws in `CanvasText`, since forced colours override `background-color` but not the mask), and the icon-file test also checks each file's `xmlns`, which an SVG loaded as an image needs.
