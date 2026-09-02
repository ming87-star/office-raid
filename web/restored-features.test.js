"use strict";
const assert=require("node:assert/strict"),f=require("./restored-features.js");
assert.equal(f.equipmentDropChance({chapter:1}),.4);assert.equal(f.equipmentDropChance({chapter:4}),.4);assert.equal(f.equipmentDropChance({dropChance:.6}),.6);
assert.equal(f.resolveEquipmentDrops({project:{},pity:2,roll:.99}).dropCount,0);
assert.equal(f.resolveEquipmentDrops({project:{boss:true},roll:.99}).dropCount,2);
assert.equal(f.resolveEquipmentDrops({project:{},tutorial:true,roll:.99}).dropCount,1);
assert.equal(f.todayKey(new Date("2026-09-01T15:00:00Z")),"2026-09-02");
console.log("Canonical feature tests passed.");
