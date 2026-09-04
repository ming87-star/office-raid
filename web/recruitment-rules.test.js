"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const recruitment = require("./recruitment-rules.js");

assert.equal(recruitment.monthlySalary(0, 0), 110);
assert.equal(recruitment.monthlySalary(0, 1), 120);
assert.equal(recruitment.monthlySalary(0, 2), 140);
assert.ok(recruitment.monthlySalary(3, 2) > recruitment.monthlySalary(3, 1));
assert.ok(recruitment.hiringCost(2, 2) > recruitment.hiringCost(2, 1));
assert.ok(recruitment.hiringCost(2, 1) > recruitment.hiringCost(2, 0));
assert.equal(recruitment.candidateHiringCost({ signingCost: 387 }), 390);
assert.equal(recruitment.candidateHiringCost({ recruitmentCost: 420, signingCost: 390 }), 420);

const gameSource = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
assert.match(gameSource, /function normalizeSavedCandidate/);
assert.match(gameSource, /delete normalized\.signingCost/);
assert.match(gameSource, /candidate-role-badge/);
assert.match(gameSource, /채용 비용은 공고·검증·온보딩에 드는 1회성 비용/);
assert.doesNotMatch(gameSource, /채용 계약금|면접 기능 해금/);

console.log("Recruitment compensation checks passed: growth potential changes salary and one-time hiring cost.");
