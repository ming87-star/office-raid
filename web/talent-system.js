(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidTalent = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidTalent() {
  "use strict";

  const GRADES = [
    { id: 0, key: "normal", label: "일반", color: "#6d7c8c", revealAt: 12, power: 1, salaryMultiplier: .9, hiringPremium: 0, hint: "장기 육성 시 히든 스킬 각성" },
    { id: 1, key: "promising", label: "유망", color: "#168c8b", revealAt: 6, power: 1, salaryMultiplier: 1, hiringPremium: 30, hint: "안정적인 히든 스킬 잠재력" },
    { id: 2, key: "special", label: "특급", color: "#7160a8", revealAt: 4, power: 1.15, salaryMultiplier: 1.15, hiringPremium: 90, hint: "강화된 히든 스킬 잠재력" },
    { id: 3, key: "genius", label: "천재", color: "#d6a12c", revealAt: 3, power: 1.3, salaryMultiplier: 1.35, hiringPremium: 180, hint: "최고 수준 히든 스킬 잠재력" }
  ];

  const HIDDEN_SKILLS = [
    { id: "crisis-manager", name: "위기관리자", path: "위기 대응형", description: "불리한 상태를 제거하고 추가 업무를 복구합니다.", visual: "위기 통제판", fx: "shield", cooldown: 3, oncePerProject: true, support: true },
    { id: "deadline-expert", name: "마감 전문가", path: "마감 돌파형", description: "마지막 2턴에 폭발적인 처리량을 만듭니다.", visual: "마감 시계", fx: "shred", cooldown: 3, support: false },
    { id: "all-rounder", name: "올라운더", path: "유연 대응형", description: "2턴 동안 추천 부서 상성을 스스로 만들어냅니다.", visual: "역할 전환표", fx: "network", cooldown: 3, support: true },
    { id: "project-owner", name: "프로젝트 오너", path: "프로젝트 설계형", description: "프로젝트 규모에 비례한 강력한 결단을 내립니다.", visual: "오너 승인서", fx: "approval", cooldown: 4, oncePerProject: true, support: false },
    { id: "team-center", name: "팀의 중심", path: "팀 지휘형", description: "다음 턴까지 다른 팀원의 처리량을 끌어올립니다.", visual: "팀 브리핑", fx: "broadcast", cooldown: 4, oncePerProject: true, support: true },
    { id: "risk-taker", name: "리스크 테이커", path: "고위험 개척형", description: "도전·고위험 계약에서 처리량이 크게 증가합니다.", visual: "위험 계약서", fx: "contract", cooldown: 2, support: false },
    { id: "perfect-finisher", name: "완벽한 마무리", path: "마감 돌파형", description: "남은 업무가 30% 이하일 때 결정적인 마무리를 합니다.", visual: "완료 도장", fx: "stamp", cooldown: 2, support: false },
    { id: "advance-designer", name: "선행 설계자", path: "프로젝트 설계형", description: "남은 업무의 구조를 정리해 일정 비율을 즉시 처리합니다.", visual: "선행 설계도", fx: "presentation", cooldown: 4, oncePerProject: true, support: true }
  ];

  const REPRESENTATIVE_CHOICES = ["crisis-manager", "team-center", "deadline-expert", "advance-designer"];

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function grade(value) { return GRADES[clamp(Math.round(Number(value) || 0), 0, GRADES.length - 1)]; }
  function hiddenSkill(skillId) { return HIDDEN_SKILLS.find(skill => skill.id === skillId) || null; }

  function hashString(value) {
    let hash = 2166136261;
    String(value).split("").forEach(character => {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
    return hash >>> 0;
  }

  function skillIdForSeed(seed) { return HIDDEN_SKILLS[hashString(seed) % HIDDEN_SKILLS.length].id; }

  function rollGrade(mode = "regular", roll = Math.random()) {
    const value = clamp(Number(roll) || 0, 0, .999999);
    if (mode === "special") {
      if (value < .18) return 0;
      if (value < .60) return 1;
      if (value < .92) return 2;
      return 3;
    }
    if (value < .72) return 0;
    if (value < .94) return 1;
    if (value < .995) return 2;
    return 3;
  }

  function legacyGrade(member = {}) {
    if (member.isRepresentative) return 1;
    return clamp(Math.round(Number(member.growthPotential) || 0), 0, 2);
  }

  function normalizeMember(member = {}) {
    const talentGrade = Number.isInteger(member.talentGrade)
      ? clamp(member.talentGrade, 0, GRADES.length - 1)
      : legacyGrade(member);
    const hiddenSkillId = hiddenSkill(member.hiddenSkillId)?.id
      || skillIdForSeed(`${member.id || "employee"}|${member.name || ""}|${member.department || ""}`);
    return {
      talentGrade,
      hiddenSkillId,
      hiddenSkillRevealed: Boolean(member.hiddenSkillRevealed)
    };
  }

  function adaptationPoints(member = {}) {
    return Math.max(0, Number(member.projectParticipation) || 0) + Math.max(0, Number(member.trainingCount) || 0) * 4;
  }

  function revealProgress(member = {}) {
    const currentGrade = grade(member.talentGrade);
    const value = adaptationPoints(member);
    const target = member.isRepresentative ? 3 : currentGrade.revealAt;
    return { value: Math.min(target, value), target, ready: value >= target };
  }

  function reveal(member = {}) {
    if (member.hiddenSkillRevealed || !revealProgress(member).ready) return null;
    const beforeGrade = grade(member.talentGrade);
    if (beforeGrade.id === 0) member.talentGrade = 1;
    member.hiddenSkillRevealed = true;
    return {
      employeeId: member.id,
      employeeName: member.name,
      fromGrade: beforeGrade.id,
      grade: grade(member.talentGrade),
      skill: hiddenSkill(member.hiddenSkillId)
    };
  }

  function representativeChoices() {
    return REPRESENTATIVE_CHOICES.map(hiddenSkill).filter(Boolean);
  }

  function isSupportSkill(skillId) { return Boolean(hiddenSkill(skillId)?.support); }
  function power(member = {}) { return grade(member.talentGrade).power; }

  return {
    GRADES, HIDDEN_SKILLS, REPRESENTATIVE_CHOICES,
    grade, hiddenSkill, skillIdForSeed, rollGrade, normalizeMember,
    adaptationPoints, revealProgress, reveal, representativeChoices,
    isSupportSkill, power
  };
});
