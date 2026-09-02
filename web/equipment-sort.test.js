"use strict";

const assert = require("node:assert/strict");
const { sortEquipment } = require("./equipment-sort.js");

const items = [
  { id: "equipment-8", name: "오래된 희귀", slot: "support", rarity: 2, workBonus: 5, collaborationBonus: 8 },
  { id: "equipment-12", name: "최신 일반", slot: "personal", rarity: 0, workBonus: 2, collaborationBonus: 1 },
  { id: "equipment-10", name: "강한 고급", slot: "work", rarity: 1, workBonus: 9, collaborationBonus: 6 },
  { id: "legacy-item", name: "레거시", slot: "support", rarity: 0, workBonus: 2, collaborationBonus: 2 }
];
const originalOrder = items.map(item => item.id);

assert.deepEqual(sortEquipment(items, "newest").map(item => item.id), ["equipment-12", "equipment-10", "equipment-8", "legacy-item"]);
assert.deepEqual(sortEquipment(items, "rarity").map(item => item.id), ["equipment-8", "equipment-10", "legacy-item", "equipment-12"]);
assert.deepEqual(sortEquipment(items, "stats").map(item => item.id), ["equipment-10", "equipment-8", "legacy-item", "equipment-12"]);
assert.deepEqual(sortEquipment(items, "slot").map(item => item.id), ["equipment-10", "equipment-8", "legacy-item", "equipment-12"]);
assert.deepEqual(items.map(item => item.id), originalOrder, "정렬이 원본 보관 순서를 바꾸면 안 됩니다.");

console.log("equipment sort tests passed");
