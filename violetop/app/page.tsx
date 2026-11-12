import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGameCard from "./components/HomeGameCard";
import HomeHeroVideo from "./components/HomeHeroVideo";
import HomeHighlights from "./components/HomeHighlights";
import { HomeGameArtwork, HomeGameLogo } from "./components/HomeGameArtwork";
import {
  eventsContent,
  homeContent,
  homeFaqs,
  joinContent,
  leagueTeams,
  valorantTeams,
} from "./data/siteContent";
import { eventArtwork, type EventArtwork } from "./data/eventArtwork";
import { getUpcomingMainEvents, type MainEvent } from "./data/mainEvents";
import styles from "./Home.module.css";

const discordUrl = "https://discord.gg/MAmXcrkADb";
export const revalidate = 900;

function EventPreview({ event, featured = false }: { event: MainEvent; featured?: boolean }) {
  const artwork: EventArtwork = eventArtwork[event.artwork];
  const date = new Date(`${event.startsOn}T12:00:00Z`);

  return (
    <Link href={`/events/${event.id}`} aria-label={`View ${event.title}`} className={featured ? styles.featuredEvent : styles.supportEvent}>
      <div className={styles.eventVisual}>
        <Image
          alt={artwork.alt}
          fill
          quality={82}
          sizes={featured ? "(max-width: 760px) calc(100vw - 40px), 62vw" : "(max-width: 760px) calc(100vw - 40px), 24vw"}
          src={artwork.src}
          style={{ objectPosition: artwork.objectPosition, objectFit: artwork.objectFit ?? "cover" }}
        />
      </div>
      <div className={styles.eventDetails}>
        <div className={styles.eventDate}>
          <span>{date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}</span>
          <strong>{date.getUTCDate()}</strong>
        </div>
        <div className={styles.eventText}>
          {event.tentative ? <span className={styles.kicker}>Tentative</span> : null}
          {event.status ? <span className={styles.kicker}>{event.status}</span> : null}
          <h3>{event.title}</h3>
          <time dateTime={event.startsOn}>{event.dateLabel}</time>
          {event.time ? <p>{event.time}{event.startsAt ? " · New York time" : ""}</p> : null}
          {event.location ? <p>{event.location}</p> : null}
          {featured ? <p>{event.description}</p> : null}
          <span className={styles.eventAction}>View event</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const upcomingEvents = getUpcomingMainEvents(new Date());
  const watchParty = upcomingEvents.find((event) => event.series === "worlds-watch-party");
  const watchPartyRsvp = watchParty?.actions?.find((action) => action.primary);
  const [featuredEvent, ...supportEvents] = upcomingEvents.slice(0, 3);
  const openPlayerPaths = joinContent.paths.filter((path) => path.applicationsOpen);
  const openStaffExamples = joinContent.staffRoles.filter(
    (role) => !role.filled && /events|creative/i.test(role.name),
  );

  return (
    <>
      <Header />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        {watchParty && watchPartyRsvp ? (
          <a href={watchPartyRsvp.href} className={styles.seasonRibbon} target="_blank" rel="noopener noreferrer">
            <span>Worlds 2026 Watch Party</span>
            <span>November 14 · {watchParty.time} · RSVP on Luma</span>
          </a>
        ) : null}
        <section aria-labelledby="hero-title" className={`${styles.hero} ${styles.glassCard}`} id="hero-section">
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{homeContent.eyebrow}<span> / Collegiate esports</span></p>
            <h1 id="hero-title">Play together.<br /><em>Compete together.</em></h1>
            <p className={styles.heroIntro}>{homeContent.body}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={discordUrl} rel="noopener noreferrer" target="_blank">Join Discord</a>
              <Link className={styles.secondaryAction} href="#teams">Explore Teams</Link>
            </div>
          </div>
          <HomeHeroVideo />
        </section>
        <section aria-labelledby="events-title" className={`${styles.section} ${styles.glassCard}`} id="latest">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="events-title">What’s Happening</h2>
            </div>
            <Link className={styles.textLink} href="/events">View all events</Link>
          </div>
          {featuredEvent ? (
            <div className={supportEvents.length ? styles.eventLayout : styles.eventLayoutSingle}>
              <div>
                <EventPreview event={featuredEvent} featured />
                {featuredEvent.actions?.some((action) => action.primary) ? (
                  <div className={styles.heroActions}>
                    {featuredEvent.actions.filter((action) => action.primary).map((action) => (
                      <a key={action.href} className={styles.primaryAction} href={action.href} target={action.href.startsWith("https:") ? "_blank" : undefined} rel={action.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{action.label}</a>
                    ))}
                  </div>
                ) : null}
              </div>
              {supportEvents.length ? (
                <div className={styles.supportEvents}>
                  {supportEvents.map((event) => <EventPreview event={event} key={event.id} />)}
                </div>
              ) : null}
            </div>
          ) : (
            <div className={styles.emptyEvents}>
              <div>
                
                <h3>No Upcoming Main Events</h3>
                <p>{eventsContent.emptyMessage}</p>
              </div>
              <div className={styles.emptyActions}>
                <Link className={styles.secondaryAction} href="/events">Check events</Link>
                <a className={styles.textLink} href={discordUrl} rel="noopener noreferrer" target="_blank">Ask in Discord</a>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="teams-title" className={`${styles.section} ${styles.solidCard}`} id="teams">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="teams-title">Teams</h2>
            </div>
          </div>
          <div className={styles.gameGrid}>
            <HomeGameCard className={`${styles.gamePanel} ${styles.valorantPanel}`} id="valorant-section">
              <div className={styles.gameArt}>
                <HomeGameArtwork game="valorant" />
              </div>
              <Link aria-label="Explore VALORANT teams" className={styles.gamePanelLink} href="/teams/valorant">
                <div className={styles.gamePanelContent}>
                  <h3 className={styles.gameTitle}><span className="sr-only">VALORANT</span><HomeGameLogo game="valorant" /></h3>
                  <p>Four rosters across competitive and open-rank pathways, including Gamechangers.</p>
                  <span className={styles.panelAction}>Explore VALORANT Teams</span>
                </div>
              </Link>
              <div aria-label="VALORANT teams" className={styles.teamLinks}>
                {valorantTeams.map((team) => (
                  <Link href={team.href} key={team.href}>
                    <Image alt="" height={28} quality={75} src={team.image} width={30} />
                    <span>{team.name}</span>
                  </Link>
                ))}
              </div>
            </HomeGameCard>
            <HomeGameCard className={`${styles.gamePanel} ${styles.leaguePanel}`} id="lol-section">
              <div className={styles.gameArt}>
                <HomeGameArtwork game="league" />
              </div>
              <Link aria-label="Explore League of Legends teams" className={styles.gamePanelLink} href="/teams/league-of-legends">
                <div className={styles.gamePanelContent}>
                  <h3 className={styles.gameTitle}><span className="sr-only">League of Legends</span><HomeGameLogo game="league" /></h3>
                  <p>Two League of Legends rosters for competitive and community play.</p>
                  <span className={styles.panelAction}>Explore League Teams</span>
                </div>
              </Link>
              <div aria-label="League of Legends teams" className={styles.teamLinks}>
                {leagueTeams.map((team) => (
                  <Link href={team.href} key={team.href}>
                    <Image alt="" height={28} quality={75} src={team.image} width={30} />
                    <span>{team.name}</span>
                  </Link>
                ))}
              </div>
            </HomeGameCard>
          </div>
        </section>

        <section aria-labelledby="community-title" className={`${styles.section} ${styles.solidCard} ${styles.highlightsSection}`}>
          <HomeHighlights />
        </section>

        <section aria-labelledby="paths-title" className={`${styles.section} ${styles.pathsSection}`} id="get-involved">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="paths-title">Get Involved</h2>
            </div>
          </div>
          <div className={styles.pathList}>
            <article className={styles.pathRow}>
              <div><h3>Competitive Teams</h3><p>Explore our VALORANT and League of Legends rosters. Each listing shows its requirements and current recruitment status.</p></div>
              <div className={styles.pathAction}>
                <span>{openPlayerPaths.length ? `Listed as open: ${openPlayerPaths.map((path) => path.name.replace("VOP ", "")).join(", ")}` : "All team applications are currently closed"}</span>
                <Link className={styles.textLink} href="/join-us#player-paths">View recruitment status</Link>
              </div>
            </article>
            <article className={styles.pathRow}>
              <div><h3>Community Play</h3><p>Meet other players, follow events, and find people to queue with without starting in a formal tryout.</p></div>
              <div className={styles.pathAction}>
                <span>Start with the Violet OP Discord.</span>
                <a className={styles.textLink} href={discordUrl} rel="noopener noreferrer" target="_blank">Join the community</a>
              </div>
            </article>
            <article className={styles.pathRow}>
              <div><h3>Staff & Creative</h3><p>Support the teams through coaching, events, design, content, and the work behind the scenes.</p></div>
              <div className={styles.pathAction}>
                <span>{openStaffExamples.length ? `Open examples: ${openStaffExamples.map((role) => role.name).join(", ")}` : "See current staff listings"}</span>
                <Link className={styles.textLink} href="/join-us#staff-roles">See staff opportunities</Link>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="faq-title" className={`${styles.section} ${styles.glassCard}`}>
          <div className={styles.sectionHeading}>
            <h2 id="faq-title">Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqList}>
            {homeFaqs.map((faq) => (
              <div className={styles.faqItem} key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
