"use client";

import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { createFrameCap, swirlRenderSize } from "../utils/swirlBudget";
import { createSwirlGradient, type SwirlGradient } from "../utils/swirlGradient";
import { easeSwirlSpeed, scrollSpeedPerMs, SWIRL_BASE_SPEED, swirlTargetSpeed } from "../utils/swirlSpeed";
import styles from "./SwirlBackground.module.css";

// Frame length assumed for the first frame, before a real interval exists.
const FALLBACK_FRAME_MS = 1000 / 60;
// Longest step the swirl takes in one frame, so waking from a stalled tab doesn't lurch.
const MAX_STEP_MS = 100;

/** The homepage's animated backdrop: violetdiabolo's ribbons, drifting faster while the page scrolls. */
export default function SwirlBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<SwirlGradient | null>(null);
  const lenisRef = useRef<Lenis | undefined>(undefined);
  const speedRef = useRef(SWIRL_BASE_SPEED);
  // Bumped when the browser restores a lost WebGL context, so both effects rebuild on it.
  const [contextGeneration, setContextGeneration] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // The GPU side, built once per visit (and again after a context restore). It doesn't depend on
  // reduced motion, so hydration's reduced-motion re-render doesn't rebuild the program.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gradient = createSwirlGradient(canvas);
    if (!gradient) {
      canvas.dataset.fallback = "";
      return;
    }
    delete canvas.dataset.fallback;
    gradientRef.current = gradient;

    // Refits the framebuffer and repaints at once; under reduced motion this is the still frame.
    const fit = () => {
      const { width, height } = swirlRenderSize(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1);
      gradient.resize(width, height);
      gradient.render(0, speedRef.current);
    };
    // Mobile browsers drop a backgrounded tab's GPU context. preventDefault() lets the browser
    // restore it; until then the canvas shows the still CSS ribbon.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      gradientRef.current = null;
      canvas.dataset.fallback = "";
    };
    const onContextRestored = () => setContextGeneration((generation) => generation + 1);

    fit();
    window.addEventListener("resize", fit);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    return () => {
      window.removeEventListener("resize", fit);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gradientRef.current = null;
      // Leaving the page frees the context now; a re-run on the same, still-attached canvas keeps it.
      gradient.dispose({ releaseContext: !canvas.isConnected });
    };
  }, [contextGeneration]);

  // The motion: nothing under reduced motion (the still frame stays), otherwise the capped rAF loop.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const cap = createFrameCap();
    let frame = 0;
    let lastTime = 0;

    const step = (time: number) => {
      const gradient = gradientRef.current;
      // The fallback, or a lost context: stop until an effect run starts the loop again.
      if (!gradient) {
        frame = 0;
        return;
      }
      const frameMs = lastTime ? Math.min(time - lastTime, MAX_STEP_MS) : 0;
      lastTime = time;
      const velocity = lenisRef.current?.velocity ?? 0;
      const target = swirlTargetSpeed(scrollSpeedPerMs(velocity, frameMs || FALLBACK_FRAME_MS));
      speedRef.current = easeSwirlSpeed(speedRef.current, target, frameMs);
      const elapsed = cap(frameMs / 1000);
      if (elapsed) gradient.render(elapsed, speedRef.current);
      frame = requestAnimationFrame(step);
    };
    const start = () => {
      if (frame || document.hidden || !gradientRef.current) return;
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
    };
  }, [prefersReducedMotion, contextGeneration]);

  return <canvas aria-hidden="true" className={styles.canvas} ref={canvasRef} />;
}
