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
      let removeHoverListeners = () => {};
      const context = gsap.context(() => {
        const travel = { position: 0 };
        const reading = { index: 0, amount: 0 };
        const echoLayer = stage.querySelector<HTMLElement>("." + styles.echoes);
        const images = cards.map((card) => card.querySelector<HTMLElement>("." + styles.image)!);
        let width = stage.clientWidth;
        let height = stage.clientHeight;
        let cardWidth = cards[0].offsetWidth;
        const spacing = () => width * (width < 760 ? .98 : .5);
        const renderCards = () => {
          const position = travel.position;
          const nearest = Math.round(position);
          const focused = reading.index;
          const focus = reading.amount;
          if (echoLayer) gsap.set(echoLayer, { opacity: 1 - focus });
          const mobile = width < 760;
          const readScale = (index: number) => Math.min(
            mobile ? .96 : placement[index][2],
            (width - 48) / cardWidth,
            (height - (mobile ? 190 : 160)) / (cardWidth * 9 / 16)
          );
          const focalWidth = cardWidth * readScale(focused);
          cards.forEach((card, index) => {
            const [top, depth, scale, tilt] = placement[index];
            const isNearest = index === focused;
            const emphasis = isNearest ? focus : 0;
            const baseScale = mobile ? .96 : scale;
            const baseX = (index - position) * spacing();
            const halfWidth = cardWidth * baseScale * 1.08 / 2;
            const separation = Math.abs(baseX);
            const clearance = Math.max(0, focalWidth / 2 + halfWidth + 40 - separation);
            const side = Math.sign(index - focused);
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
          const current = focus > .5 ? focused : nearest;
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
        let dwell: ReturnType<typeof setTimeout> | undefined;
        let hovered = -1;
        let hoverTween: ReturnType<typeof gsap.to> | undefined;
        const cancelHover = () => {
          if (hovered === -1) return;
          clearTimeout(dwell);
          dwell = undefined;
          hovered = -1;
          hoverTween?.kill();
          hoverTween = gsap.to(reading, {
            amount: 0, duration: .35, ease: "power2.out", onUpdate: renderCards,
          });
        };
        const armHover = (index: number) => {
          if (index === hovered) return;
          cancelHover();
          if (index < 0) return;
          hovered = index;
          dwell = setTimeout(() => {
            if (cancelled || hovered !== index) return;
            reading.index = index;
            hoverTween?.kill();
            hoverTween = gsap.to(reading, {
              amount: 1, duration: .45, ease: "power2.out", onUpdate: renderCards,
            });
          }, 1500);
        };
        const cardIndex = (target: EventTarget | null) => {
          const card = target instanceof Element ? target.closest<HTMLElement>("[data-portfolio-card]") : null;
          return card ? cards.indexOf(card) : -1;
        };
        // Pointer movement, rather than enter/leave on moving cards, avoids
        // toggling the pop-out when its own animation moves beneath the cursor.
        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerType !== "touch") armHover(cardIndex(event.target));
        };
        const onFocus = (event: FocusEvent) => {
          if (event.target instanceof Element && event.target.matches(":focus-visible")) {
            armHover(cardIndex(event.target));
          }
        };
        const onEscape = (event: KeyboardEvent) => {
          if (event.key === "Escape") cancelHover();
        };
        stage.addEventListener("pointermove", onPointerMove);
        stage.addEventListener("pointerleave", cancelHover);
        stage.addEventListener("focusin", onFocus);
        stage.addEventListener("focusout", cancelHover);
        stage.addEventListener("click", cancelHover);
        stage.addEventListener("keydown", onEscape);
        stage.addEventListener("wheel", cancelHover, { passive: true });
        window.addEventListener("scroll", cancelHover, { passive: true });
        removeHoverListeners = () => {
          clearTimeout(dwell);
          hoverTween?.kill();
          stage.removeEventListener("pointermove", onPointerMove);
          stage.removeEventListener("pointerleave", cancelHover);
          stage.removeEventListener("focusin", onFocus);
          stage.removeEventListener("focusout", cancelHover);
          stage.removeEventListener("click", cancelHover);
          stage.removeEventListener("keydown", onEscape);
          stage.removeEventListener("wheel", cancelHover);
          window.removeEventListener("scroll", cancelHover);
        };
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
        removeHoverListeners();
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
            <div className={styles.status}><span>{String(active + 1).padStart(2, "0")} / {COUNT}</span><span>Scroll to explore. Hover to preview; click to read.</span></div>
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
