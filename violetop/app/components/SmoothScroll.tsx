"use client";

import type { LenisOptions } from "lenis";
import { ReactLenis } from "lenis/react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

// Anchors stay native so hash links, including "Skip to content", still move focus.
const lenisOptions: LenisOptions = {
  anchors: false,
  lerp: 0.1,
  smoothWheel: true,
  stopInertiaOnNavigate: true,
};

/** Site-wide inertial scrolling. The root Lenis instance drives window scroll and renders no markup. */
export default function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? null : <ReactLenis options={lenisOptions} root />;
}
