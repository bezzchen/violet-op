import Image from "next/image";
import { eventArtwork } from "../data/eventArtwork";
import { mainEvents } from "../data/mainEvents";
import styles from "./MainEventList.module.css";

export default function MainEventList() {
  return (
    <div className={styles.list}>
      {mainEvents.map((event) => {
        const artwork = eventArtwork[event.artwork];
        return (
          <article className={`glass-panel event-row-panel ${styles.card}`} key={event.id}>
            <div className={styles.imageFrame}>
              <Image
                alt={artwork.alt}
                fill
                quality={82}
                sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1400px) calc((100vw - 72px) / 2), 664px"
                src={artwork.src}
                style={{ objectPosition: artwork.objectPosition }}
              />
            </div>
            <div className={styles.content}>
              <div className={styles.date}>
                <time dateTime={event.startsOn}>{event.dateLabel}</time>
                {event.tentative ? <span className={styles.tentative}>Tentative</span> : null}
              </div>
              <h3>{event.title}</h3>
              {event.time || event.location ? (
                <dl className={styles.logistics}>
                  {event.time ? <div><dt>Time</dt><dd>{event.startsAt ? <time dateTime={event.startsAt}>{event.time}</time> : event.time}</dd></div> : null}
                  {event.location ? <div><dt>Location</dt><dd>{event.location}</dd></div> : null}
                </dl>
              ) : null}
              <p className={styles.description}>{event.description}</p>
              {event.details ? <p className={styles.details}>{event.details}</p> : null}
              {event.registrationNotice ? <p className={styles.registrationNotice}>{event.registrationNotice}</p> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
