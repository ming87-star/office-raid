"use strict";
const assert = require("node:assert/strict");
const rules = require("./team-rules.js");

assert.equal(rules.role("dev").name, "처리·딜러");
assert.equal(rules.role("marketing").name, "협상·폭발");
assert.equal(rules.role("finance").name, "안정·방어");
assert.deepEqual(rules.stats({ trait: "꼼꼼한 기록가" }), { work: 1, collaboration: 1, speed: 0 });
assert.equal(rules.damageMultiplier({ trait: "위기 전문가" }, { remainingRatio: .3 }), 1.15);
assert.equal(rules.damageMultiplier({ trait: "위기 전문가" }, { remainingRatio: .8 }), 1);
assert.equal(rules.directiveMultiplier({ trait: "아이디어 뱅크" }), 1.1);
assert.equal(rules.directiveCharge({ trait: "발표 체질" }), 2);
console.log("team rules tests passed");
