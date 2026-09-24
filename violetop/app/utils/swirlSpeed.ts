/** Resting drift of the homepage swirl, in shader time units per second (violetdiabolo drifts at 3). */
export const SWIRL_BASE_SPEED = 2;
/** Extra drift at full scroll speed; base plus boost is four times the base, the most that still reads as motion. */
export const SWIRL_MAX_BOOST = 6;

// Scroll speed (px per ms) that earns the full boost: 60 px per frame at 60 Hz, as in violetdiabolo.
const FULL_BOOST_PX_PER_MS = 3.6;
// Frame intervals are clamped so a first frame or a stalled tab can't spike or zero the boost.
const MIN_FRAME_MS = 2;
const MAX_FRAME_MS = 50;
// Easing time constants: quick to spin up, about a second to settle back.
const SPIN_UP_MS = 120;
const SETTLE_MS = 380;

/** Converts Lenis's per-frame velocity (px per frame) to px per ms, so the boost feels the same at any refresh rate. */
export function scrollSpeedPerMs(velocityPerFrame: number, frameMs: number): number {
  if (!Number.isFinite(velocityPerFrame) || !Number.isFinite(frameMs)) return 0;
  return Math.abs(velocityPerFrame) / Math.min(Math.max(frameMs, MIN_FRAME_MS), MAX_FRAME_MS);
}

/** Target spin speed for a scroll speed in px per ms; direction is ignored and non-finite input means no boost. */
export function swirlTargetSpeed(pxPerMs: number): number {
  if (!Number.isFinite(pxPerMs)) return SWIRL_BASE_SPEED;
  const intensity = Math.min(Math.abs(pxPerMs) / FULL_BOOST_PX_PER_MS, 1);
  return SWIRL_BASE_SPEED + intensity * SWIRL_MAX_BOOST;
}

/** Frame-rate independent exponential easing from the current speed toward the target. */
export function easeSwirlSpeed(current: number, target: number, elapsedMs: number): number {
  const timeConstant = target > current ? SPIN_UP_MS : SETTLE_MS;
  const blend = 1 - Math.exp(-Math.max(elapsedMs, 0) / timeConstant);
  return current + (target - current) * blend;
}
