(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidRecruitmentRules = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidRecruitmentRules() {
  "use strict";

  const GROWTH_COMPENSATION = [
    { id: 0, label: "C", salaryMultiplier: .9, hiringPremium: 0 },
    { id: 1, label: "B", salaryMultiplier: 1, hiringPremium: 30 },
    { id: 2, label: "A", salaryMultiplier: 1.15, hiringPremium: 80 }
  ];

  function clampGrowth(value) {
    return Math.max(0, Math.min(GROWTH_COMPENSATION.length - 1, Math.round(Number(value) || 0)));
  }

  function roundTen(value) {
    return Math.max(0, Math.round((Number(value) || 0) / 10) * 10);
  }

  function monthlySalary(rank = 0, growthPotential = 1) {
    const safeRank = Math.max(0, Math.round(Number(rank) || 0));
    const growth = GROWTH_COMPENSATION[clampGrowth(growthPotential)];
    return roundTen((120 + safeRank * 72) * growth.salaryMultiplier);
  }

  function hiringCost(rank = 0, growthPotential = 1, salary) {
    const safeRank = Math.max(0, Math.round(Number(rank) || 0));
    const growth = GROWTH_COMPENSATION[clampGrowth(growthPotential)];
    const safeSalary = Number.isFinite(Number(salary)) ? Number(salary) : monthlySalary(safeRank, growthPotential);
    return roundTen(safeSalary + 100 + safeRank * 90 + growth.hiringPremium);
  }

  function candidateHiringCost(candidate = {}) {
    const migrated = Number(candidate.recruitmentCost ?? candidate.signingCost);
    return Number.isFinite(migrated) && migrated > 0
      ? roundTen(migrated)
      : hiringCost(candidate.rank, candidate.growthPotential, candidate.salary);
  }

  return { GROWTH_COMPENSATION, monthlySalary, hiringCost, candidateHiringCost };
});
