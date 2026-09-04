"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const game = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const style = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");
const artKeys = [
  "laptop", "planning-tablet", "measuring-kit", "inventory-scanner",
  "debug-keyboard", "headset", "line-checklist", "organizer-diary",
  "card-wallet", "tumbler", "coffee", "charm"
];

for (const group of ["representative", "office"]) {
  for (const art of artKeys) {
    const source = path.join(__dirname, "assets", "equipment", group, `${art}.png`);
    assert.ok(fs.existsSync(source), `${group}/${art}.png must exist`);
    const file = fs.readFileSync(source);
    assert.equal(file.subarray(1, 4).toString(), "PNG", `${art}.png must be a PNG`);
    assert.ok(file.length > 20_000, `${art}.png must contain production artwork`);
  }
}

for (const art of artKeys) assert.match(game, new RegExp(`\\[\"[^\"]+\", \\"(?:work|support|personal)\\", \\"${art}\\"`));
assert.match(game, /assets\/equipment\/\$\{canvas\.classList\.contains\("office-equipment-prop"\)/);
assert.match(style, /\.equipment-icon\[data-equipment-rarity="4"\][^{]*\{[^}]*#ffedac/s);
assert.doesNotMatch(style, /\.equipment-item \.equipment-icon\s*\{[^}]*image-rendering:\s*pixelated/s);

console.log("Rounded equipment art checks passed: 12 representative icons, 12 office props, rarity backgrounds, and smooth rendering.");
