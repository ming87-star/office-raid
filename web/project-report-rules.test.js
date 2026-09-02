const assert = require("node:assert/strict");
const rules = require("./project-report-rules.js");

assert.equal(rules.reportRound(7, 3, 8), 3);
assert.equal(rules.reportRound(99, 3, 8), 8);

const success = rules.reportGrade({
  success: true,
  round: 5,
  deadline: 8,
  affinityCount: 3,
  teamSize: 3,
  negativeEvents: 0,
  comboCount: 0
});
assert.equal(success.label, "A");

const failure = rules.reportGrade({
  success: false,
  round: 8,
  deadline: 8,
  affinityCount: 3,
  teamSize: 3
});
assert.equal(failure.label, "D");

const rows = rules.contributionRows(
  [{ id: "representative" }, { id: "developer" }, { id: "planner" }],
  {
    representative: { totalDamage: 31, actions: 2 },
    developer: { totalDamage: 41, actions: 3, directives: 1 },
    planner: { totalDamage: 28, actions: 2 }
  }
);
assert.equal(rows.reduce((sum, row) => sum + row.percent, 0), 100);
assert.equal(rows.filter(row => row.mvp).length, 1);
assert.equal(rows.find(row => row.mvp).member.id, "developer");

const emptyRows = rules.contributionRows([{ id: "a" }, { id: "b" }, { id: "c" }], {});
assert.equal(emptyRows.reduce((sum, row) => sum + row.percent, 0), 100);

assert.match(rules.failureAdvice({ progress: 90, affinityCount: 2, teamSize: 3 }), /추천 부서/);
assert.match(rules.failureAdvice({ progress: 90, affinityCount: 3, teamSize: 3, negativeEvents: 1 }), /상태 제거/);

console.log("project report rules tests passed");
