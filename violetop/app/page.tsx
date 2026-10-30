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
import { getUpcomingMainEvents, halloweenEventId, type MainEvent } from "./data/mainEvents";
import styles from "./Home.module.css";

const discordUrl = "https://discord.gg/MAmXcrkADb";
export const revalidate = 900;

function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

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
          <span className={styles.eventAction}>View event <Arrow /></span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const upcomingEvents = getUpcomingMainEvents(new Date());
  const halloween = upcomingEvents.find((event) => event.id === halloweenEventId);
  const [featuredEvent, ...supportEvents] = upcomingEvents.filter((event) => event.id !== halloween?.id).slice(0, 3);
  const openPlayerPaths = joinContent.paths.filter((path) => path.applicationsOpen);
  const openStaffExamples = joinContent.staffRoles.filter(
    (role) => !role.filled && /events|creative/i.test(role.name),
  );

  return (
    <>
      <Header />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        {halloween ? <Link href="#halloween" className={styles.seasonRibbon}><span>Halloween at NYU</span><span>Oct 31 · 1:30–5 PM · GCASL Grand Hall <Arrow /></span></Link> : null}
        <section aria-labelledby="hero-title" className={`${styles.hero} ${styles.glassCard}`} id="hero-section">
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{homeContent.eyebrow}<span> / Collegiate esports</span></p>
            <h1 id="hero-title">Play together.<br /><em>Compete together.</em></h1>
            <p className={styles.heroIntro}>{homeContent.body}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={discordUrl} rel="noopener noreferrer" target="_blank">Join Discord <Arrow external /></a>
              <Link className={styles.secondaryAction} href="#teams">Explore Teams <Arrow /></Link>
            </div>
          </div>
          <HomeHeroVideo />
        </section>
        {halloween ? (
          <section className={`${styles.section} ${styles.halloweenFeature}`} id="halloween" aria-labelledby="halloween-title">
            <div className={styles.halloweenCopy}>
              <p className={styles.halloweenEyebrow}>October 31 · Road to Worlds NYU</p>
              <h2 id="halloween-title">Halloween Fest<br /><em>&amp; Worlds Watch Party</em></h2>
              <p className={styles.halloweenHosts}>{halloween.hosts}</p>
              <p className={styles.halloweenIntro}>Come for Worlds. Stay for the costumes, creative activities, and a whole afternoon with the community.</p>
              <dl className={styles.halloweenLogistics}>
                <div><dt>When</dt><dd><time dateTime={halloween.startsAt}>Saturday, October 31<br />1:30–5 PM EDT</time></dd></div>
                <div><dt>Where</dt><dd>GCASL Grand Hall<br />5th floor · 238 Thompson Street</dd></div>
              </dl>
              <ul className={styles.halloweenHighlights}>
                <li>Costume judging at 2:30 PM</li><li>Worlds viewing &amp; Riot merch giveaways</li><li>Anime, art &amp; the Blind Ranking Challenge</li>
              </ul>
              <div className={styles.heroActions}>
                <a className={styles.halloweenRsvp} href="https://luma.com/l5ny5fhb" target="_blank" rel="noopener noreferrer">RSVP on Luma <Arrow external /></a>
                <Link className={styles.secondaryAction} href={`/events/${halloween.id}`}>Full event details <Arrow /></Link>
              </div>
              <p className={styles.halloweenNote}>Host approval required. Non-NYU guests: RSVP early for guest registration.</p>
            </div>
            <Link className={styles.halloweenPoster} href={`/events/${halloween.id}`} aria-label="View Halloween Fest details">
              <Image src="/images/events/halloween-fest-2026.webp" alt={eventArtwork.halloweenFest.alt} width={512} height={640} quality={85} sizes="(max-width: 760px) calc(100vw - 64px), 400px" />
            </Link>
          </section>
        ) : null}
        <section aria-labelledby="events-title" className={`${styles.section} ${styles.glassCard}`} id="latest">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="events-title">What’s Happening</h2>
            </div>
            <Link className={styles.textLink} href="/events">View all events <Arrow /></Link>
          </div>
          {featuredEvent ? (
            <div className={supportEvents.length ? styles.eventLayout : styles.eventLayoutSingle}>
              <EventPreview event={featuredEvent} featured />
              {supportEvents.length ? (
                <div className={styles.supportEvents}>
                  {supportEvents.map((event) => <EventPreview event={event} key={event.id} />)}
                </div>
              ) : null}
            </div>
          ) : (
            <div className={styles.emptyEvents}>
              <div>
                <span className={styles.emptyMark} aria-hidden="true">↗</span>
                <h3>No Upcoming Main Events</h3>
                <p>{eventsContent.emptyMessage}</p>
              </div>
              <div className={styles.emptyActions}>
                <Link className={styles.secondaryAction} href="/events">Check events <Arrow /></Link>
                <a className={styles.textLink} href={discordUrl} rel="noopener noreferrer" target="_blank">Ask in Discord <Arrow external /></a>
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
                  <span className={styles.panelAction}>Explore VALORANT Teams <Arrow /></span>
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
                  <span className={styles.panelAction}>Explore League Teams <Arrow /></span>
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

        <section aria-labelledby="paths-title" className={`${styles.section} ${styles.violetCard}`} id="get-involved">
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
                <Link className={styles.textLink} href="/join-us#player-paths">View recruitment status <Arrow /></Link>
              </div>
            </article>
            <article className={styles.pathRow}>
              <div><h3>Community Play</h3><p>Meet other players, follow events, and find people to queue with without starting in a formal tryout.</p></div>
              <div className={styles.pathAction}>
                <span>Start with the Violet OP Discord.</span>
                <a className={styles.textLink} href={discordUrl} rel="noopener noreferrer" target="_blank">Join the community <Arrow external /></a>
              </div>
            </article>
            <article className={styles.pathRow}>
              <div><h3>Staff & Creative</h3><p>Support the teams through coaching, events, design, content, and the work behind the scenes.</p></div>
              <div className={styles.pathAction}>
                <span>{openStaffExamples.length ? `Open examples: ${openStaffExamples.map((role) => role.name).join(", ")}` : "See current staff listings"}</span>
                <Link className={styles.textLink} href="/join-us#staff-roles">See staff opportunities <Arrow /></Link>
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
