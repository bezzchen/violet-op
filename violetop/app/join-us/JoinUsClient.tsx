"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "../components/PageShell";
import { allTeams, joinContent } from "../data/siteContent";

const teamByName = new Map(allTeams.map((team) => [team.name, team]));
const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

// Match a staff-role string (e.g. "Head Coach for White") back to its team so
// the card can show that team's crest.
const teamForRole = (role: string) =>
  allTeams.find((team) => {
    const short = team.name.replace(/^VOP\s+/, "");
    return role.toLowerCase().includes(short.toLowerCase());
  });

const delay = (index: number) =>
  ({ "--reveal-delay": `${index * 90}ms` }) as CSSProperties;

function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="reveal-up flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="font-label-caps text-label-caps uppercase text-tertiary">
          {eyebrow}
        </span>
        <h2 className="mt-3 font-display-xl text-3xl font-extrabold uppercase text-white md:text-[2.75rem]">
          {title}
        </h2>
      </div>
      {blurb ? (
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant/75">
          {blurb}
        </p>
      ) : null}
    </div>
  );
}

export default function JoinUsClient() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const pathsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-up"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const scrollToPaths = () =>
    pathsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <PageShell scrollContainerRef={scrollRef}>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-16 pt-24 md:gap-24 md:px-grid-margin md:pb-24 md:pt-28">
        <header className="reveal-up join-hero relative flex items-end overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0">
            <Image
              alt=""
              className="object-cover object-center"
              fill
              preload
              quality={78}
              sizes="100vw"
              src="/images/background.webp"
            />
            <div className="join-hero-veil absolute inset-0" />
          </div>

          <div className="relative z-10 max-w-2xl p-6 py-12 md:p-stack-xl md:py-16">
            <span className="font-label-caps text-label-caps uppercase text-primary">
              Join Us
            </span>
            <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
              {joinContent.title}
            </h1>
            <p className="mt-6 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              {joinContent.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="op-clip cursor-pointer bg-primary px-7 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
                onClick={scrollToPaths}
                type="button"
              >
                Choose Your Path
              </button>
              <Link
                className="op-clip border border-white/25 px-7 py-4 font-label-caps text-label-caps uppercase text-white transition-colors hover:border-primary hover:text-primary"
                href="/highlights"
              >
                Watch Highlights
              </Link>
            </div>
          </div>
        </header>

        <section className="grid scroll-mt-24 gap-8" ref={pathsRef}>
          <SectionHeading
            blurb="Five rosters across VALORANT and League of Legends — from stage-ready elite to open-rank community play."
            eyebrow="Find Your Roster"
            title="Choose Your Path"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {joinContent.paths.map((path, index) => {
              const team = teamByName.get(path.name);

              return (
                <div className="reveal-up" key={path.name} style={delay(index)}>
                  <article className="clip-card glass-panel flex h-full flex-col gap-5 rounded border border-white/10 p-5">
                    <div className="flex items-center gap-3">
                      {team ? (
                        <span className="relative h-12 w-12 shrink-0">
                          <Image
                            alt={`${team.name} crest`}
                            className="object-contain"
                            fill
                            quality={70}
                            sizes="48px"
                            src={team.image}
                          />
                        </span>
                      ) : null}
                      <div>
                        {team ? (
                          <span className="font-label-caps text-label-caps uppercase text-tertiary">
                            {team.tier}
                          </span>
                        ) : null}
                        <h3 className="font-headline-md text-lg font-bold uppercase text-primary">
                          {path.name}
                        </h3>
                      </div>
                    </div>

                    {path.details.length > 0 ? (
                      <ul className="grid gap-2 font-body-md text-sm text-on-surface-variant">
                        {path.details.map((detail) => (
                          <li className="flex gap-2" key={detail}>
                            <span className="text-primary">›</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body-md text-sm text-on-surface-variant/70">
                        Open-rank community squad — hop in customs and play.
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3">
                      <Link
                        className="op-clip bg-primary px-5 py-3 font-label-caps text-label-caps uppercase text-on-primary shadow-lg shadow-primary/20 transition-all hover:neon-glow-purple"
                        href={path.joinHref}
                        rel={isExternalHref(path.joinHref) ? "noreferrer" : undefined}
                        target={isExternalHref(path.joinHref) ? "_blank" : undefined}
                      >
                        Join →
                      </Link>
                      {team ? (
                        <Link
                          className="font-label-caps text-label-caps uppercase text-tertiary transition-colors hover:text-white"
                          href={team.href}
                        >
                          View Team →
                        </Link>
                      ) : null}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal-up glass-panel section-text-panel op-clip border-r-4 border-r-tertiary p-6 md:p-stack-xl">
            <span className="font-label-caps text-label-caps uppercase text-tertiary">
              Not a Player?
            </span>
            <h2 className="mt-4 font-display-xl text-3xl font-extrabold uppercase text-white md:text-[2.75rem]">
              Join the Staff
            </h2>
            <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">
              {joinContent.staffIntro}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {joinContent.staffRoles.map((role, index) => {
              const team = teamForRole(role);

              return (
                <div className="reveal-up" key={role} style={delay(index)}>
                  <article className="clip-card glass-panel flex h-full items-center gap-4 rounded border border-white/10 p-5">
                    {team ? (
                      <span className="relative h-10 w-10 shrink-0">
                        <Image
                          alt={`${team.name} crest`}
                          className="object-contain"
                          fill
                          quality={70}
                          sizes="40px"
                          src={team.image}
                        />
                      </span>
                    ) : null}
                    <span className="font-headline-md text-base font-bold uppercase text-white">
                      {role}
                    </span>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-8">
          <SectionHeading eyebrow="Good to Know" title="FAQ" />

          <div className="grid gap-4 md:grid-cols-3">
            {joinContent.faqs.map((faq, index) => (
              <div className="reveal-up" key={faq.question} style={delay(index)}>
                <article className="clip-card glass-panel flex h-full flex-col gap-4 rounded border border-white/10 p-6">
                  <h3 className="font-headline-md text-lg font-bold text-primary">
                    {faq.question}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {faq.answer}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal-up join-cta relative overflow-hidden rounded-2xl border border-primary/25 p-8 text-center md:p-stack-xl">
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
            <span className="font-label-caps text-label-caps uppercase text-primary">
              Your Journey Starts Here
            </span>
            <h2 className="font-display-xl text-3xl font-extrabold uppercase text-white md:text-5xl">
              Ready to Represent?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Tryouts, community nights, and content — there is a lane for
              everyone at Violet OP.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                className="op-clip bg-primary px-8 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
                href="/events"
              >
                Community Events
              </Link>
              <Link
                className="op-clip border border-white/25 px-8 py-4 font-label-caps text-label-caps uppercase text-white transition-colors hover:border-primary hover:text-primary"
                href="/about-us"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
