/** The swirl drifts slowly, so 30 fps reads the same as 60 and halves the frames drawn. */
export const SWIRL_TARGET_FPS = 30;
/** Fragment work scales with pixel count, so half the linear resolution is a quarter of the work. */
export const SWIRL_RENDER_SCALE = 0.5;

/** Frame timestamps jitter around vsync, so two 60 Hz frames can add up to a hair under 1/30 s. */
const FRAME_JITTER_SECONDS = 0.002;

/**
 * Accumulates frame time and returns the seconds to render with, or 0 to skip the frame.
 * It hands back everything that accumulated, so the swirl still moves in real time.
 */
export function createFrameCap(fps = SWIRL_TARGET_FPS) {
  const interval = 1 / fps - FRAME_JITTER_SECONDS;
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
