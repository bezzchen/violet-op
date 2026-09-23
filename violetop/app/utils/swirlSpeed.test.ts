import assert from "node:assert/strict";
import { test } from "node:test";
import { easeSwirlSpeed, scrollSpeedPerMs, SWIRL_BASE_SPEED, SWIRL_MAX_BOOST, swirlTargetSpeed } from "./swirlSpeed.ts";

const maxSpeed = SWIRL_BASE_SPEED + SWIRL_MAX_BOOST;

test("a resting page spins at the base speed", () => {
  assert.equal(swirlTargetSpeed(0), SWIRL_BASE_SPEED);
});

test("scrolling up or down boosts the speed equally", () => {
  const down = swirlTargetSpeed(1.2);
  assert.equal(swirlTargetSpeed(-1.2), down);
  assert.ok(down > SWIRL_BASE_SPEED && down < maxSpeed);
});

test("the boost is capped for very fast scrolls", () => {
  assert.equal(swirlTargetSpeed(100), maxSpeed);
});

test("the same scroll speed earns the same boost at 60 Hz and 120 Hz", () => {
  // 2,400 px/s is 40 px per frame at 60 Hz and 20 px per frame at 120 Hz.
  const at60 = swirlTargetSpeed(scrollSpeedPerMs(40, 1000 / 60));
  const at120 = swirlTargetSpeed(scrollSpeedPerMs(20, 1000 / 120));
  assert.ok(Math.abs(at60 - at120) < 1e-9);
  assert.ok(at60 > SWIRL_BASE_SPEED && at60 < maxSpeed);
});

test("frame intervals are clamped so a first frame or a stalled tab can't spike or zero the boost", () => {
  assert.equal(scrollSpeedPerMs(48, 0), 12);
  assert.equal(scrollSpeedPerMs(48, 2000), 0.96);
});

test("non-finite input never boosts the swirl", () => {
  assert.equal(scrollSpeedPerMs(Number.NaN, 16), 0);
  assert.equal(scrollSpeedPerMs(10, Number.NaN), 0);
  assert.equal(swirlTargetSpeed(Number.NaN), SWIRL_BASE_SPEED);
  assert.equal(swirlTargetSpeed(Number.POSITIVE_INFINITY), SWIRL_BASE_SPEED);
});

test("easing approaches the target without overshooting", () => {
  const next = easeSwirlSpeed(SWIRL_BASE_SPEED, maxSpeed, 16);
  assert.ok(next > SWIRL_BASE_SPEED && next < maxSpeed);
  assert.equal(easeSwirlSpeed(0.5, maxSpeed, 0), 0.5);
});

test("spinning up is quicker than settling back down", () => {
  const risen = easeSwirlSpeed(SWIRL_BASE_SPEED, maxSpeed, 100) - SWIRL_BASE_SPEED;
  const fallen = maxSpeed - easeSwirlSpeed(maxSpeed, SWIRL_BASE_SPEED, 100);
  assert.ok(risen > fallen);
});

test("the swirl is back within 10% of its base speed a second after scrolling stops", () => {
  let speed = maxSpeed;
  for (let frame = 0; frame < 60; frame += 1) speed = easeSwirlSpeed(speed, SWIRL_BASE_SPEED, 1000 / 60);
  assert.ok(speed - SWIRL_BASE_SPEED < SWIRL_MAX_BOOST * 0.1);
});
