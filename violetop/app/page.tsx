"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  homeContent,
  joinContent,
  leagueTeams,
  valorantTeams,
} from "./data/siteContent";
import useLenisScroll from "./hooks/useLenisScroll";

const PrismCanvas = dynamic(() => import("./components/PrismCanvas"), {
  ssr: false,
});

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (value: number) => {
  const progress = clamp(value);

  return progress * progress * (3 - 2 * progress);
};

const scrollRange = (scrollPos: number, vh: number, start: number, end: number) =>
  smoothstep((scrollPos - vh * start) / (vh * (end - start)));

const sectionEnterProgress = (scrollPos: number, vh: number, offsetTop: number) =>
  smoothstep((scrollPos - (offsetTop - vh * 0.75)) / (vh * 0.6));

export default function Home() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const heroLogoRef = useRef<HTMLDivElement | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const valAssetsRef = useRef<HTMLDivElement | null>(null);
  const valContentRef = useRef<HTMLDivElement | null>(null);
  const lolAssetsRef = useRef<HTMLDivElement | null>(null);
  const lolContentRef = useRef<HTMLDivElement | null>(null);

  useLenisScroll(scrollRef);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }

    let animationFrame = 0;
    let removeScrollListeners = () => {};
    let valorantOffset = scrollContainer.clientHeight;
    let leagueOffset = scrollContainer.clientHeight * 2;
    let ctaOffset = scrollContainer.clientHeight * 3;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

      document.documentElement.style.setProperty(
        "--app-height",
        `${viewportHeight}px`,
      );
    };

    if (reducedMotionQuery.matches) {
      const handleViewportChange = () => {
        updateViewportHeight();
      };

      updateViewportHeight();
      window.addEventListener("resize", handleViewportChange);
      window.visualViewport?.addEventListener("resize", handleViewportChange);
      window.visualViewport?.addEventListener("scroll", handleViewportChange);

      return () => {
        window.removeEventListener("resize", handleViewportChange);
        window.visualViewport?.removeEventListener("resize", handleViewportChange);
        window.visualViewport?.removeEventListener("scroll", handleViewportChange);
      };
    }

    const ctx = gsap.context(() => {
      gsap.set(heroTextRef.current, { autoAlpha: 1, x: 0 });
      gsap.set(heroCtaRef.current, { autoAlpha: 1, x: 0 });
      gsap.set(heroLogoRef.current, { autoAlpha: 1, scale: 1, x: 0 });
      gsap.set([valAssetsRef.current, valContentRef.current], { autoAlpha: 0 });
      gsap.set(valAssetsRef.current, { x: -120 });
      gsap.set(valContentRef.current, { x: 120 });
      gsap.set(lolContentRef.current, { autoAlpha: 0, x: -120 });
      gsap.set(lolAssetsRef.current, { autoAlpha: 0, x: 120 });

      const refreshSectionOffsets = () => {
        const vh = scrollContainer.clientHeight;

        valorantOffset =
          document.getElementById("valorant-section")?.offsetTop ?? vh;
        leagueOffset =
          document.getElementById("lol-section")?.offsetTop ?? vh * 2;
        ctaOffset =
          document.getElementById("cta-section")?.offsetTop ?? vh * 3;
      };

      const animateScrollState = () => {
        const scrollPos = scrollContainer.scrollTop;
        const vh = scrollContainer.clientHeight;
        const heroExit = scrollRange(scrollPos, vh, 0.05, 0.55);
        const valorantEnter = sectionEnterProgress(scrollPos, vh, valorantOffset);
        const valorantExit = sectionEnterProgress(scrollPos, vh, leagueOffset);
        const valorantProgress = clamp(valorantEnter - valorantExit);
        const leagueEnter = sectionEnterProgress(scrollPos, vh, leagueOffset);
        const leagueExit = sectionEnterProgress(scrollPos, vh, ctaOffset);
        const leagueProgress = clamp(leagueEnter - leagueExit);

        gsap.set(heroTextRef.current, {
          autoAlpha: 1 - heroExit,
          x: -120 * heroExit,
        });

        gsap.set(heroCtaRef.current, {
          autoAlpha: 1 - heroExit,
          x: -120 * heroExit,
        });

        gsap.set(heroLogoRef.current, {
          autoAlpha: 1 - heroExit,
          scale: 1 - 0.12 * heroExit,
          x: 120 * heroExit,
        });

        gsap.set(valAssetsRef.current, {
          autoAlpha: valorantProgress,
          x: -120 * (1 - valorantProgress),
        });
        gsap.set(valContentRef.current, {
          autoAlpha: valorantProgress,
          x: 120 * (1 - valorantProgress),
        });

        gsap.set(lolContentRef.current, {
          autoAlpha: leagueProgress,
          x: -120 * (1 - leagueProgress),
        });
        gsap.set(lolAssetsRef.current, {
          autoAlpha: leagueProgress,
          x: 120 * (1 - leagueProgress),
        });
      };

      const scheduleScrollState = () => {
        if (animationFrame) {
          return;
        }

        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = 0;
          animateScrollState();
        });
      };

      const handleViewportChange = () => {
        updateViewportHeight();
        refreshSectionOffsets();
        scheduleScrollState();
      };

      updateViewportHeight();
      refreshSectionOffsets();
      animateScrollState();
      scrollContainer.addEventListener("scroll", scheduleScrollState, { passive: true });
      window.addEventListener("resize", handleViewportChange);
      window.visualViewport?.addEventListener("resize", handleViewportChange);
      window.visualViewport?.addEventListener("scroll", handleViewportChange);

      removeScrollListeners = () => {
        scrollContainer.removeEventListener("scroll", scheduleScrollState);
        window.removeEventListener("resize", handleViewportChange);
        window.visualViewport?.removeEventListener("resize", handleViewportChange);
        window.visualViewport?.removeEventListener("scroll", handleViewportChange);
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }
      };
    });

    return () => {
      removeScrollListeners();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <PrismCanvas scrollContainerRef={scrollRef} />
      <Header />
      <main
        className="scroll-container relative z-10 bg-transparent text-on-background selection:bg-primary selection:text-on-primary"
        id="main-scroll"
        ref={scrollRef}
      >
        <section
          className="scroll-section z-10 flex items-center justify-center bg-transparent"
          id="hero-section"
        >
          <div className="home-section-shell relative z-20 mx-auto grid grid-cols-1 items-center gap-gutter px-4 md:px-grid-margin lg:grid-cols-12">
            <div className="relative flex min-h-[calc(var(--app-height)-6rem)] flex-col justify-start pt-12 md:min-h-0 md:justify-center md:pt-0 lg:col-span-12">
              <div
                className="pointer-events-none relative z-30 max-w-[22rem] md:max-w-none"
                ref={heroTextRef}
              >
                <span className="mb-4 block font-label-caps text-label-caps uppercase text-primary">
                  {homeContent.eyebrow}
                </span>
                <h1 className="hero-title font-display-xl uppercase italic text-white drop-shadow-2xl">
                  Violet
                  <br />
                  <span className="text-primary not-italic">OP</span>
                </h1>
                <p className="home-hero-copy mt-6 max-w-xl font-body-lg text-body-lg text-on-surface-variant drop-shadow-2xl">
                  {homeContent.body}
                </p>
                <div className="relative z-40 mt-12 hidden gap-4 md:flex">
                  <Link
                    className="pointer-events-auto op-clip bg-primary px-8 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
                    href="/about-us"
                  >
                    About Us
                  </Link>
                </div>
              </div>

              <div
                className="home-hero-logo pointer-events-none absolute left-1/2 top-[70%] z-20 w-[min(88vw,24rem)] -translate-x-1/2 -translate-y-1/2 opacity-55 md:top-[55%] md:w-full md:max-w-2xl lg:left-[75%] lg:opacity-100"
                ref={heroLogoRef}
              >
                <Image
                  alt="NYU Violet OP identity"
                  className="w-full scale-95 drop-shadow-[0_0_90px_rgba(204,72,255,0.72)] md:scale-105"
                  height={720}
                  preload
                  quality={85}
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 70vw, 92vw"
                  src="/images/logo.avif"
                  width={720}
                />
              </div>
            </div>
          </div>

          <div
            className="fixed bottom-40 left-4 z-40 flex md:hidden"
            ref={heroCtaRef}
          >
            <Link
              className="op-clip bg-primary px-8 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
              href="/about-us"
            >
              About Us
            </Link>
          </div>
        </section>

        <section
          className="scroll-section z-10 flex items-center justify-center bg-transparent"
          id="valorant-section"
        >
          <div className="absolute inset-0 z-0">
            <Image
              alt="Violet OP Valorant group"
              className="object-cover opacity-25"
              fill
              quality={45}
              sizes="100vw"
              src="/images/valologo.webp"
            />
          </div>

          <div className="home-section-shell relative z-20 mx-auto grid grid-cols-1 items-center gap-8 px-4 md:px-grid-margin lg:grid-cols-2 lg:gap-12">
            <div
              className="relative flex flex-col items-center justify-center"
              ref={valAssetsRef}
            >
              <Image
                alt="Waylay Valorant agent"
                className="home-feature-character relative z-10 max-h-[56vh] object-contain drop-shadow-[0_0_38px_rgba(204,72,255,0.48)] md:max-h-[70vh]"
                height={1100}
                quality={70}
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 55vw, 82vw"
                src="/images/waylay.webp"
                width={700}
              />
            </div>

            <div
              className="home-roster-panel glass-panel section-text-panel op-clip border-l-4 border-l-tertiary p-6 md:p-stack-xl"
              ref={valContentRef}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tertiary" />
                <span className="font-label-caps text-label-caps uppercase text-tertiary">
                  Meet the Teams
                </span>
              </div>
              <h2 className="mb-8 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
                VALORANT <span className="text-tertiary">Rosters</span>
              </h2>

              <div className="mb-8 grid grid-cols-2 gap-4">
                {valorantTeams.map((team) => (
                  <Link
                    className="home-roster-card flex min-h-48 flex-col gap-2 rounded border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                    href={team.href}
                    key={team.name}
                  >
                    <div className="home-roster-card-media relative h-28 w-full overflow-hidden rounded bg-surface-container">
                      <Image
                        alt={`${team.name} team`}
                        className="object-contain object-center opacity-80"
                        fill
                        quality={60}
                        sizes="(min-width: 1024px) 240px, 50vw"
                        src={team.image}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-lg text-on-surface">
                        {team.name}
                      </span>
                      <span className="font-label-caps text-[10px] uppercase text-tertiary">
                        {team.tier}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                className="flex items-center gap-2 font-label-caps text-label-caps text-tertiary transition-transform hover:translate-x-2"
                href="/join-us"
              >
                Join Us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section
          className="scroll-section z-10 flex items-center justify-center bg-transparent"
          id="lol-section"
        >
          <div className="absolute inset-0 z-0">
            <Image
              alt="League of Legends atmospheric backdrop"
              className="object-cover opacity-20"
              fill
              quality={45}
              sizes="100vw"
              src="/images/lollogo.avif"
            />
          </div>

          <div className="home-section-shell relative z-20 mx-auto grid grid-cols-1 items-center gap-8 px-4 md:px-grid-margin lg:grid-cols-2 lg:gap-12">
            <div
              className="home-roster-panel glass-panel section-text-panel op-clip order-2 flex flex-col items-end border-r-4 border-r-primary p-6 text-right md:p-stack-xl lg:order-1"
              ref={lolContentRef}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="font-label-caps text-label-caps uppercase text-primary">
                  Meet the Teams
                </span>
                <span className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <h2 className="mb-8 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
                League <span className="text-primary">Rosters</span>
              </h2>

              <div className="mb-8 grid w-full grid-cols-2 gap-4">
                {leagueTeams.map((team) => (
                  <Link
                    className="home-roster-card flex min-h-48 flex-col gap-2 rounded border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                    href={team.href}
                    key={team.name}
                  >
                    <div className="home-roster-card-media relative h-28 w-full overflow-hidden rounded bg-surface-container">
                      <Image
                        alt={`${team.name} team`}
                        className="object-contain object-center opacity-80"
                        fill
                        quality={60}
                        sizes="(min-width: 1024px) 240px, 50vw"
                        src={team.image}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-lg text-on-surface">
                        {team.name}
                      </span>
                      <span className="font-label-caps text-[10px] uppercase text-tertiary">
                        {team.tier}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                className="flex items-center gap-2 self-end font-label-caps text-label-caps text-primary transition-transform hover:-translate-x-2"
                href="/join-us"
              >
                <span aria-hidden="true">←</span> Join Us
              </Link>
            </div>

            <div
              className="order-1 flex flex-col items-center justify-center lg:order-2"
              ref={lolAssetsRef}
            >
              <Image
                alt="Ahri League of Legends champion"
                className="home-feature-character relative z-10 max-h-[58vh] object-contain drop-shadow-[0_0_48px_rgba(240,120,255,0.58)] md:max-h-[70vh]"
                height={1100}
                quality={70}
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 55vw, 82vw"
                src="/images/ahri.avif"
                width={700}
              />
            </div>
          </div>
        </section>

        <section
          className="scroll-section z-10 flex flex-col items-center justify-center bg-transparent px-4 text-center md:px-grid-margin"
          id="cta-section"
        >
          <div className="home-cta-shell relative z-10 max-w-4xl space-y-stack-md md:pb-12">
            <span className="font-label-caps text-label-caps uppercase text-on-primary-container">
              {joinContent.title}
            </span>
            <h2 className="font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
              Join <span className="text-primary">Us</span>
            </h2>
            <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              {homeContent.join}
            </p>

            <div className="grid w-full grid-cols-1 items-stretch gap-gutter pt-stack-md md:grid-cols-2">
              <Link
                className="home-cta-card glass-panel op-clip flex h-full min-h-80 w-full flex-col justify-between p-8 transition-all hover:neon-glow-purple"
                href="/join-us"
              >
                <div>
                  <h3 className="mb-2 font-bold font-headline-md text-headline-md text-primary">
                    Choose Your Path
                  </h3>
                  <p className="mb-4 font-body-md text-body-md text-on-surface/70">
                    {joinContent.intro}
                  </p>
                </div>
                <span className="border-b border-primary pb-1 font-label-caps text-label-caps">
                  Join Us
                </span>
              </Link>

              <Link
                className="home-cta-card glass-panel op-clip flex h-full min-h-80 w-full flex-col justify-between p-8 transition-all hover:neon-glow-purple"
                href="/join-us"
              >
                <div>
                  <h3 className="mb-2 font-bold font-headline-md text-headline-md text-tertiary">
                    Not a Player?
                  </h3>
                  <p className="mb-4 font-body-md text-body-md text-on-surface/70">
                    {joinContent.staffIntro}
                  </p>
                </div>
                <span className="border-b border-tertiary pb-1 font-label-caps text-label-caps">
                  Join the Staff
                </span>
              </Link>
            </div>
          </div>
          <Footer />
        </section>
      </main>
    </>
  );
}
