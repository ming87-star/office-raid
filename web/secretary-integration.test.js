"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const index = fs.readFileSync(require.resolve("./index.html"), "utf8");
const game = fs.readFileSync(require.resolve("./game.js"), "utf8");
const canonical = fs.readFileSync(require.resolve("./canonical-systems.js"), "utf8");
const css = fs.readFileSync(require.resolve("./style.css"), "utf8");

assert.ok(index.indexOf("secretary-system.js") < index.indexOf("game.js"), "Secretary rules must load before the game runtime.");
assert.match(game, /secretaryRoadmapClaimed: \[\]/);
assert.match(game, /equipmentLockedIds: \[\]/);
assert.match(game, /data-hire-secretary=/);
assert.match(game, /data-secretary-team=/);
assert.match(game, /data-secretary-run=/);
assert.match(game, /secretaryManaged/);
assert.match(game, /battleDelay\(900\)/);
assert.match(canonical, /data-equipment-lock=/);
assert.match(canonical, /secretary-sale-recommended/);
assert.match(css, /secretary-a\.webp/);
assert.match(css, /secretary-b\.webp/);
assert.match(css, /secretary-c\.webp/);

console.log("Secretary integration checks passed: recruitment, roadmap, automation, locks, and art assets.");
