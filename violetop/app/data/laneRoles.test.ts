import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
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

test("words that are only built-in object keys get no icon", () => {
  assert.equal(laneRole("constructor"), null);
  assert.equal(laneRole("__proto__"), null);
  assert.equal(laneRole("Constructor / sub"), null);
});

test("every lane has its icon file", () => {
  for (const role of ["Top", "Jungle", "Middle", "Bottom", "Support"] as const) {
    const svg = readFileSync(new URL(`../../public/images/lanes/${role.toLowerCase()}.svg`, import.meta.url), "utf8");
    assert.match(svg, /viewBox="0 0 136 136"/, `${role} icon`);
    assert.match(svg, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${role} icon is a standalone SVG`);
  }
});
