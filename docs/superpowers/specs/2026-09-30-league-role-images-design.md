# League Role Images — Design

**Date:** 2026-09-30
**Status:** Approved in chat
**App:** `violetop/` (Next.js 16.2, React 19.2, CSS modules)

## Goal

League roster tiles show Riot's official position icons, the set the user provided in June, as image files tinted to each team's accent.

## History

| Date | Commit | What happened |
|---|---|---|
| 2026-06-10 | `99190fd` | The first lane icons were hand-drawn glyphs: an arrow, a diamond and a shield. |
| 2026-06-10 | `88cd4d2` | "Redraw League lane icons to match the official position icons": an intermediate hand redraw. |
| 2026-06-10 | `f8d29bc` | "Use the provided official-style SVGs for League lane icons". The artwork was inlined into the team page so it recoloured to the team accent. |
| 2026-09-18 | `ccbd424` | Removed them. |
| 2026-09-23 | `f9f6d59` | Restored the older `99190fd` glyphs by mistake. |

- The provided files no longer exist on disk.
- The artwork survives verbatim in history, identical from `f8d29bc` through `d03c492`.

## Assets

`violetop/public/images/lanes/`, one file per role:

| File | Size |
|---|---|
| `top.svg` | 478 B |
| `jungle.svg` | 775 B |
| `middle.svg` | 564 B |
| `bottom.svg` | 550 B |
| `support.svg` | 899 B |

- They are written from the `lanePaths` block at `d03c492`, with every `d` attribute unchanged.
- The frame paths keep `opacity="0.375"`.
- Each file has `viewBox="0 0 136 136"` and `fill="#fff"`.
- These are the original artwork restored, not new drawings.

## Rendering

- `app/components/LaneIcon.tsx` keeps its API, `LaneIcon({ className, role })`. It now renders a decorative `<span aria-hidden="true">` instead of an inline `<svg>`.
  - The span's mask is its role's file, `url("/images/lanes/${role.toLowerCase()}.svg")`, set inline as `maskImage` and `WebkitMaskImage`.
  - It is filled with `currentColor`, so it takes the team accent from `color`.
  - The mask reads the files' alpha, which keeps the two-tone look (the frame shows at 37.5%).
- `app/components/LaneIcon.module.css` gets a `.icon` class: `display: inline-block`, `flex: none`, `background-color: currentColor`, and mask position `center`, size `contain` and repeat `no-repeat`, each with its `-webkit-` form.
- **Size:** 28px, as in June (`h-7 w-7`). `.laneIcon` in `app/[teamSlug]/TeamProfile.module.css` goes from `24px` to `28px`. Its `color: var(--team-accent)` stays.
- The old inline glyph paths are removed.

## Unchanged

- The `laneRole()` mapping: Top, Jungle, Middle, Bottom, Support and their aliases, with "Support / sub" still mapping to Support.
- The tile size and background.
- Valorant rosters and staff tiles keep their initials.

## Tests

- A `laneRoles` test checks that every lane role has `public/images/lanes/<role>.svg`, with the role in lower case.
- It also checks that each file has `viewBox="0 0 136 136"`.

## Verification

- `npm test`, `npm run lint` and `npm run build` are clean, and the routes stay static.
- **Browser, at 1440 and 407 wide:**
  - Every roster tile on `/league1` (5 tiles) and `/league2` (6 tiles) shows its official icon at 28px.
  - The icons are tinted to each team's accent (`#80dcd1` and `#bcdd75`) and keep the two-tone frame.
  - Each `/images/lanes/*.svg` returns 200.
  - `/vop-white` still shows initials.
  - Take screenshots.
