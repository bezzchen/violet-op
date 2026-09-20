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

const mainFissures = [
  "M-32 166 64 148 126 185 190 151 256 207 335 187 408 229",
  "M824-24 856 58 826 115 895 152 873 218 934 249",
  "M154 516 180 447 246 416 232 359 307 326 361 278",
  "M1472 359 1390 341 1344 386 1259 352 1192 403 1104 374 1046 430",
  "M619 501 647 442 625 397 665 354",
];

const branchFissures = [
  "M126 185 100 127 132 76",
  "M190 151 178 105 199 67",
  "M256 207 279 157 332 134",
  "M335 187 367 142 359 103",
  "M856 58 912 35 946-4",
  "M826 115 780 95 743 52",
  "M895 152 954 126 1008 139",
  "M873 218 824 243 788 286",
  "M246 416 202 386 160 389",
  "M232 359 185 334 142 345",
  "M307 326 331 280 318 239",
  "M1390 341 1405 294 1442 263",
  "M1344 386 1320 432 1274 458",
  "M1259 352 1239 305 1191 281",
  "M1192 403 1160 449 1112 472",
  "M647 442 698 419 727 382",
  "M625 397 580 369 548 329",
  "M493 39 532 76 524 122 566 147",
  "M1119-8 1094 46 1118 91 1081 127",
  "M1015 316 974 335 944 373",
];

const emissionFissures = [
  mainFissures[0],
  mainFissures[1],
  mainFissures[2],
  mainFissures[3],
  branchFissures[0],
  branchFissures[2],
  branchFissures[6],
  branchFissures[9],
  branchFissures[12],
  branchFissures[15],
  branchFissures[18],
];

function PathSet({ paths }: { paths: string[] }) {
  return <>{paths.map((path, index) => <path d={path} key={`${path}-${index}`} />)}</>;
}

function SurfaceArtwork() {
  return (
    <svg className={styles.surfaceArtwork} preserveAspectRatio="none" viewBox="0 0 1440 500">
      <g className={styles.contactShadows} transform="translate(0 4)">
        <PathSet paths={mainFissures} />
        <PathSet paths={branchFissures} />
      </g>
      <g className={styles.fissureBevels}>
        <PathSet paths={mainFissures} />
        <PathSet paths={branchFissures} />
      </g>
      <g className={styles.fissureCuts}>
        <PathSet paths={mainFissures} />
        <PathSet paths={branchFissures} />
      </g>
      <g className={styles.chippedEdges}>
        <path d="m54 144 21-16 18 17-26 10Z" />
        <path d="m247 204 16-18 19 9-18 18Z" />
        <path d="m820 109 18-17 14 24-18 10Z" />
        <path d="m886 148 22-16 12 23-20 13Z" />
        <path d="m224 355 18-15 14 18-20 13Z" />
        <path d="m1337 381 20-14 13 19-19 14Z" />
        <path d="m1184 399 16-17 16 17-17 14Z" />
      </g>
    </svg>
  );
}

function EmissionArtwork() {
  return (
    <svg className={styles.emissionArtwork} preserveAspectRatio="none" viewBox="0 0 1440 500">
      <g className={styles.emissionGlow}><PathSet paths={emissionFissures} /></g>
      <g className={styles.emissionCore}><PathSet paths={emissionFissures} /></g>
      <g className={styles.emissionHot}><PathSet paths={emissionFissures.slice(0, 4)} /></g>
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
      <EmissionArtwork />
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
          <SurfaceArtwork />
        </div>
        <div aria-hidden="true" className={styles.layers}>
          <ThemeLayer theme={currentTheme} variant="current" />
          <ThemeLayer theme={nextTheme} variant="incoming" />
        </div>

        <div className={styles.controls}>
          <span aria-live="polite" className={styles.themeName}>{currentTheme.name}</span>
          <div aria-hidden="true" className={styles.dots}>
            {themes.map((theme, index) => (
              <span className={index === currentIndex ? styles.activeDot : ""} key={theme.name} />
            ))}
          </div>
          <button
            aria-label={reducedMotion ? "Color cycle disabled by reduced motion preference" : userPlaying ? "Pause color cycle" : "Play color cycle"}
            className={styles.motionButton}
            disabled={reducedMotion}
            onClick={() => setUserPlaying((playing) => !playing)}
            type="button"
          >
            <span aria-hidden="true">{reducedMotion ? "—" : userPlaying ? "Ⅱ" : "▶"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
