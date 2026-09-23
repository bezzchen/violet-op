import assert from "node:assert/strict";
import { test } from "node:test";
import type { CalendarEvent } from "../lib/ical";
import { eventArtwork, getEventArtwork, teamEventArtwork } from "./eventArtwork.ts";

function calendarEvent(title: string, location: string | null = null): CalendarEvent {
  return {
    id: title,
    title,
    month: "SEP",
    day: "24",
    weekday: "Thu",
    time: "7:00 PM – 9:30 PM",
    location,
    startsAt: "2026-09-24T23:00:00.000Z",
  };
}

test("each VOP team's events show that team's splash art", () => {
  assert.equal(getEventArtwork(calendarEvent("VOP White PCL Game")), teamEventArtwork.white);
  assert.equal(getEventArtwork(calendarEvent("VOP Purple PCL Game")), teamEventArtwork.purple);
  assert.equal(getEventArtwork(calendarEvent("VOP Black Scrims")), teamEventArtwork.black);
  assert.equal(getEventArtwork(calendarEvent("VOP Ruby Tryouts")), teamEventArtwork.ruby);
  assert.equal(getEventArtwork(calendarEvent("NECC VOP Elder Match")), teamEventArtwork.elder);
  assert.equal(getEventArtwork(calendarEvent("VOP Baron Customs")), teamEventArtwork.baron);
});

test("team names match regardless of case or spacing", () => {
  assert.equal(getEventArtwork(calendarEvent("vop   WHITE watch party")), teamEventArtwork.white);
});

test("the first team named in a title wins", () => {
  assert.equal(getEventArtwork(calendarEvent("VOP Purple vs VOP Black Scrim")), teamEventArtwork.purple);
});

test("events without a VOP team keep the game and activity artwork", () => {
  assert.equal(getEventArtwork(calendarEvent("Community Game Night")), eventArtwork.valorantCommunity);
  assert.equal(getEventArtwork(calendarEvent("Elder customs")), eventArtwork.leagueCommunity);
  assert.equal(getEventArtwork(calendarEvent("Black Friday Social")), eventArtwork.valorantCommunity);
});
