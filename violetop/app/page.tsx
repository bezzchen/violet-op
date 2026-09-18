import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Header from "./components/Header";
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
import { getCalendarEvents, type CalendarEvent } from "./lib/ical";
import styles from "./Home.module.css";

const discordUrl = "https://discord.gg/MAmXcrkADb";

function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

function EventPreview({ event, featured = false }: { event: CalendarEvent; featured?: boolean }) {
  return (
    <article className={featured ? styles.featuredEvent : styles.supportEvent}>
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
        <section aria-labelledby="hero-title" className={styles.hero} id="hero-section">
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{homeContent.eyebrow} <span> / Collegiate esports</span></p>
            <h1 id="hero-title">Play Together.<br /><em>Compete Together.</em></h1>
            <p className={styles.heroIntro}>{homeContent.body}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={discordUrl} rel="noopener noreferrer" target="_blank">
                Join Discord <Arrow external />
              </a>
              <Link className={styles.secondaryAction} href="#teams">
                Explore Teams <Arrow />
              </Link>
            </div>
            <p className={styles.heroNote}>Competition, community, and the people who make both happen.</p>
          </div>
          <div className={styles.heroMedia}>
            <Image
              alt="Violet OP members gathered for a group photo"
              className={styles.heroPhoto}
              fill
              preload
              quality={82}
              sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 48vw"
              src="/images/groupphoto.avif"
            />
            <div className={styles.photoCaption}><span>01 / The community</span><span>New York University</span></div>
          </div>
        </section>

        <section aria-labelledby="events-title" className={styles.section} id="latest">
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

        <section aria-labelledby="teams-title" className={`${styles.section} ${styles.teamsSection}`} id="teams">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Meet the rosters</p>
              <h2 id="teams-title">Two Games. One Community.</h2>
            </div>
            <p className={styles.sectionLead}>Find a team to follow, a squad to grow with, or your next place to compete.</p>
          </div>
          <div className={styles.gameGrid}>
            <article className={`${styles.gamePanel} ${styles.valorantPanel}`} id="valorant-section">
              <div className={styles.gameArt}>
                <Image alt="" fill quality={75} sizes="(max-width: 760px) 85vw, 40vw" src="/images/jettfull.webp" />
              </div>
              <Link aria-label="Explore VALORANT teams" className={styles.gamePanelLink} href="/teams/valorant">
                <div className={styles.gamePanelContent}>
                  <span className={styles.kicker}>01 / Tactical shooter</span>
                  <h3>VALORANT</h3>
                  <p>Four rosters across competitive and open-rank pathways, including a dedicated space for marginalized-gender players.</p>
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
            </article>
            <article className={`${styles.gamePanel} ${styles.leaguePanel}`} id="lol-section">
              <div className={styles.gameArt}>
                <Image alt="" fill quality={75} sizes="(max-width: 760px) 85vw, 40vw" src="/images/ahri.avif" />
              </div>
              <Link aria-label="Explore League of Legends teams" className={styles.gamePanelLink} href="/teams/league-of-legends">
                <div className={styles.gamePanelContent}>
                  <span className={styles.kicker}>02 / Multiplayer strategy</span>
                  <h3>League of Legends</h3>
                  <p>Meet VOP Elder and VOP Baron, our open-rank League rosters for team play, customs, and community.</p>
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
            </article>
          </div>
        </section>

        <section aria-labelledby="paths-title" className={`${styles.section} ${styles.pathsSection}`} id="get-involved">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Find your place</p>
              <h2 id="paths-title">More Than One Way In.</h2>
            </div>
            <p className={styles.sectionLead}>{homeContent.join}</p>
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

        <section aria-labelledby="community-title" className={`${styles.section} ${styles.communitySection}`}>
          <div className={styles.communityIntro}>
            <p className={styles.eyebrow}>The community in motion</p>
            <h2 id="community-title">The Players Make the Moments.</h2>
            <p>Violet OP brings competition, creative work, and friendship into the same space. Meet the people behind the teams and watch their plays.</p>
            <Link className={styles.textLink} href="/about-us">Get to know Violet OP <Arrow /></Link>
          </div>
          <div className={styles.highlightFeature}>
            <span className={styles.kicker}>From the video archive</span>
            <span className={styles.playSymbol} aria-hidden="true">▶</span>
            <h3>{featuredClip.title}</h3>
            <p>Start with this Violet OP VALORANT video, or browse the rest of the archive.</p>
            <div className={styles.highlightActions}>
              <a className={styles.textLink} href={featuredClip.url} rel="noopener noreferrer" target="_blank">Watch video <Arrow external /></a>
              <Link className={styles.textLink} href="/highlights">All highlights <Arrow /></Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className={`${styles.section} ${styles.faqSection}`}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Good to know</p><h2 id="faq-title">A Few Common Questions.</h2></div>
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

        <section aria-labelledby="close-title" className={styles.closing} id="cta-section">
          <div>
            <p className={styles.eyebrow}>Your next move</p>
            <h2 id="close-title">Start with the People.<br />Find Your Place in the Game.</h2>
          </div>
          <div className={styles.closingActions}>
            <p>Join the conversation now, or explore the current player and staff paths.</p>
            <a className={styles.primaryAction} href={discordUrl} rel="noopener noreferrer" target="_blank">Join Discord <Arrow external /></a>
            <Link className={styles.secondaryAction} href="/join-us">View joining paths <Arrow /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
