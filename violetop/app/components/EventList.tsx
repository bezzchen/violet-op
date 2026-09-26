import Image from "next/image";
import type { CSSProperties } from "react";
import { getEventArtwork } from "../data/eventArtwork";
import type { CalendarEvent } from "../lib/ical";

type EventListProps = {
  events: CalendarEvent[];
  error?: string | null;
  emptyMessage?: string;
  startDelayIndex?: number;
  compact?: boolean;
};

const revealDelay = (index: number) =>
  ({ "--reveal-delay": `${index * 90}ms` }) as CSSProperties;

function Notice({ children, index }: { children: string; index: number }) {
  return (
    <p
      className="reveal-up glass-panel event-row-panel rounded-lg px-6 py-6 font-body-md text-body-lg text-on-surface-variant/75"
      style={revealDelay(index)}
    >
      {children}
    </p>
  );
}

export default function EventList({
  events,
  error = null,
  emptyMessage = "No upcoming events on the calendar right now. Check back soon.",
  startDelayIndex = 0,
  compact = false,
}: EventListProps) {
  if (error) {
    return (
      <Notice index={startDelayIndex}>
        {`We could not load the calendar right now. ${error}`}
      </Notice>
    );
  }

  if (events.length === 0) {
    return <Notice index={startDelayIndex}>{emptyMessage}</Notice>;
  }

  return (
    <div className="grid gap-4">
      {events.map((event, index) => {
        const artwork = getEventArtwork(event);

        return (
            <article
              className={`reveal-up glass-panel event-row-panel grid overflow-hidden rounded-lg ${compact ? "" : "md:grid-cols-[minmax(240px,340px)_1fr]"}`}
              key={event.id}
              style={revealDelay(startDelayIndex + index)}
            >
              <div className="relative aspect-video overflow-hidden bg-[#13101b]">
                <Image
                  alt={artwork.alt}
                  className="object-cover"
                  fill
                  quality={82}
                  sizes={compact ? "(max-width: 760px) calc(100vw - 32px), 45vw" : "(max-width: 767px) calc(100vw - 40px), 340px"}
                  src={artwork.src}
                  style={{ objectPosition: artwork.objectPosition }}
                />
              </div>

              <div className={`flex min-w-0 flex-col gap-5 px-6 py-6 ${compact ? "xl:flex-row xl:items-center xl:gap-4" : "sm:flex-row sm:items-center sm:gap-7 md:px-8 md:py-7"}`}>
                <div className="flex shrink-0 items-center gap-6">
                  <div className="w-16 shrink-0 text-center">
                    <span className="block font-label-caps text-label-caps font-bold uppercase text-primary">
                      {event.month}
                    </span>
                    <span className="block font-headline-lg text-4xl font-bold leading-none text-white">
                      {event.day}
                    </span>
                  </div>
                  <span aria-hidden="true" className="h-16 w-px shrink-0 bg-white/10" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-headline-md text-2xl font-bold text-white">
                    {event.title}
                  </h3>
                  <time className="mt-1 block font-body-md text-body-lg text-on-surface-variant" dateTime={event.startsAt}>{event.time}</time>
                  {event.location ? (
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                      {event.location}
                    </p>
                  ) : null}
                  {event.url && /^https?:\/\//i.test(event.url) ? <a className="mt-3 inline-block text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4" href={event.url} rel="noopener noreferrer" target="_blank">Event details ↗</a> : null}
                </div>

                <span className={`inline-flex self-start rounded-none bg-primary-fixed px-4 py-1.5 font-headline-md text-base font-bold text-on-primary-fixed ${compact ? "xl:self-center" : "sm:self-center"}`}>
                  {event.weekday}
                </span>
              </div>
            </article>
        );
      })}
    </div>
  );
}
