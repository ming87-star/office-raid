"use strict";

const assert = require("node:assert/strict");
const secretary = require("./secretary-system.js");

const base = {
  projectClears: 0,
  companyLevel: 0,
  employees: [
    { id: "a", department: "dev", work: 20, collaboration: 12, speed: 15, equipment: {} },
    { id: "b", department: "planning", work: 13, collaboration: 20, speed: 16, equipment: {} },
    { id: "c", department: "finance", work: 15, collaboration: 16, speed: 12, equipment: {} }
  ]
};

assert.equal(secretary.CANDIDATES.length, 3);
assert.deepEqual(secretary.CANDIDATES.map(candidate => candidate.id), ["a", "b", "c"]);
assert.equal(secretary.roadmap(base).current.id, "first-project");

const ready = { ...base, projectClears: 10, companyLevel: 1, employees: Array.from({ length: 6 }, (_, index) => ({ id: `e${index}`, equipment: index < 3 ? { work: { id: `q${index}` } } : {} })) };
assert.equal(secretary.roadmap(ready).ready, true);

const team = secretary.recommendTeam(base.employees, { recommended: ["planning", "dev"] }, 3);
assert.deepEqual(team.slice(0, 2).map(member => member.department).sort(), ["dev", "planning"]);

const equipment = [
  { id: "1", slot: "work", rarity: 2, workBonus: 7, collaborationBonus: 3 },
  { id: "2", slot: "work", rarity: 1, workBonus: 5, collaborationBonus: 2 },
  { id: "3", slot: "work", rarity: 0, workBonus: 3, collaborationBonus: 1 },
  { id: "4", slot: "work", rarity: 0, workBonus: 2, collaborationBonus: 1 },
  { id: "5", slot: "work", rarity: 0, workBonus: 1, collaborationBonus: 1 }
];
assert.deepEqual(secretary.saleRecommendationIds(equipment, ["5"]), ["4"]);
const normalized = secretary.normalizeSecretary({ candidateId: "b", battleSpeed: 3, introSeen: true, hintKeys: ["projects", "projects", 3] });
assert.equal(normalized.battleSpeed, 3);
assert.equal(normalized.introSeen, true);
assert.deepEqual(normalized.hintKeys, ["projects"]);
assert.equal(secretary.normalizeSecretary({ candidateId: "unknown" }), null);
for (const candidate of secretary.CANDIDATES) {
  assert.ok(secretary.tapDialoguePool(candidate.id).length >= 84, `${candidate.name} needs at least three times the general employee dialogue volume`);
  assert.ok(secretary.rareTapDialogues(candidate.id).length >= 4);
}

console.log("Secretary system checks passed: candidates, roadmap, recommendations, and save normalization.");
