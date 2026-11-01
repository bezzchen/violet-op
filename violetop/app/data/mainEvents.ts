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
  endsAt?: string;
  location?: string;
  description: string;
  details?: string;
  registrationNotice?: string;
  status?: string;
  hosts?: string;
  updatedOn?: string;
  scheduleNote?: string;
  actions?: { label: string; href: string; primary?: boolean }[];
  sections?: { title: string; body?: string; items?: string[] }[];
  artwork: keyof typeof eventArtwork;
};

export const halloweenEventId = "halloween-event-2026";
export const cupEventId = "vop-cup-bracket-weekend-2026";

/** Preserve older shared links while sending visitors to the current cup details. */
export const mainEventRedirects: Record<string, string> = {
  "vop-cup-registration-2026": cupEventId,
  "vop-cup-online-stage-2026": cupEventId,
};

/** Tournament announcements verified October 29; Halloween recap added October 31. */
export const mainEvents: MainEvent[] = [
  {
    id: "geng-fireside-chat-2026",
    series: "fireside-chat",
    title: "Fireside Chat with Gen.G CEO Arnold Hur",
    startsOn: "2026-10-09",
    dateLabel: "October 9, 2026",
    location: "Palladium Multipurpose Room · NYU",
    description: "Violet OP welcomed Gen.G CEO Arnold Hur for a conversation about esports, careers, and community.",
    artwork: "valorantCommunity",
  },
  {
    id: halloweenEventId,
    series: "halloween",
    title: "Halloween Fest & Worlds Watch Party",
    startsOn: "2026-10-31",
    dateLabel: "Saturday, October 31, 2026",
    time: "1:30–5 PM EDT",
    startsAt: "2026-10-31T13:30:00-04:00",
    location: "GCASL Grand Hall · 5th floor",
    hosts: "Violet OP × Club Anime × NYU Gaming",
    endsAt: "2026-10-31T17:00:00-04:00",
    status: "Event complete · Photos available",
    updatedOn: "October 31, 2026",
    description: "Worlds on the big screen, costumes on stage, and a hall full of the NYU gaming and anime community. Revisit Halloween Fest through photos by Artus Yeh, Katelyn, and msf.",
    actions: [{ label: "View the recap & photos", href: `/media/${halloweenEventId}`, primary: true }],
    artwork: "halloweenFest",
  },
  {
    id: cupEventId,
    series: "vop-cup",
    title: "Road to Worlds NYU: VOP Cup",
    startsOn: "2026-11-07",
    endsOn: "2026-11-08",
    dateLabel: "November 7–8, 2026",
    time: "Match times to be announced",
    location: "Online · Violet OP Discord",
    status: "Main registration closed",
    updatedOn: "October 29, 2026",
    description: "Compete in NYU’s League of Legends intramural tournament for Road to Worlds. The winning five-player team receives five Worlds 2026 tickets—one per player.",
    details: "November 7: single-elimination knockout, best of one. November 8: final, best of three.",
    registrationNotice: "Main registration is closed. Substitute interest is still open; a waitlist place does not guarantee a spot.",
    scheduleNote: "Match times and the confirmed bracket will be shared by the organizers. Follow Discord for the latest tournament updates.",
    actions: [
      { label: "Join the substitute waitlist", href: "https://docs.google.com/forms/d/e/1FAIpQLSd3r4OWwrmXU4pHncy-8-67vYqmsSGwJlF4B-7FdBCf4Az5uA/viewform", primary: true },
      { label: "Tournament Discord", href: "https://discord.gg/HaSTScWyB" },
    ],
    sections: [
      {
        title: "The tournament weekend",
        items: ["Saturday, November 7 · Single-elimination knockout rounds, best of one.", "Sunday, November 8 · Final, best of three.", "All matches take place online through the Violet OP Discord."],
      },
      {
        title: "Registration update",
        body: "Main signups have closed after an overwhelming response. Teams and players are scheduled to be notified by November 1. Interested substitutes can still join the waitlist; organizers match openings by rank and role and will contact players on Discord if needed.",
      },
      {
        title: "Player eligibility & fair play",
        items: ["Open to current NYU students with a valid @nyu.edu email and NetID.", "Organizers verify enrollment, rank, and account history.", "Smurf accounts, alternate accounts, or misrepresented ranks can result in disqualification."],
      },
      {
        title: "Questions before match day?",
        body: "Check the tournament Discord for organizer announcements, team updates, and match-day questions.",
      },
    ],
    artwork: "roadToWorldsCup",
  },
  {
    id: "worlds-watch-party-2026",
    series: "worlds-watch-party",
    title: "Worlds Watch Party",
    startsOn: "2026-11-14",
    dateLabel: "November 14, 2026",
    time: "Time to be announced",
    location: "Kimmel · Room to be announced",
    description: "Watch Worlds with the Violet OP community, with activities between games.",
    scheduleNote: "The room and start time will be confirmed by the organizers. Check Discord before making plans.",
    updatedOn: "October 29, 2026",
    artwork: "worldsWatchParty",
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

/** Use a confirmed end time when known, otherwise the final New York calendar day. */
export function getUpcomingMainEvents(now: Date): MainEvent[] {
  const parts = localDate.formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  return mainEvents.filter((event) => event.endsAt
    ? new Date(event.endsAt).getTime() > now.getTime()
    : (event.endsOn ?? event.startsOn) >= today)
    .sort((a, b) => a.startsOn.localeCompare(b.startsOn));
}

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
  // Retire the superseded registration/online-stage/November 6 schedule too.
  // The team-match guard above continues to preserve individual matches.
  if (seriesTitles["vop-cup"].test(title) && date >= "2026-10-05" && date <= "2026-11-08") return true;
  return mainEvents.some((entry) =>
    date >= entry.startsOn && date <= (entry.endsOn ?? entry.startsOn) && seriesTitles[entry.series].test(title),
  );
}
