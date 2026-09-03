"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const index = fs.readFileSync(require.resolve("./index.html"), "utf8");
const game = fs.readFileSync(require.resolve("./game.js"), "utf8");
const canonical = fs.readFileSync(require.resolve("./canonical-systems.js"), "utf8");
const css = fs.readFileSync(require.resolve("./style.css"), "utf8");

assert.ok(index.indexOf("secretary-system.js") < index.indexOf("game.js"), "Secretary rules must load before the game runtime.");
assert.match(game, /secretaryRoadmapClaimed: \[\]/);
assert.match(game, /equipmentLockedIds: \[\]/);
assert.match(game, /data-select-secretary=/);
assert.match(game, /function renderSecretaryWelcome\(step = 0\)/);
assert.match(game, /class="secretary-resume-head"/);
assert.match(game, /function secretaryAssistMarkup\(/);
assert.match(game, /assets\/secretary\/\$\{filename\}/);
assert.doesNotMatch(game, /IMAGE<br>PENDING/);
assert.match(game, /class="office-executive-row/);
assert.match(game, /class="desk secretary-office-desk"/);
assert.doesNotMatch(game, /class="office-secretary/);
assert.match(game, /data-secretary-team=/);
assert.match(game, /data-secretary-run=/);
assert.match(game, /secretaryManaged/);
assert.match(game, /battleDelay\(900\)/);
assert.match(game, /data-equipment-lock=/);
assert.match(canonical, /data-market-mode="sale"/);
assert.match(canonical, /data-sale-select=/);
assert.match(canonical, /id="secretary-market-recommend"/);
assert.match(canonical, /secretaryMailAssistMarkup\(mail\.id\)/);
assert.match(canonical, /secretary-sale-recommended/);
assert.match(css, /equipment-lock-toggle\.locked/);
assert.doesNotMatch(css, /secretary-[abc]\.webp/);

const expressions = ["neutral", "smile", "confident", "worried", "surprised", "sorry"];
["a", "b", "c"].forEach(candidateId => {
  [
    `${candidateId}-resume.webp`,
    `${candidateId}-fullbody.webp`,
    `${candidateId}-office.webp`,
    ...expressions.map(expression => `${candidateId}-face-${expression}.webp`)
  ].forEach(filename => assert.ok(fs.existsSync(path.join(__dirname, "assets", "secretary", filename)), `Missing secretary asset: ${filename}`));
});

console.log("Secretary integration checks passed: resume recruitment, onboarding, contextual assistance, office seating, market sales, and lock toggles.");
