import assert from "node:assert/strict";
import { test } from "node:test";
import { laneRole } from "./laneRoles.ts";

test("each roster lane maps to its icon", () => {
  assert.equal(laneRole("Top"), "Top");
  assert.equal(laneRole("Jungle"), "Jungle");
  assert.equal(laneRole("Middle"), "Middle");
  assert.equal(laneRole("Bottom"), "Bottom");
  assert.equal(laneRole("Support"), "Support");
});

test("a substitute keeps the lane they cover", () => {
  assert.equal(laneRole("Support / sub"), "Support");
});

test("short names and any casing are understood", () => {
  assert.equal(laneRole("mid"), "Middle");
  assert.equal(laneRole("ADC"), "Bottom");
  assert.equal(laneRole("  jungle "), "Jungle");
});

test("roles that are not a lane get no icon", () => {
  assert.equal(laneRole("IGL"), null);
  assert.equal(laneRole("player"), null);
  assert.equal(laneRole("sub"), null);
});
