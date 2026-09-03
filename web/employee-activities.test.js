"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const activities = require("./employee-activities.js");

const rookieB = {
  id: "employee-20", department: "quality", rank: 0,
  work: 9, collaboration: 12, speed: 11, growthPotential: 1, trainingCount: 0,
  equipment: { work: null, support: null, personal: null }
};
const rookieA = { ...rookieB, growthPotential: 2 };

assert.equal(activities.DURATION, 3);
assert.equal(activities.TRIP_REFUSAL_REPUTATION, 15);
assert.ok(activities.trainingBaseScore(rookieA, "work") > activities.trainingBaseScore(rookieB, "work"));
assert.ok(activities.trainingBaseScore(rookieB, "work") > activities.trainingBaseScore(rookieB, "collaboration"));
assert.equal(activities.trainingGain("work", "failure"), 0);
assert.equal(activities.trainingGain("work", "success"), 2);
assert.equal(activities.trainingGain("speed", "great"), 2);
assert.equal(activities.trainingGain("work", "great", 2), 2);
assert.equal(activities.trainingGain("work", "great", 4), 1);
assert.equal(activities.trainingGain("speed", "success", 4), 0);

assert.equal(activities.miniGameModifier(4, 4), 10);
assert.equal(activities.miniGameModifier(3, 4), 5);
assert.equal(activities.miniGameModifier(2, 4), 0);
assert.equal(activities.miniGameModifier(1, 4), -5);
assert.equal(activities.resultForScore(49).id, "failure");
assert.equal(activities.resultForScore(70).id, "success");
assert.equal(activities.resultForScore(90).id, "great");

const trip = activities.tripDefinition("quality");
assert.equal(trip.name, "협력사 품질 감사");
assert.equal(trip.type, "inspection");
assert.equal(activities.tripBaseScore({ ...rookieB, work: 18 }, { work: 18, collaboration: 12 }), 56);
assert.equal(activities.resultForScore(activities.finalScore(56, -5, -5)).id, "failure");
assert.ok(activities.expectedTripPayout({ ...rookieB, work: 20 }, { work: 24, collaboration: 12 }) >= 1400);
assert.equal(activities.tripPayout(1500, "failure"), 0);
assert.equal(activities.tripPayout(1500, "success"), 1500);
assert.equal(activities.tripPayout(1500, "great"), 2100);

assert.equal(activities.canOfferTrip({ availableCount: 4, teamLimit: 3, cycle: 5, nextCycle: 5 }), true);
assert.equal(activities.canOfferTrip({ availableCount: 3, teamLimit: 3, cycle: 5, nextCycle: 5 }), false);
assert.equal(activities.canOfferTrip({ availableCount: 7, teamLimit: 6, cycle: 4, nextCycle: 5 }), false);
assert.equal(activities.nextTripCycle(10, 0), 15);
assert.equal(activities.nextTripCycle(10, .99), 17);

const miniGame = activities.createMiniGame({ id: "training-1", employeeId: "employee-20", type: "training", courseId: "work" });
assert.equal(miniGame.options.length, 4);
assert.equal(miniGame.answerIds.length, 4);
assert.deepEqual(activities.gradeMiniGamePicks(miniGame, miniGame.answerIds), { correct: 4, total: 4, modifier: 10 });

const gameSource = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const indexSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
assert.match(gameSource, /function progressEmployeeActivities\(\)/);
assert.match(gameSource, /activity\.progress === 2/);
assert.match(gameSource, /function renderActivityMiniGame\(\)/);
assert.match(gameSource, /function renderBusinessTripOffer\(/);
assert.match(gameSource, /availableEmployees\(\)\.length - 1 < projectTeamLimit\(\)/);
assert.doesNotMatch(gameSource, /member\.rank !== 0.*신입 전용/);
assert.match(gameSource, /data-train-member="\$\{member\.id\}" aria-disabled="\$\{!education\.allowed\}">교육 보내기/);
assert.match(gameSource, /data-end-contract="\$\{member\.id\}" aria-disabled="\$\{protectedMember\}">계약 종료/);
assert.match(gameSource, /function showCenterNotice\(message\)/);
assert.ok(indexSource.indexOf("employee-activities.js") < indexSource.indexOf("game.js"));

console.log("Employee activity checks passed: three-project training, designated trips, graded mini-game influence.");
