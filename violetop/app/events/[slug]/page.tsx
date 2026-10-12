import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "../../components/PageShell";
import { eventArtwork } from "../../data/eventArtwork";
import { mainEvents } from "../../data/mainEvents";
import { pastEvents } from "../../data/pastEvents";
import styles from "./EventDetail.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return mainEvents.map((event) => ({ slug: event.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = mainEvents.find((entry) => entry.id === slug);
  if (!event) notFound();
  return { title: `${event.title} | Violet OP`, description: event.description };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  if (pastEvents.some((event) => event.slug === slug)) redirect(`/media/${slug}`);
  const event = mainEvents.find((entry) => entry.id === slug);
  if (!event) notFound();
  const artwork = eventArtwork[event.artwork];
  const related = mainEvents.filter((entry) => entry.series === event.series && entry.id !== event.id);

  return (
    <PageShell>
      <div className={styles.page}>
        <Link className={styles.back} href="/events">← All events</Link>
        <article className={styles.event}>
          <div className={styles.artwork}>
            <Image alt={artwork.alt} fill preload quality={85} sizes="(max-width: 760px) calc(100vw - 32px), 1120px" src={artwork.src} style={{ objectPosition: artwork.objectPosition }} />
          </div>
          <div className={styles.content}>
            <p className={styles.eyebrow}>Violet OP · Main event</p>
            <h1>{event.title}</h1>
            <dl className={styles.logistics}>
              <div><dt>Date</dt><dd><time dateTime={event.startsOn}>{event.dateLabel}</time>{event.tentative ? <span className={styles.badge}>Tentative</span> : null}</dd></div>
              <div><dt>Time</dt><dd>{event.startsAt ? <time dateTime={event.startsAt}>{event.time} · New York time</time> : event.time ?? "TBA"}</dd></div>
              {event.location ? <div><dt>Location</dt><dd>{event.location}</dd></div> : null}
            </dl>
            <div className={styles.description}>
              <h2>About the event</h2>
              <p>{event.description}</p>
              {event.details ? <p>{event.details}</p> : null}
              {event.registrationNotice ? <p className={styles.notice}>{event.registrationNotice}</p> : null}
            </div>
            <p className={styles.scheduleNote}>Dates and details are from the 2026 draft schedule and may change.</p>
            <a className={styles.discord} href="https://discord.gg/MAmXcrkADb" target="_blank" rel="noopener noreferrer">Event updates on Discord <span aria-hidden="true">↗</span></a>
          </div>
        </article>
        {related.length ? (
          <section className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title">More from the VOP Cup</h2>
            {related.map((entry) => <Link key={entry.id} href={`/events/${entry.id}`}><span>{entry.title}<small>{entry.dateLabel}{entry.tentative ? " · Tentative" : ""}</small></span><span aria-hidden="true">→</span></Link>)}
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
