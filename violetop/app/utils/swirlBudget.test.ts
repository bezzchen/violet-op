import assert from "node:assert/strict";
import { test } from "node:test";
import { createFrameCap, swirlRenderSize } from "./swirlBudget.ts";

test("the frame cap skips frames until a 30 fps interval has passed", () => {
  const cap = createFrameCap(30);
  assert.equal(cap(0.02), 0);
  assert.ok(Math.abs(cap(0.02) - 0.04) < 1e-12);
});

test("the frame cap hands over all the time that accumulated, then starts again", () => {
  const cap = createFrameCap(30);
  cap(0.01);
  cap(0.01);
  cap(0.01);
  assert.ok(Math.abs(cap(0.01) - 0.04) < 1e-12);
  assert.equal(cap(0.01), 0);
});

test("the swirl renders at half the device resolution", () => {
  assert.deepEqual(swirlRenderSize(1440, 900, 2), { width: 1440, height: 900 });
  assert.deepEqual(swirlRenderSize(390, 844, 3), { width: 585, height: 1266 });
});

test("render size never drops below one pixel per CSS pixel", () => {
  assert.deepEqual(swirlRenderSize(1280, 720, 1), { width: 1280, height: 720 });
});
