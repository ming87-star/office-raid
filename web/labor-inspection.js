(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidLaborInspection = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidLaborInspection() {
  "use strict";

  const UNLOCK_COMPANY_LEVEL = 1;
  const UNLOCK_PROJECT_CLEARS = 6;
  const INSPECTION_COOLDOWN = 4;
  const DEFAULT_RISK = 5;
  const RISK_SOURCES = Object.freeze({
    nightShift: { amount: 7, label: "반복된 밤샘 지시", issue: "최근 프로젝트의 연장 근무 기록" },
    payrollDeficit: { amount: 18, label: "급여일 자금 부족", issue: "급여 지급 능력과 임금대장" },
    termination: { amount: 12, label: "잦은 계약 종료", issue: "계약 종료 절차와 정산 기록" }
  });
  const DEFAULT_ISSUES = Object.freeze([
    "근로시간 기록과 휴게 관리",
    "근로계약서와 급여대장"
  ]);

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Number(value) || 0));
  }

  function normalizeCompliance(value = {}) {
    const sources = {};
    Object.keys(RISK_SOURCES).forEach(key => {
      sources[key] = Math.max(0, Math.round(Number(value.sources?.[key]) || 0));
    });
    return {
      score: clamp(Number.isFinite(Number(value.score)) ? Number(value.score) : DEFAULT_RISK, 0, 100),
      sources,
      cleanProjects: Math.max(0, Math.round(Number(value.cleanProjects) || 0)),
      lastInspectionProject: Number.isFinite(Number(value.lastInspectionProject)) ? Number(value.lastInspectionProject) : -99,
      inspections: Math.max(0, Math.round(Number(value.inspections) || 0))
    };
  }

  function recordRisk(value, source, occurrences = 1) {
    const compliance = normalizeCompliance(value);
    const rule = RISK_SOURCES[source];
    const count = Math.max(0, Math.round(Number(occurrences) || 0));
    if (!rule || !count) return compliance;
    compliance.score = clamp(compliance.score + rule.amount * count, 0, 100);
    compliance.sources[source] += count;
    compliance.cleanProjects = 0;
    return compliance;
  }

  function recordCleanProject(value) {
    const compliance = normalizeCompliance(value);
    compliance.score = clamp(compliance.score - 2, 0, 100);
    compliance.cleanProjects += 1;
    return compliance;
  }

  function riskBand(score) {
    const safeScore = clamp(score, 0, 100);
    if (safeScore >= 45) return { id: "danger", label: "위험", color: "#c84b3c" };
    if (safeScore >= 20) return { id: "watch", label: "주의", color: "#d6a12c" };
    return { id: "stable", label: "안정", color: "#168c8b" };
  }

  function inspectionChance(score) {
    return clamp(5 + Math.round(clamp(score, 0, 100) * .55), 5, 55);
  }

  function canQueueInspection({ companyLevel = 0, projectClears = 0, pending = false, lastInspectionProject = -99 } = {}) {
    return !pending
      && companyLevel >= UNLOCK_COMPANY_LEVEL
      && projectClears >= UNLOCK_PROJECT_CLEARS
      && projectClears - lastInspectionProject >= INSPECTION_COOLDOWN;
  }

  function shouldQueueInspection(options = {}, randomValue = Math.random()) {
    if (!canQueueInspection(options)) return false;
    return clamp(randomValue, 0, 1) < inspectionChance(options.score) / 100;
  }

  function inspectionIssues(value) {
    const compliance = normalizeCompliance(value);
    const ranked = Object.entries(compliance.sources)
      .filter(([, count]) => count > 0)
      .sort(([leftKey, leftCount], [rightKey, rightCount]) => {
        const leftWeight = leftCount * RISK_SOURCES[leftKey].amount;
        const rightWeight = rightCount * RISK_SOURCES[rightKey].amount;
        return rightWeight - leftWeight;
      })
      .map(([key]) => RISK_SOURCES[key].issue);
    DEFAULT_ISSUES.forEach(issue => {
      if (ranked.length < 2 && !ranked.includes(issue)) ranked.push(issue);
    });
    return ranked.slice(0, 2);
  }

  function responseCosts(headcount = 3, score = DEFAULT_RISK) {
    const people = Math.max(3, Math.round(Number(headcount) || 3));
    const risk = clamp(score, 0, 100);
    return {
      advisor: 160 + people * 35,
      correction: 90 + people * 20,
      fine: 280 + people * 55 + risk * 4
    };
  }

  function directResponseChance({ score = DEFAULT_RISK, responderCollaboration = 0, financeSpecialist = false } = {}) {
    const chance = 32
      + Math.floor(Math.max(0, Number(responderCollaboration) || 0) * 1.2)
      + (financeSpecialist ? 12 : 0)
      - Math.floor(clamp(score, 0, 100) * .25);
    return clamp(chance, 30, 82);
  }

  function buildInspection({ compliance, headcount, responderId, responderName, responderCollaboration, financeSpecialist } = {}) {
    const normalized = normalizeCompliance(compliance);
    const costs = responseCosts(headcount, normalized.score);
    return {
      riskAtVisit: normalized.score,
      issues: inspectionIssues(normalized),
      responderId: responderId || null,
      responderName: responderName || "대표",
      directChance: directResponseChance({
        score: normalized.score,
        responderCollaboration,
        financeSpecialist
      }),
      advisorCost: costs.advisor,
      correctionCost: costs.correction,
      fineCost: costs.fine
    };
  }

  function resolveInspection(event, strategy, randomValue = Math.random()) {
    const risk = clamp(event?.riskAtVisit, 0, 100);
    if (strategy === "advisor") {
      return { id: "pass", label: "적합", cost: Math.max(0, Number(event?.advisorCost) || 0), reputation: 1, nextRisk: clamp(risk - 28, 0, 100) };
    }
    if (strategy === "correction") {
      return { id: "warning", label: "시정 완료", cost: Math.max(0, Number(event?.correctionCost) || 0), reputation: -2, nextRisk: clamp(risk - 35, 0, 100) };
    }
    const success = clamp(randomValue, 0, 1) < clamp(event?.directChance, 0, 100) / 100;
    if (success) return { id: "pass", label: "적합", cost: 0, reputation: 4, nextRisk: clamp(risk - 20, 0, 100) };
    return { id: "fine", label: "시정 명령", cost: Math.max(0, Number(event?.fineCost) || 0), reputation: -6, nextRisk: clamp(risk - 30, 0, 100) };
  }

  return {
    UNLOCK_COMPANY_LEVEL,
    UNLOCK_PROJECT_CLEARS,
    INSPECTION_COOLDOWN,
    DEFAULT_RISK,
    RISK_SOURCES,
    normalizeCompliance,
    recordRisk,
    recordCleanProject,
    riskBand,
    inspectionChance,
    canQueueInspection,
    shouldQueueInspection,
    inspectionIssues,
    responseCosts,
    directResponseChance,
    buildInspection,
    resolveInspection
  };
});
