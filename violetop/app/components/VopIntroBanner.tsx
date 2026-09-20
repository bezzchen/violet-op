"use client";

import type { AnimationEvent, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Header, { type HeaderPalette } from "./Header";
import styles from "./VopIntroBanner.module.css";

const HOLD_MS = 4_000;
const WIPE_MS = 4_000;

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

type BannerTheme = HeaderPalette & {
  style: ThemeStyle;
};

const themes: BannerTheme[] = [
  {
    name: "Purple",
    style: {
      "--mark-start": "#7100c7",
      "--mark-mid": "#a800f0",
      "--mark-end": "#cc35ff",
      "--emission": "#b739ff",
      "--emission-hot": "#e0b0ff",
      "--aura": "#9400e89c",
      "--button-bg": "#c9a8f5",
      "--button-glow": "#9b36dc5c",
    },
  },
  {
    name: "White",
    style: {
      "--mark-start": "#ffffff",
      "--mark-mid": "#e6e9ef",
      "--mark-end": "#aeb5c0",
      "--emission": "#edf0f6",
      "--emission-hot": "#ffffff",
      "--aura": "#dce5f071",
      "--button-bg": "#eff1f5",
      "--button-glow": "#ffffff45",
    },
  },
  {
    name: "Black",
    style: {
      "--mark-start": "#9098a5",
      "--mark-mid": "#535965",
      "--mark-end": "#292c33",
      "--emission": "#8e96a3",
      "--emission-hot": "#d9dde5",
      "--aura": "#9ba5b363",
      "--button-bg": "#aeb5c0",
      "--button-glow": "#bac4d055",
    },
  },
  {
    name: "Ruby",
    style: {
      "--mark-start": "#ff5365",
      "--mark-mid": "#d6213c",
      "--mark-end": "#870d20",
      "--emission": "#ef3f58",
      "--emission-hot": "#ffabb6",
      "--aura": "#d91f3f96",
      "--button-bg": "#f06b7d",
      "--button-glow": "#df29485e",
    },
  },
  {
    name: "Elder",
    style: {
      "--mark-start": "#77eee5",
      "--mark-mid": "#2bbab6",
      "--mark-end": "#116b70",
      "--emission": "#43d8d1",
      "--emission-hot": "#b3fff7",
      "--aura": "#24bab691",
      "--button-bg": "#70ddd5",
      "--button-glow": "#2bbab65c",
    },
  },
  {
    name: "Baron",
    style: {
      "--mark-start": "#ccf86b",
      "--mark-mid": "#8fcb3d",
      "--mark-end": "#4d8124",
      "--emission": "#a4dc4e",
      "--emission-hot": "#e5ffad",
      "--aura": "#8fca4391",
      "--button-bg": "#b7e668",
      "--button-glow": "#8fca435c",
    },
  },
];

const polygonCells = [
  "M-46-18 166-26 246 72 132 166-34 132Z",
  "M246 72 397 14 456 136Z",
  "M246 72 456 136 344 205Z",
  "M-34 132 132 166 278 230 223 356 52 320-40 246Z",
  "M278 230 344 205 456 136 549 235 423 331Z",
  "M52 320 223 356 349 514-36 526Z",
  "M223 356 423 331 585 276 684 388 600 514 349 514Z",
  "M397 14 650-36 595 101 456 136Z",
  "M595 101 721 43 850 112Z",
  "M595 101 850 112 806 220 641 207Z",
  "M650-36 901-24 850 112 721 43Z",
  "M806 220 1001 222 1047 341 882 383 747 299Z",
  "M684 388 747 299 882 383 979 514 600 514Z",
  "M850 112 984-18 1128 69Z",
  "M850 112 1128 69 1071 187 904 127Z",
  "M1001 222 1071 187 1248 171 1197 307 1047 341Z",
  "M984-18 1346-22 1490 94 1391 204 1248 171 1128 69Z",
  "M1047 341 1197 307 1354 389 1298 520 979 514Z",
  "M1197 307 1391 204 1492 274 1450 421 1354 389Z",
  "M1391 204 1490 94 1514 90 1518 278 1492 274Z",
  "M1354 389 1450 421 1512 389 1518 522 1298 520Z",
];

function PolygonCells() {
  const paths = polygonCells;
  return <>{paths.map((path, index) => <path d={path} key={`${path}-${index}`} />)}</>;
}

function SurfaceNetwork() {
  return (
    <svg className={`${styles.networkArtwork} ${styles.surfaceNetwork}`} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 500">
      <g><PolygonCells /></g>
    </svg>
  );
}

function ColorNetwork() {
  return (
    <svg className={`${styles.networkArtwork} ${styles.colorNetwork}`} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 500">
      <g className={styles.networkGlow}><PolygonCells /></g>
      <g className={styles.networkCore}><PolygonCells /></g>
    </svg>
  );
}

function ThemeLayer({ theme, variant }: { theme: BannerTheme; variant: "current" | "incoming" }) {
  return (
    <div
      className={`${styles.themeLayer} ${variant === "current" ? styles.currentLayer : styles.incomingLayer}`}
      data-theme={theme.name.toLowerCase()}
      style={theme.style}
    >
      <ColorNetwork />
      <div className={styles.markWrap}>
        <span className={styles.markAura} />
        <span className={styles.mark} />
      </div>
    </div>
  );
}

export default function VopIntroBanner() {
  const bannerRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"hold" | "wipe">("hold");
  const [userPlaying, setUserPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const nextIndex = (currentIndex + 1) % themes.length;
  const active = userPlaying && isVisible && isPageVisible && !reducedMotion;
  const currentTheme = themes[currentIndex];
  const nextTheme = themes[nextIndex];
  const sceneStyle: ThemeStyle = { "--wipe-duration": `${WIPE_MS}ms` };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || phase !== "hold") return;
    const holdTimer = window.setTimeout(() => setPhase("wipe"), HOLD_MS);
    return () => window.clearTimeout(holdTimer);
  }, [active, currentIndex, phase]);

  const finishWipe = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target || phase !== "wipe") return;
    setCurrentIndex(nextIndex);
    setPhase("hold");
  };

  return (
    <div
      className={`${styles.scene} ${phase === "wipe" ? styles.wiping : ""} ${!active ? styles.paused : ""}`}
      onAnimationEnd={finishWipe}
      style={sceneStyle}
    >
      <Header homeAnimation={{ current: currentTheme, incoming: nextTheme, wiping: phase === "wipe" }} />
      <section aria-label="Violet OP colorway banner" className={styles.banner} id="hero-section" ref={bannerRef}>
        <h1 className={styles.screenReaderOnly}>Violet OP</h1>
        <div aria-hidden="true" className={styles.background}>
          <SurfaceNetwork />
        </div>
        <div aria-hidden="true" className={styles.layers}>
          <ThemeLayer theme={currentTheme} variant="current" />
          <ThemeLayer theme={nextTheme} variant="incoming" />
        </div>

        <div className={styles.controls}>
          <span aria-live="polite" className={styles.themeName}>{currentTheme.name}</span>
          <button
            aria-label={reducedMotion ? "Color cycle disabled by reduced motion preference" : userPlaying ? "Pause color cycle" : "Play color cycle"}
            className={styles.motionButton}
            disabled={reducedMotion}
            onClick={() => setUserPlaying((playing) => !playing)}
            type="button"
          >
            {userPlaying && !reducedMotion ? (
              <svg aria-hidden="true" className={styles.motionIcon} viewBox="0 0 14 14">
                <path d="M3.25 2.25h2.5v9.5h-2.5zm5 0h2.5v9.5h-2.5z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className={styles.motionIcon} viewBox="0 0 14 14">
                <path d="m3.5 2 8 5-8 5z" />
              </svg>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
