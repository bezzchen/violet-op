"use client";

import Lenis from "lenis";
import { RefObject, useEffect } from "react";

export default function useLenisScroll(
  scrollContainerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;

    if (
      reducedMotionQuery.matches ||
      coarsePointerQuery.matches ||
      connection?.saveData
    ) {
      return;
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      content: scrollContainer,
      lerp: 0.085,
      stopInertiaOnNavigate: true,
      wrapper: scrollContainer,
    });

    return () => {
      lenis.destroy();
    };
  }, [scrollContainerRef]);
}
