(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidBalance = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidBalance() {
  "use strict";

  const RISK_TIERS = {
    stable: { id: "stable", label: "안정", tone: "stable", workload: 1, deadline: 0, cash: 1, reputation: 1, dropChance: .40, eventPressure: 0 },
    challenge: { id: "challenge", label: "도전", tone: "challenge", workload: 1.16, deadline: -1, cash: 1.18, reputation: 1.15, dropChance: .50, eventPressure: .16 },
    high: { id: "high", label: "고위험", tone: "high", workload: 1.34, deadline: -2, cash: 1.35, reputation: 1.30, dropChance: .60, eventPressure: .32 }
  };
  const REGULAR_MULTIPLIERS = [1.55, 1.82, 2.08, 2.36];
  const REGULAR_DEADLINE_CUTS = [2, 3, 4, 5];
  const BOSS_MULTIPLIERS = [1.62, 1.78, 1.96, 2.15];
  const BOSS_DEADLINE_CUTS = [5, 6, 7, 8];

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function chapterIndex(project) { return clamp(Math.round(Number(project?.chapter) || 1), 1, 4) - 1; }

  function scaleProject(project = {}, { clears = 0, tutorial = false, teamLimit = 3 } = {}) {
    if (tutorial) return { ...project, max: project.workload, deadline: project.deadline };
    const index = chapterIndex(project);
    const growth = Math.max(0, Math.floor((Number(clears) || 0) / 4));
    const progression = 1 + Math.min(.42, growth * .06);
    const teamScale = 1 + Math.max(0, clamp(Math.round(Number(teamLimit) || 3), 3, 6) - 3) * .12;
    const multiplier = project.boss ? BOSS_MULTIPLIERS[index] : REGULAR_MULTIPLIERS[index];
    const deadlineCut = project.boss ? BOSS_DEADLINE_CUTS[index] : REGULAR_DEADLINE_CUTS[index];
    return {
      ...project,
      max: Math.round(project.workload * multiplier * progression * teamScale),
      deadline: Math.max(project.boss ? 10 : 4, project.deadline - deadlineCut),
      cash: project.cash + growth * (project.boss ? 300 : 90),
      reputation: project.reputation + growth * (project.boss ? 5 : 2)
    };
  }

  function requiredOutputPerMemberTurn(project = {}, teamSize = 3) {
    const members = clamp(Math.round(Number(teamSize) || 3), 1, 6);
    const turns = Math.max(1, Math.round(Number(project.deadline) || 1));
    return Number(project.max || 0) / (members * turns);
  }

  function applyRisk(project = {}, tierId = "stable") {
    if (project.boss) return { ...project, riskTier: "boss", riskLabel: "장기", riskTone: "boss" };
    const tier = RISK_TIERS[tierId] || RISK_TIERS.stable;
    return {
      ...project,
      riskTier: tier.id,
      riskLabel: tier.label,
      riskTone: tier.tone,
      max: Math.round(project.max * tier.workload),
      deadline: Math.max(4, project.deadline + tier.deadline),
      cash: Math.round(project.cash * tier.cash),
      reputation: Math.round(project.reputation * tier.reputation),
      dropChance: tier.dropChance
    };
  }

  function recommendedCoverage(team = [], project = {}) {
    const recommended = Array.isArray(project.recommended) ? project.recommended : [];
    const matches = team.filter(member => recommended.includes(member.department)).length;
    const target = Math.min(2, recommended.length, team.length);
    return { matches, target, missing: Math.max(0, target - matches) };
  }

  function eventProfile({ project = {}, missingRecommended = 0 } = {}) {
    const tier = RISK_TIERS[project.riskTier] || RISK_TIERS.stable;
    const chapter = chapterIndex(project) + 1;
    const missing = clamp(Math.round(Number(missingRecommended) || 0), 0, 2);
    const pressure = 1 + missing * .22 + tier.eventPressure;
    const riskStep = project.riskTier === "high" ? 2 : project.riskTier === "challenge" ? 1 : 0;
    return {
      pressure,
      reworkAdded: Math.round((14 + chapter * 3) * pressure),
      reworkCap: Math.round(Math.max(36, Number(project.max || 0) * .15)),
      reworkTurns: 1 + (missing > 0 ? 1 : 0) + (project.riskTier === "high" ? 1 : 0),
      reworkEfficiency: Math.max(.65, .90 - missing * .05 - riskStep * .025),
      meetingTurns: 1 + (missing > 0 ? 1 : 0) + (project.riskTier === "high" ? 1 : 0),
      meetingEfficiency: Math.max(.50, .78 - missing * .08 - riskStep * .04),
      budgetTurns: 2 + (missing > 0 ? 1 : 0) + (project.riskTier === "high" ? 1 : 0),
      budgetFlat: -(3 + chapter + missing * 2 + riskStep),
      goodTurns: 2,
      goodFlat: Math.max(1, 4 - missing - riskStep)
    };
  }

  return { RISK_TIERS, scaleProject, applyRisk, requiredOutputPerMemberTurn, recommendedCoverage, eventProfile };
});
