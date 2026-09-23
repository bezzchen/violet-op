"use client";

import type { PaperShaderElement } from "@paper-design/shaders";
import { Swirl } from "@paper-design/shaders-react";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { easeSwirlSpeed, SWIRL_BASE_SPEED, SWIRL_SPEED_EPSILON, swirlTargetSpeed } from "../utils/swirlSpeed";
import BrandLogo from "./BrandLogo";
import styles from "./SwirlHero.module.css";

// Brand purples from deep violet to lavender; the swirl bands blend through them.
const swirlColors = ["#2a0b4d", "#7100c7", "#a800f0", "#d9b8ff"];
// Animation time (ms) the swirl starts from; also the still frame shown for reduced motion.
const SWIRL_START_FRAME = 24_000;
// About 1.6 megapixels. The soft bands upscale invisibly, so there's no need to shade every device pixel.
const SWIRL_MAX_PIXELS = 1_600_000;

type SpeedLoop = { frame: number; lastTime: number; speed: number; target: number };

let webgl2Supported: boolean | undefined;

// Paper Shaders needs WebGL2 and throws without it, so check once before mounting.
function supportsWebGL2() {
  if (webgl2Supported === undefined) {
    const context = document.createElement("canvas").getContext("webgl2");
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
  const loopRef = useRef<SpeedLoop>({ frame: 0, lastTime: 0, speed: SWIRL_BASE_SPEED, target: SWIRL_BASE_SPEED });

  // Eases the shader toward the scroll-driven target speed, then stops once it settles.
  const easeSpeed = useCallback(function step(time: number) {
    const loop = loopRef.current;
    const elapsed = loop.lastTime ? time - loop.lastTime : 0;
    loop.lastTime = time;
    const next = easeSwirlSpeed(loop.speed, loop.target, elapsed);
    const settled = Math.abs(loop.target - next) < SWIRL_SPEED_EPSILON;
    loop.speed = settled ? loop.target : next;
    shaderRef.current?.paperShaderMount?.setSpeed(loop.speed);

    if (settled) {
      loop.frame = 0;
      loop.lastTime = 0;
    } else {
      loop.frame = requestAnimationFrame(step);
    }
  }, []);

  useLenis(
    ({ velocity }) => {
      if (prefersReducedMotion) return;
      const loop = loopRef.current;
      loop.target = swirlTargetSpeed(velocity);
      if (!loop.frame) loop.frame = requestAnimationFrame(easeSpeed);
    },
    [prefersReducedMotion, easeSpeed],
  );

  // Reduced motion freezes the swirl, so drop any acceleration already in flight.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const loop = loopRef.current;
    cancelAnimationFrame(loop.frame);
    loop.frame = 0;
    loop.lastTime = 0;
    loop.speed = SWIRL_BASE_SPEED;
    loop.target = SWIRL_BASE_SPEED;
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
