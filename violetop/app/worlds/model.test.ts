import test from "node:test";
import assert from "node:assert/strict";
import { initialRoom, hostAction, vote, publicRoom, PollError } from "./model.ts";

test("one ballot per browser, hidden results, close and stale-poll protection", () => {
  const room = initialRoom();
  assert.throws(() => vote(room, "a", "opening", "BLG"), PollError);
  hostAction(room, { action: "activate", pollId: "opening" });
  vote(room, "a", "opening", "BLG");
  vote(room, "b", "opening", "Gen.G");
  vote(room, "a", "opening", "Gen.G");
  const hidden = publicRoom(room, "a");
  assert.equal(hidden.active?.total, 2);
  assert.equal(hidden.active?.mine, "Gen.G");
  assert.equal(hidden.active?.counts, null);
  assert.equal(hidden.polls.length, 0);
  hostAction(room, { action: "reveal", pollId: "opening" });
  assert.deepEqual(publicRoom(room, "b").active?.counts, [0, 2]);
  hostAction(room, { action: "close", pollId: "opening" });
  assert.throws(() => vote(room, "c", "opening", "BLG"), PollError);
});

test("open answers require moderation and edits withdraw approval", () => {
  const room = initialRoom();
  hostAction(room, { action: "create", title: "Your MVP?", kind: "text" });
  const id = room.polls[1].id;
  hostAction(room, { action: "activate", pollId: id });
  vote(room, "a", id, "Great player");
  hostAction(room, { action: "reveal", pollId: id });
  assert.equal(publicRoom(room, "b").active?.responses.length, 0);
  assert.equal(publicRoom(room, "host", true).active?.responses.length, 1);
  hostAction(room, { action: "moderate", pollId: id, voter: "a", approved: true });
  const displayed = publicRoom(room, "b").active!.responses;
  assert.equal(displayed.length, 1);
  assert.equal(displayed[0].id, undefined);
  vote(room, "a", id, "Changed answer");
  assert.equal(publicRoom(room, "b").active?.responses.length, 0);
  assert.throws(() => vote(room, "a", "opening", "BLG"), PollError);
});

test("multiple choice validates options and keeps only one poll open", () => {
  const room = initialRoom();
  assert.throws(() => hostAction(room, { action: "create", title: "Bad", kind: "duel", options: ["A", "a"] }), PollError);
  hostAction(room, { action: "activate", pollId: "opening" });
  hostAction(room, { action: "create", title: "Next objective?", kind: "choice", options: ["Baron", "Dragon", "Tower"] });
  const id = room.polls[1].id;
  hostAction(room, { action: "activate", pollId: id });
  assert.equal(room.polls[0].open, false);
  assert.throws(() => vote(room, "a", id, "Invalid"), PollError);
  vote(room, "a", id, "Dragon");
  assert.deepEqual(publicRoom(room, "host", true).active?.counts, [0, 1, 0]);
});
