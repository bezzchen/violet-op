import Image from "next/image";
import Link from "next/link";
import { pastEvents } from "../data/pastEvents";
import styles from "./Media.module.css";

export default function EventArchive({ compact = false }: { compact?: boolean }) {
  const Heading = compact ? "h3" : "h2";
  return (
    <div className={`${styles.cardGrid} ${compact ? styles.compactGrid : ""}`}>
      {pastEvents.map((event) => (
        <Link className={styles.eventCard} href={`/media/${event.slug}`} key={event.slug}>
          <div className={styles.cardImage}>
            <Image alt={event.coverAlt} fill quality={82} sizes={compact ? "(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 320px" : "(max-width: 700px) calc(100vw - 32px), 640px"} src={event.cover} style={{ objectPosition: event.coverPosition }} />
          </div>
          <div className={styles.cardBody}>
            <time dateTime={event.date}>{event.dateLabel}</time>
            <Heading>{event.title}</Heading>
            {!compact ? <p>{event.description}</p> : null}
            <span className={styles.cardLink}>View event media <span aria-hidden="true">↗</span></span>
          </div>
        </Link>
      ))}
    </div>
  );
}
