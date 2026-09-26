import assert from "node:assert/strict";
import { test } from "node:test";
import type { CalendarEvent } from "../lib/ical";
import { isScheduledMainEvent } from "./mainEvents.ts";

function event(title: string, startsAt: string): CalendarEvent {
  return { id: title, title, startsAt, month: "OCT", day: "9", weekday: "FRI", time: "TBA", location: null };
}

test("public schedule occurrences cannot also appear in the live event lists", () => {
  for (const [title, date] of [
    ["VOP Cup Registration", "2026-10-05T16:00:00Z"],
    ["Fireside Chat with Gen.G's President", "2026-10-09T16:00:00Z"],
    ["VOP Cup Qualifiers", "2026-10-25T16:00:00Z"],
    ["Halloween Event", "2026-10-31T21:00:00Z"],
    ["VOP Cup — Semifinals", "2026-11-07T18:00:00Z"],
    ["Worlds Watch Party", "2026-11-14T18:00:00Z"],
  ]) assert.equal(isScheduledMainEvent(event(title, date)), true, title);
});

test("deduplication uses New York dates and preserves unrelated matches and practices", () => {
  assert.equal(isScheduledMainEvent(event("Worlds Watch Party", "2026-11-15T00:00:00Z")), true);
  assert.equal(isScheduledMainEvent(event("Worlds Watch Party", "2026-11-14T00:00:00Z")), false);
  for (const title of ["NECC VOP WHITE MATCH", "VOP Practice", "League Scrims", "Online Stage Practice", "VOP Cup Practice", "VOP Cup Player Match", "VOP Cup — NYU vs UMICH"]) {
    assert.equal(isScheduledMainEvent(event(title, "2026-10-19T16:00:00Z")), false, title);
  }
  assert.equal(isScheduledMainEvent(event("VOP Cup Registration", "2026-10-17T16:00:00Z")), false);
  assert.equal(isScheduledMainEvent(event("Halloween Event", "2027-10-31T16:00:00Z")), false);
  assert.equal(isScheduledMainEvent(event("VOP Cup", "invalid")), false);
});
