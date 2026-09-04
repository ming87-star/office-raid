"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const game = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const character = fs.readFileSync(path.join(__dirname, "illustrated-character.js"), "utf8");
const index = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const officeStart = game.indexOf("function renderOffice(");
const officeEnd = game.indexOf("function positionOfficeDragGhost", officeStart);
const office = game.slice(officeStart, officeEnd);

assert.ok(index.indexOf("company-identity.js") < index.indexOf("game.js"));
assert.ok(index.indexOf("team-rules.js") < index.indexOf("game.js"));
assert.match(game, /data-logo-part="\$\{part\}"/);
assert.match(game, /id="random-company-logo"/);
assert.match(game, /data-representative-gender="male"/);
assert.match(game, /data-representative-gender="female"/);
assert.match(game, /const gender = Math\.random\(\) < \.5 \? "female" : "male"/);
assert.match(game, /gender: member\.gender === "female"/);
assert.match(character, /function femaleHairBack\(/);
assert.match(character, /function femaleFrontBody\(/);
assert.match(character, /const female = member\?\.gender === "female"/);
assert.match(office, /unreadMailCount \? `<b aria-hidden="true"><\/b>` : ""/);
assert.doesNotMatch(office, /office-page-prev|office-page-next|complete.*office-mail-icon/);

console.log("Customization integration checks passed: logo builder, gender parts, mail state, and buttonless office paging.");
