import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../components/PageShell";
import { pastEvents, type EventMediaItem } from "../../data/pastEvents";
import catalog from "../../data/eventMedia.json";
import MediaGallery from "../MediaGallery";
import styles from "../Media.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return pastEvents.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = pastEvents.find((item) => item.slug === slug);
  if (!event) notFound();
  return { title: `${event.title} — Media | Violet OP`, description: event.description };
}

export default async function EventMediaPage({ params }: Props) {
  const { slug } = await params;
  const event = pastEvents.find((item) => item.slug === slug);
  if (!event) notFound();
  const items = (catalog as Record<string, EventMediaItem[]>)[slug];
  const next = pastEvents[(pastEvents.indexOf(event) + 1) % pastEvents.length];
  return (
    <PageShell>
      <article className={styles.page}>
        <Link className={styles.back} href="/media">← All past events</Link>
        <header className={styles.eventHero}>
          <div className={styles.eventIntro}>
            <span className={styles.eyebrow}>{event.category} · <time dateTime={event.date}>{event.dateLabel}</time></span>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            {event.location ? <p className={styles.location}>{event.location}</p> : null}
            <a className={styles.albumLink} href={event.albumUrl} target="_blank" rel="noopener noreferrer">Open original album <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.heroImage}>
            <Image alt={event.coverAlt} fill preload quality={85} sizes="(max-width: 800px) calc(100vw - 32px), 700px" src={event.cover} style={{ objectPosition: event.coverPosition }} />
          </div>
        </header>
        <MediaGallery key={slug} items={items} title={event.title} />
        <Link className={styles.nextEvent} href={`/media/${next.slug}`}><span>Another event<strong>{next.title}</strong></span><span aria-hidden="true">→</span></Link>
      </article>
    </PageShell>
  );
}
