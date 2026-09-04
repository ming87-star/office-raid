"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const game = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const style = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");
const canonical = fs.readFileSync(path.join(__dirname, "canonical-systems.js"), "utf8");
const officeStart = game.indexOf("function renderOffice(");
const officeEnd = game.indexOf("function positionOfficeDragGhost", officeStart);
const office = game.slice(officeStart, officeEnd);

assert.match(office, /office-screen-a/);
assert.match(office, /class="office-hud"/);
assert.match(office, /class="office-mail-icon/);
assert.match(office, /class="office-dock"/);
assert.match(office, /office-nav-hire\.webp/);
assert.match(office, /office-nav-team\.webp/);
assert.match(office, /office-nav-equipment\.webp/);
assert.match(office, /office-nav-hr\.webp/);
assert.match(office, /office-nav-project\.webp/);
assert.match(office, /office-mail-glyph/);
assert.match(office, /companyLogoMarkup\("office-company-logo"/);
assert.doesNotMatch(office, /office-page-prev|office-page-next/);
assert.doesNotMatch(office, /placeholder-icon/);
assert.match(office, /"잠김" : "채용"/);
for (const icon of ["hire", "team", "equipment", "hr", "project", "mail", "expand"]) {
  assert.ok(fs.existsSync(path.join(__dirname, "assets", "ui", `office-nav-${icon}.webp`)), `${icon} icon must exist`);
}
assert.match(office, /handleOfficeEmployeeTap/);
assert.match(office, /mountOfficePageSwipe\(officePageCount\)/);
assert.match(office, /class="office-company-title"/);
assert.match(game, /data-office-away-type/);
assert.doesNotMatch(office, /office-activity-toast/);
assert.doesNotMatch(office, /company-card panel/);
assert.doesNotMatch(office, /toggleLoadout/);
assert.doesNotMatch(game.slice(game.indexOf("function officeEquipmentMarkup"), game.indexOf("function ensureWorkMail")), /office-loadout-popover/);
assert.match(style, /\.office-stage\s*\{[^}]*flex:\s*1 1 auto/s);
assert.match(style, /\.office-dock\s*\{[^}]*grid-template-columns:\s*repeat\(5/s);
assert.match(style, /\.office-screen-a \.office-equipment-prop\s*\{[^}]*scale:\s*1\s*;/s);
assert.match(style, /\.office-monitor-back\s*\{[^}]*top:\s*53%/s);
assert.match(style, /\.office-monitor-back\s*\{[^}]*z-index:\s*6/s);
assert.match(style, /\.placement-desk-work\s*\{[^}]*z-index:\s*4/s);
assert.ok(office.indexOf('id="hr"') < office.indexOf('id="equipment"'));
assert.ok(office.indexOf('id="equipment"') < office.indexOf('id="team"'));
assert.match(style, /\.equipment-lock-toggle i::after/);
assert.match(style, /\.prop-laptop\s*\{[^}]*top:\s*43%[^}]*left:\s*18%/s);
assert.match(style, /\.hr-profile-tile\s*\{[^}]*aspect-ratio:\s*1/s);
assert.match(style, /data-equipment-rarity="4"\]\s*\{[^}]*background:\s*#ffedac/s);
assert.doesNotMatch(canonical, /away \? escapeHtml\(activityStatusText/);
assert.match(style, /\.secretary-welcome::before\s*\{[^}]*office-background\.webp/s);

console.log("Office A layout checks passed: full-height room, compact HUD, mail icon, dock, dialogue taps, and visible equipment.");
