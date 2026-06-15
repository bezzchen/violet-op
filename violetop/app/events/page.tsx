import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `Events | ${siteMeta.title}`,
  description: siteMeta.description,
};

export default function EventsPage() {
  return <EventsClient />;
}
