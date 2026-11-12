# NYU Violet OP

The community and collegiate esports website for Violet OP at New York University.

[Visit the live website](https://www.violet-op.com/) · [Christopher He's project case study](https://chrismhe.com/projects/violet-op/)

## What the website does

- Brings club events and player match schedules into one place.
- Presents VALORANT and League of Legends teams and player profiles.
- Helps visitors find community, team recruitment, and staff opportunities.
- Publishes event photo galleries, community videos, and match highlights.
- Includes motion effects with reduced-motion support and rendering-budget utilities.

## Project and contributor context

This is a shared Violet OP project hosted in `bezzchen/violet-op`.

[Christopher He](https://github.com/christophermengzihe-maker) contributes website design, development, and maintenance as the club's webmaster. His [personal portfolio](https://chrismhe.com/) includes this project, Morgan Real Estate & Financial, and his events and community work.

See the repository history for individual code contributions.

## Development

The Next.js, React, and TypeScript application lives in `violetop/`.

```bash
cd violetop
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm test
npm run build
```

Run these commands from `violetop/`. The test suite includes event grouping, event artwork, main-event selection, lane roles, and animation timing and rendering budgets.

## Repository guide

| Path | Purpose |
| --- | --- |
| `violetop/app/` | Pages, shared components, styles, and API routes |
| `violetop/app/data/` | Team and event content, media metadata, and related tests |
| `violetop/app/lib/ical.ts` | Calendar parsing |
| `violetop/app/utils/` | Motion and rendering utilities |
| `violetop/public/` | Images, video, and other public assets |
| `violetop/docs/event-media.md` | Event media workflow |

Project assets include club media and third-party game artwork; their presence here does not imply unrestricted reuse.
