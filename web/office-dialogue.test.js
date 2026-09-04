"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const dialogue = require("./office-dialogue.js");

test("repeated employee taps escalate from conversation to silence", () => {
  let state = null;
  const stages = [];
  for (let index = 0; index < 7; index += 1) {
    state = dialogue.nextTap(state, 1000 + index * 500);
    stages.push(state.stage);
  }
  assert.deepEqual(stages, ["normal", "normal", "normal", "complaint", "complaint", "final", "silent"]);
});

test("tap escalation resets after the quiet period", () => {
  const irritated = { count: 7, lastTapAt: 1000 };
  assert.equal(dialogue.nextTap(irritated, 31001).stage, "normal");
});

test("dialogue picker avoids recently shown lines when possible", () => {
  assert.equal(dialogue.pickFresh(["A", "B", "C"], ["A", "B"], 0), "C");
  assert.equal(dialogue.pickFresh(["A", "B"], ["A", "B"], 0.75), "B");
});
