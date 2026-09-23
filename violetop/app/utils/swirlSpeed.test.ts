import assert from "node:assert/strict";
import { test } from "node:test";
import { easeSwirlSpeed, SWIRL_BASE_SPEED, SWIRL_MAX_BOOST, swirlTargetSpeed } from "./swirlSpeed.ts";

const maxSpeed = SWIRL_BASE_SPEED + SWIRL_MAX_BOOST;

test("a resting page spins at the base speed", () => {
  assert.equal(swirlTargetSpeed(0), SWIRL_BASE_SPEED);
});

test("scrolling up or down boosts the speed equally", () => {
  const down = swirlTargetSpeed(24);
  assert.equal(swirlTargetSpeed(-24), down);
  assert.ok(down > SWIRL_BASE_SPEED && down < maxSpeed);
});

test("the boost is capped for very fast scrolls", () => {
  assert.equal(swirlTargetSpeed(10_000), maxSpeed);
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
