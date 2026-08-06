import type { CSSProperties } from "react";
import type { CalendarEvent } from "../lib/ical";

type EventListProps = {
  events: CalendarEvent[];
  error?: string | null;
  emptyMessage?: string;
  startDelayIndex?: number;
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
      {events.map((event, index) => (
        <article
          className="reveal-up glass-panel event-row-panel flex flex-col gap-5 rounded-lg px-6 py-6 md:flex-row md:items-center md:gap-8 md:px-8 md:py-7"
          key={event.id}
          style={revealDelay(startDelayIndex + index)}
        >
          <div className="flex items-center gap-6 md:w-40">
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
            <p className="mt-1 font-body-md text-body-lg text-on-surface-variant/70">
              {event.time}
            </p>
            {event.location ? (
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant/50">
                {event.location}
              </p>
            ) : null}
          </div>

          <span className="inline-flex self-start rounded-full bg-primary-fixed px-4 py-1.5 font-headline-md text-base font-bold text-on-primary-fixed md:self-center">
            {event.weekday}
          </span>
        </article>
      ))}
    </div>
  );
}
