"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const features = require("./restored-features.js");

const canonical = fs.readFileSync(path.join(__dirname, "canonical-systems.js"), "utf8");

assert.equal(features.equipmentResalePrice({ rarity: 0, workBonus: 0, collaborationBonus: 0 }), 50);
assert.equal(features.equipmentResalePrice({ rarity: 1, workBonus: 0, collaborationBonus: 0 }), 100);
assert.equal(features.equipmentResalePrice({ rarity: 2, workBonus: 0, collaborationBonus: 0 }), 200);
assert.equal(features.equipmentResalePrice({ rarity: 3, workBonus: 0, collaborationBonus: 0 }), 400);
assert.equal(features.equipmentResalePrice({ rarity: 4, workBonus: 0, collaborationBonus: 0 }), 800);
assert.equal(features.equipmentResalePrice({ rarity: 0, workBonus: 2, collaborationBonus: 1 }), 70);

assert.match(canonical, /class="equipment-resale-price">예상 판매가 \$\{resale\}만원/);
assert.match(canonical, /data-sell-equipment="\$\{item\.id\}"/);
assert.match(canonical, /id="confirm-equipment-sale"/);
assert.match(canonical, /requestEquipmentSale\(button\.dataset\.sellEquipment\)/);
assert.match(canonical, /function confirmTrade\(\)/, "Automatic equipment upgrade must remain available.");

console.log("Equipment individual sale checks passed.");
