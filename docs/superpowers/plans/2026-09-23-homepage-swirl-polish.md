# Homepage Swirl & Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship five approved homepage changes:
- Team splash art on event cards.
- Rounded corners everywhere.
- Aligned, hover-lifting event cards.
- Lenis inertial scrolling.
- A scroll-reactive Paper Shaders swirl hero that replaces the stashed colorway banner and restores the solid nav logo.

**Architecture:**
- **Next.js 16 App Router site in `violetop/`.** The homepage stays a server component. It renders two client components: `Header` in a new `overlay` mode and a new `SwirlHero`.
- **Lenis:** one root instance, mounted from the root layout through `lenis/react`. `SwirlHero` reads its scroll velocity with `useLenis` and eases the shader's speed through the shader's own `setSpeed`, with no React re-renders.
- **Artwork:** data lives in `app/data/eventArtwork.ts`. Pure logic (team matching, speed easing) is unit-tested with Node's built-in test runner.

**Tech Stack:** Next.js 16.2.6 (Turbopack), React 19.2.4, TypeScript 5, Tailwind CSS 4.3 + CSS modules, `lenis` 1.3.23 (already installed), `@paper-design/shaders-react` 0.0.81, `sharp` 0.34 (already in `node_modules`, for image conversion), Node 22.14 (`node --test` with `--experimental-strip-types`).

**Spec:** `docs/superpowers/specs/2026-09-23-homepage-swirl-polish-design.md`

## Global Constraints

- **Working directory:** run all npm/node commands from `violetop/`. Paths below are relative to the repo root `/Users/bezzchen/Documents/violet-op` unless they start with `app/` or `public/`, which are inside `violetop/`.
- **Next.js docs:** `violetop/AGENTS.md` says this Next.js version differs from training data. Read the relevant guide in `violetop/node_modules/next/dist/docs/` before using any Next API not already used in this repo.
- **Pin Paper Shaders exactly:** `@paper-design/shaders-react@0.0.81` and `@paper-design/shaders@0.0.81` (0.0.x ships breaking changes).
- **Radius scale (exact values):** `--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-xl: 18px`, `--radius-2xl: 18px`.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no Lenis, a static swirl frame (speed 0, no acceleration), and no hover lift.
- **Swirl budget:** `minPixelRatio={1}` and `maxPixelCount={1_600_000}`.
- **Leave alone:** do not modify `app/components/VopIntroBanner.tsx` or `VopIntroBanner.module.css` (the stashed banner).
- **Git hygiene:** never stage `.DS_Store` files or the `.claude/` directory. Stage files by explicit path.
- **Comments:** match the surrounding code's comment density. Short, explanatory comments only.
- **Commits:** every commit message ends with the trailer line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Branch:** work on branch `homepage-swirl-polish`, created from `main` before Task 1:

  ```bash
  git -C /Users/bezzchen/Documents/violet-op switch -c homepage-swirl-polish
  ```

## File Map

| File | Change | Responsibility |
|---|---|---|
| `violetop/package.json` | Modify | `test` script; Paper Shaders deps (Task 7) |
| `violetop/tsconfig.json` | Modify | `allowImportingTsExtensions` so tests can import `./x.ts` |
| `violetop/app/data/eventArtwork.ts` | Modify | Team → splash art mapping ahead of game/activity fallback |
| `violetop/app/data/eventArtwork.test.ts` | Create | Team matching tests |
| `violetop/public/images/events/*.webp` (6) | Create | Team splash art |
| `violetop/public/images/events/sources.json` | Modify | Provenance for the 6 new images |
| `violetop/app/globals.css` | Modify | Radius tokens (`@theme static`) |
| `violetop/app/components/Header.module.css` | Modify | Radius; `.homeHeader` split into `.overlayHeader` + `.accentHeader` |
| `violetop/app/Home.module.css` | Modify | Radius; event grid alignment; hover lift |
| `violetop/app/components/GameOverview.module.css`, `app/about-us/AboutUs.module.css`, `app/[teamSlug]/TeamProfile.module.css` | Modify | Radius |
| `violetop/app/join-us/JoinUsClient.tsx`, `app/eboard/EboardClient.tsx`, `app/events/EventsClient.tsx`, `app/highlights/FeaturedPlayer.tsx` | Modify | Tailwind `rounded-*` classes |
| `violetop/app/hooks/usePrefersReducedMotion.ts` | Create | Shared reduced-motion hook |
| `violetop/app/components/SmoothScroll.tsx` | Create | Root Lenis instance |
| `violetop/app/layout.tsx` | Modify | Lenis CSS + `<SmoothScroll />` |
| `violetop/app/hooks/useLenisScroll.ts` | Delete | Unused scroll-container Lenis hook |
| `violetop/app/components/Header.tsx` | Modify | `data-lenis-prevent`; `overlay` prop |
| `violetop/app/utils/swirlSpeed.ts` | Create | Scroll velocity → shader speed math |
| `violetop/app/utils/swirlSpeed.test.ts` | Create | Speed math tests |
| `violetop/app/components/SwirlHero.tsx` + `.module.css` | Create | The swirl hero |
| `violetop/app/page.tsx` | Modify | Render `<Header overlay />` + `<SwirlHero />` instead of `<VopIntroBanner />` |

---

### Task 1: Team splash art on event cards

**Files:**
- Modify: `violetop/package.json` (scripts)
- Modify: `violetop/tsconfig.json` (compilerOptions)
- Create: `violetop/app/data/eventArtwork.test.ts`
- Modify: `violetop/app/data/eventArtwork.ts`
- Create: `violetop/public/images/events/{valorant-vyse,valorant-reyna,valorant-omen,valorant-clove,league-elder-dragon,league-baron-nashor}.webp`
- Modify: `violetop/public/images/events/sources.json`

**Interfaces:**
- Consumes: `CalendarEvent` from `app/lib/ical.ts`. Fields: `id`, `title`, `month`, `day`, `weekday`, `time`, `location: string | null`, `startsAt`.
- Produces:
  - `export type EventArtwork = { src: string; alt: string; objectPosition: string }`
  - `export type TeamKey = "white" | "purple" | "black" | "ruby" | "elder" | "baron"`
  - `export const teamEventArtwork: Record<TeamKey, EventArtwork>`
  - `export const eventArtwork` (unchanged keys)
  - `export function getEventArtwork(event: CalendarEvent): EventArtwork`. Callers `app/page.tsx` and `app/components/EventList.tsx` already use only `src`, `alt` and `objectPosition`.
  - npm script `test`.

- [ ] **Step 1: Add the test script and TS option**

In `violetop/package.json`, replace:

```json
    "lint": "eslint"
```

with:

```json
    "lint": "eslint",
    "test": "node --experimental-strip-types --disable-warning=ExperimentalWarning --test \"app/**/*.test.ts\""
```

In `violetop/tsconfig.json`, replace:

```json
    "noEmit": true,
```

with:

```json
    "noEmit": true,
    "allowImportingTsExtensions": true,
```

(Node's test runner needs explicit `.ts` import paths. The flag lets `next build`'s type-check accept them. It is valid because `noEmit` is true.)

- [ ] **Step 2: Write the failing tests**

Create `violetop/app/data/eventArtwork.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import type { CalendarEvent } from "../lib/ical";
import { eventArtwork, getEventArtwork, teamEventArtwork } from "./eventArtwork.ts";

function calendarEvent(title: string, location: string | null = null): CalendarEvent {
  return {
    id: title,
    title,
    month: "SEP",
    day: "24",
    weekday: "Thu",
    time: "7:00 PM – 9:30 PM",
    location,
    startsAt: "2026-09-24T23:00:00.000Z",
  };
}

test("each VOP team's events show that team's splash art", () => {
  assert.equal(getEventArtwork(calendarEvent("VOP White PCL Game")), teamEventArtwork.white);
  assert.equal(getEventArtwork(calendarEvent("VOP Purple PCL Game")), teamEventArtwork.purple);
  assert.equal(getEventArtwork(calendarEvent("VOP Black Scrims")), teamEventArtwork.black);
  assert.equal(getEventArtwork(calendarEvent("VOP Ruby Tryouts")), teamEventArtwork.ruby);
  assert.equal(getEventArtwork(calendarEvent("NECC VOP Elder Match")), teamEventArtwork.elder);
  assert.equal(getEventArtwork(calendarEvent("VOP Baron Customs")), teamEventArtwork.baron);
});

test("team names match regardless of case or spacing", () => {
  assert.equal(getEventArtwork(calendarEvent("vop   WHITE watch party")), teamEventArtwork.white);
});

test("the first team named in a title wins", () => {
  assert.equal(getEventArtwork(calendarEvent("VOP Purple vs VOP Black Scrim")), teamEventArtwork.purple);
});

test("events without a VOP team keep the game and activity artwork", () => {
  assert.equal(getEventArtwork(calendarEvent("Community Game Night")), eventArtwork.valorantCommunity);
  assert.equal(getEventArtwork(calendarEvent("Elder customs")), eventArtwork.leagueCommunity);
  assert.equal(getEventArtwork(calendarEvent("Black Friday Social")), eventArtwork.valorantCommunity);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run (from `violetop/`): `npm test`
Expected: FAIL. The file errors with `SyntaxError: The requested module './eventArtwork.ts' does not provide an export named 'teamEventArtwork'`, and the summary shows `# fail 1`.

- [ ] **Step 4: Implement the team mapping in `violetop/app/data/eventArtwork.ts`**

Replace the type block at the top:

```ts
export type EventArtwork = {
  src: string;
  alt: string;
  objectPosition: string;
  game: "valorant" | "league";
  activity: "general" | "competitive" | "community" | "practice";
};
```

with:

```ts
export type EventArtwork = {
  src: string;
  alt: string;
  objectPosition: string;
};

type ActivityArtwork = EventArtwork & {
  game: "valorant" | "league";
  activity: "general" | "competitive" | "community" | "practice";
};
```

Replace the closing line of the `eventArtwork` object:

```ts
} as const satisfies Record<string, EventArtwork>;
```

with this. The new block goes directly after it and before `function eventGame`:

```ts
} as const satisfies Record<string, ActivityArtwork>;

export type TeamKey = "white" | "purple" | "black" | "ruby" | "elder" | "baron";

/** Full splash art of each roster's featured agent or namesake monster. */
export const teamEventArtwork = {
  white: {
    src: "/images/events/valorant-vyse.webp",
    alt: "VALORANT artwork of Vyse, VOP White's featured agent",
    objectPosition: "50% 22%",
  },
  purple: {
    src: "/images/events/valorant-reyna.webp",
    alt: "VALORANT artwork of Reyna, VOP Purple's featured agent",
    objectPosition: "50% 20%",
  },
  black: {
    src: "/images/events/valorant-omen.webp",
    alt: "VALORANT artwork of Omen, VOP Black's featured agent",
    objectPosition: "44% 24%",
  },
  ruby: {
    src: "/images/events/valorant-clove.webp",
    alt: "VALORANT artwork of Clove, VOP Ruby's featured agent",
    objectPosition: "50% 20%",
  },
  elder: {
    src: "/images/events/league-elder-dragon.webp",
    alt: "Legends of Runeterra artwork of the Elder Dragon, VOP Elder's namesake",
    objectPosition: "42% 45%",
  },
  baron: {
    src: "/images/events/league-baron-nashor.webp",
    alt: "League of Legends artwork of Baron Nashor, VOP Baron's namesake",
    objectPosition: "56% 30%",
  },
} as const satisfies Record<TeamKey, EventArtwork>;

const teamPattern = /\bvop\s+(white|purple|black|ruby|elder|baron)\b/i;

function eventTeam(event: CalendarEvent): TeamKey | null {
  const match = teamPattern.exec(event.title);
  return match ? (match[1].toLowerCase() as TeamKey) : null;
}
```

Replace the doc comment and the first lines of `getEventArtwork`:

```ts
/**
 * Both the homepage and Events page call this function, so every occurrence of
 * a calendar series keeps the same artwork without storing presentation data in
 * the calendar feed or making a random choice during render.
 */
export function getEventArtwork(event: CalendarEvent): EventArtwork {
  const game = eventGame(event);
```

with:

```ts
/**
 * Both the homepage and Events page call this function, so every occurrence of
 * a calendar series keeps the same artwork without storing presentation data in
 * the calendar feed or making a random choice during render. Events that name a
 * VOP roster show that roster's splash art; the rest fall back to artwork chosen
 * by game and activity.
 */
export function getEventArtwork(event: CalendarEvent): EventArtwork {
  const team = eventTeam(event);
  if (team) return teamEventArtwork[team];

  const game = eventGame(event);
```

Leave the rest of the function and the `eventArtwork` entries unchanged.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: `# tests 4`, `# pass 4`, `# fail 0`.

- [ ] **Step 6: Generate the six WebP files**

The approved originals were downloaded in the planning session to `/private/tmp/claude-501/-Users-bezzchen-Documents-violet-op/7e6a0248-6380-4508-8083-4d80d49de9ef/scratchpad/art/raw/`. If that folder is missing, stop and ask; do not re-download without the user's OK.

The VALORANT files are cropped to x 2–83%, which drops the vertical "VALORANT" wordmark strip.

Run from `violetop/`:

```bash
node - <<'EOF'
const sharp = require("sharp");
const fs = require("fs");
const raw = "/private/tmp/claude-501/-Users-bezzchen-Documents-violet-op/7e6a0248-6380-4508-8083-4d80d49de9ef/scratchpad/art/raw";
const jobs = [
  ["valorant-vyse", "V26_A5_AM_VYSE.jpg", true],
  ["valorant-reyna", "V26_A5_AM_REYNA.jpg", true],
  ["valorant-omen", "Agent_Mastery_16x9_Omen.png", true],
  ["valorant-clove", "V26_A5_AM_CLOVE.jpg", true],
  ["league-elder-dragon", "elder-dragon-lvl1.png", false],
  ["league-baron-nashor", "Baron_Nashor_OriginalSkin.jpg", false],
];
(async () => {
  for (const [name, file, trimWordmark] of jobs) {
    let image = sharp(`${raw}/${file}`);
    if (trimWordmark) {
      const { width, height } = await image.metadata();
      image = image.extract({ left: Math.round(width * 0.02), top: 0, width: Math.round(width * 0.81), height: Math.min(height, 2160) });
    }
    const out = `public/images/events/${name}.webp`;
    await image.resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(out);
    const meta = await sharp(out).metadata();
    console.log(`${name}.webp ${meta.width}x${meta.height} ${Math.round(fs.statSync(out).size / 1024)} KB`);
  }
})();
EOF
```

Expected output (sizes may differ by a few KB):

```
valorant-vyse.webp 1920x1334 125 KB
valorant-reyna.webp 1920x1334 118 KB
valorant-omen.webp 1920x1334 137 KB
valorant-clove.webp 1920x1334 112 KB
league-elder-dragon.webp 1920x960 54 KB
league-baron-nashor.webp 1920x1080 123 KB
```

- [ ] **Step 7: Record provenance in `violetop/public/images/events/sources.json`**

Replace the final lines of the file:

```json
    "originalUrl": "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/9f6b6d721363f70ca89677feeb20f9dfa84b5197.zip"
  }
]
```

with:

```json
    "originalUrl": "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/9f6b6d721363f70ca89677feeb20f9dfa84b5197.zip"
  },
  {
    "asset": "valorant-vyse.webp",
    "collection": "Agent Mastery New Poses Wallpapers",
    "description": "VOP White event illustration (Vyse); selected source file: V26_A5_AM_VYSE.jpg, cropped to drop the vertical VALORANT wordmark",
    "sourcePage": "https://playvalorant.com/en-us/media/",
    "originalUrl": "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news_live/a25cf83d8830ef2fc44283ec2d071de06171d9ad.zip"
  },
  {
    "asset": "valorant-reyna.webp",
    "collection": "Agent Mastery New Poses Wallpapers",
    "description": "VOP Purple event illustration (Reyna); selected source file: V26_A5_AM_REYNA.jpg, cropped to drop the vertical VALORANT wordmark",
    "sourcePage": "https://playvalorant.com/en-us/media/",
    "originalUrl": "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news_live/a25cf83d8830ef2fc44283ec2d071de06171d9ad.zip"
  },
  {
    "asset": "valorant-omen.webp",
    "collection": "Agent Mastery New Poses Wallpapers",
    "description": "VOP Black event illustration (Omen); selected source file: Agent Mastery_16x9_Omen.png, cropped to drop the vertical VALORANT wordmark",
    "sourcePage": "https://playvalorant.com/en-us/media/",
    "originalUrl": "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news_live/a25cf83d8830ef2fc44283ec2d071de06171d9ad.zip"
  },
  {
    "asset": "valorant-clove.webp",
    "collection": "Agent Mastery New Poses Wallpapers",
    "description": "VOP Ruby event illustration (Clove); selected source file: V26_A5_AM_CLOVE.jpg, cropped to drop the vertical VALORANT wordmark",
    "sourcePage": "https://playvalorant.com/en-us/media/",
    "originalUrl": "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news_live/a25cf83d8830ef2fc44283ec2d071de06171d9ad.zip"
  },
  {
    "asset": "league-elder-dragon.webp",
    "collection": "Legends of Runeterra: Elder Dragon (08RU014)",
    "description": "VOP Elder event illustration; selected source file: 08RU014-full.png",
    "sourcePage": "https://dd.b.pvp.net/latest/set8/en_us/data/set8-en_us.json",
    "originalUrl": "https://dd.b.pvp.net/latest/set8/en_us/img/cards/08RU014-full.png"
  },
  {
    "asset": "league-baron-nashor.webp",
    "collection": "League of Legends Wiki: Baron Nashor",
    "description": "VOP Baron event illustration; selected source file: Baron_Nashor_OriginalSkin.jpg (chosen by the site owner)",
    "sourcePage": "https://wiki.leagueoflegends.com/en-us/Baron_Nashor",
    "originalUrl": "https://wiki.leagueoflegends.com/en-us/images/Baron_Nashor_OriginalSkin.jpg"
  }
]
```

Check it parses: `node -e 'console.log(require("./public/images/events/sources.json").length)'`. Expected: `13`.

- [ ] **Step 8: Lint and build**

Run: `npm run lint && npm run build`
Expected: lint prints no problems. The build finishes with the route table, with no TypeScript errors (the test file type-checks thanks to `allowImportingTsExtensions`).

- [ ] **Step 9: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/package.json violetop/tsconfig.json violetop/app/data/eventArtwork.ts violetop/app/data/eventArtwork.test.ts violetop/public/images/events/sources.json violetop/public/images/events/valorant-vyse.webp violetop/public/images/events/valorant-reyna.webp violetop/public/images/events/valorant-omen.webp violetop/public/images/events/valorant-clove.webp violetop/public/images/events/league-elder-dragon.webp violetop/public/images/events/league-baron-nashor.webp
git -C /Users/bezzchen/Documents/violet-op commit -m "Show each team's splash art on its events

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Rounded corners everywhere

**Files:**
- Modify: `violetop/app/globals.css`
- Modify: `violetop/app/components/Header.module.css`
- Modify: `violetop/app/Home.module.css`
- Modify: `violetop/app/components/GameOverview.module.css`
- Modify: `violetop/app/about-us/AboutUs.module.css`
- Modify: `violetop/app/[teamSlug]/TeamProfile.module.css`
- Modify: `violetop/app/join-us/JoinUsClient.tsx`, `violetop/app/eboard/EboardClient.tsx`, `violetop/app/events/EventsClient.tsx`, `violetop/app/highlights/FeaturedPlayer.tsx`

**Interfaces:**
- Produces:
  - Global CSS variables `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (18px) and `--radius-2xl` (18px), available to every CSS module.
  - Tailwind `rounded-sm/md/lg/xl/2xl` resolve to the same values.
  - Task 3 and Task 7 use `var(--radius-lg)` and `var(--radius-xl)`.

Rule for nesting: an element inside a rounded parent gets the next size down (mega menu `lg` → groups `md` → links `sm`).

- [ ] **Step 1: Define the scale in `violetop/app/globals.css`**

Replace:

```css
  --text-label-caps--line-height: 16px;
}

:root {
```

with:

```css
  --text-label-caps--line-height: 16px;
}

/* Corner radius scale shared by Tailwind's rounded-* utilities and the CSS modules.
   `static` makes Tailwind always emit these as :root variables. */
@theme static {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;
  --radius-2xl: 18px;
}

:root {
```

- [ ] **Step 2: Round the header (`violetop/app/components/Header.module.css`)**

Make these exact replacements (each `old` string occurs once):

| Old | New |
|---|---|
| `padding: 12px 18px; background: #e8d7ff;` | `padding: 12px 18px; border-radius: var(--radius-md); background: #e8d7ff;` |
| `padding: 0 22px; background: #c9a8f5; color: #15101a;` | `padding: 0 22px; border-radius: var(--radius-md); background: #c9a8f5; color: #15101a;` |
| `border: 1px solid #66527e; background: transparent; color: white; font-size: 23px;` | `border: 1px solid #66527e; border-radius: var(--radius-md); background: transparent; color: white; font-size: 23px;` |
| `padding: 18px; border: 1px solid var(--site-border); background: var(--site-bg-alt);` | `padding: 18px; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-bg-alt);` |
| `.megaGroup { min-width: 0; padding: 21px; border: 1px solid var(--site-border); background: var(--site-surface); }` | `.megaGroup { min-width: 0; padding: 21px; border: 1px solid var(--site-border); border-radius: var(--radius-md); background: var(--site-surface); }` |
| `padding: 8px 10px; border: 1px solid var(--site-border); background: var(--site-bg-alt);` | `padding: 8px 10px; border: 1px solid var(--site-border); border-radius: var(--radius-sm); background: var(--site-bg-alt);` |
| `img.darkCrest { padding: 3px; background: #d4cddd; }` | `img.darkCrest { padding: 3px; border-radius: var(--radius-sm); background: #d4cddd; }` |
| `.mobileGame { padding: 12px; border: 1px solid var(--site-border); background: var(--site-surface); }` | `.mobileGame { padding: 12px; border: 1px solid var(--site-border); border-radius: var(--radius-md); background: var(--site-surface); }` |
| `gap: 7px; padding: 6px; border: 1px solid var(--site-border); background: var(--site-bg-alt);` | `gap: 7px; padding: 6px; border: 1px solid var(--site-border); border-radius: var(--radius-sm); background: var(--site-bg-alt);` |

- [ ] **Step 3: Round the homepage (`violetop/app/Home.module.css`)**

| Old | New |
|---|---|
| `  padding: 0 22px;`<br>`  font-size: 12px;` (inside `.primaryAction, .secondaryAction`) | `  padding: 0 22px;`<br>`  border-radius: var(--radius-md);`<br>`  font-size: 12px;` |
| `.featuredEvent, .supportEvent { min-width: 0; overflow: hidden; border: 1px solid var(--site-border); background: var(--site-surface-raised); }` | `.featuredEvent, .supportEvent { min-width: 0; overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface-raised); }` |
| `padding: clamp(30px, 5vw, 62px); border: 1px solid var(--site-border); background: var(--site-surface); }` | `padding: clamp(30px, 5vw, 62px); border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface); }` |
| `border: 1px solid #c5a3ef; color: #d9bbf8; font-size: 23px; }` | `border: 1px solid #c5a3ef; border-radius: var(--radius-sm); color: #d9bbf8; font-size: 23px; }` |
| `min-height: 600px; overflow: hidden; border: 1px solid var(--site-border); isolation: isolate; }` | `min-height: 600px; overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-lg); isolation: isolate; }` |
| `border: 1px solid #5a496d; background: #100d18e8;` | `border: 1px solid #5a496d; border-radius: var(--radius-md); background: #100d18e8;` |
| `.teamLinks img { width: 30px; height: 28px; padding: 2px; background: #62606b; object-fit: contain; }` | `.teamLinks img { width: 30px; height: 28px; padding: 2px; border-radius: var(--radius-sm); background: #62606b; object-fit: contain; }` |
| `.highlightFeature { overflow: hidden; border: 1px solid var(--site-border); background: var(--site-surface-raised); }` | `.highlightFeature { overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface-raised); }` |

- [ ] **Step 4: Round the game overview, about and team pages**

`violetop/app/components/GameOverview.module.css`:

| Old | New |
|---|---|
| `overflow: hidden; background: var(--site-surface-raised); border: 1px solid var(--site-border); }` | `overflow: hidden; border-radius: var(--radius-xl); background: var(--site-surface-raised); border: 1px solid var(--site-border); }` |
| `padding: 28px; border: 1px solid var(--site-border); background: var(--site-surface);` | `padding: 28px; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface);` |
| `.crest { position: relative; display: block; width: 70px; height: 68px; padding: 8px; background: #4a4551; }` | `.crest { position: relative; display: block; width: 70px; height: 68px; padding: 8px; border-radius: var(--radius-md); background: #4a4551; }` |

`violetop/app/about-us/AboutUs.module.css`:

| Old | New |
|---|---|
| `min-height: 360px; border: 1px solid var(--site-border); background: var(--site-surface-raised); }` | `min-height: 360px; overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-xl); background: var(--site-surface-raised); }` |
| `.personCard { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--site-border); background: var(--site-surface); }` | `.personCard { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface); }` |
| `.personInfo li { padding: 6px 8px; border: 1px solid #514162;` | `.personInfo li { padding: 6px 8px; border: 1px solid #514162; border-radius: var(--radius-sm);` |

`violetop/app/[teamSlug]/TeamProfile.module.css`:

| Old | New |
|---|---|
| `min-height: 335px; overflow: hidden; border: 1px solid var(--site-border); background: var(--site-surface-raised); }` | `min-height: 335px; overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-xl); background: var(--site-surface-raised); }` |
| `.crest { position: relative; display: block; width: 72px; height: 72px; padding: 7px; background: #4e4854; }` | `.crest { position: relative; display: block; width: 72px; height: 72px; padding: 7px; border-radius: var(--radius-md); background: #4e4854; }` |
| `.status { padding: 11px 12px; border: 1px solid #ffffff44;` | `.status { padding: 11px 12px; border: 1px solid #ffffff44; border-radius: var(--radius-md);` |
| `min-height: 43px; padding: 0 15px; background: var(--team-accent);` | `min-height: 43px; padding: 0 15px; border-radius: var(--radius-md); background: var(--team-accent);` |
| `.switcher a { padding: 9px 11px; border: 1px solid var(--site-border);` | `.switcher a { padding: 9px 11px; border: 1px solid var(--site-border); border-radius: var(--radius-md);` |
| `min-height: 71px; padding: 11px; border: 1px solid var(--site-border); background: var(--site-surface); }` | `min-height: 71px; padding: 11px; border: 1px solid var(--site-border); border-radius: var(--radius-md); background: var(--site-surface); }` |
| `.avatar { display: flex; flex: 0 0 42px; width: 42px; height: 42px;` | `.avatar { display: flex; flex: 0 0 42px; width: 42px; height: 42px; border-radius: var(--radius-sm);` |
| `.detailBlock { padding: 21px; border: 1px solid var(--site-border); background: var(--site-surface); }` | `.detailBlock { padding: 21px; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface); }` |

- [ ] **Step 5: Round the Tailwind pages**

`violetop/app/join-us/JoinUsClient.tsx`:

| Old | New |
|---|---|
| `className="op-clip border border-white/25 px-7 py-4` | `className="op-clip rounded-md border border-white/25 px-7 py-4` |
| `flex h-full flex-col gap-6 rounded border p-6 md:p-7` | `flex h-full flex-col gap-6 rounded-lg border p-6 md:p-7` |
| `<span className="op-clip border border-white/20 bg-white/5 px-5 py-3` | `<span className="op-clip rounded-md border border-white/20 bg-white/5 px-5 py-3` |
| `section-text-panel op-clip border-r-4 border-r-tertiary p-6 md:p-stack-xl"` | `section-text-panel op-clip rounded-lg border-r-4 border-r-tertiary p-6 md:p-stack-xl"` |
| `flex h-full items-center gap-4 rounded border p-5` | `flex h-full items-center gap-4 rounded-lg border p-5` |
| `flex h-full flex-col gap-4 rounded border border-white/10 p-6` | `flex h-full flex-col gap-4 rounded-lg border border-white/10 p-6` |
| `className="op-clip border border-white/25 px-8 py-4` | `className="op-clip rounded-md border border-white/25 px-8 py-4` |

`violetop/app/eboard/EboardClient.tsx`:

| Old | New |
|---|---|
| `section-text-panel op-clip border-l-4 border-l-tertiary` | `section-text-panel op-clip rounded-lg border-l-4 border-l-tertiary` |
| `className="w-full rounded border border-outline-variant` | `className="w-full rounded-md border border-outline-variant` |

`violetop/app/events/EventsClient.tsx`:

| Old | New |
|---|---|
| `aspect-[4/3] overflow-hidden rounded border border-white/10` | `aspect-[4/3] overflow-hidden rounded-lg border border-white/10` |
| `section-text-panel op-clip border-r-4 border-r-tertiary p-6 text-right` | `section-text-panel op-clip rounded-lg border-r-4 border-r-tertiary p-6 text-right` |

`violetop/app/highlights/FeaturedPlayer.tsx`:

| Old | New |
|---|---|
| `className="op-clip inline-flex items-center gap-2 bg-primary px-5 py-3` | `className="op-clip inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3` |

Afterwards, confirm no bare `rounded ` class is left on a card or input: `grep -rn '[" ]rounded [a-z]' app --include='*.tsx'`. Expected: no output.

- [ ] **Step 6: Lint, build and check the tokens render**

Run: `npm run lint && npm run build`
Expected: clean lint, and the build finishes with the route table.

Browser check (controller, dev server `violetop-dev` from `.claude/launch.json`). On `/`, run in the page:

```js
[getComputedStyle(document.documentElement).getPropertyValue("--radius-lg").trim(),
 getComputedStyle(document.querySelector("article")).borderTopLeftRadius]
```

Expected: `["12px", "12px"]`. Screenshot `/`, `/events`, `/join-us`, `/vop-white`, `/teams/valorant` and `/about-us`, and confirm cards, buttons and chips have rounded corners and nothing is clipped oddly.

- [ ] **Step 7: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/globals.css violetop/app/components/Header.module.css violetop/app/Home.module.css violetop/app/components/GameOverview.module.css violetop/app/about-us/AboutUs.module.css "violetop/app/[teamSlug]/TeamProfile.module.css" violetop/app/join-us/JoinUsClient.tsx violetop/app/eboard/EboardClient.tsx violetop/app/events/EventsClient.tsx violetop/app/highlights/FeaturedPlayer.tsx
git -C /Users/bezzchen/Documents/violet-op commit -m "Round corners across the site with a shared radius scale

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Align the What's Happening cards and lift them on hover

**Files:**
- Modify: `violetop/app/Home.module.css`

**Interfaces:**
- Consumes: `--radius-lg` from Task 2, and the class names `.eventLayout`, `.featuredEvent`, `.supportEvent`, `.eventVisual` and `.supportEvents`, already used by `EventPreview` in `app/page.tsx`. No markup changes.

- [ ] **Step 1: Stretch the grid and let the artwork absorb extra height**

Replace these lines (as left by Task 2):

```css
.eventLayout { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, .85fr); gap: 16px; align-items: start; }
.eventLayoutSingle { display: block; }
.featuredEvent, .supportEvent { min-width: 0; overflow: hidden; border: 1px solid var(--site-border); border-radius: var(--radius-lg); background: var(--site-surface-raised); }
.eventVisual { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: #13101b; }
```

with:

```css
.eventLayout { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, .85fr); gap: 16px; align-items: stretch; }
.eventLayoutSingle { display: block; }
.featuredEvent, .supportEvent {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--site-border);
  border-radius: var(--radius-lg);
  background: var(--site-surface-raised);
  transition: transform .22s cubic-bezier(.2, .7, .3, 1), box-shadow .22s ease, border-color .22s ease;
}
/* The artwork absorbs any extra height so both columns end on the same line. */
.eventVisual { position: relative; flex: 1 0 auto; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: #13101b; }
```

Replace:

```css
.supportEvents { display: grid; gap: 16px; }
```

with:

```css
.supportEvents { display: grid; grid-auto-rows: 1fr; gap: 16px; }
```

- [ ] **Step 2: Add the hover lift**

Directly after the line `.supportEvent .eventText p { font-size: 12px; }`, insert:

```css
@media (hover: hover) {
  .featuredEvent:hover, .supportEvent:hover {
    border-color: #6f5a8f;
    box-shadow: 0 22px 44px -18px #000000d9, 0 0 0 1px #c9a8f533;
    transform: translateY(-6px);
  }
}
```

Replace the reduced-motion block at the end of the file:

```css
@media (prefers-reduced-motion: reduce) {
  .primaryAction, .secondaryAction, .playSymbol { transition: none; }
}
```

with:

```css
@media (prefers-reduced-motion: reduce) {
  .primaryAction, .secondaryAction, .playSymbol { transition: none; }
  .featuredEvent, .supportEvent { transition: border-color .22s ease, box-shadow .22s ease; }
  .featuredEvent:hover, .supportEvent:hover { transform: none; }
}
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: clean lint and a successful build.

- [ ] **Step 4: Verify alignment and hover in the browser (controller)**

At a 1440×900 viewport on `/`, run in the page:

```js
(() => {
  const layout = document.querySelector("#latest [class*='eventLayout']");
  const [featured, ...support] = layout.querySelectorAll("article");
  const f = featured.getBoundingClientRect();
  const last = support.at(-1)?.getBoundingClientRect();
  return { supportCount: support.length, topGap: Math.round(f.top - support[0]?.getBoundingClientRect().top), bottomGap: Math.round(f.bottom - last?.bottom) };
})()
```

Expected with two support events: `topGap: 0`, `bottomGap: 0` (±1). If the live calendar has fewer events, note the count and check whatever renders.

Hover a card with the mouse and read `getComputedStyle(card).transform` after 300ms. Expected: `matrix(1, 0, 0, 1, 0, -6)`. Screenshot the section.

- [ ] **Step 5: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/Home.module.css
git -C /Users/bezzchen/Documents/violet-op commit -m "Align What's Happening cards and lift them on hover

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Lenis inertial scrolling

**Files:**
- Create: `violetop/app/hooks/usePrefersReducedMotion.ts`
- Create: `violetop/app/components/SmoothScroll.tsx`
- Modify: `violetop/app/layout.tsx`
- Modify: `violetop/app/components/Header.tsx` (two `data-lenis-prevent` attributes)
- Delete: `violetop/app/hooks/useLenisScroll.ts`

**Interfaces:**
- Produces:
  - `export default function usePrefersReducedMotion(): boolean`. It is `true` during server rendering and hydration, then reflects the media query live. Task 7 uses it.
  - A root Lenis instance whenever motion is allowed. Task 7 reads it with `useLenis` from `lenis/react`.

- [ ] **Step 1: Create the reduced-motion hook**

Create `violetop/app/hooks/usePrefersReducedMotion.ts`:

```ts
"use client";

import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

// Server renders assume reduced motion so nothing animates before hydration.
function getServerSnapshot() {
  return true;
}

export default function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 2: Create the root Lenis component**

Create `violetop/app/components/SmoothScroll.tsx`:

```tsx
"use client";

import type { LenisOptions } from "lenis";
import { ReactLenis } from "lenis/react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

// Anchors stay native so hash links, including "Skip to content", still move focus.
const lenisOptions: LenisOptions = {
  anchors: false,
  lerp: 0.1,
  smoothWheel: true,
  stopInertiaOnNavigate: true,
};

/** Site-wide inertial scrolling. The root Lenis instance drives window scroll and renders no markup. */
export default function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? null : <ReactLenis options={lenisOptions} root />;
}
```

- [ ] **Step 3: Mount it in `violetop/app/layout.tsx`**

Replace:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { siteMeta } from "./data/siteContent";
```

with:

```tsx
import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { siteMeta } from "./data/siteContent";
```

Replace:

```tsx
      <body>{children}</body>
```

with:

```tsx
      <body>
        <SmoothScroll />
        {children}
      </body>
```

- [ ] **Step 4: Let the header menus scroll natively**

In `violetop/app/components/Header.tsx`, replace:

```tsx
            <div aria-label="Teams" className={styles.megaMenu} hidden={!teamsOpen} id="teams-mega-menu" ref={megaRef} role="region">
```

with:

```tsx
            <div aria-label="Teams" className={styles.megaMenu} data-lenis-prevent hidden={!teamsOpen} id="teams-mega-menu" ref={megaRef} role="region">
```

Replace:

```tsx
        <nav aria-label="Mobile navigation" className={styles.mobileNav} hidden={!menuOpen} id="mobile-navigation" ref={mobileNavRef}>
```

with:

```tsx
        <nav aria-label="Mobile navigation" className={styles.mobileNav} data-lenis-prevent hidden={!menuOpen} id="mobile-navigation" ref={mobileNavRef}>
```

- [ ] **Step 5: Delete the unused scroll-container hook**

```bash
git -C /Users/bezzchen/Documents/violet-op rm violetop/app/hooks/useLenisScroll.ts
```

Confirm nothing imported it: `grep -rn "useLenisScroll" violetop/app`. Expected: no output.

- [ ] **Step 6: Lint and build**

Run: `npm run lint && npm run build`
Expected: clean lint and a successful build.

- [ ] **Step 7: Verify in the browser (controller)**

On `/`, run `document.documentElement.className`. Expected: it contains `lenis`.

Scroll with the mouse wheel (the computer tool's `scroll` action) and, in the same batch, sample `window.scrollY` a few times over about 500ms. Expected: several distinct increasing values after the wheel stops (inertia), not a single jump.

At a 1280×600 viewport, open the Teams menu, scroll the wheel over it, and read `document.getElementById("teams-mega-menu").scrollTop`. Expected: > 0, and the page behind does not move. Navigate to `/events` and back, and check the console for errors. Expected: none.

- [ ] **Step 8: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/hooks/usePrefersReducedMotion.ts violetop/app/components/SmoothScroll.tsx violetop/app/layout.tsx violetop/app/components/Header.tsx
git -C /Users/bezzchen/Documents/violet-op commit -m "Add Lenis inertial scrolling site-wide

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(The `git rm` in Step 5 already staged the deletion.)

---

### Task 5: Header `overlay` mode, separate from banner accents

**Files:**
- Modify: `violetop/app/components/Header.tsx`
- Modify: `violetop/app/components/Header.module.css`

**Interfaces:**
- Produces:
  - `Header` props: `overlay?: boolean` (transparent over `#hero-section`, gaining its surface as the hero scrolls away).
  - `homeAnimation?: { current; incoming; wiping }` is unchanged and now implies `overlay`.
  - Task 7 renders `<Header overlay />`.
  - The stashed `VopIntroBanner` keeps passing `homeAnimation` and must behave exactly as before.

- [ ] **Step 1: Split the props in `Header.tsx`**

Replace:

```tsx
type HeaderProps = {
  homeAnimation?: {
    current: HeaderPalette;
    incoming: HeaderPalette;
    wiping: boolean;
  };
};

export default function Header({ homeAnimation }: HeaderProps = {}) {
  const pathname = usePathname();
  const isHomeHeader = Boolean(homeAnimation);
```

with:

```tsx
type HeaderProps = {
  /** Sit transparently over `#hero-section`, gaining the normal surface as the hero scrolls away. */
  overlay?: boolean;
  /** Colorway accents driven by the stashed VopIntroBanner. Implies `overlay`. */
  homeAnimation?: {
    current: HeaderPalette;
    incoming: HeaderPalette;
    wiping: boolean;
  };
};

export default function Header({ overlay = false, homeAnimation }: HeaderProps = {}) {
  const pathname = usePathname();
  const isOverlay = overlay || Boolean(homeAnimation);
  const hasAccents = Boolean(homeAnimation);
```

Then make these replacements (each occurs once):

| Old | New |
|---|---|
| `  useLayoutEffect(() => {`<br>`    if (!isHomeHeader) return;`<br><br>`    const motionPreference` | `  useLayoutEffect(() => {`<br>`    if (!isOverlay) return;`<br><br>`    const motionPreference` |
| `      motionPreference.removeEventListener("change", updateSurface);`<br>`    };`<br>`  }, [isHomeHeader]);` | `      motionPreference.removeEventListener("change", updateSurface);`<br>`    };`<br>`  }, [isOverlay]);` |
| `  const syncAccentGeometry = useCallback(() => {`<br>`    if (!isHomeHeader) return;` | `  const syncAccentGeometry = useCallback(() => {`<br>`    if (!hasAccents) return;` |
| ``      element.style.setProperty("--reveal-mask-y", `${-bounds.top}px`);``<br>`    });`<br>`  }, [isHomeHeader]);` | ``      element.style.setProperty("--reveal-mask-y", `${-bounds.top}px`);``<br>`    });`<br>`  }, [hasAccents]);` |
| `  useLayoutEffect(() => {`<br>`    if (!isHomeHeader) return;`<br><br>`    const frame = window.requestAnimationFrame(syncAccentGeometry);` | `  useLayoutEffect(() => {`<br>`    if (!hasAccents) return;`<br><br>`    const frame = window.requestAnimationFrame(syncAccentGeometry);` |
| `  }, [isHomeHeader, menuOpen, mobileTeamsOpen, syncAccentGeometry]);` | `  }, [hasAccents, menuOpen, mobileTeamsOpen, syncAccentGeometry]);` |
| ``<header className={`${styles.header} ${homeAnimation ? styles.homeHeader : ""}`} ref={headerRef}>`` | ``<header className={`${styles.header} ${isOverlay ? styles.overlayHeader : ""} ${hasAccents ? styles.accentHeader : ""}`} ref={headerRef}>`` |

Afterwards `grep -n "isHomeHeader\|homeHeader" violetop/app/components/Header.tsx`. Expected: no output.

- [ ] **Step 2: Split the CSS in `Header.module.css`**

Replace the whole block from `.homeHeader {` through the `.homeHeader :is(.brand, .desktopNav > a, .teamsTrigger) { … }` rule (currently lines 17–59) with:

```css
/* Transparent over #hero-section until the hero scrolls away (Header's `overlay`). */
.overlayHeader {
  border-bottom-color: transparent;
  background: transparent;
  box-shadow: none;
}
.overlayHeader::before,
.overlayHeader::after {
  position: absolute;
  z-index: 0;
  left: 0;
  width: 100%;
  content: "";
  opacity: var(--home-surface-opacity);
  pointer-events: none;
  transition: opacity 90ms linear;
  will-change: opacity;
}
.overlayHeader::before {
  top: 0;
  height: var(--header-bar-height);
  background: #100d18f5;
}
.overlayHeader::after {
  top: calc(var(--header-bar-height) - 1px);
  height: 1px;
  background: var(--site-border);
}
.overlayHeader :is(.brand, .desktopNav > a, .teamsTrigger) {
  text-shadow: 0 1px 8px #000, 0 0 18px #000b;
}
/* Colorway accents for the stashed VopIntroBanner replace the base logo until the hero scrolls away. */
.accentHeader .brandBaseLogo,
.accentHeader .brandOpBase {
  opacity: var(--home-surface-opacity);
  transition: opacity 90ms linear;
}
.accentHeader .brandMark > .accentLayer,
.accentHeader .brandOp > .accentLayer,
.accentHeader :is(.join, .mobileJoin) > .accentLayer {
  opacity: calc(1 - var(--home-surface-opacity));
  transition: opacity 90ms linear;
}
.accentHeader .join { position: relative; background: #c9a8f5; }
.accentHeader .mobileJoin { background: #c9a8f5; }
```

In the `@media (prefers-reduced-motion: reduce)` block at the end, replace:

```css
  .homeHeader::before,
  .homeHeader::after,
  .homeHeader .brandBaseLogo,
  .homeHeader .brandOpBase,
  .homeHeader .brandMark > .accentLayer,
  .homeHeader .brandOp > .accentLayer,
  .homeHeader :is(.join, .mobileJoin) > .accentLayer { transition: none; }
```

with:

```css
  .overlayHeader::before,
  .overlayHeader::after,
  .accentHeader .brandBaseLogo,
  .accentHeader .brandOpBase,
  .accentHeader .brandMark > .accentLayer,
  .accentHeader .brandOp > .accentLayer,
  .accentHeader :is(.join, .mobileJoin) > .accentLayer { transition: none; }
```

Afterwards `grep -n "homeHeader" violetop/app/components/Header.module.css`. Expected: no output.

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: clean lint and a successful build.

- [ ] **Step 4: Verify nothing changed visually (controller)**

The homepage still mounts `VopIntroBanner`, which passes `homeAnimation`. On `/`, `document.querySelector("header").className` should contain both `overlayHeader` and `accentHeader`, and the banner/header should look and animate exactly as before (screenshot at the top of the page and after scrolling past the banner). On `/events` the header class list contains neither.

- [ ] **Step 5: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/components/Header.tsx violetop/app/components/Header.module.css
git -C /Users/bezzchen/Documents/violet-op commit -m "Separate the header's hero overlay from the banner's colorway accents

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Swirl speed math (scroll velocity → shader speed)

**Files:**
- Create: `violetop/app/utils/swirlSpeed.test.ts`
- Create: `violetop/app/utils/swirlSpeed.ts`

**Interfaces:**
- Produces (used by Task 7):
  - `export const SWIRL_BASE_SPEED = 0.18`
  - `export const SWIRL_MAX_BOOST = 0.9`
  - `export const SWIRL_SPEED_EPSILON = 0.002`
  - `export function swirlTargetSpeed(scrollVelocity: number): number`
  - `export function easeSwirlSpeed(current: number, target: number, elapsedMs: number): number`

- [ ] **Step 1: Write the failing tests**

Create `violetop/app/utils/swirlSpeed.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { easeSwirlSpeed, SWIRL_BASE_SPEED, SWIRL_MAX_BOOST, swirlTargetSpeed } from "./swirlSpeed.ts";

const maxSpeed = SWIRL_BASE_SPEED + SWIRL_MAX_BOOST;

test("a resting page spins at the base speed", () => {
  assert.equal(swirlTargetSpeed(0), SWIRL_BASE_SPEED);
});

test("scrolling up or down boosts the speed equally", () => {
  const down = swirlTargetSpeed(24);
  assert.equal(swirlTargetSpeed(-24), down);
  assert.ok(down > SWIRL_BASE_SPEED && down < maxSpeed);
});

test("the boost is capped for very fast scrolls", () => {
  assert.equal(swirlTargetSpeed(10_000), maxSpeed);
});

test("easing approaches the target without overshooting", () => {
  const next = easeSwirlSpeed(SWIRL_BASE_SPEED, maxSpeed, 16);
  assert.ok(next > SWIRL_BASE_SPEED && next < maxSpeed);
  assert.equal(easeSwirlSpeed(0.5, maxSpeed, 0), 0.5);
});

test("spinning up is quicker than settling back down", () => {
  const risen = easeSwirlSpeed(SWIRL_BASE_SPEED, maxSpeed, 100) - SWIRL_BASE_SPEED;
  const fallen = maxSpeed - easeSwirlSpeed(maxSpeed, SWIRL_BASE_SPEED, 100);
  assert.ok(risen > fallen);
});

test("the swirl is back within 10% of its base speed a second after scrolling stops", () => {
  let speed = maxSpeed;
  for (let frame = 0; frame < 60; frame += 1) speed = easeSwirlSpeed(speed, SWIRL_BASE_SPEED, 1000 / 60);
  assert.ok(speed - SWIRL_BASE_SPEED < SWIRL_MAX_BOOST * 0.1);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL. `swirlSpeed.test.ts` errors with `ERR_MODULE_NOT_FOUND` for `swirlSpeed.ts`. The four `eventArtwork` tests still pass.

- [ ] **Step 3: Implement**

Create `violetop/app/utils/swirlSpeed.ts`:

```ts
/** Resting spin speed of the homepage swirl, in Paper Shaders speed units. */
export const SWIRL_BASE_SPEED = 0.18;
/** Extra speed at full scroll velocity; base plus boost is about six times the base. */
export const SWIRL_MAX_BOOST = 0.9;
/** Below this gap the eased speed snaps to its target and the easing loop stops. */
export const SWIRL_SPEED_EPSILON = 0.002;

// Lenis velocity (pixels per frame) that earns the full boost: a brisk wheel flick.
const FULL_BOOST_VELOCITY = 48;
// Easing time constants: quick to spin up, about a second to settle back.
const SPIN_UP_MS = 120;
const SETTLE_MS = 380;

export function swirlTargetSpeed(scrollVelocity: number): number {
  const intensity = Math.min(Math.abs(scrollVelocity) / FULL_BOOST_VELOCITY, 1);
  return SWIRL_BASE_SPEED + intensity * SWIRL_MAX_BOOST;
}

/** Frame-rate independent exponential easing from the current speed toward the target. */
export function easeSwirlSpeed(current: number, target: number, elapsedMs: number): number {
  const timeConstant = target > current ? SPIN_UP_MS : SETTLE_MS;
  const blend = 1 - Math.exp(-Math.max(elapsedMs, 0) / timeConstant);
  return current + (target - current) * blend;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `# tests 10`, `# pass 10`, `# fail 0`.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no problems.

- [ ] **Step 6: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/utils/swirlSpeed.ts violetop/app/utils/swirlSpeed.test.ts
git -C /Users/bezzchen/Documents/violet-op commit -m "Add scroll-to-swirl speed easing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Swirl hero replaces the banner (and the logo turns solid)

**Files:**
- Modify: `violetop/package.json`, `violetop/package-lock.json` (via npm)
- Create: `violetop/app/components/SwirlHero.module.css`
- Create: `violetop/app/components/SwirlHero.tsx`
- Modify: `violetop/app/page.tsx`

**Interfaces:**
- Consumes:
  - `usePrefersReducedMotion()` (Task 4) and `useLenis` from `lenis/react`, fed by the root instance (Task 4).
  - `SWIRL_BASE_SPEED`, `SWIRL_SPEED_EPSILON`, `swirlTargetSpeed`, `easeSwirlSpeed` (Task 6).
  - `var(--radius-xl)` (Task 2) and `<Header overlay />` (Task 5).
  - `BrandLogo` (`app/components/BrandLogo.tsx`, props `className?: string; priority?: boolean`).
  - Paper's `Swirl` (props: `colors`, `colorBack`, `bandCount`, `twist`, `center`, `proportion`, `softness`, `noise`, `noiseFrequency`, `speed`, `frame`, `scale`, `offsetX`, `offsetY`, `minPixelRatio`, `maxPixelCount`, `className`, `ref`, plus div props).
  - `PaperShaderElement` (a div with `.paperShaderMount?.setSpeed(n)` and `.getCurrentFrame()`).
- Produces: `export default function SwirlHero()`, a `<section id="hero-section">`. The header's surface fade keys off that id.

- [ ] **Step 1: Install Paper Shaders (pinned)**

Run from `violetop/`:

```bash
npm install --save-exact @paper-design/shaders-react@0.0.81 @paper-design/shaders@0.0.81
```

Expected: `package.json` dependencies gain `"@paper-design/shaders": "0.0.81"` and `"@paper-design/shaders-react": "0.0.81"`, with no peer-dependency errors (React 19 is supported).

- [ ] **Step 2: Create `violetop/app/components/SwirlHero.module.css`**

```css
.hero {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  height: clamp(440px, 60vh, 640px);
  margin: 12px 12px 0;
  overflow: hidden;
  border: 1px solid #ffffff12;
  border-radius: var(--radius-xl);
  /* Static stand-in for the shader: shown while rendering on the server, while loading, and without WebGL2. */
  background:
    radial-gradient(ellipse 80% 95% at 18% 12%, #7100c75c 0%, transparent 62%),
    radial-gradient(ellipse 70% 85% at 88% 92%, #a800f03d 0%, transparent 60%),
    radial-gradient(circle at 50% 50%, #2a0b4d 0%, #140b22 56%, #09080d 100%);
}

.swirl {
  position: absolute;
  z-index: -2;
  inset: 0;
  animation: swirlFadeIn 900ms ease-out both;
}

/* Darkens the header strip and pools shadow behind the mark so both stay legible over the bands. */
.vignette {
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 30% 38% at 50% 50%, #09080d9e 0%, transparent 72%),
    linear-gradient(180deg, #09080dc7 0%, transparent 24%, transparent 72%, #09080d8c 100%);
}

.mark {
  width: clamp(112px, 13vw, 176px);
  aspect-ratio: 896 / 802;
  filter: drop-shadow(0 0 26px #a800f07a) drop-shadow(0 12px 28px #000000b3);
}

.markImage {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.screenReaderOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@keyframes swirlFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 760px) {
  .hero {
    height: clamp(360px, 56vh, 520px);
    margin: 8px 8px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .swirl { animation: none; }
}
```

- [ ] **Step 3: Create `violetop/app/components/SwirlHero.tsx`**

```tsx
"use client";

import type { PaperShaderElement } from "@paper-design/shaders";
import { Swirl } from "@paper-design/shaders-react";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { easeSwirlSpeed, SWIRL_BASE_SPEED, SWIRL_SPEED_EPSILON, swirlTargetSpeed } from "../utils/swirlSpeed";
import BrandLogo from "./BrandLogo";
import styles from "./SwirlHero.module.css";

// Brand purples from deep violet to lavender; the swirl bands blend through them.
const swirlColors = ["#2a0b4d", "#7100c7", "#a800f0", "#d9b8ff"];
// Animation time (ms) the swirl starts from; also the still frame shown for reduced motion.
const SWIRL_START_FRAME = 24_000;
// About 1.6 megapixels. The soft bands upscale invisibly, so there's no need to shade every device pixel.
const SWIRL_MAX_PIXELS = 1_600_000;

type SpeedLoop = { frame: number; lastTime: number; speed: number; target: number };

let webgl2Supported: boolean | undefined;

// Paper Shaders needs WebGL2 and throws without it, so check once before mounting.
function supportsWebGL2() {
  if (webgl2Supported === undefined) {
    const context = document.createElement("canvas").getContext("webgl2");
    webgl2Supported = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webgl2Supported;
}

const subscribeToNothing = () => () => {};
const withoutShader = () => false;

export default function SwirlHero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  // False on the server and during hydration, so the static gradient renders first.
  const canRenderShader = useSyncExternalStore(subscribeToNothing, supportsWebGL2, withoutShader);
  const shaderRef = useRef<PaperShaderElement>(null);
  const loopRef = useRef<SpeedLoop>({ frame: 0, lastTime: 0, speed: SWIRL_BASE_SPEED, target: SWIRL_BASE_SPEED });

  // Eases the shader toward the scroll-driven target speed, then stops once it settles.
  const easeSpeed = useCallback(function step(time: number) {
    const loop = loopRef.current;
    const elapsed = loop.lastTime ? time - loop.lastTime : 0;
    loop.lastTime = time;
    const next = easeSwirlSpeed(loop.speed, loop.target, elapsed);
    const settled = Math.abs(loop.target - next) < SWIRL_SPEED_EPSILON;
    loop.speed = settled ? loop.target : next;
    shaderRef.current?.paperShaderMount?.setSpeed(loop.speed);

    if (settled) {
      loop.frame = 0;
      loop.lastTime = 0;
    } else {
      loop.frame = requestAnimationFrame(step);
    }
  }, []);

  useLenis(
    ({ velocity }) => {
      if (prefersReducedMotion) return;
      const loop = loopRef.current;
      loop.target = swirlTargetSpeed(velocity);
      if (!loop.frame) loop.frame = requestAnimationFrame(easeSpeed);
    },
    [prefersReducedMotion, easeSpeed],
  );

  // Reduced motion freezes the swirl, so drop any acceleration already in flight.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const loop = loopRef.current;
    cancelAnimationFrame(loop.frame);
    loop.frame = 0;
    loop.lastTime = 0;
    loop.speed = SWIRL_BASE_SPEED;
    loop.target = SWIRL_BASE_SPEED;
  }, [prefersReducedMotion]);

  useEffect(() => {
    const loop = loopRef.current;
    return () => cancelAnimationFrame(loop.frame);
  }, []);

  return (
    <section aria-labelledby="hero-title" className={styles.hero} id="hero-section">
      <h1 className={styles.screenReaderOnly} id="hero-title">Violet OP</h1>
      {canRenderShader ? (
        <Swirl
          aria-hidden="true"
          bandCount={3}
          center={0.2}
          className={styles.swirl}
          colorBack="#09080d"
          colors={swirlColors}
          frame={SWIRL_START_FRAME}
          maxPixelCount={SWIRL_MAX_PIXELS}
          minPixelRatio={1}
          noise={0.16}
          noiseFrequency={0.3}
          offsetX={-0.42}
          offsetY={0.36}
          proportion={0.45}
          ref={shaderRef}
          scale={1.7}
          softness={1}
          speed={prefersReducedMotion ? 0 : SWIRL_BASE_SPEED}
          twist={0.3}
        />
      ) : null}
      <div aria-hidden="true" className={styles.vignette} />
      <div aria-hidden="true" className={styles.mark}>
        <BrandLogo className={styles.markImage} priority />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Swap the homepage hero in `violetop/app/page.tsx`**

Replace:

```tsx
import Footer from "./components/Footer";
import VopIntroBanner from "./components/VopIntroBanner";
```

with:

```tsx
import Footer from "./components/Footer";
import Header from "./components/Header";
import SwirlHero from "./components/SwirlHero";
```

Replace:

```tsx
    <>
      <VopIntroBanner />
      <main className={styles.page} id="main-content" tabIndex={-1}>
```

with:

```tsx
    <>
      {/* The colorway banner (VopIntroBanner) is stashed; render it in place of these two to restore it. */}
      <Header overlay />
      <SwirlHero />
      <main className={styles.page} id="main-content" tabIndex={-1}>
```

- [ ] **Step 5: Test, lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: 10 tests passing, clean lint, and a successful build. `/` is still `○ (Static)` with 15m revalidate.

If the build reports an SSR error from `@paper-design/shaders-react`, read `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`. Then load `Swirl` with `next/dynamic` and `{ ssr: false }` inside `SwirlHero.tsx`, keeping every prop the same.

- [ ] **Step 6: Verify behaviour in the browser (controller)**

Start `violetop-dev` and open `/` at 1440×900. Check the console. Expected: no errors or warnings from Paper Shaders.

Then run in the page:

```js
(async () => {
  const el = document.querySelector("#hero-section [data-paper-shader]");
  const mount = el?.paperShaderMount;
  const canvas = el?.querySelector("canvas");
  const f0 = mount.getCurrentFrame();
  await new Promise((r) => setTimeout(r, 1000));
  return { pixels: canvas.width * canvas.height, idleFramesPerSecond: Math.round(mount.getCurrentFrame() - f0) };
})()
```

Expected: `pixels` ≤ 1600000. `idleFramesPerSecond` ≈ 180 (1000 ms × 0.18), anywhere from 150 to 210.

Scroll the wheel down over the hero while repeating the sample (computer `scroll` then `javascript_tool` in one `browser_batch`). Expected: the 1-second delta is clearly higher (> 350) and returns to about 180 within about 2s of stopping.

Scroll to the footer and sample again. Expected: a delta of `0` (Paper pauses off-screen).

**Logo check:** at the very top of `/`, compare the header logo with `/events`. `getComputedStyle(document.querySelector("header img")).opacity` should be `"1"` on both, the "OP" should be purple, and the header class list contains `overlayHeader` but not `accentHeader`. Scroll past the hero and confirm the header gains its dark surface.

Screenshot the hero at 1440×900 and 390×844.

- [ ] **Step 7: Tune the look (controller, visual)**

Compare screenshots with the approved direction: soft purple bands sweeping diagonally across the panel (not a centered bullseye), lavender highlights visible but not blown out, and the mark clearly legible.

Adjust only these `Swirl` props and re-screenshot until it reads right:

| Prop | Range to explore |
|---|---|
| `scale` | 1.2–2.4 |
| `offsetX` / `offsetY` | −0.8 to 0.8 |
| `twist` | 0.15–0.6 |
| `bandCount` | 2–4 |
| `proportion` | 0.3–0.6 |
| `noise` | 0–0.3 |
| `swirlColors` | keep the four brand hues; only reorder or darken the first |

Keep `softness={1}`, `minPixelRatio={1}`, `maxPixelCount` and the speed constants unchanged. Re-run Step 5's commands after the final edit.

- [ ] **Step 8: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/package.json violetop/package-lock.json violetop/app/components/SwirlHero.tsx violetop/app/components/SwirlHero.module.css violetop/app/page.tsx
git -C /Users/bezzchen/Documents/violet-op commit -m "Replace the colorway banner with a scroll-reactive swirl hero

The banner stays in the repo, unmounted, so it can come back later.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: End-to-end verification

**Files:** none, unless a check fails. In that case fix the file the failing check points at and commit the fix with a message describing it.

- [ ] **Step 1: Full local checks**

Run from `violetop/`: `npm test && npm run lint && npm run build`
Expected: 10 passing tests, clean lint, and a successful build with the same routes as before.

- [ ] **Step 2: Every page, both widths (controller)**

With `violetop-dev` running, visit each route below at 1440×900 and 390×844:

- `/`, `/events`, `/join-us`, `/eboard`, `/highlights`, `/about-us`
- `/teams/valorant`, `/teams/league-of-legends`
- `/vop-white`, `/vop-purple`, `/vop-black`, `/ruby`, `/league1`, `/league2`

On each:
- read console errors (expected: none);
- screenshot;
- confirm rounded corners;
- confirm no horizontal scroll: `document.documentElement.scrollWidth <= innerWidth`.

- [ ] **Step 3: Main-thread health on the homepage (controller)**

On `/` at 1440×900 with the hero in view, run:

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

Expected: `longTasks: 0`, and `avgFrameMs` close to the display refresh interval (about 16.7 on 60 Hz, 8.3 on 120 Hz), with `worstFrameMs` < 50.

- [ ] **Step 4: Menus and navigation (controller)**

- At 1280×600, open **Teams**, wheel inside it (it scrolls, the page does not), then press Escape (it closes).
- At 390×844, open the mobile menu and expand Teams; the menu scrolls on its own.
- Click from `/` to a team page and back. The page starts at the top, and there are no console errors.

- [ ] **Step 5: Report**

Summarise results to the user with the homepage screenshots (hero top, What's Happening, mobile). If Step 1–4 required fixes, list each fix and its commit.

---

## As built

Changes made during review, after the tasks above were written:

- The `test` script also passes `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON`, which keeps the output free of Node's module-type notice.
- Four filled buttons that Task 2's tables missed now use `rounded-md`: the three `op-clip … bg-primary` buttons on Join Us and the E-Board submit button.
- `.overlayHeader .brandOp { text-shadow: none; }`: the overlay's text shadow was painting over the gradient-clipped "OP".
- Swirl tuning settled on `offsetX={0}`, `offsetY={0}` and `scale={1.25}`, which centres the vortex's dark eye behind the mark.
- The scroll boost is measured in px per ms:
  - `scrollSpeedPerMs(velocityPerFrame, frameMs)` was added, and `swirlTargetSpeed` now takes px per ms (full boost at 2.88).
  - The easing loop reads `lenis.velocity` live each frame, with non-finite guards.
  - There are 13 tests in total.
- The WebGL2 probe uses `failIfMajorPerformanceCaveat`.
- The mobile support grid resets to `grid-auto-rows: auto`.
- The Omen and Clove art is re-cropped from x 10.5% and 3.9% respectively.
