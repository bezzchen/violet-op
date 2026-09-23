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
