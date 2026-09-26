import Image from "next/image";
import EventList from "../components/EventList";
import { getEventArtwork } from "../data/eventArtwork";
import type { CalendarEvent } from "../lib/ical";
import styles from "./PlayerMatchList.module.css";

type Props = {
  events: CalendarEvent[];
  error: string | null;
};

export default function PlayerMatchList({ events, error }: Props) {
  if (error || !events.length) {
    return <EventList compact emptyMessage="No upcoming player matches are listed. Check the calendar or Discord for updates." error={error} events={events} />;
  }

  return (
    <div className={styles.list}>
      {events.map((event) => {
        const artwork = getEventArtwork(event);
        const hasDetails = event.url && /^https?:\/\//i.test(event.url);

        return (
          <article className={styles.row} key={event.id}>
            <div className={styles.thumbnail}>
              <Image alt={artwork.alt} fill quality={82} sizes="192px" src={artwork.src} style={{ objectPosition: artwork.objectPosition }} />
            </div>
            <div className={styles.information}>
              <h3>{event.title}</h3>
              <time dateTime={event.startsAt}>
                <span className={styles.date}>{event.month} {event.day}</span>{" "}
                <span>{event.time}</span>
              </time>
              {event.location ? <p>{event.location}</p> : null}
            </div>
            <div className={styles.trailing}>
              <span className={styles.weekday}>{event.weekday}</span>
              {hasDetails ? <a href={event.url} rel="noopener noreferrer" target="_blank">Event details <span aria-hidden="true">↗</span><span className="sr-only">: {event.title}</span></a> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
