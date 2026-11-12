"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { portfolioSlides } from "../data/portfolioSlides";
import styles from "./PortfolioBanner.module.css";

const COUNT = portfolioSlides.length;

export default function PortfolioBanner() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigateRef = useRef<((index: number) => void) | null>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [listView, setListView] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const still = listView || reducedMotion || failed;

  useEffect(() => {
    if (still) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let cancelled = false;
    let cleanup = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-portfolio-card]"));
      const title = stage.querySelector<HTMLElement>("[data-portfolio-title]");
      const progressBar = stage.querySelector<HTMLElement>("[data-portfolio-progress]");
      let lastActive = -1;
      let trigger: ReturnType<typeof ScrollTrigger.create>;
      const context = gsap.context(() => {
        const travel = { position: 0 };
        let width = stage.clientWidth;
        let cardWidth = cards[0].offsetWidth;
        const renderCards = () => {
          const position = travel.position;
          const gap = width < 760 ? 24 : 48;
          // Equal widths and a fixed gap keep every slide aligned and separate
          // throughout the scroll, including between the centered positions.
          cards.forEach((card, index) => {
            gsap.set(card, { x: (index - position) * (cardWidth + gap) });
          });
          const current = Math.round(position);
          if (current !== lastActive) { lastActive = current; setActive(current); }
        };
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: () => "top " + (stage.clientWidth < 760 ? "62px" : "72px"),
            end: () => "+=" + (root.offsetHeight - stage.offsetHeight),
            scrub: .65,
            invalidateOnRefresh: true,
            onRefresh: () => {
              width = stage.clientWidth;
              cardWidth = cards[0].offsetWidth;
              renderCards();
            },
          },
        });
        timeline.to(travel, { position: COUNT - 1, duration: 1, ease: "none", onUpdate: renderCards }, 0);
        renderCards();
        if (title) timeline.fromTo(title, { xPercent: 0 }, { xPercent: -35, duration: 1, ease: "none" }, 0);
        if (progressBar) timeline.fromTo(progressBar, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
        trigger = timeline.scrollTrigger!;

      }, root);
      navigateRef.current = (index) => {
        const next = Math.max(0, Math.min(COUNT - 1, index));
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * next / (COUNT - 1), behavior: "smooth" });
      };
      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      resizeObserver.observe(stage);
      ScrollTrigger.refresh();
      cleanup = () => {
        navigateRef.current = null;
        resizeObserver.disconnect();
        context.revert();
      };
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; cleanup(); };
  }, [still]);

  useEffect(() => {
    if (expanded === null) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [expanded]);

  const openSlide = (index: number) => {
    setExpanded(index);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <section ref={rootRef} className={styles.journey} data-still={still ? "true" : "false"} aria-label="Violet OP portfolio">
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.topline}>
            <span>COMPETITIVE / COMMUNITY / CREATIVE</span>
            <div>
              <button type="button" onClick={() => setListView(!listView)} aria-pressed={listView}>{still ? (reducedMotion || failed ? "Portfolio" : "Explore") : "All slides"}</button>
              <a href="#directory-heading">Meet our staff</a>
            </div>
          </div>
          <h1 className={styles.wordmark} data-portfolio-title aria-label="Violet OP portfolio">VIOLET OP</h1>
          <div className={styles.field} aria-label={still ? "Portfolio slides" : "Scroll to explore the portfolio"}
            tabIndex={still ? -1 : 0}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget || still) return;
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                navigateRef.current?.(event.key === "Home" ? 0 : event.key === "End" ? COUNT - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
              }
            }}>
            {portfolioSlides.map((slide, index) => {
              return (
                <button key={slide.src} type="button" data-portfolio-card className={styles.slide}
                  style={{ "--initial-x": `calc(${index} * (var(--slide-width) + var(--slide-gap)))` } as CSSProperties}
                  tabIndex={still || active === index ? 0 : -1} onClick={() => openSlide(index)}
                  aria-label={"Open slide " + (index + 1) + ": " + slide.title}>
                  <span className={styles.image}>
                    <Image src={slide.src} alt={slide.alt} fill unoptimized sizes="(max-width: 760px) 88vw, (max-width: 1500px) 69vw, 1035px"
                      loading={index < 3 ? "eager" : "lazy"} draggable={false} />
                  </span>
                  <span className={styles.slideLabel}><span>{String(index + 1).padStart(2, "0")}</span>{slide.title}<span>View</span></span>
                </button>
              );
            })}
          </div>
          {!still && <div className={styles.bottomline}>
            <div className={styles.navigation}>
              <button type="button" onClick={() => navigateRef.current?.(active - 1)} disabled={active === 0}>Previous</button>
              <button type="button" onClick={() => openSlide(active)}>View slide</button>
              <button type="button" onClick={() => navigateRef.current?.(active + 1)} disabled={active === COUNT - 1}>Next</button>
            </div>
            <div className={styles.progress}><span data-portfolio-progress /></div>
          </div>}
        </div>
      </section>
      <dialog ref={dialogRef} className={styles.viewer} aria-label="Portfolio slide viewer" data-lenis-prevent
        onClose={() => setExpanded(null)} onWheel={(event) => event.stopPropagation()}
        onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        {expanded !== null && <div className={styles.viewerInner}>
          <div className={styles.viewerHeading}><span>{portfolioSlides[expanded].title}</span>
            <button type="button" onClick={() => dialogRef.current?.close()} autoFocus>Close</button></div>
          <div className={styles.viewerImage}><Image src={portfolioSlides[expanded].src} alt={portfolioSlides[expanded].alt} fill unoptimized sizes="96vw" /></div>
          <div className={styles.viewerFooter}>
            <button type="button" onClick={() => setExpanded((expanded + COUNT - 1) % COUNT)}>Previous</button>
            <span>{expanded + 1} / {COUNT}</span>
            <button type="button" onClick={() => setExpanded((expanded + 1) % COUNT)}>Next</button>
          </div>
        </div>}
      </dialog>
    </>
  );
}
