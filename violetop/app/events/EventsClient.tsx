"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import EventList from "../components/EventList";
import PageShell from "../components/PageShell";
import { eventsContent } from "../data/siteContent";
import type { CalendarEvent } from "../lib/ical";

const revealDelay = (index: number) =>
  ({ "--reveal-delay": `${index * 90}ms` }) as CSSProperties;

type EventsClientProps = {
  events: CalendarEvent[];
  error: string | null;
};

export default function EventsClient({ events, error }: EventsClientProps) {
  return (
    <PageShell>
      <section className="wide-page-shell relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-10 px-4 pb-12 pt-28 md:px-grid-margin">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1fr]">
          <div
            className="reveal-up relative min-h-80 overflow-hidden rounded border border-white/10 bg-surface-container-lowest shadow-2xl md:min-h-[34rem]"
            style={revealDelay(0)}
          >
            <Image
              alt="Violet OP community"
              className="object-cover"
              fill
              preload
              quality={75}
              sizes="(min-width: 1024px) 42vw, 100vw"
              src="/images/groupphoto.avif"
            />
          </div>

          <div
            className="reveal-up glass-panel section-text-panel op-clip border-r-4 border-r-tertiary p-6 text-right md:p-stack-xl"
            style={revealDelay(1)}
          >
            <span className="font-label-caps text-label-caps uppercase text-tertiary">
              Events
            </span>
            <h1 className="mt-4 font-display-xl text-4xl font-extrabold text-white md:text-display-xl">
              {eventsContent.title}
            </h1>
          </div>
        </div>

        <section className="grid gap-6">
          <EventList
            emptyMessage={eventsContent.emptyMessage}
            error={error}
            events={events}
            startDelayIndex={2}
          />
        </section>
      </section>
    </PageShell>
  );
}
