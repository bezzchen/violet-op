"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Footer } from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

/** Local assets in `public/images/` */
const HERO_IMG = "/images/voppurple.avif";
const VAL_BG = "/images/jettfull.webp";
const VAL_LOGO = "/images/valologo.webp";
const VAL_AGENT = "/images/jettfull.webp";
const LOL_BG = "/images/ekko.png";
const LOL_LOGO = "/images/lollogo.png";
const LOL_CHAMP = "/images/ekko.png";

const VAL_ROSTER_THUMBS = [
  "/images/vopwhite.avif",
  "/images/voppurple.avif",
  "/images/vopblack.png",
  "/images/groupphoto.avif",
] as const;

const LOL_ROSTER_THUMBS = ["/images/lollogo.png", "/images/groupphoto.avif"] as const;

function IconTrendingFlat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m22 12-4-4v3H6v2h12v3z" />
    </svg>
  );
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const hero = document.getElementById("hero-section");
    const val = document.getElementById("valorant-section");
    const lol = document.getElementById("lol-section");
    if (!hero || !val || !lol) return;

    const lenis = new Lenis({
      wrapper: scrollEl,
      content: scrollEl,
      // Wheel often targets the fixed header; listen on window so trackpad scroll still drives Lenis
      eventsTarget: window,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.85,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return scrollEl.getBoundingClientRect();
      },
    });

    const applySectionStates = () => {
      const scrollPos = lenis.scroll;
      const vh = window.innerHeight;

      if (scrollPos > vh * 0.2) {
        hero.classList.remove("hero-active");
        hero.classList.add("hero-exit");
      } else {
        hero.classList.add("hero-active");
        hero.classList.remove("hero-exit");
      }

      if (scrollPos > vh * 0.5 && scrollPos < vh * 1.5) {
        val.classList.add("val-active");
        val.classList.remove("val-hidden");
      } else {
        val.classList.remove("val-active");
        val.classList.add("val-hidden");
      }

      if (scrollPos > vh * 1.5 && scrollPos < vh * 2.5) {
        lol.classList.add("lol-active");
        lol.classList.remove("lol-hidden");
      } else {
        lol.classList.remove("lol-active");
        lol.classList.add("lol-hidden");
      }
    };

    applySectionStates();

    const trigger = ScrollTrigger.create({
      trigger: scrollEl,
      scroller: scrollEl,
      start: "top top",
      end: "bottom bottom",
      onUpdate: applySectionStates,
    });

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tickerFn);
      gsap.ticker.lagSmoothing(500, 33);
      trigger.kill();
      lenis.destroy();
    };
  }, []);

  return (
    <main className="scroll-container" id="main-scroll" ref={scrollRef}>
      <section
        className="scroll-section hero-active flex items-center justify-center bg-surface-container-lowest"
        id="hero-section"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-primary-container/10 via-transparent to-background" />
        <div className="relative z-20 container mx-auto grid grid-cols-1 items-center gap-gutter px-grid-margin lg:grid-cols-12">
          <div className="relative lg:col-span-12">
            <div className="animate-on-scroll hero-text relative z-30 pointer-events-none">
              <span className="font-label-caps text-label-caps mb-4 block tracking-[0.4em] text-primary">
                NEW YORK UNIVERSITY ESPORTS
              </span>
              <h1 className="big-headline font-display-xl drop-shadow-2xl uppercase italic text-white">
                VIOLET
                <br />
                <span className="text-primary not-italic">OPERATOR</span>
              </h1>
            </div>
            <div className="animate-on-scroll hero-logo absolute top-1/2 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 opacity-40 lg:left-2/3 lg:opacity-100">
              <Image
                alt="NYU Violet OP Identity"
                className="w-full scale-110 drop-shadow-[0_0_80px_rgba(134,3,226,0.5)]"
                src={HERO_IMG}
                width={900}
                height={900}
                sizes="(min-width: 1024px) 42rem, 100vw"
              />
            </div>
            <div className="relative z-40 mt-12 flex gap-4">
              <button
                type="button"
                className="op-clip bg-primary px-8 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
              >
                About Us
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
      </section>

      <section
        className="scroll-section val-hidden flex items-center justify-center bg-[#0f1923]"
        id="valorant-section"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f1923] via-[#0f1923]/80 to-transparent" />
          <Image
            alt="Valorant Tactical"
            className="h-full w-full object-cover opacity-30"
            src={VAL_BG}
            fill
            sizes="100vw"
          />
        </div>
        <div className="relative z-20 container mx-auto grid grid-cols-1 items-center gap-12 px-grid-margin lg:grid-cols-2">
          <div className="val-assets animate-on-scroll relative flex flex-col items-center justify-center">
            <Image
              alt="Valorant Logo"
              className="relative z-20 mb-8 w-64"
              src={VAL_LOGO}
              width={256}
              height={120}
            />
            <Image
              alt="Jett Agent"
              className="relative z-10 max-h-[70vh] object-contain drop-shadow-[0_0_30px_rgba(0,219,233,0.3)]"
              src={VAL_AGENT}
              width={500}
              height={900}
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
          </div>
          <div className="val-content animate-on-scroll glass-panel op-clip border-l-4 border-l-tertiary p-stack-xl">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              <span className="font-label-caps text-label-caps uppercase text-tertiary">
                Squadron Deployment: active
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-8 uppercase tracking-tight">
              Tactical <span className="text-tertiary">Rosters</span>
            </h2>
            <div className="mb-8 grid grid-cols-2 gap-4">
              {(
                [
                  ["Violet", "Varsity"],
                  ["Ultraviolet", "Junior Varsity"],
                  ["Orchid", "Academy"],
                  ["Amethyst", "Gamechangers"],
                ] as const
              ).map(([name, tier], index) => (
                <div
                  key={name}
                  className="flex flex-col gap-2 rounded border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <Image
                    src={VAL_ROSTER_THUMBS[index]}
                    className="h-32 w-full rounded object-cover object-top opacity-80"
                    alt={`${name} team`}
                    width={320}
                    height={128}
                  />
                  <div className="flex flex-col">
                    <span className="font-headline-md text-lg text-on-surface">
                      {name}
                    </span>
                    <span className="font-label-caps text-[10px] tracking-wider text-tertiary uppercase">
                      {tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="font-label-caps text-label-caps flex items-center gap-2 text-tertiary transition-transform hover:translate-x-2"
            >
              VIEW ROSTER{" "}
              <IconTrendingFlat className="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      <section
        className="scroll-section lol-hidden flex items-center justify-center bg-[#010a13]"
        id="lol-section"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#010a13] via-[#010a13]/70 to-transparent" />
          <Image
            alt="League Rift"
            className="h-full w-full object-cover opacity-30"
            src={LOL_BG}
            fill
            sizes="100vw"
          />
        </div>
        <div className="relative z-20 container mx-auto grid grid-cols-1 items-center gap-12 px-grid-margin lg:grid-cols-2">
          <div className="lol-content animate-on-scroll glass-panel order-2 flex flex-col items-end self-center text-right op-clip border-r-4 border-r-primary p-stack-xl lg:order-1">
            <div className="mb-6 flex items-center gap-2">
              <span className="font-label-caps text-label-caps uppercase text-primary">
                Squadron Deployment: active
              </span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-8 uppercase tracking-tight">
              Ascending the <span className="text-primary">Rift</span>
            </h2>
            <div className="mb-8 grid w-full grid-cols-2 gap-4">
              {(
                [
                  ["Baron", "Varsity"],
                  ["Elder", "Development"],
                ] as const
              ).map(([name, tier], index) => (
                <div
                  key={name}
                  className="flex flex-col gap-2 rounded border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                >
                  <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded bg-primary/10">
                    <Image
                      src={LOL_ROSTER_THUMBS[index]}
                      className="w-3/4 object-contain opacity-50"
                      alt={`${name} team`}
                      width={200}
                      height={128}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-lg text-on-surface">
                      {name}
                    </span>
                    <span className="font-label-caps text-[10px] tracking-wider text-primary uppercase">
                      {tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="font-label-caps text-label-caps flex items-center gap-2 self-end text-primary transition-transform hover:-translate-x-2"
            >
              <IconTrendingFlat className="h-5 w-5 shrink-0 rotate-180" />{" "}
              VIEW ROSTER
            </button>
          </div>
          <div className="lol-assets animate-on-scroll relative order-1 flex flex-col items-center justify-center lg:order-2">
            <Image
              alt="LoL Logo"
              className="relative z-20 mb-8 w-80"
              src={LOL_LOGO}
              width={320}
              height={160}
            />
            <Image
              alt="League champion"
              className="relative z-10 max-h-[70vh] object-contain drop-shadow-[0_0_40px_rgba(224,182,255,0.4)]"
              src={LOL_CHAMP}
              width={500}
              height={900}
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
          </div>
        </div>
      </section>

      <section
        className="scroll-section relative flex flex-col items-center justify-center bg-surface px-grid-margin text-center"
        id="join-section"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/20 via-transparent to-transparent" />
        <div className="z-10 max-w-4xl space-y-stack-md">
          <span className="font-label-caps text-label-caps text-on-primary-container">
            JOIN THE LEGACY
          </span>
          <h2 className="font-display-xl uppercase md:text-display-xl text-headline-lg">
            Are you <span className="text-primary">Overpowered?</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto max-w-2xl">
            Whether you&apos;re a high-ELO competitor, a broadcast specialist, or
            a community builder, there&apos;s a place for you in the Violet OP
            ecosystem.
          </p>
          <div className="flex flex-col items-center justify-center gap-gutter pt-stack-md md:flex-row">
            <div className="glass-panel op-clip group w-full cursor-pointer p-8 transition-all hover:neon-glow-purple md:w-80">
              <h3 className="font-headline-md text-headline-md mb-2 text-primary">
                Players
              </h3>
              <p className="font-body-md text-body-md mb-4 text-on-surface/70">
                Trial for our premiere rosters.
              </p>
              <span className="font-label-caps text-label-caps border-b border-primary pb-1">
                APPLY NOW
              </span>
            </div>
            <div className="glass-panel op-clip group w-full cursor-pointer p-8 transition-all hover:neon-glow-purple md:w-80">
              <h3 className="font-headline-md text-headline-md mb-2 text-tertiary">
                Staff
              </h3>
              <p className="font-body-md text-body-md mb-4 text-on-surface/70">
                Coaching &amp; Management.
              </p>
              <span className="font-label-caps text-label-caps border-b border-tertiary pb-1">
                JOIN CREW
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </main>
  );
}
