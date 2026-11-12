"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { portfolioSlides } from "../data/portfolioSlides";
import styles from "./PortfolioBanner.module.css";

const COUNT = portfolioSlides.length;
const INTERVAL_MS = 6500;

export default function PortfolioBanner() {
  const stageRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const playing = !paused && !hovered && visible && tabVisible && !reducedMotion;

  const goTo = useCallback((index: number, manual = true) => {
    const next = (index + COUNT) % COUNT;
    indexRef.current = next;
    setActive(next);
    if (manual) setPaused(true);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4), { threshold: 0.4 });
    observer.observe(stage);
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => goTo(indexRef.current + 1, false), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, goTo, playing]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let accumulated = 0;
    let previousEvent = 0;
    let lastStep = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const delta = raw * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1);
      if (!delta) return;
      const direction = Math.sign(delta);
      // Release scrolling at either end so the gallery never traps the page.
      if ((indexRef.current === 0 && direction < 0) || (indexRef.current === COUNT - 1 && direction > 0)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - previousEvent > 180 || Math.sign(accumulated) !== direction) accumulated = 0;
      previousEvent = now;
      if (now - lastStep < 700) return;
      accumulated += delta;
      if (Math.abs(accumulated) < 40) return;
      accumulated = 0;
      lastStep = now;
      goTo(indexRef.current + direction);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [goTo]);

  return (
    <section className={styles.banner} aria-label="Violet OP portfolio" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <h1 className="sr-only">Violet OP portfolio</h1>
      <div className={styles.topline}>
        <span>COMPETITIVE / COMMUNITY / CREATIVE</span>
        <a href="#directory-heading" onClick={() => setPaused(true)}>Meet our staff</a>
      </div>
      <div ref={stageRef} className={styles.stage} tabIndex={0} data-lenis-prevent-wheel
        aria-label="Portfolio slides. Scroll or use left and right arrow keys to browse."
        onFocus={() => setPaused(true)}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(indexRef.current + (event.key === "ArrowRight" ? 1 : -1));
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            goTo(event.key === "Home" ? 0 : COUNT - 1);
          }
        }}
        onTouchStart={(event) => {
          if (event.touches.length !== 1) { touchStart.current = null; return; }
          touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          setPaused(true);
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !event.changedTouches[0]) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(indexRef.current + (dx < 0 ? 1 : -1));
        }}>
        {portfolioSlides.map((slide, index) => {
          let offset = index - active;
          if (offset > COUNT / 2) offset -= COUNT;
          if (offset < -COUNT / 2) offset += COUNT;
          const distance = Math.abs(offset);
          const cardStyle = {
            "--offset": offset, "--distance": distance, "--tilt": `${Math.sign(offset) * -23}deg`,
            zIndex: COUNT - distance, opacity: distance > 2 ? 0 : distance === 0 ? 1 : 0.4,
          } as CSSProperties;
          return (
            <div className={styles.slide} style={cardStyle} key={slide.src} aria-hidden={index !== active}
              role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${COUNT}: ${slide.title}`}>
              <Image src={slide.src} alt={slide.alt} fill unoptimized sizes="(max-width: 760px) 92vw, 1040px"
                loading={index < 2 ? "eager" : "lazy"} draggable={false} />
            </div>
          );
        })}
      </div>
      <div className={styles.toolbar}>
        <div className={styles.caption} aria-live={playing ? "off" : "polite"} aria-atomic="true">
          <span className={styles.count}>{String(active + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}</span>
          <strong>{portfolioSlides[active].title}</strong>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous portfolio slide">Previous</button>
          <button type="button" onClick={() => setPaused((value) => !value)} disabled={reducedMotion}
            aria-label={paused || reducedMotion ? "Play portfolio slideshow" : "Pause portfolio slideshow"}>
            {paused || reducedMotion ? "Play" : "Pause"}
          </button>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Next portfolio slide">Next</button>
        </div>
      </div>
      <div className={styles.bottomline}>
        <div className={styles.pagination} aria-label="Choose portfolio slide">
          {portfolioSlides.map((slide, index) => (
            <button type="button" key={slide.src} aria-label={`Show ${slide.title}`} aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}><span /></button>
          ))}
        </div>
        <span className={styles.hint}>Scroll to explore · Swipe on mobile</span>
      </div>
    </section>
  );
}
