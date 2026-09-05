"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const talent = require("./talent-system.js");

assert.equal(talent.GRADES.length, 4);
assert.equal(talent.HIDDEN_SKILLS.length, 8);
assert.equal(talent.representativeChoices().length, 4);
assert.equal(talent.rollGrade("regular", .1), 0);
assert.equal(talent.rollGrade("regular", .8), 1);
assert.equal(talent.rollGrade("special", .7), 2);
assert.equal(talent.rollGrade("special", .99), 3);

const representative = { id: "rep", name: "서대표", department: "management", isRepresentative: true };
assert.equal(talent.normalizeMember(representative).talentGrade, 1);
assert.equal(talent.revealProgress({ ...representative, talentGrade: 1, projectParticipation: 3 }).ready, true);

const normal = { id: "n", name: "김사원", department: "dev", talentGrade: 0, projectParticipation: 8, trainingCount: 1, hiddenSkillId: "perfect-finisher", hiddenSkillRevealed: false };
assert.equal(talent.revealProgress(normal).ready, true);
const awakening = talent.reveal(normal);
assert.equal(normal.talentGrade, 1);
assert.equal(normal.hiddenSkillRevealed, true);
assert.equal(awakening.skill.id, "perfect-finisher");

const special = { id: "s", talentGrade: 2, projectParticipation: 3, trainingCount: 0, hiddenSkillId: "team-center" };
assert.equal(talent.revealProgress(special).ready, false);
special.projectParticipation += 1;
assert.equal(talent.revealProgress(special).ready, true);

const gameSource = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
const indexSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
assert.ok(indexSource.indexOf("talent-system.js") < indexSource.indexOf("game.js"));
assert.match(gameSource, /representative\.talentGrade = 1/);
assert.match(gameSource, /data-representative-talent="\$\{skill\.id\}"/);
assert.match(gameSource, /if \(hidden\) base\[2\] = \{ \.\.\.hidden, hidden: true \}/);
assert.match(gameSource, /member\.salary = RECRUITMENT\.monthlySalary\(member\.rank, member\.talentGrade\)/);
assert.match(gameSource, /state\.pendingTalentReveals\.length\) return renderTalentReveal\(\)/);

console.log("Talent system checks passed: grades, recruitment odds, adaptation, representative choice, and hidden-skill awakening.");
