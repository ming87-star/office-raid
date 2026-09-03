"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const game = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const style = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");

assert.match(game, /class="desk-identity"><strong>\$\{escapeHtml\(member\.name\)\}<\/strong><small>\$\{DEPARTMENTS\[member\.department\]\.short\} · \$\{employeePosition\(member\)\}<\/small>/);
assert.match(style, /\.desk-identity\s*\{[^}]*display:\s*inline-flex/s, "Office identity must keep the name and team on one row.");
assert.match(style, /\.desk-identity\s*\{[^}]*overflow:\s*hidden/s, "Office identity must stay inside its desk column.");
assert.match(style, /\.desk-identity\s*>\s*small\s*\{[^}]*text-overflow:\s*ellipsis/s, "Long team labels must truncate safely.");
assert.doesNotMatch(style, /\.desk\s*>\s*small\s*\{/);

console.log("Office identity layout checks passed.");
