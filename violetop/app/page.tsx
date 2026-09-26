import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGameCard from "./components/HomeGameCard";
import { HomeGameArtwork, HomeGameLogo } from "./components/HomeGameArtwork";
import {
  calendarFeeds,
  eventsContent,
  highlightsContent,
  homeContent,
  homeFaqs,
  joinContent,
  leagueTeams,
  valorantTeams,
} from "./data/siteContent";
import { getEventArtwork } from "./data/eventArtwork";
import { getCalendarEvents, type CalendarEvent } from "./lib/ical";
import styles from "./Home.module.css";

const discordUrl = "https://discord.gg/MAmXcrkADb";

function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

function EventPreview({ event, featured = false }: { event: CalendarEvent; featured?: boolean }) {
  const artwork = getEventArtwork(event);

  return (
    <article className={featured ? styles.featuredEvent : styles.supportEvent}>
      <div className={styles.eventVisual}>
        <Image
          alt={artwork.alt}
          fill
          quality={82}
          sizes={featured ? "(max-width: 760px) calc(100vw - 40px), 62vw" : "(max-width: 760px) calc(100vw - 40px), 24vw"}
          src={artwork.src}
          style={{ objectPosition: artwork.objectPosition }}
        />
      </div>
      <div className={styles.eventDetails}>
        <div className={styles.eventDate}>
          <span>{event.month}</span>
          <strong>{event.day}</strong>
        </div>
        <div className={styles.eventText}>
          <span className={styles.kicker}>{event.weekday} · Violet OP event</span>
          <h3>{event.title}</h3>
          <time dateTime={event.startsAt}>{event.time}</time>
          {event.location ? <p>{event.location}</p> : null}
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const { events, error } = await getCalendarEvents(calendarFeeds.events, 3);
  const [featuredEvent, ...supportEvents] = events;
  const openPlayerPaths = joinContent.paths.filter((path) => !path.filled);
  const openStaffExamples = joinContent.staffRoles.filter(
    (role) => !role.filled && /events|creative/i.test(role.name),
  );
  const featuredClip = highlightsContent.clips[0];

  return (
    <>
      <Header />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section aria-labelledby="hero-title" className={`${styles.hero} ${styles.glassCard}`} id="hero-section">
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{homeContent.eyebrow}<span> / Collegiate esports</span></p>
            <h1 id="hero-title">Play together.<br /><em>Compete together.</em></h1>
            <p className={styles.heroIntro}>{homeContent.body}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={discordUrl} rel="noopener noreferrer" target="_blank">Join Discord <Arrow external /></a>
              <Link className={styles.secondaryAction} href="#teams">Explore Teams <Arrow /></Link>
            </div>
            <p className={styles.heroNote}>Competition, community, and the people who make both happen.</p>
          </div>
          <div className={styles.heroMedia}>
            <Image alt="Violet OP members gathered for a community group photo" className={styles.heroPhoto} fill preload quality={85} sizes="(max-width: 900px) 100vw, 50vw" src="/images/groupphoto.avif" />
            <div className={styles.photoCaption}><span>New York University</span></div>
          </div>
        </section>
        <section aria-labelledby="events-title" className={`${styles.section} ${styles.glassCard}`} id="latest">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>On the calendar</p>
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
                <h3>{error ? "Calendar Temporarily Unavailable" : "Nothing Scheduled Just Yet"}</h3>
                <p>{error ? "We couldn't load the calendar right now. Find current updates on the Events page or in Discord." : eventsContent.emptyMessage}</p>
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
              <p className={styles.eyebrow}>Meet the rosters</p>
              <h2 id="teams-title">Two Games. One Community.</h2>
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

        <section aria-labelledby="community-title" className={`${styles.section} ${styles.solidCard} ${styles.communitySection}`}>
          <div className={styles.communityIntro}>
            <p className={styles.eyebrow}>The community in motion</p>
            <h2 id="community-title">The Players Make the Moments.</h2>
            <p>Violet OP brings competition, creative work, and friendship into the same space. Meet the people behind the teams and watch their plays.</p>
            <Link className={styles.textLink} href="/about-us">Get to know Violet OP <Arrow /></Link>
          </div>
          <div className={styles.highlightFeature}>
            <a
              aria-label={`Watch ${featuredClip.title} on YouTube`}
              className={styles.highlightMedia}
              href={featuredClip.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt={`Thumbnail for ${featuredClip.title}`}
                fill
                quality={84}
                sizes="(max-width: 760px) calc(100vw - 40px), 48vw"
                src="/images/highlights/we-deserve-lan-thumbnail.webp"
              />
              <span className={styles.highlightShade} aria-hidden="true" />
              <span className={styles.playSymbol} aria-hidden="true">▶</span>
            </a>
            <div className={styles.highlightCopy}>
              <span className={styles.kicker}>From the video archive</span>
              <h3>{featuredClip.title}</h3>
              <p>Start with this Violet OP VALORANT video, or browse the rest of the archive.</p>
              <div className={styles.highlightActions}>
                <a className={styles.textLink} href={featuredClip.url} rel="noopener noreferrer" target="_blank">Watch Video <Arrow external /></a>
                <Link className={styles.textLink} href="/highlights">All Highlights <Arrow /></Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="paths-title" className={`${styles.section} ${styles.violetCard}`} id="get-involved">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Find your place</p>
              <h2 id="paths-title">Get Involved.</h2>
            </div>
          </div>
          <div className={styles.pathList}>
            <article className={styles.pathRow}>
              <span className={styles.pathNumber}>01</span>
              <div><h3>Competitive Teams</h3><p>Try out for a VALORANT roster or join a League squad. Each listing shows its requirements and current status.</p></div>
              <div className={styles.pathAction}>
                <span>{openPlayerPaths.length ? `Listed as open: ${openPlayerPaths.map((path) => path.name.replace("VOP ", "")).join(", ")}` : "No player applications currently listed as open"}</span>
                <Link className={styles.textLink} href="/join-us#player-paths">Explore roster paths <Arrow /></Link>
              </div>
            </article>
            <article className={styles.pathRow}>
              <span className={styles.pathNumber}>02</span>
              <div><h3>Community Play</h3><p>Meet other players, follow events, and find people to queue with without starting in a formal tryout.</p></div>
              <div className={styles.pathAction}>
                <span>Start with the Violet OP Discord.</span>
                <a className={styles.textLink} href={discordUrl} rel="noopener noreferrer" target="_blank">Join the community <Arrow external /></a>
              </div>
            </article>
            <article className={styles.pathRow}>
              <span className={styles.pathNumber}>03</span>
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
            <div><p className={styles.eyebrow}>Good to know</p><h2 id="faq-title">Frequently Asked Questions.</h2></div>
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
