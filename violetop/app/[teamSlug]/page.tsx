import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../components/PageShell";
import { joinContent, siteMeta, teamPages } from "../data/siteContent";
import styles from "./TeamProfile.module.css";

type TeamRouteParams = { teamSlug: string };

export function generateStaticParams() {
  return teamPages.map((team) => ({ teamSlug: team.slug }));
}

export async function generateMetadata({ params }: { params: Promise<TeamRouteParams> }): Promise<Metadata> {
  const { teamSlug } = await params;
  const team = teamPages.find((item) => item.slug === teamSlug);
  return team
    ? { title: `${team.name} | ${siteMeta.title}`, description: `${team.name} roster, team information, and joining status at Violet OP.` }
    : { title: siteMeta.title, description: siteMeta.description };
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function displayRole(role: string) {
  if (role === "player") return "Player";
  if (role === "sub") return "Substitute";
  if (role === "super sub") return "Super Substitute";
  if (role === "Support / sub") return "Support / Substitute";
  return role;
}

export default async function TeamPage({ params }: { params: Promise<TeamRouteParams> }) {
  const { teamSlug } = await params;
  const team = teamPages.find((item) => item.slug === teamSlug);
  if (!team) notFound();

  const recruitment = joinContent.paths.find((path) => path.name === team.name);
  const sameGame = teamPages.filter((item) => item.game === team.game);
  const overviewHref = team.game === "valorant" ? "/teams/valorant" : "/teams/league-of-legends";
  const namedStaff = team.staff.filter((member) => member.role !== "TBA");
  const unnamedStaff = team.staff.filter((member) => member.role === "TBA");
  const support = "support" in team ? team.support : undefined;

  return (
    <PageShell>
      <div className={styles.wrap} data-team={team.slug}>
        <nav aria-label="Team navigation" className={styles.breadcrumb}>
          <Link href={overviewHref}>← {team.gameLabel} Teams</Link>
          <span aria-hidden="true">/</span>
          <span>{team.name}</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.identity}>
              <span className={styles.crest}><Image alt="" fill priority quality={75} sizes="76px" src={team.image} /></span>
              <span className={styles.eyebrow}>{team.gameLabel} / {team.label}</span>
            </div>
            <h1>{team.name}</h1>
            <p className={styles.tagline}>{team.feature.summary}</p>
            <div className={styles.heroActions}>
              <span className={styles.status}>{recruitment?.filled ? "Roster Filled" : "Applications Listed Open"}</span>
              <Link href="/join-us#player-paths">{recruitment?.filled ? "See Other Joining Paths" : "View Joining Details"} <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className={styles.art}>
            <Image alt="" fill priority quality={75} sizes="(max-width: 760px) 100vw, 42vw" src={team.feature.image} />
            <span className={styles.artLabel}>{team.feature.name}</span>
          </div>
        </header>

        <nav aria-label={`Other ${team.gameLabel} teams`} className={styles.switcher}>
          <span>Explore {team.gameLabel} Teams</span>
          <div>
            {sameGame.map((other) => (
              <Link aria-current={other.slug === team.slug ? "page" : undefined} href={`/${other.slug}`} key={other.slug}>{other.name}</Link>
            ))}
          </div>
        </nav>

        <div className={styles.content}>
          <section aria-labelledby="roster-heading" className={styles.rosterSection}>
            <div className={styles.sectionTitle}>
              <p className={styles.eyebrow}>The Lineup</p>
              <h2 id="roster-heading">Roster</h2>
              <span>{team.roster.length} listed members</span>
            </div>
            <div className={styles.rosterGrid}>
              {team.roster.map((member, index) => (
                <article className={styles.member} key={`${member.name}-${member.username}-${index}`}>
                  <span aria-hidden="true" className={styles.avatar}>{initials(member.name)}</span>
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.username}</p>
                  </div>
                  <span className={styles.memberRole}>{displayRole(member.role)}</span>
                </article>
              ))}
            </div>

            <div className={styles.staffSection}>
              <h2>Coaches & Staff</h2>
              {namedStaff.length ? (
                <div className={styles.staffGrid}>
                  {namedStaff.map((member, index) => (
                    <article className={styles.member} key={`${member.role}-${index}`}>
                      <span aria-hidden="true" className={styles.avatar}>{initials(member.role)}</span>
                      <div><h3>{member.role}</h3>{member.username ? <p>{member.username}</p> : null}</div>
                      <span className={styles.memberRole}>{member.detail}</span>
                    </article>
                  ))}
                </div>
              ) : <p className={styles.unlisted}>No staff members are listed for this roster yet.</p>}
              {unnamedStaff.length > 0 ? <p className={styles.unlisted}>Unassigned roles: {unnamedStaff.map((member) => member.detail).join(", ")}.</p> : null}
            </div>
          </section>

          <aside className={styles.details}>
            <section aria-labelledby="about-heading" className={styles.detailBlock}>
              <p className={styles.eyebrow}>Team Profile</p>
              <h2 id="about-heading">About {team.name}</h2>
              {team.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {support ? <p>{support}</p> : null}
            </section>
            <section aria-labelledby="requirements-heading" className={styles.detailBlock}>
              <p className={styles.eyebrow}>At a Glance</p>
              <h2 id="requirements-heading">Requirements & Commitment</h2>
              <dl>
                {team.requirements.map((requirement) => {
                  const [label, ...details] = requirement.split(":");
                  return <div key={requirement}><dt>{details.length ? label : "Info"}</dt><dd>{details.length ? details.join(":").trim() : requirement}</dd></div>;
                })}
              </dl>
            </section>
            <section aria-labelledby="joining-heading" className={styles.detailBlock}>
              <p className={styles.eyebrow}>Joining Status</p>
              <h2 id="joining-heading">{recruitment?.filled ? "Roster Currently Filled" : "Interested in Joining?"}</h2>
              <p>{recruitment?.filled
                ? "Applications for this roster are currently closed. Explore the other teams and community paths."
                : "Check the current application and full joining details before applying."}</p>
              <Link className={styles.detailAction} href="/join-us#player-paths">{recruitment?.filled ? "Explore Joining Paths" : "View Application Details"} <span aria-hidden="true">→</span></Link>
            </section>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
