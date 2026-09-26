// Minimal iCalendar (RFC 5545) reader for the public Google Calendar feeds that
// back the Events and E-Board pages. Google exports the whole calendar history,
// including open-ended weekly rules, so we expand recurrences ourselves and keep
// only what is still upcoming.

const DEFAULT_TIME_ZONE = "America/New_York";
const DAY_MS = 86_400_000;
// How far ahead recurring series are expanded, plus hard caps so a malformed or
// unbounded RRULE can never spin the render.
const HORIZON_DAYS = 400;
const MAX_DAY_STEPS = 3660;
const MAX_PERIOD_STEPS = 400;
const MAX_OCCURRENCES = 500;
const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

export type CalendarEvent = {
  id: string;
  title: string;
  month: string;
  day: string;
  weekday: string;
  time: string;
  location: string | null;
  startsAt: string;
  categories?: string[];
  url?: string;
};

export type CalendarFeedResult = {
  events: CalendarEvent[];
  error: string | null;
};

type IcalProperty = {
  name: string;
  params: Record<string, string>;
  value: string;
};

type IcalComponent = {
  name: string;
  properties: IcalProperty[];
};

type IcalInstant = {
  ms: number;
  allDay: boolean;
};

type RecurrenceRule = {
  freq: string;
  interval: number;
  count: number | null;
  until: number | null;
  byDay: string[];
  weekStart: string;
};

/* -------------------------------------------------------------------------- */
/* Time zone helpers                                                          */
/* -------------------------------------------------------------------------- */

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  const cached = partsFormatters.get(timeZone);
  if (cached) return cached;

  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    // Unknown TZID in the feed — fall back to the calendar's home zone.
    formatter = partsFormatter(DEFAULT_TIME_ZONE);
  }

  partsFormatters.set(timeZone, formatter);
  return formatter;
}

function zonedParts(ms: number, timeZone: string) {
  const parts = partsFormatter(timeZone).formatToParts(new Date(ms));
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function zoneOffsetMs(ms: number, timeZone: string) {
  const parts = zonedParts(ms, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return asUtc - ms;
}

// Wall-clock time in `timeZone` -> epoch ms. The second pass settles the offset
// when the first guess lands on the wrong side of a DST transition.
function zonedToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
) {
  const wall = Date.UTC(year, month - 1, day, hour, minute, second);
  const firstPass = wall - zoneOffsetMs(wall, timeZone);

  return wall - zoneOffsetMs(firstPass, timeZone);
}

/* -------------------------------------------------------------------------- */
/* Parsing                                                                    */
/* -------------------------------------------------------------------------- */

// Content lines longer than 75 octets are split with a leading space/tab.
function unfoldLines(raw: string) {
  const lines: string[] = [];

  for (const line of raw.split(/\r\n|\n|\r/)) {
    if (lines.length > 0 && (line.startsWith(" ") || line.startsWith("\t"))) {
      lines[lines.length - 1] += line.slice(1);
      continue;
    }

    lines.push(line);
  }

  return lines;
}

// Parameter values may be quoted and contain `:` or `;`, so scan for the real
// separator instead of using split().
function indexOfUnquoted(text: string, target: string) {
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') quoted = !quoted;
    else if (char === target && !quoted) return index;
  }

  return -1;
}

function splitUnquoted(text: string, separator: string) {
  const segments: string[] = [];
  let current = "";
  let quoted = false;

  for (const char of text) {
    if (char === '"') {
      quoted = !quoted;
      current += char;
    } else if (char === separator && !quoted) {
      segments.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  segments.push(current);
  return segments;
}

function unescapeText(value: string) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseProperty(line: string): IcalProperty | null {
  const colon = indexOfUnquoted(line, ":");
  if (colon === -1) return null;

  const segments = splitUnquoted(line.slice(0, colon), ";");
  const params: Record<string, string> = {};

  for (const segment of segments.slice(1)) {
    const equals = segment.indexOf("=");
    if (equals === -1) continue;

    params[segment.slice(0, equals).toUpperCase()] = segment
      .slice(equals + 1)
      .replace(/^"|"$/g, "");
  }

  return {
    name: segments[0].toUpperCase(),
    params,
    value: line.slice(colon + 1),
  };
}

// Returns only VEVENT blocks. VTIMEZONE is skipped outright — its nested
// DTSTART/RRULE lines would otherwise read as bogus events.
function parseVEvents(raw: string): IcalComponent[] {
  const stack: string[] = [];
  const events: IcalComponent[] = [];
  let current: IcalComponent | null = null;

  for (const line of unfoldLines(raw)) {
    const property = parseProperty(line);
    if (!property) continue;

    if (property.name === "BEGIN") {
      const name = property.value.trim().toUpperCase();
      stack.push(name);

      if (name === "VEVENT" && !stack.includes("VTIMEZONE")) {
        current = { name, properties: [] };
      }

      continue;
    }

    if (property.name === "END") {
      const name = property.value.trim().toUpperCase();
      stack.pop();

      if (name === "VEVENT" && current) {
        events.push(current);
        current = null;
      }

      continue;
    }

    current?.properties.push(property);
  }

  return events;
}

function firstProperty(component: IcalComponent, name: string) {
  return component.properties.find((property) => property.name === name);
}

function allProperties(component: IcalComponent, name: string) {
  return component.properties.filter((property) => property.name === name);
}

function parseInstant(
  property: IcalProperty | undefined,
  fallbackZone: string,
): IcalInstant | null {
  if (!property) return null;

  const value = property.value.trim();
  const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(value);

  if (dateOnly) {
    return {
      ms: zonedToUtc(
        Number(dateOnly[1]),
        Number(dateOnly[2]),
        Number(dateOnly[3]),
        0,
        0,
        0,
        fallbackZone,
      ),
      allDay: true,
    };
  }

  const dateTime = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(
    value,
  );
  if (!dateTime) return null;

  const [, year, month, day, hour, minute, second, utcMarker] = dateTime;

  if (utcMarker) {
    return {
      ms: Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
      ),
      allDay: false,
    };
  }

  return {
    ms: zonedToUtc(
      Number(year),
      Number(month),
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      property.params.TZID ?? fallbackZone,
    ),
    allDay: false,
  };
}

function parseRecurrenceRule(
  property: IcalProperty | undefined,
): RecurrenceRule | null {
  if (!property) return null;

  const parts: Record<string, string> = {};
  for (const pair of property.value.split(";")) {
    const equals = pair.indexOf("=");
    if (equals === -1) continue;
    parts[pair.slice(0, equals).toUpperCase()] = pair.slice(equals + 1);
  }

  if (!parts.FREQ) return null;

  const untilProperty: IcalProperty | undefined = parts.UNTIL
    ? { name: "UNTIL", params: {}, value: parts.UNTIL }
    : undefined;

  return {
    freq: parts.FREQ.toUpperCase(),
    interval: Math.max(1, Number(parts.INTERVAL ?? "1") || 1),
    count: parts.COUNT ? Number(parts.COUNT) || null : null,
    until: parseInstant(untilProperty, DEFAULT_TIME_ZONE)?.ms ?? null,
    // Strip any BYDAY ordinal prefix ("2SU" -> "SU"); ordinals are rare in these
    // feeds and the base date already pins the week.
    byDay: (parts.BYDAY ?? "")
      .split(",")
      .map((code) => code.trim().toUpperCase().slice(-2))
      .filter((code) => WEEKDAY_CODES.includes(code)),
    weekStart: (parts.WKST ?? "SU").toUpperCase(),
  };
}

/* -------------------------------------------------------------------------- */
/* Recurrence expansion                                                       */
/* -------------------------------------------------------------------------- */

function utcWeekday(dateUtc: number) {
  return new Date(dateUtc).getUTCDay();
}

// Candidate start dates (as UTC midnight stamps) for a rule, before the
// wall-clock time of day is reapplied.
function recurringDates(
  rule: RecurrenceRule,
  baseYear: number,
  baseMonth: number,
  baseDay: number,
  horizonUtc: number,
) {
  const baseDateUtc = Date.UTC(baseYear, baseMonth - 1, baseDay);
  const dates: number[] = [];

  if (rule.freq === "DAILY" || rule.freq === "WEEKLY") {
    const weekStartIndex = Math.max(0, WEEKDAY_CODES.indexOf(rule.weekStart));
    const baseWeekStart =
      baseDateUtc -
      ((utcWeekday(baseDateUtc) - weekStartIndex + 7) % 7) * DAY_MS;
    const allowedDays =
      rule.byDay.length > 0
        ? rule.byDay
        : [WEEKDAY_CODES[utcWeekday(baseDateUtc)]];

    for (let step = 0; step < MAX_DAY_STEPS; step += 1) {
      const cursor = baseDateUtc + step * DAY_MS;
      if (cursor > horizonUtc || dates.length >= MAX_OCCURRENCES) break;

      if (rule.freq === "DAILY") {
        if (step % rule.interval === 0) dates.push(cursor);
        continue;
      }

      const weekIndex = Math.round((cursor - baseWeekStart) / (7 * DAY_MS));
      if (weekIndex % rule.interval !== 0) continue;
      if (!allowedDays.includes(WEEKDAY_CODES[utcWeekday(cursor)])) continue;

      dates.push(cursor);
    }

    return dates;
  }

  for (let step = 0; step < MAX_PERIOD_STEPS; step += 1) {
    const year =
      rule.freq === "YEARLY" ? baseYear + step * rule.interval : baseYear;
    const monthIndex =
      rule.freq === "MONTHLY"
        ? baseMonth - 1 + step * rule.interval
        : baseMonth - 1;

    const cursor = Date.UTC(year, monthIndex, baseDay);
    if (cursor > horizonUtc || dates.length >= MAX_OCCURRENCES) break;

    // Skip periods that are too short for this day-of-month (e.g. the 31st).
    if (new Date(cursor).getUTCDate() !== baseDay) continue;

    dates.push(cursor);
  }

  return dates;
}

function expandOccurrences(
  event: IcalComponent,
  start: IcalInstant,
  calendarZone: string,
  horizonMs: number,
  excluded: Set<number>,
) {
  const rule = parseRecurrenceRule(firstProperty(event, "RRULE"));
  if (!rule) return excluded.has(start.ms) ? [] : [start.ms];

  const zone = firstProperty(event, "DTSTART")?.params.TZID ?? calendarZone;
  const base = zonedParts(start.ms, zone);
  const horizonParts = zonedParts(horizonMs, zone);
  const horizonUtc = Date.UTC(
    horizonParts.year,
    horizonParts.month - 1,
    horizonParts.day,
  );

  const occurrences: number[] = [];
  let emitted = 0;

  for (const date of recurringDates(
    rule,
    base.year,
    base.month,
    base.day,
    horizonUtc,
  )) {
    if (rule.count !== null && emitted >= rule.count) break;
    emitted += 1;

    const cursor = new Date(date);
    const ms = zonedToUtc(
      cursor.getUTCFullYear(),
      cursor.getUTCMonth() + 1,
      cursor.getUTCDate(),
      base.hour,
      base.minute,
      base.second,
      zone,
    );

    if (rule.until !== null && ms > rule.until) break;
    if (excluded.has(ms)) continue;

    occurrences.push(ms);
  }

  return occurrences;
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function formatter(timeZone: string, options: Intl.DateTimeFormatOptions) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone, ...options });
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: DEFAULT_TIME_ZONE,
      ...options,
    });
  }
}

function formatTime(ms: number, timeZone: string) {
  return formatter(timeZone, { hour: "numeric", minute: "2-digit" }).format(
    new Date(ms),
  );
}

function formatShortDate(ms: number, timeZone: string) {
  return formatter(timeZone, { month: "short", day: "numeric" }).format(
    new Date(ms),
  );
}

function sameZonedDay(a: number, b: number, timeZone: string) {
  const first = zonedParts(a, timeZone);
  const second = zonedParts(b, timeZone);

  return (
    first.year === second.year &&
    first.month === second.month &&
    first.day === second.day
  );
}

function formatTimeRange(
  startMs: number,
  endMs: number | null,
  allDay: boolean,
  timeZone: string,
) {
  if (allDay) {
    // An all-day DTEND is exclusive, so step back inside the final day.
    const lastDay = endMs ? endMs - DAY_MS : startMs;

    return sameZonedDay(startMs, lastDay, timeZone)
      ? "All day"
      : `All day · through ${formatShortDate(lastDay, timeZone)}`;
  }

  const startLabel = formatTime(startMs, timeZone);
  if (!endMs || endMs <= startMs) return startLabel;

  const endLabel = formatTime(endMs, timeZone);

  return sameZonedDay(startMs, endMs, timeZone)
    ? `${startLabel} – ${endLabel}`
    : `${startLabel} – ${formatShortDate(endMs, timeZone)}, ${endLabel}`;
}

function toCalendarEvent(
  startMs: number,
  endMs: number | null,
  allDay: boolean,
  title: string,
  location: string | null,
  uid: string,
  timeZone: string,
): CalendarEvent {
  const date = new Date(startMs);

  return {
    id: `${uid}-${startMs}`,
    title,
    month: formatter(timeZone, { month: "short" }).format(date).toUpperCase(),
    day: formatter(timeZone, { day: "numeric" }).format(date),
    weekday: formatter(timeZone, { weekday: "short" })
      .format(date)
      .toUpperCase(),
    time: formatTimeRange(startMs, endMs, allDay, timeZone),
    location,
    startsAt: date.toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

// `now` is injected so the parser stays deterministic and unit-testable.
export function parseCalendar(
  raw: string,
  now: number,
  limit: number,
): CalendarEvent[] {
  const calendarZone =
    /^X-WR-TIMEZONE:(.+)$/m.exec(raw)?.[1]?.trim() || DEFAULT_TIME_ZONE;
  const components = parseVEvents(raw);
  const horizonMs = now + HORIZON_DAYS * DAY_MS;

  // A VEVENT carrying RECURRENCE-ID replaces one occurrence of the series that
  // shares its UID, so collect those before expanding the masters.
  const overriddenByUid = new Map<string, Set<number>>();
  for (const component of components) {
    const recurrenceId = firstProperty(component, "RECURRENCE-ID");
    const uid = firstProperty(component, "UID")?.value.trim();
    if (!recurrenceId || !uid) continue;

    const instant = parseInstant(recurrenceId, calendarZone);
    if (!instant) continue;

    const existing = overriddenByUid.get(uid) ?? new Set<number>();
    existing.add(instant.ms);
    overriddenByUid.set(uid, existing);
  }

  const events: CalendarEvent[] = [];

  for (const component of components) {
    if (firstProperty(component, "STATUS")?.value.trim() === "CANCELLED") {
      continue;
    }

    const start = parseInstant(
      firstProperty(component, "DTSTART"),
      calendarZone,
    );
    if (!start) continue;

    const uid =
      firstProperty(component, "UID")?.value.trim() ?? String(start.ms);
    const title =
      unescapeText(firstProperty(component, "SUMMARY")?.value ?? "") ||
      "Untitled event";
    const location =
      unescapeText(firstProperty(component, "LOCATION")?.value ?? "") || null;

    const end = parseInstant(firstProperty(component, "DTEND"), calendarZone);
    const duration = end ? end.ms - start.ms : null;

    const isOverride = Boolean(firstProperty(component, "RECURRENCE-ID"));
    const excluded = new Set<number>(
      isOverride ? [] : (overriddenByUid.get(uid) ?? []),
    );

    for (const property of allProperties(component, "EXDATE")) {
      for (const value of property.value.split(",")) {
        const instant = parseInstant({ ...property, value }, calendarZone);
        if (instant) excluded.add(instant.ms);
      }
    }

    const occurrences = isOverride
      ? [start.ms]
      : expandOccurrences(component, start, calendarZone, horizonMs, excluded);

    for (const occurrence of occurrences) {
      const endMs = duration === null ? null : occurrence + duration;

      // Keep events that are still running, drop the ones already finished.
      if ((endMs ?? occurrence) < now) continue;
      if (occurrence > horizonMs) continue;

      events.push({
        ...toCalendarEvent(
          occurrence,
          endMs,
          start.allDay,
          title,
          location,
          uid,
          calendarZone,
        ),
        categories: allProperties(component, "CATEGORIES").flatMap((property) =>
          property.value.split(/(?<!\\),/).map(unescapeText),
        ),
        url: firstProperty(component, "URL")?.value.trim() || undefined,
      });
    }
  }

  // Organizers sometimes re-create a series instead of editing it, leaving two
  // UIDs describing the same meeting. Collapse on what a reader can tell apart.
  const seen = new Set<string>();

  return events
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .filter((event) => {
      const key = `${event.title}|${event.startsAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

export async function getCalendarEvents(
  feedUrl: string,
  limit = 12,
): Promise<CalendarFeedResult> {
  try {
    const response = await fetch(feedUrl, { next: { revalidate: 900 } });

    if (!response.ok) {
      return {
        events: [],
        error: `Calendar feed responded with ${response.status}.`,
      };
    }

    return {
      events: parseCalendar(await response.text(), Date.now(), limit),
      error: null,
    };
  } catch {
    return { events: [], error: "Could not reach the calendar feed." };
  }
}
