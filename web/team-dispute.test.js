"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dispute = require("./team-dispute.js");

const team = [
  { id: "employee-1", name: "서대표" },
  { id: "employee-2", name: "이도윤" },
  { id: "employee-3", name: "윤도윤" }
];

assert.equal(dispute.shouldArm({ tutorialMode: true, teamSize: 3 }, 0), false);
assert.equal(dispute.shouldArm({ tutorialMode: false, teamSize: 1 }, 0), false);
assert.equal(dispute.shouldArm({ tutorialMode: false, teamSize: 3 }, .1), true);
assert.equal(dispute.shouldArm({ tutorialMode: false, teamSize: 3 }, .8), false);

const event = dispute.buildDispute(team, 0, 0);
assert.equal(event.firstId, "employee-1");
assert.equal(event.secondId, "employee-2");
assert.notEqual(event.firstId, event.secondId);

const badStatus = { name: "긴급회의", turns: 2, tone: "bad", efficiency: .8, flat: 0 };
const proceed = dispute.resolveChoice("proceed", { workload: 200, maxWorkload: 300, directiveGauge: 40, status: badStatus });
assert.equal(proceed.workload, 188);
assert.equal(proceed.directiveGauge, 48);
assert.deepEqual(proceed.status, badStatus);

const review = dispute.resolveChoice("review", { workload: 200, maxWorkload: 300, directiveGauge: 40, status: badStatus });
assert.equal(review.workload, 206);
assert.equal(review.status, null);

const compromise = dispute.resolveChoice("compromise", { workload: 200, maxWorkload: 300, directiveGauge: 40, status: badStatus });
assert.equal(compromise.workload, 200);
assert.equal(compromise.directiveGauge, 60);
assert.equal(compromise.status.turns, 1);

const gameSource = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const indexSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
assert.match(gameSource, /function openTeamDispute\(\)/);
assert.match(gameSource, /function resolveTeamDispute\(choice\)/);
assert.match(gameSource, /battle\.teamDispute/);
assert.match(gameSource, /data-dispute-choice=/);
assert.match(gameSource, /공과 사는 구분해야죠/);
assert.ok(indexSource.indexOf("team-dispute.js") < indexSource.indexOf("game.js"));

console.log("Team dispute checks passed: project-only trigger, unique pair, and three temporary choices.");
