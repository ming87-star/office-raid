(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidRecruitmentRules = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidRecruitmentRules() {
  "use strict";

  const TALENT_COMPENSATION = [
    { id: 0, label: "일반", salaryMultiplier: .9, hiringPremium: 0 },
    { id: 1, label: "유망", salaryMultiplier: 1, hiringPremium: 30 },
    { id: 2, label: "특급", salaryMultiplier: 1.15, hiringPremium: 90 },
    { id: 3, label: "천재", salaryMultiplier: 1.35, hiringPremium: 180 }
  ];

  function clampTalent(value) {
    return Math.max(0, Math.min(TALENT_COMPENSATION.length - 1, Math.round(Number(value) || 0)));
  }

  function roundTen(value) {
    return Math.max(0, Math.round((Number(value) || 0) / 10) * 10);
  }

  function monthlySalary(rank = 0, talentGrade = 0) {
    const safeRank = Math.max(0, Math.round(Number(rank) || 0));
    const talent = TALENT_COMPENSATION[clampTalent(talentGrade)];
    return roundTen((120 + safeRank * 72) * talent.salaryMultiplier);
  }

  function hiringCost(rank = 0, talentGrade = 0, salary) {
    const safeRank = Math.max(0, Math.round(Number(rank) || 0));
    const talent = TALENT_COMPENSATION[clampTalent(talentGrade)];
    const safeSalary = Number.isFinite(Number(salary)) ? Number(salary) : monthlySalary(safeRank, talentGrade);
    return roundTen(safeSalary + 100 + safeRank * 90 + talent.hiringPremium);
  }

  function candidateHiringCost(candidate = {}) {
    const migrated = Number(candidate.recruitmentCost ?? candidate.signingCost);
    return Number.isFinite(migrated) && migrated > 0
      ? roundTen(migrated)
      : hiringCost(candidate.rank, candidate.talentGrade, candidate.salary);
  }

  return { TALENT_COMPENSATION, GROWTH_COMPENSATION: TALENT_COMPENSATION, monthlySalary, hiringCost, candidateHiringCost };
});
