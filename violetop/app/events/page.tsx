import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { calendarFeeds, siteMeta } from "../data/siteContent";
import { getCalendarEvents } from "../lib/ical";

export const metadata: Metadata = {
  title: `Events | ${siteMeta.title}`,
  description: siteMeta.description,
};

export default async function EventsPage() {
  const { events, error } = await getCalendarEvents(calendarFeeds.events, 12);

  return <EventsClient error={error} events={events} />;
}
