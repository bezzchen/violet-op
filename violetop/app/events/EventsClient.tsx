"use client";

import EventList from "../components/EventList";
import Link from "next/link";
import PageShell from "../components/PageShell";
import { calendarFeeds, eventsContent } from "../data/siteContent";
import { groupEvents } from "../data/eventGroups";
import { isScheduledMainEvent, type MainEvent } from "../data/mainEvents";
import EventArchive from "../media/EventArchive";
import mediaStyles from "../media/Media.module.css";
import type { CalendarEvent } from "../lib/ical";
import EventPhotoCarousel from "./EventPhotoCarousel";
import PlayerMatchList from "./PlayerMatchList";
import MainEventList from "./MainEventList";
import styles from "./Events.module.css";

export default function EventsClient({ events, error, upcomingMainEvents }: { events: CalendarEvent[]; error: string | null; upcomingMainEvents: MainEvent[] }) {
  const groups = groupEvents(events.filter((event) => !isScheduledMainEvent(event)));
  return (
    <PageShell>
      <div className={styles.page}>
        <div className={styles.heading}>
          <div><span className={styles.eyebrow}>Violet OP events</span><h1>{eventsContent.title}</h1></div>
          <a className={styles.calendarLink} href={calendarFeeds.events}>Subscribe to calendar <span aria-hidden="true">↗</span></a>
        </div>
        <EventPhotoCarousel />
        <section className={mediaStyles.pastSection} aria-labelledby="past-events-title">
          <div className={mediaStyles.sectionHeading}>
            <div><h2 id="past-events-title">Past events &amp; media</h2><p>Revisit the events through photos, videos, and reels.</p></div>
            <Link className={mediaStyles.allMedia} href="/media">All event media <span aria-hidden="true">↗</span></Link>
          </div>
          <EventArchive compact />
        </section>
        <div className={styles.columns}>
          <section aria-labelledby="matches-title" className={styles.column}>
            <h2 id="matches-title">Player Matches</h2>
            <p className={styles.columnIntro}>Upcoming matches, team practices, and scrims.</p>
            <PlayerMatchList error={error} events={groups.matches} />
          </section>
          <section aria-labelledby="main-events-title" className={styles.column}>
            <h2 id="main-events-title">Main Events</h2>
            <p className={styles.columnIntro}>Draft schedule · 2026. Tentative dates are marked; details may change. All times are New York local time.</p>
            <MainEventList events={upcomingMainEvents} />
          </section>
        </div>
        {groups.unclassified.length ? (
          <section aria-labelledby="unclassified-title" className={styles.unclassified}>
            <h2 id="unclassified-title">Needs Classification</h2>
            <p>These calendar entries do not specify whether they are player matches or general club events. They remain listed here until their category is confirmed.</p>
            <EventList events={groups.unclassified} />
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
