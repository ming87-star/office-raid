"use strict";

const assert = require("node:assert/strict");
const balance = require("./balance-rules.js");

const base = { chapter: 1, workload: 225, deadline: 8, cash: 760, reputation: 13, recommended: ["production", "quality", "product"] };
const tutorial = balance.scaleProject(base, { clears: 0, tutorial: true });
assert.equal(tutorial.max, 225);
assert.equal(tutorial.deadline, 8);

const scaled = balance.scaleProject(base, { clears: 1, teamLimit: 3 });
assert.equal(scaled.max, 349);
assert.equal(scaled.deadline, 6);

const stable = balance.applyRisk(scaled, "stable");
const challenge = balance.applyRisk(scaled, "challenge");
const high = balance.applyRisk(scaled, "high");
assert.equal(stable.dropChance, .40);
assert.equal(challenge.dropChance, .50);
assert.equal(high.dropChance, .60);
assert.ok(high.max > challenge.max && challenge.max > stable.max);
assert.ok(high.cash > stable.cash);
assert.equal(high.deadline, 4);

const lateBase = { chapter: 4, workload: 505, deadline: 12, cash: 1720, reputation: 35 };
const lateSmallTeam = balance.scaleProject(lateBase, { clears: 20, teamLimit: 3 });
const lateLargeTeam = balance.scaleProject(lateBase, { clears: 20, teamLimit: 6 });
assert.ok(lateLargeTeam.max > lateSmallTeam.max * 1.3, "Expanded teams must face expanded workloads.");
assert.ok(balance.requiredOutputPerMemberTurn(lateLargeTeam, 6) > balance.requiredOutputPerMemberTurn(scaled, 3), "Late-game pressure per employee turn must exceed the opening project.");

const coverage = balance.recommendedCoverage([{ department: "production" }, { department: "management" }, { department: "sales" }], base);
assert.deepEqual(coverage, { matches: 1, target: 2, missing: 1 });
const prepared = balance.eventProfile({ project: stable, missingRecommended: 0 });
const unprepared = balance.eventProfile({ project: high, missingRecommended: 2 });
assert.ok(unprepared.reworkAdded > prepared.reworkAdded);
assert.ok(unprepared.meetingEfficiency < prepared.meetingEfficiency);
assert.ok(unprepared.budgetTurns > prepared.budgetTurns);

const boss = balance.scaleProject({ ...base, boss: true, workload: 820, deadline: 19 }, { clears: 4, teamLimit: 4 });
assert.ok(boss.max > 1300);
assert.equal(boss.deadline, 14);

console.log("Balance rules passed: tutorial safety, chapter pressure, risk tiers, department coverage.");
