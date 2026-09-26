import type { CalendarEvent } from "../lib/ical";

export type EventGroup = "matches" | "main" | "unclassified";

/** Team practices and scrims belong with player matches. Calendar categories
 * otherwise take precedence; tentative and unfamiliar entries stay separate. */
export function classifyEvent(event: CalendarEvent): EventGroup {
  const categories = (event.categories ?? []).map((category) => category.trim().toLowerCase());
  const matches = categories.some((category) => ["player matches", "team matches", "matches"].includes(category));
  const main = categories.some((category) => ["main events", "community", "club events"].includes(category));
  const title = event.title;
  const tentative = /\b(potential|tbd)\b/i.test(title);
  const community = /\b(watch party|community|casual|customs?|dinner|social|shopping|sleepover|picture day)\b/i.test(title);
  if (matches && main) return "unclassified";
  if (matches) return "matches";
  if (!tentative && !community && /\b(practices?|scrims?|scrimmages?)\b/i.test(title)) return "matches";
  if (main) return "main";

  if (tentative) return "unclassified";
  if (community) return "main";
  if (/\b(tryouts?|auditions?)\b/i.test(title)) return "unclassified";
  if (/\b(match(?:es)?|necc|pcl|premier|playoffs?)\b/i.test(title) || /\bvs\.?\b/i.test(title)) return "matches";
  if (/\bvop\s+(valorant|league)\s+event\b|\blevel up\b/i.test(title)) return "main";
  return "unclassified";
}

export function groupEvents(events: CalendarEvent[]) {
  const groups: Record<EventGroup, CalendarEvent[]> = { matches: [], main: [], unclassified: [] };
  const seen = new Set<string>();
  for (const event of [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt))) {
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    groups[classifyEvent(event)].push(event);
  }
  return groups;
}
