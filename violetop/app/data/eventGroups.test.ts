import assert from "node:assert/strict";
import { test } from "node:test";
import type { CalendarEvent } from "../lib/ical";
import { parseCalendar } from "../lib/ical.ts";
import { classifyEvent, groupEvents } from "./eventGroups.ts";

function event(title: string, categories?: string[]): CalendarEvent {
  return { id: title, title, categories, month: "SEP", day: "28", weekday: "MON", time: "7:00 PM", location: "Online", startsAt: "2026-09-28T23:00:00Z" };
}

test("calendar's match labels and watch parties remain separate", () => {
  for (const title of ["NECC VOP WHITE MATCH", "PCL VOP ELDER", "PCL VOP Baron", "VOP Purple PCL Game"]) assert.equal(classifyEvent(event(title)), "matches");
  assert.equal(classifyEvent(event("Valorant America Grand Finals Watch Party")), "main");
  assert.equal(classifyEvent(event("VOP League Event")), "main");
});

test("team practices and scrims belong with player matches", () => {
  for (const title of ["VOP Practice", "Premier Practice", "VOP Purple Practice Match", "League Scrims", "VALORANT Scrimmage"]) assert.equal(classifyEvent(event(title)), "matches");
  assert.equal(classifyEvent(event("VOP Practice", ["Main Events"])), "matches");
  assert.equal(classifyEvent(event("Community Practice Watch Party")), "main");
});

test("tentative dates and unfamiliar entries require confirmation", () => {
  for (const title of ["Potential Picture Day", "Spring Break", "TBD Match", "TBD Practice", "VOP Tryouts"]) assert.equal(classifyEvent(event(title)), "unclassified");
});

test("explicit categories override title rules and conflicts remain unclassified", () => {
  assert.equal(classifyEvent(event("NECC match", ["Main Events"])), "main");
  assert.equal(classifyEvent(event("Community play", ["Player Matches"])), "matches");
  assert.equal(classifyEvent(event("NECC match", ["Main Events", "Player Matches"])), "unclassified");
});

test("groups preserve every unique occurrence in chronological order", () => {
  const early = event("NECC match");
  const later = { ...event("PCL Game"), startsAt: "2026-09-30T23:00:00Z" };
  const practice = event("VOP Practice");
  const groups = groupEvents([later, practice, early, early]);
  assert.deepEqual(groups.matches, [practice, early, later]);
  assert.deepEqual(groups.unclassified, []);
  assert.deepEqual(groups.main, []);
});

test("calendar metadata and URLs survive recurrence expansion", () => {
  const raw = "BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:series\nDTSTART:20260928T230000Z\nSUMMARY:VOP Practice\nCATEGORIES:Main Events,Community\\, casual\nURL:https://example.com/event\nRRULE:FREQ=WEEKLY;COUNT=2\nEND:VEVENT\nEND:VCALENDAR";
  const events = parseCalendar(raw, Date.parse("2026-09-26T00:00:00Z"), 12);
  assert.equal(events.length, 2);
  for (const entry of events) {
    assert.deepEqual(entry.categories, ["Main Events", "Community, casual"]);
    assert.equal(entry.url, "https://example.com/event");
    assert.equal(classifyEvent(entry), "matches");
  }
});
