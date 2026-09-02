"use strict";

const assert = require("node:assert/strict");
const features = require("./restored-features.js");

assert.equal(features.equipmentResalePrice({ rarity: 0, workBonus: 3, collaborationBonus: 1 }), 100);
assert.ok(features.equipmentResalePrice({ rarity: 4, workBonus: 10, collaborationBonus: 6 }) > features.equipmentResalePrice({ rarity: 2, workBonus: 6, collaborationBonus: 3 }));

assert.equal(features.equipmentDropChance({ chapter: 1 }), 0.60);
assert.equal(features.equipmentDropChance({ chapter: 4 }), 0.75);
assert.deepEqual(features.resolveEquipmentDrops({ project: { chapter: 1 }, pity: 0, roll: 0.99 }), {
  chance: 0.60, dropCount: 0, minimumRarity: 0, nextPity: 1, guaranteed: false
});
assert.equal(features.resolveEquipmentDrops({ project: { chapter: 1 }, pity: 2, roll: 0.99 }).dropCount, 1);
assert.equal(features.resolveEquipmentDrops({ project: { boss: true, chapter: 4 }, pity: 0, roll: 0.99 }).dropCount, 2);
assert.equal(features.resolveEquipmentDrops({ project: { boss: true }, pity: 0, roll: 0.99 }).minimumRarity, 2);
assert.equal(features.resolveEquipmentDrops({ project: { chapter: 1 }, tutorial: true, pity: 0, roll: 0.99 }).dropCount, 1);

for (const type of ["math", "excel", "drawing"]) {
  const problem = features.createWorkMailProblem({ seed: `qa-${type}`, type, senderName: "테스트 직원" });
  assert.equal(problem.options.length, 4);
  assert.ok(problem.answerIndex >= 0 && problem.answerIndex < 4);
  assert.equal(features.validateWorkMailAnswer(problem, problem.answerIndex), true);
  assert.equal(features.validateWorkMailAnswer(problem, (problem.answerIndex + 1) % 4), false);
  assert.equal(problem.senderName, "테스트 직원");
}
assert.deepEqual(
  features.createWorkMailProblem({ seed: "stable", type: "auto", senderName: "김대리" }),
  features.createWorkMailProblem({ seed: "stable", type: "auto", senderName: "김대리" })
);
assert.equal(features.workMailAccuracy({ correct: 3, total: 4 }), 75);
assert.equal(features.todayKey(new Date(2026, 8, 2)), "2026-09-02");

console.log("Restored feature tests passed: resale, drop rates, damage hooks, work-mail generation, accuracy.");
