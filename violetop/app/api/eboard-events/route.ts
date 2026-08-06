import { calendarFeeds } from "../../data/siteContent";
import { getCalendarEvents } from "../../lib/ical";

// Hardcoded on purpose — this gates a page, not an account. Keeping the check
// here rather than in the client means a wrong PIN never receives the data.
const EBOARD_PIN = "1831";

export async function GET(request: Request) {
  const pin = new URL(request.url).searchParams.get("pin");

  if (pin !== EBOARD_PIN) {
    return Response.json({ error: "Incorrect PIN." }, { status: 401 });
  }

  const { events, error } = await getCalendarEvents(calendarFeeds.eboard, 20);

  return Response.json({ events, error });
}
