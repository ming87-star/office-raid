const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const game = read("game.js");
const canonical = read("canonical-systems.js");
const style = read("style.css");

for (const source of [game, canonical]) {
  assert.match(source, /class="work-mail-avatar"/);
  assert.match(source, /data-portrait-crop="face"/);
}

assert.doesNotMatch(canonical, /data-portrait-crop="upper"/);
assert.match(style, /\.work-mail-avatar\s*\{[^}]*overflow:\s*hidden/);
assert.match(style, /\.work-mail-avatar\s+:is\(canvas,\s*\.character-svg\)\s*\{[^}]*overflow:\s*hidden/);

console.log("work mail portrait layout tests passed");
