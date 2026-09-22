import type { CalendarEvent } from "../lib/ical";

export type EventArtwork = {
  src: string;
  alt: string;
  objectPosition: string;
  game: "valorant" | "league";
  activity: "general" | "competitive" | "community" | "practice";
};

export const eventArtwork = {
  valorantGeneral: {
    src: "/images/events/valorant-episode-8-act-1.webp",
    alt: "VALORANT Episode 8 Act I artwork showing three agents overlooking a city",
    objectPosition: "50% 50%",
    game: "valorant",
    activity: "general",
  },
  valorantCompetitive: {
    src: "/images/events/valorant-china-launch.webp",
    alt: "VALORANT China Launch artwork showing an agent in a competitive firefight",
    objectPosition: "54% 48%",
    game: "valorant",
    activity: "competitive",
  },
  valorantCommunity: {
    src: "/images/events/valorant-gekko.webp",
    alt: "VALORANT artwork featuring Gekko and his creatures",
    objectPosition: "50% 47%",
    game: "valorant",
    activity: "community",
  },
  valorantPractice: {
    src: "/images/events/valorant-iso.webp",
    alt: "VALORANT artwork featuring Iso",
    objectPosition: "50% 48%",
    game: "valorant",
    activity: "practice",
  },
  leagueCompetitive: {
    src: "/images/events/league-yasuo.webp",
    alt: "League of Legends key art featuring Yasuo",
    objectPosition: "50% 50%",
    game: "league",
    activity: "competitive",
  },
  leaguePractice: {
    src: "/images/events/league-vi.webp",
    alt: "League of Legends key art featuring Vi",
    objectPosition: "50% 50%",
    game: "league",
    activity: "practice",
  },
  leagueCommunity: {
    src: "/images/events/league-lulu.webp",
    alt: "League of Legends key art featuring Lulu",
    objectPosition: "50% 50%",
    game: "league",
    activity: "community",
  },
} as const satisfies Record<string, EventArtwork>;

function eventGame(event: CalendarEvent) {
  const text = `${event.title} ${event.location ?? ""}`.toLowerCase();
  return /\b(league|lol|baron|elder)\b/.test(text) ? "league" : "valorant";
}

function eventActivity(event: CalendarEvent) {
  const text = `${event.title} ${event.location ?? ""}`.toLowerCase();

  if (/\b(practice|scrim|tryout|tryouts|audition|auditions)\b/.test(text)) {
    return "practice";
  }

  if (
    /\b(community|casual|custom|customs|watch party|intramural|intramurals|dinner|social|shopping|sleepover|filming|picture day)\b/.test(
      text,
    )
  ) {
    return "community";
  }

  if (/\b(match|matches|game|games|final|finals|playoff|playoffs|pcl|necc|premier|tournament)\b/.test(text)) {
    return "competitive";
  }

  return "general";
}

/**
 * Both the homepage and Events page call this function, so every occurrence of
 * a calendar series keeps the same artwork without storing presentation data in
 * the calendar feed or making a random choice during render.
 */
export function getEventArtwork(event: CalendarEvent): EventArtwork {
  const game = eventGame(event);
  const activity = eventActivity(event);

  if (game === "league") {
    if (activity === "competitive") return eventArtwork.leagueCompetitive;
    if (activity === "practice") return eventArtwork.leaguePractice;
    return eventArtwork.leagueCommunity;
  }

  if (activity === "competitive") return eventArtwork.valorantCompetitive;
  if (activity === "practice") return eventArtwork.valorantPractice;
  if (activity === "community") return eventArtwork.valorantCommunity;
  return eventArtwork.valorantGeneral;
}
