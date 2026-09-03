"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const management = require("./office-management.js");

const representative = { id: "employee-1", isRepresentative: true, rank: 0, department: "management", joinOrder: 1, projectParticipation: 5 };
const staff = [
  { id: "employee-2", rank: 1, department: "quality", joinOrder: 2, projectParticipation: 4 },
  { id: "employee-3", rank: 3, department: "sales", joinOrder: 3, projectParticipation: 2 },
  { id: "employee-4", rank: 2, department: "quality", joinOrder: 4, projectParticipation: 8 }
];
const employees = [representative, ...staff];

assert.equal(management.hasExecutiveSeat(0), false);
assert.equal(management.hasExecutiveSeat(1), true);
assert.equal(management.EXECUTIVE_PAGE_STAFF_SIZE, 3);
assert.equal(management.generalSeatCapacity(9, 1), 8);
assert.deepEqual(management.officeSeatIndicesForPage(0, 1), [0, 1, 2]);
assert.deepEqual(management.officeSeatIndicesForPage(1, 1), [3, 4, 5, 6, 7, 8]);
assert.equal(management.maximumOfficePages(12, 2), 3);
assert.equal(management.occupiedOfficePages(["employee-2", null, null, null, null, "employee-3"], 1), 2);

const startupSeats = management.normalizeOfficeSeats(employees, [], 6, 0);
assert.deepEqual(startupSeats.slice(0, 4), employees.map(member => member.id));
const expandedSeats = management.normalizeOfficeSeats(employees, startupSeats, 9, 1);
assert.equal(expandedSeats.includes(representative.id), false);
assert.equal(expandedSeats.filter(Boolean).length, staff.length);
assert.equal(expandedSeats.length, 8);

assert.deepEqual(management.sortEmployees(employees, "rank").map(member => member.id), ["employee-1", "employee-3", "employee-4", "employee-2"]);
assert.deepEqual(management.sortEmployees(employees, "joined").map(member => member.id), ["employee-1", "employee-2", "employee-3", "employee-4"]);
assert.deepEqual(management.sortEmployees(employees, "department", ["management", "sales", "quality"]).map(member => member.id), ["employee-1", "employee-3", "employee-4", "employee-2"]);
assert.deepEqual(management.sortEmployees(employees, "participation").map(member => member.id), ["employee-1", "employee-4", "employee-2", "employee-3"]);

const gameSource = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");
assert.match(gameSource, /function recordBattleParticipation\(\)/);
assert.match(gameSource, /function mountOfficeSeatInteractions\(\)/);
assert.match(gameSource, /reserved \? ` data-office-worker="\$\{reservedMember\.id\}"`/);
assert.doesNotMatch(gameSource, /data-seat-locked=/);
assert.match(gameSource, /data-hr-sort=/);
assert.match(gameSource, /class="hr-directory"/);

console.log("Office management checks passed: executive seat, persistent desks, HR sorting, participation tracking.");
