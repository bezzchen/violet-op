import type { CSSProperties, ReactNode } from "react";
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

const VALORANT_TIERSET = "03621f52-342b-cf4e-4f86-9350a49c6d04";
const LEAGUE_UNRANKED_IMAGE = "/images/Season_2023_-_Unranked.webp";

const rankEmblemUrl = (tier: number) =>
  `https://media.valorant-api.com/competitivetiers/${VALORANT_TIERSET}/${tier}/largeicon.png`;

type RequirementBadge = {
  alt: string;
  plus: boolean;
  src: string;
};

const splitRequirement = (item: string) => {
  const match = item.match(/^\s*([^:]+):\s*(.*)$/);

  if (!match) {
    return { detail: item, title: "Info" };
  }

  return {
    detail: match[2].trim() || "TBA",
    title: match[1].trim(),
  };
};

const isRankRequirement = (item: string) => /^\s*rank:/i.test(item);

// Derive a rank emblem straight from the free-text "Rank:" requirement so the
// badge always matches the copy while allowing each game to use its own open
// rank art.
const getRequirementBadge = (
  team: TeamPageData,
  item: string,
): RequirementBadge | null => {
  if (!isRankRequirement(item)) {
    return null;
  }

  const { detail } = splitRequirement(item);

  if (team.game === "league" && /open\s*rank|unranked/i.test(detail)) {
    return {
      alt: "League of Legends Unranked emblem",
      plus: false,
      src: LEAGUE_UNRANKED_IMAGE,
    };
  }

  if (team.game !== "valorant") {
    return null;
  }

  if (/immortal/i.test(detail)) {
    return { alt: "Valorant Immortal rank emblem", plus: true, src: rankEmblemUrl(24) };
  }

  if (/open\s*rank|unranked/i.test(detail)) {
    return { alt: "Valorant Open rank emblem", plus: false, src: rankEmblemUrl(0) };
  }

  return null;
};

const laneRoles = ["Top", "Jungle", "Middle", "Bottom", "Support"] as const;

type LaneRole = (typeof laneRoles)[number];

// Official-style League position icons (provided as assets, inlined here so they
// can inherit the team accent via currentColor). The frame sits at reduced
// opacity behind the full-opacity directional marker for a two-tone look.
const lanePaths: Record<LaneRole, ReactNode> = {
  Top: (
    <>
      <path d="M16 16c32.06 0 64.12-.01 96.18.01-6.72 6.67-13.45 13.33-20.19 19.99H36v56c-6.66 6.73-13.33 13.46-19.99 20.18-.02-32.06 0-64.12-.01-96.18Z" />
      <path
        d="M104 44.02c5.32-5.33 10.65-10.64 15.99-15.94.02 30.64.01 61.28.01 91.92-30.64 0-61.28.01-91.93-.01 5.33-5.34 10.66-10.66 16-15.99 19.97-.01 39.95.01 59.93 0V44.02Z"
        opacity={0.375}
      />
      <path d="M56 56h28v28H56V56Z" opacity={0.375} />
    </>
  ),
  Jungle: (
    <path d="M72.13 57.86C78.7 41.1 90.04 26.94 99.94 12.1 93 29.47 84.31 46.87 84.04 65.97c-.73 4.81-2.83 9.31-4 14.03-2.08-7.57-4.91-14.9-7.91-22.14ZM36.21 12.35c13.06 20.19 26.67 40.61 33.61 63.87 4.77 15.49 5.42 32.94-1.8 47.8-5.58-6.1-11.08-12.29-16.71-18.34-4.97-4.72-10.26-9.1-15.32-13.71-1.55-11.73-2.97-23.87-8.72-34.42-2.75-5.24-6.71-9.72-11.19-13.55 9.67 4.75 19.18 10.41 26.23 18.72 4.37 4.98 7.46 10.94 9.69 17.15 1.15-10.29.58-20.79-2.05-30.81-3.31-12.68-8.99-24.55-13.74-36.71ZM105.84 53.83c4.13-4 8.96-7.19 14.04-9.84-4.4 3.88-8.4 8.32-11.14 13.55-5.75 10.56-7.18 22.71-8.74 34.45-5.32 5.35-10.68 10.65-15.98 16.01.15-4.37-.25-8.84 1.02-13.1 3.39-15.08 9.48-30.18 20.8-41.07Z" />
  ),
  Middle: (
    <>
      <path
        d="M16 16c22.67 0 45.33 0 67.99.01C78.62 21.34 73.28 26.69 67.88 32c-11.96 0-23.92-.01-35.88 0-.01 12 .01 24-.01 36-5.32 5.3-10.64 10.6-15.98 15.89C15.99 61.26 16 38.63 16 16zm87.95 51.9c5.32-5.37 10.69-10.68 16.04-16.02.02 22.71.01 45.41 0 68.12-22.65 0-45.31.01-67.97-.01 5.33-5.33 10.65-10.67 15.99-15.99 12-.01 23.99.01 35.99 0 .04-12.04-.05-24.07-.05-36.1z"
        opacity={0.375}
      />
      <path d="M100.02 16H120v19.99C92 64 64 92 35.99 120H16v-19.99C44 72 72 43.99 100.02 16z" />
    </>
  ),
  Bottom: (
    <>
      <path
        d="M16.01 16c30.64 0 61.27-.01 91.91.01-5.32 5.33-10.65 10.66-15.98 15.98-19.98.02-39.96 0-59.94.01-.05 19.98-.12 39.95-.17 59.92-5.25 5.36-10.54 10.67-15.82 16-.02-30.64-.01-61.28 0-91.92Z"
        opacity={0.375}
      />
      <path d="M52.01 52c9.33 0 18.66-.01 27.99.01V80H52c0-9.33 0-18.67.01-28Z" opacity={0.375} />
      <path d="M100 44.01c6.66-6.74 13.32-13.46 19.99-20.19.02 32.06 0 64.12.01 96.18-32.06-.01-64.12.02-96.18-.01C30.54 113.32 37.28 106.67 44 100h56V44.01Z" />
    </>
  ),
  Support: (
    <path d="M52.21 12.03c10.33-.1 20.66.06 30.99-.08 1.71 2.62 3.2 5.37 4.79 8.07C81.32 28 74.68 36.01 68 43.98 61.32 36 54.66 28 48.01 19.99c1.4-2.65 2.82-5.29 4.2-7.96ZM0 36.3c14.64-.68 29.33-.11 43.99-.3C48 40 52 44 56 48.01c-2.67 9.32-5.32 18.66-8.01 27.98-6.66-2.65-13.32-5.32-19.98-7.99 3.97-5.35 8.02-10.63 11.96-15.99-5.01-.08-10.15.4-15-1.14C15.58 48.12 7.75 42.05 0 36.34v-.04ZM92.02 36c14.66.05 29.32-.09 43.98.07v.03c-7.3 5.9-15.1 11.53-24.1 14.5-5.11 1.85-10.59 1.34-15.91 1.41 4.01 5.32 8 10.65 11.99 15.98-6.64 2.7-13.31 5.34-19.97 8-2.69-9.32-5.34-18.65-8.01-27.98C84.01 44 88 39.99 92.02 36ZM64.01 52.11c1.36 1.26 2.7 2.55 3.99 3.89 1.32-1.33 2.65-2.65 3.99-3.97 4.04 19.97 7.97 39.96 12.02 59.92-5.31 4.05-10.66 8.07-16.04 12.03-5.32-4.01-10.67-7.97-15.98-12.01 4.04-19.94 7.96-39.92 12.02-59.86Z" />
  ),
};

function LaneIcon({ className, role }: { className?: string; role: LaneRole }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 136 136">
      {lanePaths[role]}
    </svg>
  );
}

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
  const isLeague = team.game === "league";
  const titleParts = getTeamTitleParts(team.name);
  const restWords = titleParts.rest.trim().split(/\s+/);
  const titleRestClass = [
    "team-hero-title-rest",
    restWords.length > 1 && "is-multiword",
    restWords.some((word) => word.length >= 8) && "is-long",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <PageShell>
      <section className="wide-page-shell relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-12 px-4 pb-20 pt-20 md:gap-24 md:px-grid-margin md:pb-28 md:pt-24">
        <TeamHeroMotion
          className="team-reveal team-hero-section relative overflow-hidden"
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

          <div className="relative z-10 grid items-center gap-8 p-5 md:gap-10 md:p-8 lg:grid-cols-[minmax(19.2rem,0.58fr)_1fr] lg:p-12 xl:grid-cols-[minmax(24.32rem,0.61fr)_1fr]">
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
                    <span className={titleRestClass}>{titleParts.rest}</span>
                  </>
                ) : (
                  <span className={titleRestClass}>{titleParts.rest}</span>
                )}
              </h1>
            </div>

            <div
              className="team-hero-art relative aspect-[11/10]"
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
                className={`team-hero-feature object-contain ${
                  team.slug === "league1" ? "team-hero-feature-elder" : ""
                }`}
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
            {team.requirements.map((item, index) => {
              const requirement = splitRequirement(item);
              const requirementBadge = getRequirementBadge(team, item);

              return (
                <article
                  className="team-reveal glass-panel team-info-card rounded border border-white/10 p-5"
                  key={item}
                  style={revealStyle(index + 3)}
                >
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                      {`0${index + 1}:`}
                    </span>
                    <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                      {requirement.title}
                    </span>
                  </div>

                  {requirementBadge ? (
                    <div className="mt-6 flex items-center gap-2">
                      <Image
                        alt={requirementBadge.alt}
                        className="h-20 w-20 object-contain drop-shadow-[0_0_18px_rgba(209,76,255,0.55)]"
                        height={80}
                        quality={85}
                        src={requirementBadge.src}
                        width={80}
                      />
                      {requirementBadge.plus ? (
                        <span
                          className={`font-display-xl text-5xl font-extrabold leading-none ${accent.text}`}
                        >
                          +
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <p
                    className={`font-headline-md text-xl font-bold uppercase text-white ${
                      requirementBadge ? "mt-6" : "mt-10"
                    }`}
                  >
                    {requirement.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="team-reveal grid gap-8" style={revealStyle(3)}>
          <SectionHeading accent={accent} eyebrow="Lineup" title="Roster" />

          <div className="grid gap-4 md:grid-cols-5">
            {rosterSlots.map((member, index) => {
              const role = isLeague ? laneRoles[index % laneRoles.length] : null;

              return (
                <article
                  className="team-reveal team-roster-card glass-panel rounded border border-white/10 p-5"
                  key={`${member.slot}-${member.name}`}
                  style={revealStyle(index + 4)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-label-caps text-label-caps uppercase ${accent.text}`}>
                      {member.slot}
                    </span>
                    {role ? <LaneIcon className={`h-7 w-7 ${accent.text}`} role={role} /> : null}
                  </div>
                  <h3 className="mt-8 font-headline-md text-2xl font-bold uppercase text-white">
                    {member.name}
                  </h3>
                  <p className="mt-2 font-label-caps text-label-caps uppercase text-on-surface-variant/60">
                    {role ?? "Role TBA"}
                  </p>
                </article>
              );
            })}
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
