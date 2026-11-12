"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { portfolioSlides } from "../data/portfolioSlides";
import styles from "./PortfolioBanner.module.css";

const COUNT = portfolioSlides.length;
const placement = [
  [43, 0, 1, -2], [64, -140, .82, 3], [29, -70, .9, -2],
  [58, -180, .86, 2], [35, 0, 1.04, -1], [65, -110, .92, 2],
  [31, 0, 1, -3], [58, -160, .87, 2], [32, -70, .94, -1],
  [62, -130, .9, 2], [44, 0, 1.05, -2],
];

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
      const echoes = Array.from(stage.querySelectorAll<HTMLElement>("[data-portfolio-echo]"));
      const title = stage.querySelector<HTMLElement>("[data-portfolio-title]");
      const progressBar = stage.querySelector<HTMLElement>("[data-portfolio-progress]");
      let lastActive = -1;
      let trigger: ReturnType<typeof ScrollTrigger.create>;
      const context = gsap.context(() => {
        // Render clearance from the scrubbed position, so reverse scrolling
        // and fast wheel input follow the same continuous path.
        const travel = { position: 0 };
        const images = cards.map((card) => card.querySelector<HTMLElement>("." + styles.image)!);
        let width = stage.clientWidth;
        let height = stage.clientHeight;
        let cardWidth = cards[0].offsetWidth;
        const spacing = () => width * (width < 760 ? .98 : .5);
        const smoothstep = (value: number) => {
          const t = Math.max(0, Math.min(1, value));
          return t * t * (3 - 2 * t);
        };
        const renderCards = () => {
          const position = travel.position;
          const nearest = Math.round(position);
          const distance = Math.abs(position - nearest);
          // Hold a clear reading area near the center, then release it
          // smoothly before the next slide takes focus.
          const focus = 1 - smoothstep((distance - .18) / .32);
          const mobile = width < 760;
          const readScale = (index: number) => Math.min(
            mobile ? .96 : placement[index][2],
            (width - 48) / cardWidth,
            (height - (mobile ? 190 : 160)) / (cardWidth * 9 / 16)
          );
          const focalWidth = cardWidth * readScale(nearest);
          cards.forEach((card, index) => {
            const [top, depth, scale, tilt] = placement[index];
            const isNearest = index === nearest;
            const emphasis = isNearest ? focus : 0;
            const baseScale = mobile ? .96 : scale;
            const baseX = (index - position) * spacing();
            const halfWidth = cardWidth * baseScale * 1.08 / 2;
            const separation = Math.abs(baseX);
            const clearance = Math.max(0, focalWidth / 2 + halfWidth + 40 - separation);
            const side = Math.sign(index - nearest);
            const centerShift = width * (mobile ? 0 : .06);
            const x = isNearest
              ? baseX * (1 - emphasis) + centerShift * emphasis
              : baseX + (centerShift + side * clearance) * focus;
            gsap.set(card, {
              x,
              y: (height * (.5 - top / 100) - 15) * emphasis,
              rotationY: (-5 + position) * (1 - emphasis),
              zIndex: isNearest && focus > 0 ? 2 : 1,
            });
            gsap.set(images[index], {
              xPercent: -50, yPercent: -50, x: 0, y: 0,
              z: (mobile ? 0 : depth) * (1 - emphasis),
              scale: baseScale + (readScale(index) - baseScale) * emphasis,
              rotation: tilt * (1 - emphasis),
            });
          });
          if (nearest !== lastActive) { lastActive = nearest; setActive(nearest); }
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
              height = stage.clientHeight;
              cardWidth = cards[0].offsetWidth;
              renderCards();
            },
          },
        });
        timeline.to(travel, { position: COUNT - 1, duration: 1, ease: "none", onUpdate: renderCards }, 0);
        renderCards();
        echoes.forEach((echo, index) => {
          timeline.fromTo(echo,
            { x: () => (index - .5) * spacing() * 1.2 },
            { x: () => ((index - .5) * 1.2 - (COUNT - 1) * .7) * spacing(), duration: 1, ease: "none" }, 0);
        });
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
            {!still && <div className={styles.echoes} aria-hidden="true">
              {portfolioSlides.map((slide, index) => (
                <div key={slide.src} data-portfolio-echo className={styles.echo}
                  style={{ top: index % 2 ? "77%" : "16%", left: "50%", width: index % 3 ? "260px" : "190px" }}>
                  <Image src={slide.src} alt="" fill unoptimized sizes="260px" />
                </div>
              ))}
            </div>}
            {portfolioSlides.map((slide, index) => {
              const [top, depth, scale, tilt] = placement[index];
              return (
                <button key={slide.src} type="button" data-portfolio-card className={styles.slide}
                  style={{ "--card-top": top + "%", "--depth": depth + "px", "--size": scale, "--tilt": tilt + "deg",
                    "--initial-x": index * 50 + "vw" } as CSSProperties}
                  tabIndex={still || active === index ? 0 : -1} onClick={() => openSlide(index)}
                  aria-label={"Open slide " + (index + 1) + ": " + slide.title}>
                  <span className={styles.image}>
                    <Image src={slide.src} alt={slide.alt} fill unoptimized sizes="(max-width: 760px) 84vw, 640px"
                      loading={index < 3 ? "eager" : "lazy"} draggable={false} />
                  </span>
                  <span className={styles.slideLabel}><span>{String(index + 1).padStart(2, "0")}</span>{slide.title}<span>View</span></span>
                </button>
              );
            })}
          </div>
          {!still && <div className={styles.bottomline}>
            <div className={styles.status}><span>{String(active + 1).padStart(2, "0")} / {COUNT}</span><span>Scroll to explore. Click a slide to read.</span></div>
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
