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
