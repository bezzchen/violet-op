"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "../components/PageShell";
import { allTeams, joinContent } from "../data/siteContent";

const teamByName = new Map(allTeams.map((team) => [team.name, team]));
const gameSections = [
  {
    id: "valorant",
    label: "VALORANT",
    logo: "/images/valologo.webp",
  },
  {
    id: "league",
    label: "League of Legends",
    logo: "/images/lollogo.avif",
  },
] as const;

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
        <h2 className="mt-3 font-display-xl text-3xl font-extrabold text-white md:text-[2.75rem]">
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
  const pathsRef = useRef<HTMLElement | null>(null);

  const scrollToPaths = () =>
    pathsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });

  return (
    <PageShell>
      <div className="wide-page-shell relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-16 pt-24 md:gap-24 md:px-grid-margin md:pb-24 md:pt-28">
        <header className="reveal-up join-hero relative flex items-end overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0">
            <Image
              alt=""
              className="object-cover object-center"
              fill
              preload
              quality={78}
              sizes="100vw"
              src="/images/groupphoto.avif"
            />
            <div className="join-hero-veil absolute inset-0" />
          </div>

          <div className="relative z-10 max-w-2xl p-6 py-12 md:p-stack-xl md:py-16">
            <span className="font-label-caps text-label-caps uppercase text-primary">
              Join Us
            </span>
            <h1 className="mt-4 font-display-xl text-4xl font-extrabold text-white md:text-display-xl">
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

        <section className="grid scroll-mt-24 gap-8" id="player-paths" ref={pathsRef}>
          <SectionHeading
            blurb="Six rosters across VALORANT and League of Legends — from stage-ready elite to open-rank community play."
            eyebrow="Find Your Roster"
            title="Choose Your Path"
          />

          <div className="grid gap-12">
            {gameSections.map((section, sectionIndex) => (
              <div className="grid gap-6" key={section.id}>
                <div className="reveal-up flex items-center gap-4" style={delay(sectionIndex)}>
                  <span className="relative h-14 w-14 shrink-0 md:h-16 md:w-16">
                    <Image
                      alt={`${section.label} logo`}
                      className="object-contain"
                      fill
                      quality={70}
                      sizes="64px"
                      src={section.logo}
                    />
                  </span>
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-tertiary">
                      Recruiting
                    </span>
                    <h3 className="font-headline-md text-2xl font-bold text-white">
                      {section.label} Teams
                    </h3>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {joinContent.paths
                    .filter((path) => path.game === section.id)
                    .map((path, index) => {
                      const team = teamByName.get(path.name);

                      return (
                        <div
                          className="reveal-up"
                          key={path.name}
                          style={delay(sectionIndex * 4 + index + 1)}
                        >
                          <article
                            className={`join-path-card clip-card glass-panel flex h-full flex-col gap-6 rounded border p-6 md:p-7 ${
                              path.filled ? "join-card-filled" : "border-white/10"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4">
                                {team ? (
                                  <span className="relative h-14 w-14 shrink-0">
                                    <Image
                                      alt={`${team.name} crest`}
                                      className="object-contain"
                                      fill
                                      quality={70}
                                      sizes="56px"
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
                                  <h4 className="font-headline-md text-xl font-bold text-primary">
                                    {path.name}
                                  </h4>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 font-label-caps text-[10px] uppercase text-on-surface-variant">
                                {path.filled ? "Filled" : "Open"}
                              </span>
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

                            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3">
                              {path.filled ? (
                                <span className="op-clip border border-white/20 bg-white/5 px-5 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                                  Applications closed
                                </span>
                              ) : (
                                <Link
                                  className="op-clip bg-primary px-5 py-3 font-label-caps text-label-caps uppercase text-on-primary shadow-lg shadow-primary/20 transition-all hover:neon-glow-purple"
                                  href={path.joinHref}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  Apply ↗
                                </Link>
                              )}
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
              </div>
            ))}
          </div>
        </section>

        <section className="grid scroll-mt-24 gap-8 lg:grid-cols-[0.9fr_1.1fr]" id="staff-roles">
          <div className="reveal-up glass-panel section-text-panel op-clip border-r-4 border-r-tertiary p-6 md:p-stack-xl">
            <span className="font-label-caps text-label-caps uppercase text-tertiary">
              Not a Player?
            </span>
            <h2 className="mt-4 font-display-xl text-3xl font-extrabold text-white md:text-[2.75rem]">
              Join the Staff
            </h2>
            <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">
              {joinContent.staffIntro}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {joinContent.staffRoles.map((role, index) => {
              const team = teamForRole(role.name);
              const card = (
                <article
                  className={`join-role-card clip-card glass-panel flex h-full items-center gap-4 rounded border p-5 ${
                    role.filled ? "join-card-filled" : "border-white/10"
                  }`}
                >
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
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="font-headline-md text-base font-bold text-white">
                      {role.name}
                    </span>
                    <span className="shrink-0 font-label-caps text-[10px] uppercase text-tertiary">
                      {role.filled ? "Filled" : "Apply ↗"}
                    </span>
                  </div>
                </article>
              );

              return (
                <div className="reveal-up" key={role.name} style={delay(index)}>
                  {role.filled ? card : (
                    <Link className="block h-full" href={role.joinHref} rel="noreferrer" target="_blank">
                      {card}
                    </Link>
                  )}
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
            <h2 className="font-display-xl text-3xl font-extrabold text-white md:text-5xl">
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
