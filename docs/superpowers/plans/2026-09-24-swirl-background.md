# Swirl Background, Section Cards & League Lane Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:**
- Replace the homepage's inset swirl hero with a fixed, full-page violetdiabolo ribbon background, with every homepage section as a solid or glass rounded card over it.
- Show lane icons for League players on their team pages.

**Architecture:**
- **Engine:** a small TypeScript WebGL1 module (`swirlGradient.ts`, ported from `/Users/bezzchen/Documents/violetdiabolo/src/gradient/`) and a frame-budget module (`swirlBudget.ts`).
- **Component:** a client component, `SwirlBackground`, mounted only on the homepage, runs them. It uses a 30 fps cap and half resolution, and drives the speed from the existing `swirlSpeed.ts` easing fed by Lenis velocity.
- **Cards:** the homepage sections become CSS-module cards.
- **Lane icons:** the inline SVG glyphs from commit `99190fd` return as `LaneIcon`, selected by a pure, unit-tested `laneRole()` mapper.

**Tech Stack:** Next.js 16.2.6 (Turbopack), React 19.2.4, TypeScript 5, CSS modules, `lenis` 1.3.23 (`lenis/react`), raw WebGL1, Node 22 `node --test` (`npm test`).

**Spec:** `docs/superpowers/specs/2026-09-24-swirl-background-design.md`

## Global Constraints

- **Scope:** homepage only. Other pages keep their backgrounds and layout.
- **Working directory:** run npm/node commands from `violetop/`, and git as `git -C /Users/bezzchen/Documents/violet-op …`. `app/…` and `public/…` paths are inside `violetop/`.
- **Next.js docs:** `violetop/AGENTS.md` applies. Read `violetop/node_modules/next/dist/docs/` before using any Next API not already in this repo.
- **Swirl pace:**
  - `SWIRL_BASE_SPEED = 2` shader-time units per second.
  - `SWIRL_MAX_BOOST = 6`, so the maximum is 4× the base.
  - Full boost at `3.6` px/ms.
- **Swirl budget:** `TARGET_FPS = 30`; `RENDER_SCALE = 0.5`, with the framebuffer at `max(1, dpr × 0.5)` per CSS pixel.
- **Palette (shader uniforms, 0–1):**
  - deep `[0.031, 0.024, 0.051]`
  - mid `[0.322, 0.118, 0.62]`
  - bright `[0.502, 0.141, 1.0]`
- **No-WebGL fallback:** `linear-gradient(126deg, #08060d 0%, #08060d 34%, #291e52 46%, #8024fe 52%, #291e52 58%, #08060d 72%, #08060d 100%)`. Before the first frame the canvas is plain `#08060d`.
- **Card tokens:**
  - gutter `clamp(12px, 3vw, 40px)`
  - gap `clamp(24px, 6vh, 64px)`
  - padding `clamp(40px, 5vw, 72px) clamp(24px, 4.5vw, 64px)` (`36px 20px` at ≤760px)
  - max width `1440px`
  - border `1px solid #ffffff12`
  - radius `var(--radius-xl)`
- **Card materials:**
  - solid `#0d0a14`
  - dark glass `rgb(11 8 18 / 80%)`
  - violet glass `rgb(37 21 56 / 76%)`
  - both glasses add `backdrop-filter: blur(22px) saturate(1.15)`
- **Reduced motion:** one still swirl frame and no loop. Lenis is already off.
- **Leave alone:** do not modify `app/components/VopIntroBanner.tsx` or `VopIntroBanner.module.css`.
- **Git hygiene:**
  - Never stage `.DS_Store`, `.claude/` or `.superpowers/`.
  - Stage by explicit path.
  - Never run `git restore`, `git checkout -- <file>`, `git reset`, `git stash`, or `git clean`.
- **Commits:** every commit message ends with the trailer line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Comments:** short and explanatory, matching the surrounding code.
- **Branch:** work on `homepage-swirl-background`, created from `main` before Task 1:

  ```bash
  git -C /Users/bezzchen/Documents/violet-op switch -c homepage-swirl-background
  ```

## File Map

| File | Change | Responsibility |
|---|---|---|
| `violetop/app/data/laneRoles.ts` (+ `.test.ts`) | Create | Roster role → lane |
| `violetop/app/components/LaneIcon.tsx` | Create | Five inline SVG lane glyphs |
| `violetop/app/[teamSlug]/page.tsx`, `TeamProfile.module.css` | Modify | Lane icons on League roster tiles |
| `violetop/app/utils/swirlBudget.ts` (+ `.test.ts`) | Create | 30 fps frame cap; half-resolution render size |
| `violetop/app/utils/swirlGradient.ts` | Create | WebGL program for the ribbon shader |
| `violetop/app/utils/swirlSpeed.ts` | Modify | New pace constants; drop `SWIRL_SPEED_EPSILON` |
| `violetop/app/components/SwirlBackground.tsx` (+ `.module.css`) | Create | Fixed canvas, render loop, fallbacks |
| `violetop/app/page.tsx`, `violetop/app/Home.module.css` | Modify | Mount the background, transparent hero, section cards |
| `violetop/app/components/SwirlHero.tsx` (+ `.module.css`) | Delete | Replaced |
| `violetop/package.json`, `package-lock.json` | Modify | Uninstall Paper Shaders |

---

### Task 1: League lane icons

**Files:**
- Create: `violetop/app/data/laneRoles.ts`, `violetop/app/data/laneRoles.test.ts`, `violetop/app/components/LaneIcon.tsx`
- Modify: `violetop/app/[teamSlug]/page.tsx`, `violetop/app/[teamSlug]/TeamProfile.module.css`

**Interfaces:**
- Produces:
  - `export type LaneRole = "Top" | "Jungle" | "Middle" | "Bottom" | "Support"`
  - `export function laneRole(role: string): LaneRole | null`
  - `export default function LaneIcon({ className, role }: { className?: string; role: LaneRole })`
- Consumes: `teamPages` entries (`game: "valorant" | "league"`; `roster: { name, username, role }[]`, where League roles are "Top", "Jungle", "Middle", "Bottom", "Support" and "Support / sub").

- [ ] **Step 1: Write the failing tests** — create `violetop/app/data/laneRoles.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { laneRole } from "./laneRoles.ts";

test("each roster lane maps to its icon", () => {
  assert.equal(laneRole("Top"), "Top");
  assert.equal(laneRole("Jungle"), "Jungle");
  assert.equal(laneRole("Middle"), "Middle");
  assert.equal(laneRole("Bottom"), "Bottom");
  assert.equal(laneRole("Support"), "Support");
});

test("a substitute keeps the lane they cover", () => {
  assert.equal(laneRole("Support / sub"), "Support");
});

test("short names and any casing are understood", () => {
  assert.equal(laneRole("mid"), "Middle");
  assert.equal(laneRole("ADC"), "Bottom");
  assert.equal(laneRole("  jungle "), "Jungle");
});

test("roles that are not a lane get no icon", () => {
  assert.equal(laneRole("IGL"), null);
  assert.equal(laneRole("player"), null);
  assert.equal(laneRole("sub"), null);
});
```

- [ ] **Step 2: Run to verify RED**

Run: `npm test`
Expected: the new file fails with `ERR_MODULE_NOT_FOUND` for `laneRoles.ts`; the 13 existing tests still pass.

- [ ] **Step 3: Implement** — create `violetop/app/data/laneRoles.ts`:

```ts
export type LaneRole = "Top" | "Jungle" | "Middle" | "Bottom" | "Support";

const laneAliases: Record<string, LaneRole> = {
  top: "Top",
  jungle: "Jungle",
  jg: "Jungle",
  middle: "Middle",
  mid: "Middle",
  bottom: "Bottom",
  bot: "Bottom",
  adc: "Bottom",
  support: "Support",
  supp: "Support",
};

/** The League lane a roster role names ("Support / sub" is Support), or null when it names none. */
export function laneRole(role: string): LaneRole | null {
  const lane = role.split("/")[0].trim().toLowerCase();
  return laneAliases[lane] ?? null;
}
```

- [ ] **Step 4: Run to verify GREEN**

Run: `npm test`
Expected: `# tests 17`, `# pass 17`, `# fail 0`. `npm test 2>&1 | grep -v "^> " | grep -c "Warning\|MODULE_TYPELESS"` prints `0`.

- [ ] **Step 5: Create `violetop/app/components/LaneIcon.tsx`** (the glyphs from commit `99190fd`):

```tsx
import type { ReactNode } from "react";
import type { LaneRole } from "../data/laneRoles";

// Inline SVGs keep these icons request-free and crisp at any size; they take the
// surrounding colour through currentColor.
const lanePaths: Record<LaneRole, ReactNode> = {
  Top: (
    <>
      <path d="M6 13.5l6-6 6 6" />
      <path d="M12 7.5V18" />
    </>
  ),
  Jungle: (
    <>
      <path d="M12 4l6 11H6z" />
      <path d="M12 15v4.5" />
    </>
  ),
  Middle: <path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z" />,
  Bottom: (
    <>
      <path d="M6 10.5l6 6 6-6" />
      <path d="M12 6V16.5" />
    </>
  ),
  Support: <path d="M12 4l6 2.4v5c0 3.8-2.6 6.6-6 7.6-3.4-1-6-3.8-6-7.6v-5z" />,
};

export default function LaneIcon({ className, role }: { className?: string; role: LaneRole }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      {lanePaths[role]}
    </svg>
  );
}
```

- [ ] **Step 6: Show the icons on League rosters** in `violetop/app/[teamSlug]/page.tsx`.

Replace:

```tsx
import PageShell from "../components/PageShell";
import { joinContent, siteMeta, teamPages } from "../data/siteContent";
```

with:

```tsx
import LaneIcon from "../components/LaneIcon";
import PageShell from "../components/PageShell";
import { laneRole } from "../data/laneRoles";
import { joinContent, siteMeta, teamPages } from "../data/siteContent";
```

Replace:

```tsx
              {team.roster.map((member, index) => (
                <article className={styles.member} key={`${member.name}-${member.username}-${index}`}>
                  <span aria-hidden="true" className={styles.avatar}>{initials(member.name)}</span>
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.username}</p>
                  </div>
                  <span className={styles.memberRole}>{displayRole(member.role)}</span>
                </article>
              ))}
```

with:

```tsx
              {team.roster.map((member, index) => {
                const lane = team.game === "league" ? laneRole(member.role) : null;
                return (
                  <article className={styles.member} key={`${member.name}-${member.username}-${index}`}>
                    <span aria-hidden="true" className={styles.avatar}>
                      {lane ? <LaneIcon className={styles.laneIcon} role={lane} /> : initials(member.name)}
                    </span>
                    <div>
                      <h3>{member.name}</h3>
                      <p>{member.username}</p>
                    </div>
                    <span className={styles.memberRole}>{displayRole(member.role)}</span>
                  </article>
                );
              })}
```

In `violetop/app/[teamSlug]/TeamProfile.module.css`, directly after the line that starts `.avatar { display: flex; flex: 0 0 42px;`, add:

```css
.laneIcon { width: 24px; height: 24px; color: var(--team-accent); }
```

- [ ] **Step 7: Lint and build**

Run: `npm run lint && npm run build`
Expected: clean lint, and a successful build that still lists `/league1` and `/league2` among the `/[teamSlug]` paths.

- [ ] **Step 8: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/data/laneRoles.ts violetop/app/data/laneRoles.test.ts violetop/app/components/LaneIcon.tsx "violetop/app/[teamSlug]/page.tsx" "violetop/app/[teamSlug]/TeamProfile.module.css"
git -C /Users/bezzchen/Documents/violet-op commit -m "Show lane icons for League players on their team pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Swirl engine (ported violetdiabolo shader and frame budget)

**Files:**
- Create: `violetop/app/utils/swirlBudget.ts`, `violetop/app/utils/swirlBudget.test.ts`, `violetop/app/utils/swirlGradient.ts`

**Interfaces:**
- Produces (used by Task 3):
  - `export const SWIRL_TARGET_FPS = 30`
  - `export const SWIRL_RENDER_SCALE = 0.5`
  - `export function createFrameCap(fps?: number): (deltaSeconds: number) => number`. It returns the accumulated seconds to render with, or 0 to skip.
  - `export function swirlRenderSize(cssWidth: number, cssHeight: number, dpr?: number): { width: number; height: number }`
  - `export type SwirlGradient = { render(elapsedSeconds: number, rate: number): void; resize(width: number, height: number): void; dispose(): void }`
  - `export function createSwirlGradient(canvas: HTMLCanvasElement): SwirlGradient | null`

- [ ] **Step 1: Write the failing tests** — create `violetop/app/utils/swirlBudget.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { createFrameCap, swirlRenderSize } from "./swirlBudget.ts";

test("the frame cap skips frames until a 30 fps interval has passed", () => {
  const cap = createFrameCap(30);
  assert.equal(cap(0.02), 0);
  assert.ok(Math.abs(cap(0.02) - 0.04) < 1e-12);
});

test("the frame cap hands over all the time that accumulated, then starts again", () => {
  const cap = createFrameCap(30);
  cap(0.01);
  cap(0.01);
  cap(0.01);
  assert.ok(Math.abs(cap(0.01) - 0.04) < 1e-12);
  assert.equal(cap(0.01), 0);
});

test("the swirl renders at half the device resolution", () => {
  assert.deepEqual(swirlRenderSize(1440, 900, 2), { width: 1440, height: 900 });
  assert.deepEqual(swirlRenderSize(390, 844, 3), { width: 585, height: 1266 });
});

test("render size never drops below one pixel per CSS pixel", () => {
  assert.deepEqual(swirlRenderSize(1280, 720, 1), { width: 1280, height: 720 });
});
```

- [ ] **Step 2: Run to verify RED**

Run: `npm test`
Expected: `swirlBudget.test.ts` fails with `ERR_MODULE_NOT_FOUND`; the other 17 tests pass.

- [ ] **Step 3: Implement** — create `violetop/app/utils/swirlBudget.ts`:

```ts
/** The swirl drifts slowly, so 30 fps reads the same as 60 and halves the frames drawn. */
export const SWIRL_TARGET_FPS = 30;
/** Fragment work scales with pixel count, so half the linear resolution is a quarter of the work. */
export const SWIRL_RENDER_SCALE = 0.5;

/**
 * Accumulates frame time and returns the seconds to render with, or 0 to skip the frame.
 * It hands back everything that accumulated, so the swirl still moves in real time.
 */
export function createFrameCap(fps = SWIRL_TARGET_FPS) {
  const interval = 1 / fps;
  let accumulated = 0;
  return (deltaSeconds: number) => {
    accumulated += deltaSeconds;
    if (accumulated < interval) return 0;
    const elapsed = accumulated;
    accumulated = 0;
    return elapsed;
  };
}

/** Framebuffer size for a canvas of the given CSS size, never below one pixel per CSS pixel. */
export function swirlRenderSize(cssWidth: number, cssHeight: number, dpr = 1) {
  const scale = Math.max(1, dpr * SWIRL_RENDER_SCALE);
  return { width: Math.round(cssWidth * scale), height: Math.round(cssHeight * scale) };
}
```

- [ ] **Step 4: Run to verify GREEN**

Run: `npm test`
Expected: `# tests 21`, `# pass 21`, `# fail 0`, and no warnings (the same grep as Task 1 prints `0`).

- [ ] **Step 5: Create `violetop/app/utils/swirlGradient.ts`** (WebGL only runs in the browser; Task 3 verifies it there):

```ts
// The homepage swirl: violetdiabolo's ribbon shader (the club's sister site), ported.

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_deep;
uniform vec3 u_mid;
uniform vec3 u_bright;

// Ashima Arts' 2D simplex noise (MIT).
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// One ribbon: a bright core inside a soft, wide falloff to black.
float ribbon(float d, float w) {
  float f = 1.0 - smoothstep(0.0, w, abs(d));
  float f2 = f * f;
  return f2 * (0.42 + 0.58 * f2 * f2);
}

void main() {
  // Centred before the aspect correction, so a narrower screen sees less of the same pattern.
  vec2 p = gl_FragCoord.xy / u_resolution - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time;

  // Ribbons run about 36 degrees above horizontal, bottom-left to top-right.
  float a = 0.95;
  mat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a));
  vec2 q = rot * p;

  // Two warp octaves drifting against each other turn straight bands into swirls.
  float w1 = snoise(q * 0.80 + vec2(0.0, t * 0.055));
  float w2 = snoise(q * 1.90 - vec2(t * 0.031, 0.0));
  float warped = q.x + w1 * 0.32 + w2 * 0.14;

  // Three ribbons combined with max(), so overlaps never flatten into a plateau.
  float band = 0.0;
  band = max(band, ribbon(warped + 0.62, 0.30) * 0.85);
  band = max(band, ribbon(warped - 0.02, 0.34) * 1.00);
  band = max(band, ribbon(warped - 0.72, 0.26) * 0.62);

  // Ribbons swell and fade along their length.
  band *= 0.52 + 0.48 * (0.5 + 0.5 * w1);

  vec3 col = mix(u_deep, u_mid, smoothstep(0.0, 1.0, band));
  col = mix(col, u_bright, smoothstep(0.45, 1.0, band));

  gl_FragColor = vec4(col, 1.0);
}
`;

// Near-black ground, then two violets; the shader mixes through them in this order.
const PALETTE = {
  deep: [0.031, 0.024, 0.051],
  mid: [0.322, 0.118, 0.62],
  bright: [0.502, 0.141, 1.0],
} as const;

export type SwirlGradient = {
  /** Advances the swirl by `elapsedSeconds` at `rate` shader-time units per second, then draws. */
  render(elapsedSeconds: number, rate: number): void;
  /** Sets the framebuffer size. This clears the canvas, so draw again afterwards. */
  resize(width: number, height: number): void;
  dispose(): void;
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error("[swirl] shader failed to compile:", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  if (vertex) gl.deleteShader(vertex);
  if (fragment) gl.deleteShader(fragment);
  if (!program) return null;
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error("[swirl] program failed to link:", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

/** Sets up the swirl on a canvas, or returns null when WebGL is missing or software-rendered. */
export function createSwirlGradient(canvas: HTMLCanvasElement): SwirlGradient | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "low-power",
    stencil: false,
  });
  if (!gl) return null;
  const program = createProgram(gl);
  if (!program) return null;
  gl.useProgram(program);

  // Two triangles covering clip space: the whole geometry.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const timeUniform = uniform("u_time");
  const resolutionUniform = uniform("u_resolution");
  gl.uniform3f(uniform("u_deep"), ...PALETTE.deep);
  gl.uniform3f(uniform("u_mid"), ...PALETTE.mid);
  gl.uniform3f(uniform("u_bright"), ...PALETTE.bright);

  let time = 0;

  return {
    render(elapsedSeconds, rate) {
      time += elapsedSeconds * rate;
      gl.uniform1f(timeUniform, time);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    resize(width, height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
```

- [ ] **Step 6: Lint and build**

Run: `npm run lint && npm run build`
Expected: clean lint and a successful build. Nothing imports `swirlGradient.ts` yet; it must still type-check.

- [ ] **Step 7: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/utils/swirlBudget.ts violetop/app/utils/swirlBudget.test.ts violetop/app/utils/swirlGradient.ts
git -C /Users/bezzchen/Documents/violet-op commit -m "Port violetdiabolo's ribbon shader and frame budget

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The swirl becomes the homepage background

**Files:**
- Modify: `violetop/app/utils/swirlSpeed.ts`, `violetop/app/page.tsx`, `violetop/app/Home.module.css`, `violetop/package.json`, `violetop/package-lock.json`
- Create: `violetop/app/components/SwirlBackground.tsx`, `violetop/app/components/SwirlBackground.module.css`
- Delete: `violetop/app/components/SwirlHero.tsx`, `violetop/app/components/SwirlHero.module.css`

**Interfaces:**
- Consumes:
  - From Task 2: `createFrameCap`, `swirlRenderSize` (`../utils/swirlBudget`) and `createSwirlGradient` (`../utils/swirlGradient`).
  - `easeSwirlSpeed`, `scrollSpeedPerMs`, `SWIRL_BASE_SPEED`, `swirlTargetSpeed` (`../utils/swirlSpeed`).
  - `usePrefersReducedMotion` (`../hooks/usePrefersReducedMotion`) and `useLenis` (`lenis/react`; the root instance comes from `SmoothScroll` in the layout).
  - `BrandLogo` (`./components/BrandLogo`, props `className?`, `priority?`) and `<Header overlay />` (fades its surface in as `#hero-section` scrolls away).
- Produces: `export default function SwirlBackground()`, a fixed full-viewport `<canvas>`.

- [ ] **Step 1: Retune the pace in `violetop/app/utils/swirlSpeed.ts`**

Replace:

```ts
/** Resting spin speed of the homepage swirl, in Paper Shaders speed units. */
export const SWIRL_BASE_SPEED = 0.18;
/** Extra speed at full scroll speed; base plus boost is about six times the base. */
export const SWIRL_MAX_BOOST = 0.9;
/** Below this gap the eased speed snaps to its target and the easing loop stops. */
export const SWIRL_SPEED_EPSILON = 0.002;

// Scroll speed (px per ms) that earns the full boost: a brisk wheel flick, 48 px per frame at 60 Hz.
const FULL_BOOST_PX_PER_MS = 2.88;
```

with:

```ts
/** Resting drift of the homepage swirl, in shader time units per second (violetdiabolo drifts at 3). */
export const SWIRL_BASE_SPEED = 2;
/** Extra drift at full scroll speed; base plus boost is four times the base, the most that still reads as motion. */
export const SWIRL_MAX_BOOST = 6;

// Scroll speed (px per ms) that earns the full boost: 60 px per frame at 60 Hz, as in violetdiabolo.
const FULL_BOOST_PX_PER_MS = 3.6;
```

Run `npm test`. Expected: all 21 still pass, because the speed tests are written against the constants.

- [ ] **Step 2: Create `violetop/app/components/SwirlBackground.module.css`**

```css
/* Fixed behind the homepage. Plain near-black until the first frame, so nothing flashes. */
.canvas {
  position: fixed;
  z-index: 0;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: #08060d;
  pointer-events: none;
}

/* Without WebGL: one still ribbon in the same three violets the shader mixes. */
.canvas[data-fallback] {
  background: linear-gradient(126deg, #08060d 0%, #08060d 34%, #291e52 46%, #8024fe 52%, #291e52 58%, #08060d 72%, #08060d 100%);
}
```

- [ ] **Step 3: Create `violetop/app/components/SwirlBackground.tsx`**

```tsx
"use client";

import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { createFrameCap, swirlRenderSize } from "../utils/swirlBudget";
import { createSwirlGradient } from "../utils/swirlGradient";
import { easeSwirlSpeed, scrollSpeedPerMs, SWIRL_BASE_SPEED, swirlTargetSpeed } from "../utils/swirlSpeed";
import styles from "./SwirlBackground.module.css";

// Frame length assumed for the first frame, before a real interval exists.
const FALLBACK_FRAME_MS = 1000 / 60;
// Longest step the swirl takes in one frame, so waking from a stalled tab doesn't lurch.
const MAX_STEP_MS = 100;

/** The homepage's animated backdrop: violetdiabolo's ribbons, drifting faster while the page scrolls. */
export default function SwirlBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenisRef = useRef<Lenis | undefined>(undefined);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gradient = createSwirlGradient(canvas);
    if (!gradient) {
      canvas.dataset.fallback = "";
      return;
    }

    let speed = SWIRL_BASE_SPEED;
    const fit = () => {
      const { width, height } = swirlRenderSize(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1);
      gradient.resize(width, height);
      gradient.render(0, speed);
    };
    fit();
    window.addEventListener("resize", fit);

    // Reduced motion keeps the still frame fit() drew (repainted on resize) and runs no loop.
    if (prefersReducedMotion) {
      return () => {
        window.removeEventListener("resize", fit);
        gradient.dispose();
      };
    }

    const cap = createFrameCap();
    let frame = 0;
    let lastTime = 0;

    const step = (time: number) => {
      const frameMs = lastTime ? Math.min(time - lastTime, MAX_STEP_MS) : 0;
      lastTime = time;
      const velocity = lenisRef.current?.velocity ?? 0;
      const target = swirlTargetSpeed(scrollSpeedPerMs(velocity, frameMs || FALLBACK_FRAME_MS));
      speed = easeSwirlSpeed(speed, target, frameMs);
      const elapsed = cap(frameMs / 1000);
      if (elapsed) gradient.render(elapsed, speed);
      frame = requestAnimationFrame(step);
    };
    const start = () => {
      if (frame || document.hidden) return;
      lastTime = 0;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    // Hidden tabs draw nothing: the loop is cancelled, not idled.
    const onVisibilityChange = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", fit);
      gradient.dispose();
    };
  }, [prefersReducedMotion]);

  return <canvas aria-hidden="true" className={styles.canvas} ref={canvasRef} />;
}
```

- [ ] **Step 4: Mount it and make the hero transparent** in `violetop/app/page.tsx`.

Replace:

```tsx
import Footer from "./components/Footer";
import Header from "./components/Header";
import SwirlHero from "./components/SwirlHero";
```

with:

```tsx
import BrandLogo from "./components/BrandLogo";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SwirlBackground from "./components/SwirlBackground";
```

Replace:

```tsx
      {/* The colorway banner (VopIntroBanner) is stashed; render it in place of these two to restore it. */}
      <Header overlay />
      <SwirlHero />
      <main className={styles.page} id="main-content" tabIndex={-1}>
```

with:

```tsx
      <SwirlBackground />
      {/* The colorway banner (VopIntroBanner) is stashed; render it in place of the header and hero section to restore it. */}
      <Header overlay />
      <section aria-labelledby="hero-title" className={styles.hero} id="hero-section">
        <h1 className={styles.screenReaderOnly} id="hero-title">Violet OP</h1>
        <div aria-hidden="true" className={styles.heroMark}>
          <BrandLogo className={styles.heroMarkImage} priority />
        </div>
      </section>
      <main className={styles.page} id="main-content" tabIndex={-1}>
```

- [ ] **Step 5: Styles in `violetop/app/Home.module.css`**

Replace:

```css
  overflow: clip;
  background: var(--site-bg);
```

with:

```css
  overflow: clip;
  background: transparent;
```

Directly after the line `.page :is(section, article)[id] { scroll-margin-top: 84px; }`, insert:

```css
/* The first screen is the swirl itself: no card, just the mark over the ribbons. */
.hero { position: relative; z-index: 1; display: grid; place-items: center; height: clamp(420px, 62vh, 680px); }
.heroMark { width: clamp(112px, 13vw, 176px); aspect-ratio: 896 / 802; filter: drop-shadow(0 0 30px #8024ff99) drop-shadow(0 12px 28px #000000b3); }
.heroMarkImage { display: block; width: 100%; height: 100%; object-fit: contain; }
.screenReaderOnly { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
```

Inside `@media (max-width: 760px)`, directly after `  .page :is(section, article)[id] { scroll-margin-top: 76px; }`, insert:

```css
  .hero { height: clamp(340px, 54vh, 520px); }
```

- [ ] **Step 6: Remove the old hero and Paper Shaders**

```bash
git -C /Users/bezzchen/Documents/violet-op rm violetop/app/components/SwirlHero.tsx violetop/app/components/SwirlHero.module.css
npm uninstall @paper-design/shaders-react @paper-design/shaders
```

Then confirm nothing still references them: `grep -rn "SwirlHero\|paper-design\|SWIRL_SPEED_EPSILON" app`. Expected: no output.

- [ ] **Step 7: Test, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: 21 passing tests with no warnings, clean lint, and a successful build with `/` still `○ (Static)`.

- [ ] **Step 8: Verify in the browser (controller)**

On `/`, check the console. Expected: no errors or `[swirl]` messages.

Then run in the page:

```js
(async () => {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl");
  const program = gl.getParameter(gl.CURRENT_PROGRAM);
  const location = gl.getUniformLocation(program, "u_time");
  const values = new Set();
  const t0 = gl.getUniform(program, location);
  const start = performance.now();
  await new Promise((resolve) => {
    const tick = () => { values.add(gl.getUniform(program, location)); performance.now() - start < 1000 ? requestAnimationFrame(tick) : resolve(); };
    requestAnimationFrame(tick);
  });
  return {
    framebuffer: `${canvas.width}x${canvas.height}`,
    css: `${canvas.clientWidth}x${canvas.clientHeight}`,
    dpr: devicePixelRatio,
    ratePerSecond: +(gl.getUniform(program, location) - t0).toFixed(2),
    drawsPerSecond: values.size,
  };
})()
```

Expected:
- `framebuffer` = `css` × `max(1, dpr/2)`.
- `ratePerSecond` ≈ 2 (1.8–2.2).
- `drawsPerSecond` ≈ 30 (26–32).

Repeat while scrolling with the wheel. Expected: `ratePerSecond` clearly above 2 during the scroll, at most about 8, and back to about 2 within about 2 s.

Finally, screenshot the top of `/` and confirm the header is transparent over the swirl and turns solid after the hero.

- [ ] **Step 9: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/utils/swirlSpeed.ts violetop/app/components/SwirlBackground.tsx violetop/app/components/SwirlBackground.module.css violetop/app/page.tsx violetop/app/Home.module.css violetop/package.json violetop/package-lock.json
git -C /Users/bezzchen/Documents/violet-op commit -m "Make the violetdiabolo swirl the homepage background

Replaces the Paper Shaders hero; the ribbons drift at 2 units/s (violetdiabolo
uses 3) and speed up to 4x while scrolling.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(The `git rm` in Step 6 already staged the two deletions.)

---

### Task 4: Homepage sections become cards

**Files:**
- Modify: `violetop/app/Home.module.css`, `violetop/app/page.tsx`

**Interfaces:**
- Consumes: `--radius-xl` (global, 18px), and the transparent `.page` from Task 3.
- Produces: classes `.section` (the card), `.solidCard`, `.glassCard` and `.violetCard`.

- [ ] **Step 1: Card tokens and materials in `violetop/app/Home.module.css`**

Replace:

```css
  --accent: #cfaff3;
```

with:

```css
  --accent: #cfaff3;
  --card-gutter: clamp(12px, 3vw, 40px);
  --card-gap: clamp(24px, 6vh, 64px);
```

Replace:

```css
.section { width: min(100% - 64px, 1380px); margin: 0 auto; padding: clamp(78px, 7vw, 116px) 0; }
```

with:

```css
/* Every section is a card over the swirl; the gaps between cards are where it shows through. */
.section {
  width: min(100% - 2 * var(--card-gutter), 1440px);
  margin: 0 auto var(--card-gap);
  padding: clamp(40px, 5vw, 72px) clamp(24px, 4.5vw, 64px);
  border: 1px solid #ffffff12;
  border-radius: var(--radius-xl);
}
.solidCard { background: #0d0a14; }
/* Glass blurs the swirl so a ribbon reads as colour behind the text, not as an edge. */
.glassCard, .violetCard { -webkit-backdrop-filter: blur(22px) saturate(1.15); backdrop-filter: blur(22px) saturate(1.15); }
.glassCard { background: rgb(11 8 18 / 80%); }
.violetCard { background: rgb(37 21 56 / 76%); }
```

- [ ] **Step 2: Drop the old section dividers and the full-bleed closing band**

In `violetop/app/Home.module.css`:
- Delete the line `.teamsSection { padding-top: 90px; border-top: 1px solid var(--site-border); }`.
- Delete the line `.pathsSection { border-top: 1px solid var(--site-border); }`.
- Delete the line `.faqSection { border-top: 1px solid var(--site-border); }`.
- In the `.communitySection { … }` line, remove ` border-top: 1px solid var(--site-border);`. The line becomes `.communitySection { display: grid; grid-template-columns: .95fr 1.05fr; gap: clamp(45px, 8vw, 130px); align-items: center; }`.
- Replace the `.closing { … }` line with `.closing { display: grid; grid-template-columns: 1.25fr .75fr; gap: 65px; align-items: end; }`.
- Inside `@media (max-width: 760px)`:
  - Replace `  .section { width: min(100% - 36px, 680px); padding: 74px 0; }` with `  .section { padding: 36px 20px; }`.
  - Delete `  .teamsSection { padding-top: 74px; }`.
  - Replace `  .closing { display: block; padding: 69px 22px; }` with `  .closing { display: block; }`.

- [ ] **Step 3: Give each section its material** in `violetop/app/page.tsx`

| Old | New |
|---|---|
| `className={styles.section} id="latest"` | ``className={`${styles.section} ${styles.glassCard}`} id="latest"`` |
| ``className={`${styles.section} ${styles.teamsSection}`}`` | ``className={`${styles.section} ${styles.solidCard}`}`` |
| ``className={`${styles.section} ${styles.pathsSection}`}`` | ``className={`${styles.section} ${styles.violetCard}`}`` |
| ``className={`${styles.section} ${styles.communitySection}`}`` | ``className={`${styles.section} ${styles.solidCard} ${styles.communitySection}`}`` |
| ``className={`${styles.section} ${styles.faqSection}`}`` | ``className={`${styles.section} ${styles.glassCard}`}`` |
| `className={styles.closing} id="cta-section"` | ``className={`${styles.section} ${styles.solidCard} ${styles.closing}`} id="cta-section"`` |

Then confirm no stale class remains: `grep -n "teamsSection\|pathsSection\|faqSection" app/page.tsx app/Home.module.css`. Expected: no output.

- [ ] **Step 4: Lint and build**

Run: `npm run lint && npm run build`
Expected: clean lint and a successful build.

- [ ] **Step 5: Verify in the browser (controller)**

At 1440×900 and 407×454, on `/`:
- `document.documentElement.scrollWidth <= innerWidth`.
- The six sections compute `border-top-left-radius: 18px`.
- `backdrop-filter` is set on exactly the three glass cards (What's Happening, More Than One Way In, FAQ).
- The event cards still align (Task 3 of the previous plan's alignment script).

Screenshot the page top to bottom, and confirm text on glass cards is legible over the ribbons.

- [ ] **Step 6: Commit**

```bash
git -C /Users/bezzchen/Documents/violet-op add violetop/app/Home.module.css violetop/app/page.tsx
git -C /Users/bezzchen/Documents/violet-op commit -m "Turn the homepage sections into solid and glass cards over the swirl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: End-to-end verification (controller)

**Files:** none, unless a check fails. In that case fix the file it points at and commit with a descriptive message.

- [ ] **Step 1:** `npm test && npm run lint && npm run build` from `violetop/`. Expected: 21 tests passing with pristine output, clean lint, and a successful build.
- [ ] **Step 2:** On `/` at both widths:
  - No console errors.
  - 0 long tasks over 3 s with the swirl running.
  - An average frame near the refresh interval (the previous plan's Task 8 Step 3 script).
- [ ] **Step 3:** `/league1` and `/league2` show an SVG lane icon in every roster tile. `/vop-white` shows initials. No overflow at either width.
- [ ] **Step 4:** The other pages (`/events`, `/join-us`, `/about-us`, `/teams/valorant`) have no `canvas` and look unchanged.
- [ ] **Step 5:** Report to the user with screenshots (homepage top, cards, a League roster).
