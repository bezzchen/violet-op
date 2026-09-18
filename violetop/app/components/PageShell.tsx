"use client";

import dynamic from "next/dynamic";
import { ReactNode, RefObject, useEffect, useRef } from "react";
import Footer from "./Footer";
import Header from "./Header";
import useLenisScroll from "../hooks/useLenisScroll";

const PrismCanvas = dynamic(() => import("./PrismCanvas"), {
  ssr: false,
});

type PageShellProps = {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
};

export default function PageShell({
  children,
  scrollContainerRef,
}: PageShellProps) {
  const internalScrollRef = useRef<HTMLElement | null>(null);
  const scrollRef = scrollContainerRef ?? internalScrollRef;

  useLenisScroll(scrollRef);

  useEffect(() => {
    const updateViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

      document.documentElement.style.setProperty(
        "--app-height",
        `${viewportHeight}px`,
      );
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  return (
    <>
      <PrismCanvas scrollContainerRef={scrollRef} />
      <Header />
      <main
        className="page-scroll-container relative z-10 bg-transparent text-on-background selection:bg-primary selection:text-on-primary"
        id="main-content"
        ref={scrollRef}
        tabIndex={-1}
      >
        {children}
        <Footer pinned={false} />
      </main>
    </>
  );
}
