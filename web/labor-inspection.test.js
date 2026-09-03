"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const labor = require("./labor-inspection.js");

const initial = labor.normalizeCompliance();
assert.equal(initial.score, 5);
assert.equal(labor.recordRisk(initial, "nightShift", 2).score, 19);
assert.equal(labor.recordRisk(initial, "payrollDeficit").score, 23);
assert.equal(labor.recordCleanProject(initial).score, 3);
assert.equal(labor.inspectionChance(0), 5);
assert.equal(labor.inspectionChance(100), 55);
assert.equal(labor.canQueueInspection({ companyLevel: 0, projectClears: 20 }), false);
assert.equal(labor.canQueueInspection({ companyLevel: 1, projectClears: 6, lastInspectionProject: 4 }), false);
assert.equal(labor.canQueueInspection({ companyLevel: 1, projectClears: 8, lastInspectionProject: 4 }), true);
assert.equal(labor.shouldQueueInspection({ companyLevel: 1, projectClears: 8, lastInspectionProject: 4, score: 40 }, .1), true);
assert.equal(labor.shouldQueueInspection({ companyLevel: 1, projectClears: 8, lastInspectionProject: 4, score: 40 }, .9), false);

const risky = labor.recordRisk(labor.recordRisk(initial, "termination", 2), "nightShift", 3);
assert.deepEqual(labor.inspectionIssues(risky), ["계약 종료 절차와 정산 기록", "최근 프로젝트의 연장 근무 기록"]);
const event = labor.buildInspection({
  compliance: risky,
  headcount: 7,
  responderId: "employee-1",
  responderName: "서대표",
  responderCollaboration: 20,
  financeSpecialist: false
});
assert.equal(event.responderName, "서대표");
assert.equal(event.advisorCost, 405);
assert.ok(event.directChance >= 30 && event.directChance <= 82);
assert.equal(labor.resolveInspection(event, "direct", 0).id, "pass");
assert.equal(labor.resolveInspection(event, "direct", .99).id, "fine");
assert.equal(labor.resolveInspection(event, "advisor", .99).id, "pass");
assert.equal(labor.resolveInspection(event, "correction", .99).id, "warning");

const gameSource = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const reportSource = fs.readFileSync(path.join(__dirname, "project-report.js"), "utf8");
assert.match(gameSource, /function maybeQueueLaborInspection\(\)/);
assert.match(gameSource, /function renderLaborInspection\(/);
assert.match(gameSource, /function settleBattleLaborRisk\(\)/);
assert.match(gameSource, /recordLaborRisk\("termination"\)/);
assert.match(gameSource, /recordLaborRisk\("payrollDeficit"\)/);
assert.match(gameSource, /battle\.nightShiftUses/);
assert.match(gameSource, /pendingLaborInspection/);
assert.match(reportSource, /pendingLaborInspection/);

console.log("Labor inspection checks passed: risk sources, cooldown, weighted visit, choices, and outcomes.");
