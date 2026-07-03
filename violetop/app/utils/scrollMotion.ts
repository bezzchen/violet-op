type ScrollMotionState = {
  opacity: number;
  scale?: number;
  x?: number;
};

export function setScrollMotion(
  element: HTMLElement | null,
  { opacity, scale = 1, x = 0 }: ScrollMotionState,
) {
  if (!element) {
    return;
  }

  element.style.opacity = `${opacity}`;
  element.style.transform = `translate3d(${x}px, 0, 0) scale(${scale})`;
  element.style.visibility = opacity <= 0 ? "hidden" : "visible";
}

export function captureInlineStyles(
  elements: Array<HTMLElement | null | undefined>,
) {
  const snapshots = new Map<HTMLElement, string | null>();

  elements.forEach((element) => {
    if (element && !snapshots.has(element)) {
      snapshots.set(element, element.getAttribute("style"));
    }
  });

  return () => {
    snapshots.forEach((style, element) => {
      if (style === null) {
        element.removeAttribute("style");
      } else {
        element.setAttribute("style", style);
      }
    });
  };
}
