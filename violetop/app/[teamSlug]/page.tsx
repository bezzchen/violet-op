import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../components/PageShell";
import TeamHeroMotion from "../components/TeamHeroMotion";
import { siteMeta, teamPages } from "../data/siteContent";

type TeamRouteParams = {
  teamSlug: string;
};

type TeamPageData = (typeof teamPages)[number];

const accentClasses = {
  primary: {
    border: "border-primary/35",
    borderSide: "border-l-primary",
    glow: "shadow-primary/20",
    line: "bg-primary",
    soft: "bg-primary/10",
    text: "text-primary",
  },
  tertiary: {
    border: "border-tertiary/35",
    borderSide: "border-l-tertiary",
    glow: "shadow-tertiary/20",
    line: "bg-tertiary",
    soft: "bg-tertiary/10",
    text: "text-tertiary",
  },
};

const defaultStaffNeeds = [
  {
    role: "TBA",
    detail: "Head Coach",
  },
  {
    role: "TBA",
    detail: "Analyst",
  },
  {
    role: "TBA",
    detail: "Team Manager",
  },
];

const revealStyle = (index: number) =>
  ({ "--team-delay": `${index * 90}ms` }) as CSSProperties;

const getTeamTitleParts = (name: string) => {
  if (!name.startsWith("VOP ")) {
    return { prefix: "", rest: name };
  }

  return { prefix: "VOP", rest: name.slice(4) };
};

const normalizeRoster = (team: TeamPageData) => {
  const minimumSlots = team.game === "valorant" ? 5 : 5;
  const roster = team.roster.map((member) => (member.trim() ? member : "TBA"));

  return Array.from({ length: Math.max(minimumSlots, roster.length) }, (_, index) => ({
    name: roster[index] ?? "TBA",
    slot: `Slot ${String(index + 1).padStart(2, "0")}`,
  }));
};

function SectionHeading({
  accent,
  eyebrow,
  title,
}: {
  accent: (typeof accentClasses)[keyof typeof accentClasses];
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="team-section-heading">
      <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
        {eyebrow}
      </span>
      <div className="mt-3 flex items-end gap-5">
        <h2 className="font-display-xl text-4xl font-extrabold uppercase text-white md:text-[3.5rem]">
          {title}
        </h2>
        <span className={`mb-3 hidden h-px flex-1 ${accent.line} md:block`} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return teamPages.map((team) => ({
    teamSlug: team.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TeamRouteParams>;
}): Promise<Metadata> {
  const { teamSlug } = await params;
  const team = teamPages.find((item) => item.slug === teamSlug);

  if (!team) {
    return {
      title: siteMeta.title,
      description: siteMeta.description,
    };
  }

  return {
    title: `${team.name} | ${siteMeta.title}`,
    description: siteMeta.description,
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<TeamRouteParams>;
}) {
  const { teamSlug } = await params;
  const team = teamPages.find((item) => item.slug === teamSlug);

  if (!team) {
    notFound();
  }

  const accent = accentClasses[team.accent as keyof typeof accentClasses];
  const supportRoles = team.staff.length > 0 ? team.staff : defaultStaffNeeds;
  const rosterSlots = normalizeRoster(team);
  const titleParts = getTeamTitleParts(team.name);

  return (
    <PageShell>
      <section className="relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-24 px-4 pb-20 pt-20 md:px-grid-margin md:pb-28 md:pt-24">
        <TeamHeroMotion
          className="team-reveal team-hero-section relative min-h-[calc(var(--app-height)-5rem)] overflow-hidden"
          style={revealStyle(0)}
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              alt=""
              className="team-hero-game-backdrop object-contain"
              data-team-hero-backdrop
              fill
              quality={45}
              sizes="100vw"
              src={team.gameLogo}
            />
          </div>

          <div className="relative z-10 grid min-h-[calc(var(--app-height)-5rem)] items-center gap-10 p-5 md:p-8 lg:grid-cols-[minmax(19.2rem,0.58fr)_1fr] lg:p-12 xl:grid-cols-[minmax(24.32rem,0.61fr)_1fr]">
            <div className="team-hero-copy op-clip p-6 md:p-stack-xl" data-team-hero-copy>
              <div className="mb-6 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${accent.line}`} />
                <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                  {team.gameLabel}
                </span>
              </div>

              <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                {team.label}
              </span>
              <h1 className="team-hero-title mt-6 font-display-xl font-extrabold uppercase text-white">
                {titleParts.prefix ? (
                  <>
                    <span className="team-hero-title-vop">{titleParts.prefix}</span>
                    <span className="team-hero-title-rest">{titleParts.rest}</span>
                  </>
                ) : (
                  <span className="team-hero-title-rest">{titleParts.rest}</span>
                )}
              </h1>
            </div>

            <div
              className="team-hero-art relative min-h-[40rem] md:min-h-[56rem] lg:min-h-[60rem]"
              data-team-hero-media
            >
              <div className="team-hero-team-mark">
                <Image
                  alt={`${team.name} logo`}
                  className="object-contain object-center"
                  fill
                  quality={60}
                  sizes="(min-width: 1024px) 260px, 48vw"
                  src={team.image}
                />
              </div>
              <Image
                alt={`${team.feature.name} ${team.gameLabel} feature`}
                className="team-hero-feature object-contain"
                fill
                preload
                quality={78}
                sizes="(min-width: 1024px) 46vw, 92vw"
                src={team.feature.image}
              />
            </div>
          </div>
        </TeamHeroMotion>

        <section className="team-reveal grid gap-8 lg:grid-cols-[0.68fr_1.32fr]" style={revealStyle(1)}>
          <SectionHeading
            accent={accent}
            eyebrow={`${team.feature.label}: ${team.feature.name}`}
            title="Overview"
          />

          <div className="team-overview-copy op-clip p-6 md:p-stack-xl">
            <p className="max-w-4xl font-headline-md text-3xl font-bold uppercase text-on-surface md:text-[2.75rem] md:leading-[1.02]">
              {team.feature.summary}
            </p>

            <div className="mt-8 grid max-w-4xl gap-5 font-body-lg text-body-lg text-on-surface-variant">
              {team.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="team-reveal grid gap-8 lg:grid-cols-[0.75fr_1.25fr]" style={revealStyle(2)}>
          <SectionHeading accent={accent} eyebrow="Program Brief" title="Identity" />

          <div className="grid gap-4 md:grid-cols-3">
            {team.requirements.map((item, index) => (
              <article
                className="team-reveal glass-panel team-info-card rounded border border-white/10 p-5"
                key={item}
                style={revealStyle(index + 3)}
              >
                <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                  {`0${index + 1}`}
                </span>
                <p className="mt-4 font-headline-md text-xl font-bold uppercase text-white">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="team-reveal grid gap-8" style={revealStyle(3)}>
          <SectionHeading accent={accent} eyebrow="Lineup" title="Roster" />

          <div className="grid gap-4 md:grid-cols-5">
            {rosterSlots.map((member, index) => (
              <article
                className="team-reveal team-roster-card glass-panel rounded border border-white/10 p-5"
                key={`${member.slot}-${member.name}`}
                style={revealStyle(index + 4)}
              >
                <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                  {member.slot}
                </span>
                <h3 className="mt-8 font-headline-md text-2xl font-bold uppercase text-white">
                  {member.name}
                </h3>
                <p className="mt-2 font-label-caps text-label-caps uppercase text-on-surface-variant/60">
                  Role TBA
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="team-reveal grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" style={revealStyle(4)}>
          <div>
            <SectionHeading accent={accent} eyebrow="Support System" title="Staff" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {supportRoles.map((staff, index) => (
                <article
                  className="team-reveal glass-panel team-info-card rounded border border-white/10 p-5"
                  key={`${staff.role}-${staff.detail}`}
                  style={revealStyle(index + 5)}
                >
                  <h3 className={`font-headline-md text-xl font-bold uppercase ${accent.text}`}>
                    {staff.role}
                  </h3>
                  <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
                    {staff.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className={`glass-panel section-text-panel op-clip border-l-4 ${accent.borderSide} p-6 md:p-stack-xl`}>
            <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
              Tryout Path
            </span>
            <h2 className="mt-4 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
              Ready to join?
            </h2>
            <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">
              {team.proof}
            </p>
            <Link
              className="mt-8 inline-flex op-clip bg-primary px-7 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
              href="/join-us"
            >
              Join Us
            </Link>
          </div>
        </section>
      </section>
    </PageShell>
  );
}
