"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "./components/Header";
import Footer from "./components/Footer";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (value: number) => {
  const progress = clamp(value);

  return progress * progress * (3 - 2 * progress);
};

const scrollRange = (scrollPos: number, vh: number, start: number, end: number) =>
  smoothstep((scrollPos - vh * start) / (vh * (end - start)));

const valorantTeams = [
  { name: "VOP White", tier: "Varsity", image: "/images/vopwhite.avif" },
  { name: "VOP Purple", tier: "Junior Varsity", image: "/images/voppurple.avif" },
  { name: "VOP Black", tier: "Academy", image: "/images/vopblack.png" },
  { name: "VOP Gamechangers", tier: "Marginalized", image: "/images/vopblack.png" },
];

const leagueTeams = [
  { name: "Baron", tier: "Varsity" },
  { name: "Elder", tier: "Development" },
];

export default function Home() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const heroLogoRef = useRef<HTMLDivElement | null>(null);
  const valAssetsRef = useRef<HTMLDivElement | null>(null);
  const valContentRef = useRef<HTMLDivElement | null>(null);
  const lolAssetsRef = useRef<HTMLDivElement | null>(null);
  const lolContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }

    let removeScrollListeners = () => {};

    const ctx = gsap.context(() => {
      gsap.set(heroTextRef.current, { autoAlpha: 1, x: 0 });
      gsap.set(heroLogoRef.current, { autoAlpha: 1, scale: 1, x: 0 });
      gsap.set([valAssetsRef.current, valContentRef.current], { autoAlpha: 0 });
      gsap.set(valAssetsRef.current, { x: -120 });
      gsap.set(valContentRef.current, { x: 120 });
      gsap.set(lolContentRef.current, { autoAlpha: 0, x: -120 });
      gsap.set(lolAssetsRef.current, { autoAlpha: 0, x: 120 });

      const animateScrollState = () => {
        const scrollPos = scrollContainer.scrollTop;
        const vh = window.innerHeight;
        const heroExit = scrollRange(scrollPos, vh, 0.05, 0.55);
        const valorantEnter = scrollRange(scrollPos, vh, 0.45, 0.95);
        const valorantExit = scrollRange(scrollPos, vh, 1.25, 1.75);
        const valorantProgress = clamp(valorantEnter - valorantExit);
        const leagueEnter = scrollRange(scrollPos, vh, 1.45, 1.95);
        const leagueExit = scrollRange(scrollPos, vh, 2.35, 2.85);
        const leagueProgress = clamp(leagueEnter - leagueExit);

        gsap.set(heroTextRef.current, {
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

      animateScrollState();
      scrollContainer.addEventListener("scroll", animateScrollState, { passive: true });
      window.addEventListener("resize", animateScrollState);

      removeScrollListeners = () => {
        scrollContainer.removeEventListener("scroll", animateScrollState);
        window.removeEventListener("resize", animateScrollState);
      };
    });

    return () => {
      removeScrollListeners();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Header />
      <main
        className="scroll-container bg-background text-on-background selection:bg-primary selection:text-on-primary"
        id="main-scroll"
        ref={scrollRef}
      >
        <section
          className="scroll-section flex items-center justify-center bg-surface-container-lowest"
          id="hero-section"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary-container/10 via-transparent to-background" />
          <div className="container relative z-20 mx-auto grid grid-cols-1 items-center gap-gutter px-4 md:px-grid-margin lg:grid-cols-12">
            <div className="relative lg:col-span-12">
              <div className="relative z-30 pointer-events-none" ref={heroTextRef}>
                <span className="mb-4 block font-label-caps text-label-caps uppercase text-primary">
                  New York University Esports
                </span>
                <h1 className="hero-title font-display-xl uppercase italic text-white drop-shadow-2xl">
                  Violet
                  <br />
                  <span className="text-primary not-italic">OP</span>
                </h1>
              </div>

              <div
                className="absolute left-1/2 top-1/2 z-20 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 opacity-50 lg:left-2/3 lg:opacity-100"
                ref={heroLogoRef}
              >
                <Image
                  alt="NYU Violet OP identity"
                  className="w-full scale-105 drop-shadow-[0_0_80px_rgba(134,3,226,0.5)]"
                  height={720}
                  priority
                  src="/images/logo.avif"
                  width={720}
                />
              </div>

              <div className="relative z-40 mt-12 flex gap-4">
                <a
                  className="op-clip bg-primary px-8 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
                  href="#cta-section"
                >
                  About Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="scroll-section flex items-center justify-center bg-[#0f1923]"
          id="valorant-section"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#010a13] via-[#010a13]/70 to-transparent" />
            <Image
              alt="Violet OP Valorant group"
              className="object-cover opacity-25"
              fill
              sizes="100vw"
              src="/images/valologo.webp"
            />
          </div>

          <div className="container relative z-20 mx-auto grid grid-cols-1 items-center gap-8 px-4 md:px-grid-margin lg:grid-cols-2 lg:gap-12">
            <div
              className="relative flex flex-col items-center justify-center"
              ref={valAssetsRef}
            >
              <Image
                alt="Valorant logo"
                className="relative z-20 mb-8 w-44 md:w-64"
                height={180}
                src="/images/valologo.webp"
                width={360}
              />
              <Image
                alt="Jett Valorant agent"
                className="relative z-10 max-h-[58vh] object-contain drop-shadow-[0_0_30px_rgba(0,219,233,0.3)] md:max-h-[70vh]"
                height={780}
                src="/images/waylay.webp"
                width={520}
              />
            </div>

            <div
              className="glass-panel op-clip border-l-4 border-l-tertiary p-6 md:p-stack-xl"
              ref={valContentRef}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tertiary" />
                <span className="font-label-caps text-label-caps uppercase text-tertiary">
                  Squadron Deployment: active
                </span>
              </div>
              <h2 className="mb-8 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
                Tactical <span className="text-tertiary">Rosters</span>
              </h2>

              <div className="mb-8 grid grid-cols-2 gap-4">
                {valorantTeams.map((team) => (
                  <article
                    className="flex min-h-48 flex-col gap-2 rounded border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                    key={team.name}
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded bg-surface-container">
                      <Image
                        alt={`${team.name} team`}
                        className="object-cover object-top opacity-80"
                        fill
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
                  </article>
                ))}
              </div>

              <a
                className="flex items-center gap-2 font-label-caps text-label-caps text-tertiary transition-transform hover:translate-x-2"
                href="#cta-section"
              >
                View Roster <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="scroll-section flex items-center justify-center bg-[#010a13]"
          id="lol-section"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#010a13] via-[#010a13]/70 to-transparent" />
            <Image
              alt="League of Legends atmospheric backdrop"
              className="object-cover opacity-20"
              fill
              sizes="100vw"
              src="/images/lollogo.avif"
            />
          </div>

          <div className="container relative z-20 mx-auto grid grid-cols-1 items-center gap-8 px-4 md:px-grid-margin lg:grid-cols-2 lg:gap-12">
            <div
              className="glass-panel op-clip order-2 flex flex-col items-end border-r-4 border-r-primary p-6 text-right md:p-stack-xl lg:order-1"
              ref={lolContentRef}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="font-label-caps text-label-caps uppercase text-primary">
                  Squadron Deployment: active
                </span>
                <span className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <h2 className="mb-8 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
                Ascending the <span className="text-primary">Rift</span>
              </h2>

              <div className="mb-8 grid w-full grid-cols-2 gap-4">
                {leagueTeams.map((team) => (
                  <article
                    className="flex min-h-48 flex-col gap-2 rounded border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                    key={team.name}
                  >
                    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded bg-primary/10">
                      <Image
                        alt={`${team.name} crest`}
                        className="object-contain p-5 opacity-60"
                        fill
                        sizes="(min-width: 1024px) 240px, 50vw"
                        src="/images/vopwhite.avif"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-lg text-on-surface">
                        {team.name}
                      </span>
                      <span className="font-label-caps text-[10px] uppercase text-primary">
                        {team.tier}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <a
                className="flex items-center gap-2 self-end font-label-caps text-label-caps text-primary transition-transform hover:-translate-x-2"
                href="#cta-section"
              >
                <span aria-hidden="true">←</span> View Roster
              </a>
            </div>

            <div
              className="order-1 flex flex-col items-center justify-center lg:order-2"
              ref={lolAssetsRef}
            >
              <Image
                alt="League of Legends logo"
                className="relative z-20 mb-8 w-56 md:w-80"
                height={240}
                src="/images/lollogo.avif"
                width={480}
              />
              <Image
                alt="Ekko League of Legends champion"
                className="relative z-10 max-h-[58vh] object-contain drop-shadow-[0_0_40px_rgba(224,182,255,0.4)] md:max-h-[70vh]"
                height={760}
                src="/images/ahri.avif"
                width={520}
              />
            </div>
          </div>
        </section>

        <section
          className="scroll-section relative flex flex-col items-center justify-center bg-surface px-4 text-center md:px-grid-margin"
          id="cta-section"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/20 via-transparent to-transparent" />
          <div className="z-10 max-w-4xl space-y-stack-md pb-28 md:pb-12">
            <span className="font-label-caps text-label-caps uppercase text-on-primary-container">
              Join the legacy
            </span>
            <h2 className="font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
              Are you <span className="text-primary">Overpowered?</span>
            </h2>
            <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              Whether you&apos;re a high-ELO competitor, a broadcast specialist, or a
              community builder, there&apos;s a place for you in the Violet OP
              ecosystem.
            </p>

            <div className="flex flex-col items-center justify-center gap-gutter pt-stack-md md:flex-row">
              <a
                className="glass-panel op-clip w-full p-8 transition-all hover:neon-glow-purple md:w-80"
                href="https://discord.gg/MAmXcrkADb"
                rel="noreferrer"
                target="_blank"
              >
                <h3 className="mb-2 font-headline-md text-headline-md text-primary">
                  Players
                </h3>
                <p className="mb-4 font-body-md text-body-md text-on-surface/70">
                  Trial for our premiere rosters.
                </p>
                <span className="border-b border-primary pb-1 font-label-caps text-label-caps">
                  Apply Now
                </span>
              </a>

              <a
                className="glass-panel op-clip w-full p-8 transition-all hover:neon-glow-purple md:w-80"
                href="https://discord.gg/MAmXcrkADb"
                rel="noreferrer"
                target="_blank"
              >
                <h3 className="mb-2 font-headline-md text-headline-md text-tertiary">
                  Staff
                </h3>
                <p className="mb-4 font-body-md text-body-md text-on-surface/70">
                  Coaching and management.
                </p>
                <span className="border-b border-tertiary pb-1 font-label-caps text-label-caps">
                  Join Crew
                </span>
              </a>
            </div>
          </div>
          <Footer />
        </section>
      </main>
    </>
  );
}
