"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  captureInlineStyles,
  setScrollMotion,
} from "../utils/scrollMotion";

type TeamHeroMotionProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (value: number) => {
  const progress = clamp(value);

  return progress * progress * (3 - 2 * progress);
};

const scrollRange = (scrollPos: number, vh: number, start: number, end: number) =>
  smoothstep((scrollPos - vh * start) / (vh * (end - start)));

export default function TeamHeroMotion({
  children,
  className,
  style,
}: TeamHeroMotionProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scrollContainer = root?.closest(".page-scroll-container") as HTMLElement | null;
    const copy = root?.querySelector<HTMLElement>("[data-team-hero-copy]");
    const media = root?.querySelector<HTMLElement>("[data-team-hero-media]");
    const backdrop = root?.querySelector<HTMLElement>("[data-team-hero-backdrop]");

    if (!root || !scrollContainer || !copy || !media) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionQuery.matches) {
      return;
    }

    let animationFrame = 0;
    let removeScrollListeners = () => {};

    const restoreInlineStyles = captureInlineStyles([copy, media, backdrop]);

    setScrollMotion(copy, { opacity: 1 });
    setScrollMotion(media, { opacity: 1 });

    const animateScrollState = () => {
      const scrollPos = scrollContainer.scrollTop;
      const vh = scrollContainer.clientHeight || window.innerHeight;
      const heroExit = scrollRange(scrollPos, vh, 0.05, 0.55);

      setScrollMotion(copy, {
        opacity: 1 - heroExit,
        x: -120 * heroExit,
      });

      setScrollMotion(media, {
        opacity: 1 - heroExit,
        scale: 1 - 0.12 * heroExit,
        x: 120 * heroExit,
      });

      if (backdrop) {
        backdrop.style.opacity = `${0.1 * (1 - heroExit)}`;
      }
    };

    const scheduleScrollState = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        animateScrollState();
      });
    };

    animateScrollState();
    scrollContainer.addEventListener("scroll", scheduleScrollState, { passive: true });
    window.addEventListener("resize", scheduleScrollState);
    window.visualViewport?.addEventListener("resize", scheduleScrollState);
    window.visualViewport?.addEventListener("scroll", scheduleScrollState);

    removeScrollListeners = () => {
      scrollContainer.removeEventListener("scroll", scheduleScrollState);
      window.removeEventListener("resize", scheduleScrollState);
      window.visualViewport?.removeEventListener("resize", scheduleScrollState);
      window.visualViewport?.removeEventListener("scroll", scheduleScrollState);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    return () => {
      removeScrollListeners();
      restoreInlineStyles();
    };
  }, []);

  return (
    <section className={className} ref={rootRef} style={style}>
      {children}
    </section>
  );
}
