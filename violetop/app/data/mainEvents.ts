import type { eventArtwork } from "./eventArtwork";
import type { CalendarEvent } from "../lib/ical";

type MainEventSeries = "vop-cup" | "fireside-chat" | "halloween" | "worlds-watch-party";

export type MainEvent = {
  id: string;
  series: MainEventSeries;
  title: string;
  startsOn: string;
  endsOn?: string;
  dateLabel: string;
  tentative?: boolean;
  time?: string;
  startsAt?: string;
  location?: string;
  description: string;
  details?: string;
  registrationNotice?: string;
  artwork: keyof typeof eventArtwork;
};

/** Public draft schedule supplied by VOP. Separate from the live match feed;
 * unknown times are labels, never fabricated calendar timestamps or links. */
export const mainEvents: MainEvent[] = [
  {
    id: "vop-cup-registration-2026",
    series: "vop-cup",
    title: "VOP Cup Registration",
    startsOn: "2026-10-05",
    endsOn: "2026-10-16",
    dateLabel: "October 5–16, 2026",
    tentative: true,
    description: "Register your team for the VOP Cup. An NYU email and Riot ID are required.",
    registrationNotice: "Registration Details Coming Soon",
    artwork: "valorantGeneral",
  },
  {
    id: "geng-fireside-chat-2026",
    series: "fireside-chat",
    title: "Fireside Chat with Gen.G’s President",
    startsOn: "2026-10-09",
    dateLabel: "October 9, 2026",
    time: "TBA",
    location: "TBA",
    description: "Join Violet OP for a fireside chat with Gen.G’s president.",
    artwork: "valorantCommunity",
  },
  {
    id: "vop-cup-online-stage-2026",
    series: "vop-cup",
    title: "VOP Cup — Online Stage",
    startsOn: "2026-10-19",
    endsOn: "2026-10-25",
    dateLabel: "October 19–25, 2026",
    time: "TBA",
    location: "Online",
    description: "The VOP Cup begins online, with qualifiers if more than eight teams register.",
    artwork: "valorantPractice",
  },
  {
    id: "halloween-event-2026",
    series: "halloween",
    title: "Halloween Event",
    startsOn: "2026-10-31",
    dateLabel: "October 31, 2026",
    time: "5–10 PM",
    startsAt: "2026-10-31T17:00:00-04:00",
    location: "TBA",
    description: "Celebrate Halloween with League open play, artist and anime club activities, and community hangouts.",
    artwork: "leagueCommunity",
  },
  {
    id: "vop-cup-bracket-weekend-2026",
    series: "vop-cup",
    title: "VOP Cup — Bracket Weekend",
    startsOn: "2026-11-06",
    endsOn: "2026-11-08",
    dateLabel: "November 6–8, 2026",
    tentative: true,
    time: "TBA",
    location: "TBA",
    description: "Eight teams compete in a best-of-three bracket across three days.",
    details: "Quarterfinals November 6 · Semifinals November 7 · Final November 8",
    artwork: "valorantCompetitive",
  },
  {
    id: "worlds-watch-party-2026",
    series: "worlds-watch-party",
    title: "Worlds Watch Party",
    startsOn: "2026-11-14",
    dateLabel: "November 14, 2026",
    time: "1–6 PM",
    startsAt: "2026-11-14T13:00:00-05:00",
    location: "TBA",
    description: "Watch Worlds with the Violet OP community, with activities between games.",
    artwork: "leagueCompetitive",
  },
];

const seriesTitles: Record<MainEventSeries, RegExp> = {
  "vop-cup": /\bvop\s+cup\b/i,
  "fireside-chat": /\bfireside\s+chat\b.*\bgen\s*g\b|\bgen\s*g\b.*\bfireside\s+chat\b/i,
  halloween: /\bhalloween\b/i,
  "worlds-watch-party": /\bworlds\b.*\bwatch\s+party\b|\bwatch\s+party\b.*\bworlds\b/i,
};

const localDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
});

/** Hide only matching occurrences already represented by the curated schedule.
 * Practices, unrelated matches, and events outside these dates stay in the feed. */
export function isScheduledMainEvent(event: CalendarEvent): boolean {
  // A named team match or practice is distinct from the overall cup stage.
  if (/\b(practices?|scrims?|scrimmages?|match(?:es)?|games?|vs|necc|pcl)\b/i.test(event.title)) return false;
  const instant = new Date(event.startsAt);
  if (Number.isNaN(instant.getTime())) return false;
  const parts = localDate.formatToParts(instant);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  const title = event.title.replace(/[^\p{L}\p{N}\s]/gu, " ");
  return mainEvents.some((entry) =>
    date >= entry.startsOn && date <= (entry.endsOn ?? entry.startsOn) && seriesTitles[entry.series].test(title),
  );
}
