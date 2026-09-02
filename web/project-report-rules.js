(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.OfficeRaidProjectReportRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createProjectReportRules() {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  function reportRound(action, teamSize, deadline) {
    const safeTeamSize = Math.max(1, Number(teamSize) || 1);
    const safeDeadline = Math.max(1, Number(deadline) || 1);
    return Math.min(safeDeadline, Math.max(1, Math.ceil(Math.max(1, Number(action) || 0) / safeTeamSize)));
  }
  function reportGrade({ success, round, deadline, affinityCount, teamSize, negativeEvents = 0, comboCount = 0 }) {
    if (!success) return { label: "D", score: 0, tone: "failure", description: "마감과 팀 구성을 다시 점검해야 합니다." };
    const safeDeadline = Math.max(1, Number(deadline) || 1);
    const safeRound = clamp(Number(round) || safeDeadline, 1, safeDeadline);
    const remainingRatio = Math.max(0, safeDeadline - safeRound) / safeDeadline;
    const affinityRatio = clamp((Number(affinityCount) || 0) / Math.max(1, Number(teamSize) || 1), 0, 1);
    const score = clamp(Math.round(68 + remainingRatio * 12 + affinityRatio * 8 + Math.min(10, (Number(comboCount) || 0) * 5) - (Number(negativeEvents) || 0) * 3), 1, 100);
    if (score >= 92) return { label: "S", score, tone: "excellent", description: "일정, 부서 상성, 긴급 지시 연계가 완벽했습니다." };
    if (score >= 80) return { label: "A", score, tone: "great", description: "핵심 부서 조합과 빠른 행동 순서가 좋았습니다." };
    if (score >= 68) return { label: "B", score, tone: "good", description: "프로젝트를 안정적으로 완료했습니다." };
    return { label: "C", score, tone: "barely", description: "프로젝트는 완료했지만 다음 마감은 더 촘촘한 준비가 필요합니다." };
  }
  function contributionRows(team, memberStats) {
    const members = Array.isArray(team) ? team : [];
    const prepared = members.map((member, index) => {
      const stats = memberStats?.[member.id] || {};
      return {
        member,
        index,
        actions: Math.max(0, Number(stats.actions) || 0),
        directives: Math.max(0, Number(stats.directives) || 0),
        normalDamage: Math.max(0, Number(stats.normalDamage) || 0),
        directiveDamage: Math.max(0, Number(stats.directiveDamage) || 0),
        automationDamage: Math.max(0, Number(stats.automationDamage) || 0),
        totalDamage: Math.max(0, Number(stats.totalDamage) || 0)
      };
    });
    const measuredTotal = prepared.reduce((sum, row) => sum + row.totalDamage, 0);
    const weights = prepared.map(row => measuredTotal > 0 ? row.totalDamage : 1);
    const weightTotal = Math.max(1, weights.reduce((sum, value) => sum + value, 0));
    const raw = weights.map(value => value / weightTotal * 100);
    const percentages = raw.map(Math.floor);
    let remaining = 100 - percentages.reduce((sum, value) => sum + value, 0);
    raw.map((value, index) => ({ index, fraction: value - percentages[index] }))
      .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
      .forEach(item => { if (remaining > 0) { percentages[item.index] += 1; remaining -= 1; } });
    const mvpIndex = prepared.reduce((best, row, index) => row.totalDamage > (prepared[best]?.totalDamage ?? -1) ? index : best, 0);
    return prepared.map((row, index) => ({ ...row, percent: percentages[index] || 0, mvp: index === mvpIndex }));
  }
  function failureAdvice({ progress, affinityCount, teamSize, negativeEvents = 0 }) {
    if ((Number(affinityCount) || 0) < Math.max(1, Number(teamSize) || 1)) return "추천 부서 직원을 보강하면 기본 업무 처리량이 크게 오릅니다.";
    if ((Number(negativeEvents) || 0) > 0) return "상태 제거와 마감 연장 스킬을 긴급 지시에 포함해 돌발 상황에 대비하세요.";
    if ((Number(progress) || 0) >= 80) return "업무 도구를 강화하거나 속도가 빠른 직원을 앞에 배치하면 마감 전에 끝낼 수 있습니다.";
    return "실무 능력과 장비 보너스를 높인 뒤 팀 편성을 다시 점검하세요.";
  }
  return Object.freeze({ reportRound, reportGrade, contributionRows, failureAdvice });
});
