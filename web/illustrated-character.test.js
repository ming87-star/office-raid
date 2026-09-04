"use strict";

const assert = require("node:assert/strict");

global.window = {};
require("./illustrated-character.js");

const member = {
  gender: "female",
  appearance: { face: 0, skin: 0, hair: 4, eyes: 0, eyebrows: 0, nose: 0, mouth: 0, accessory: 0, top: 0, bottom: 1 }
};
const front = window.OfficeRaidCharacter.render(member, "front", false);
const back = window.OfficeRaidCharacter.render(member, "back", false);

for (const svg of [front, back]) {
  assert.match(svg, /M64 191 V220 M96 191 V220/);
  assert.match(svg, /M58 1(?:67|68) Q80 177 102 1(?:67|68) L108 194 L52 194Z/);
  assert.doesNotMatch(svg, /M84 194 L84 218/);
}

console.log("Illustrated character checks passed: female skirt, legs, and shoes share centered body axes.");
