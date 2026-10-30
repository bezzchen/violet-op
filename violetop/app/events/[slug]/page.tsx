import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "../../components/PageShell";
import { eventArtwork, type EventArtwork } from "../../data/eventArtwork";
import { mainEvents, mainEventRedirects } from "../../data/mainEvents";
import { pastEvents } from "../../data/pastEvents";
import styles from "./EventDetail.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...mainEvents.map((event) => ({ slug: event.id })), ...Object.keys(mainEventRedirects).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = mainEvents.find((entry) => entry.id === (mainEventRedirects[slug] ?? slug));
  if (!event) notFound();
  return { title: `${event.title} | Violet OP`, description: event.description };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  if (mainEventRedirects[slug]) redirect(`/events/${mainEventRedirects[slug]}`);
  if (pastEvents.some((event) => event.slug === slug)) redirect(`/media/${slug}`);
  const event = mainEvents.find((entry) => entry.id === slug);
  if (!event) notFound();
  const artwork: EventArtwork = eventArtwork[event.artwork];
  const related = mainEvents.filter((entry) => entry.series === event.series && entry.id !== event.id);

  return (
    <PageShell>
      <div className={styles.page}>
        <Link className={styles.back} href="/events">← All events</Link>
        <article className={`${styles.event} ${event.series === "halloween" ? styles.halloweenEvent : ""}`}>
          <div className={`${styles.artwork} ${artwork.objectFit === "contain" ? styles.posterArtwork : ""}`}>
            <Image alt={artwork.alt} fill preload quality={85} sizes="(max-width: 760px) calc(100vw - 32px), 1120px" src={artwork.src} style={{ objectPosition: artwork.objectPosition, objectFit: artwork.objectFit ?? "cover" }} />
          </div>
          <div className={styles.content}>
            <p className={styles.eyebrow}>{event.hosts ?? "Violet OP · Main event"}</p>
            <h1>{event.title}</h1>
            {event.status ? <p className={styles.status}>{event.status}</p> : null}
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
            {event.actions?.length ? <div className={styles.actions}>{event.actions.map((action) => <a key={action.href} href={action.href} className={action.primary ? styles.primaryAction : styles.discord} target={action.href.startsWith("https:") ? "_blank" : undefined} rel={action.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{action.label}<span aria-hidden="true">{action.href.startsWith("https:") ? "↗" : "→"}</span></a>)}</div> : null}
            {event.sections?.length ? <div className={styles.detailSections}>{event.sections.map((section) => <section key={section.title} className={styles.detailSection}><h2>{section.title}</h2>{section.body ? <p>{section.body}</p> : null}{section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</section>)}</div> : null}
            <p className={styles.scheduleNote}>{event.scheduleNote ?? "Event details may change. Check Discord for organizer updates."}{event.updatedOn ? <><br />Updated {event.updatedOn}.</> : null}</p>
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
