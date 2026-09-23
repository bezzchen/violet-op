"use client";

import type { PaperShaderElement } from "@paper-design/shaders";
import { Swirl } from "@paper-design/shaders-react";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { easeSwirlSpeed, scrollSpeedPerMs, SWIRL_BASE_SPEED, SWIRL_SPEED_EPSILON, swirlTargetSpeed } from "../utils/swirlSpeed";
import BrandLogo from "./BrandLogo";
import styles from "./SwirlHero.module.css";

// Brand purples from deep violet to lavender; the swirl bands blend through them.
const swirlColors = ["#2a0b4d", "#7100c7", "#a800f0", "#d9b8ff"];
// Animation time (ms) the swirl starts from; the still frame when reduced motion is on at load.
const SWIRL_START_FRAME = 24_000;
// About 1.6 megapixels. The soft bands upscale invisibly, so there's no need to shade every device pixel.
const SWIRL_MAX_PIXELS = 1_600_000;
// Frame length assumed for the first eased frame, before a real interval exists.
const FALLBACK_FRAME_MS = 1000 / 60;

type SpeedLoop = { frame: number; lastTime: number; speed: number };

let webgl2Supported: boolean | undefined;

// Paper Shaders needs WebGL2 and throws without it, so check once before mounting.
function supportsWebGL2() {
  if (webgl2Supported === undefined) {
    // Software-rendered WebGL would stutter, so those machines keep the static gradient.
    const context = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
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
  const loopRef = useRef<SpeedLoop>({ frame: 0, lastTime: 0, speed: SWIRL_BASE_SPEED });
  const lenisRef = useRef<Lenis | undefined>(undefined);

  // Eases the shader toward a speed set by the live scroll velocity, then stops once scrolling ends and it settles.
  const easeSpeed = useCallback(function step(time: number) {
    const loop = loopRef.current;
    const elapsed = loop.lastTime ? time - loop.lastTime : 0;
    loop.lastTime = time;
    // Read Lenis live: its reset() zeroes velocity without emitting a scroll event.
    const velocity = lenisRef.current?.velocity ?? 0;
    const target = swirlTargetSpeed(scrollSpeedPerMs(velocity, elapsed || FALLBACK_FRAME_MS));
    const next = easeSwirlSpeed(loop.speed, target, elapsed);
    const settled = velocity === 0 && Math.abs(target - next) < SWIRL_SPEED_EPSILON;
    loop.speed = settled ? target : next;
    shaderRef.current?.paperShaderMount?.setSpeed(loop.speed);

    if (settled) {
      loop.frame = 0;
      loop.lastTime = 0;
    } else {
      loop.frame = requestAnimationFrame(step);
    }
  }, []);

  const lenis = useLenis(
    () => {
      if (prefersReducedMotion) return;
      const loop = loopRef.current;
      if (!loop.frame) loop.frame = requestAnimationFrame(easeSpeed);
    },
    [prefersReducedMotion, easeSpeed],
  );

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Reduced motion freezes the swirl, so drop any acceleration already in flight.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const loop = loopRef.current;
    cancelAnimationFrame(loop.frame);
    loop.frame = 0;
    loop.lastTime = 0;
    loop.speed = SWIRL_BASE_SPEED;
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
          offsetX={0}
          offsetY={0}
          proportion={0.45}
          ref={shaderRef}
          scale={1.25}
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
