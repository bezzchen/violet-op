/** Resting spin speed of the homepage swirl, in Paper Shaders speed units. */
export const SWIRL_BASE_SPEED = 0.18;
/** Extra speed at full scroll speed; base plus boost is about six times the base. */
export const SWIRL_MAX_BOOST = 0.9;
/** Below this gap the eased speed snaps to its target and the easing loop stops. */
export const SWIRL_SPEED_EPSILON = 0.002;

// Scroll speed (px per ms) that earns the full boost: a brisk wheel flick, 48 px per frame at 60 Hz.
const FULL_BOOST_PX_PER_MS = 2.88;
// Frame intervals are clamped so a first frame or a stalled tab can't spike or zero the boost.
const MIN_FRAME_MS = 4;
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
