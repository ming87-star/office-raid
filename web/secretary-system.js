"use strict";

(() => {
  const CANDIDATES = [
    {
      id: "a",
      name: "한서윤",
      title: "따뜻한 실무형",
      tone: "warm",
      summary: "복잡한 업무를 차근차근 정리하고 부드럽게 알려줍니다.",
      greeting: "대표님, 반복되는 일은 제가 차근차근 정리해둘게요.",
      teamLine: "추천 부서와 직원 상태를 함께 확인해 팀을 정리했습니다.",
      equipmentLine: "지금 팀에 가장 도움이 되는 장비부터 배치했습니다.",
      saleLine: "당장 쓰지 않을 장비만 조심스럽게 골라두었습니다.",
      hrLine: "성장 여지가 크고 지금 교육을 보낼 수 있는 직원을 먼저 살펴봤어요.",
      mailLine: "죄송해요, 이 메일은 대표님이 직접 판단하셔야 해요. 옆에서 응원할게요."
    },
    {
      id: "b",
      name: "윤하린",
      title: "밝은 에너지형",
      tone: "bright",
      summary: "빠르고 활기차게 준비를 끝내고 핵심 선택만 남겨줍니다.",
      greeting: "대표님! 반복 업무는 저한테 맡기고 중요한 결정만 해주세요.",
      teamLine: "프로젝트에 딱 맞는 조합으로 빠르게 편성했어요!",
      equipmentLine: "장비 조합 완료! 지금 팀의 강점을 더 살렸어요.",
      saleLine: "안 쓰는 장비 후보를 찾았어요. 확인 후 정리해볼까요?",
      hrLine: "교육 효과를 가장 크게 볼 수 있는 직원을 찾아봤어요! 결정은 대표님 몫이에요.",
      mailLine: "앗, 이 메일은 제가 대신 답할 수 없어요. 대표님 판단을 믿고 기다릴게요!"
    },
    {
      id: "c",
      name: "차세린",
      title: "차분한 엘리트형",
      tone: "calm",
      summary: "정보를 냉정하게 분석해 가장 효율적인 선택지를 제시합니다.",
      greeting: "대표님, 필요한 선택지만 정리해두었습니다.",
      teamLine: "부서 상성과 처리 효율을 기준으로 최적안을 구성했습니다.",
      equipmentLine: "현재 프로젝트 기준으로 장비 효율을 최적화했습니다.",
      saleLine: "활용 가능성이 낮은 장비만 판매 후보로 분류했습니다.",
      hrLine: "성장 가능성과 현재 공백 위험을 함께 검토했습니다. 추천 대상만 표시하겠습니다.",
      mailLine: "이 요청은 대표 권한에 해당합니다. 도움을 드리지 못해 죄송합니다."
    }
  ];

  const ROADMAP_STAGES = [
    { id: "first-project", label: "첫 프로젝트 완료", detail: "창립 팀으로 첫 성과를 만드세요.", target: 1, metric: "projectClears", rewardCash: 120, rewardReputation: 0 },
    { id: "first-hire", label: "첫 직원 채용", detail: "면접에서 네 번째 직원을 채용하세요.", target: 4, metric: "employees", rewardCash: 0, rewardReputation: 2 },
    { id: "three-equipment", label: "장비 3개 장착", detail: "직원들의 업무 장비를 준비하세요.", target: 3, metric: "equipped", rewardCash: 180, rewardReputation: 0 },
    { id: "three-projects", label: "프로젝트 3회 완료", detail: "팀 편성과 긴급 지시에 익숙해지세요.", target: 3, metric: "projectClears", rewardCash: 0, rewardReputation: 3 },
    { id: "medium-office", label: "중형 사무실 확장", detail: "더 많은 직원을 위한 공간을 확보하세요.", target: 1, metric: "companyLevel", rewardCash: 300, rewardReputation: 0 },
    { id: "six-employees", label: "직원 6명 달성", detail: "반복 관리가 시작되는 규모까지 성장하세요.", target: 6, metric: "employees", rewardCash: 0, rewardReputation: 5 },
    { id: "ten-projects", label: "프로젝트 누적 10회", detail: "경영지원실을 개설할 신뢰를 증명하세요.", target: 10, metric: "projectClears", rewardCash: 0, rewardReputation: 0 }
  ];

  function equippedCount(state) {
    return (state.employees || []).reduce((sum, member) => sum + Object.values(member.equipment || {}).filter(Boolean).length, 0);
  }

  function stageValue(state, stage) {
    if (stage.metric === "employees") return (state.employees || []).length;
    if (stage.metric === "equipped") return equippedCount(state);
    if (stage.metric === "companyLevel") return Number(state.companyLevel || 0) >= 1 ? 1 : 0;
    return Math.max(0, Number(state[stage.metric]) || 0);
  }

  function roadmap(state) {
    const stages = ROADMAP_STAGES.map(stage => {
      const value = Math.min(stage.target, stageValue(state, stage));
      return { ...stage, value, complete: value >= stage.target };
    });
    const currentIndex = stages.findIndex(stage => !stage.complete);
    return {
      stages,
      completed: stages.filter(stage => stage.complete).length,
      total: stages.length,
      current: currentIndex < 0 ? null : stages[currentIndex],
      ready: currentIndex < 0
    };
  }

  function normalizeSecretary(value) {
    if (!value || !CANDIDATES.some(candidate => candidate.id === value.candidateId)) return null;
    return {
      candidateId: value.candidateId,
      hiredAt: Math.max(0, Number(value.hiredAt) || 0),
      autoDirective: Boolean(value.autoDirective),
      battleSpeed: value.battleSpeed === 3 ? 3 : 1,
      introSeen: Boolean(value.introSeen),
      hintKeys: Array.isArray(value.hintKeys) ? [...new Set(value.hintKeys.filter(key => typeof key === "string"))] : []
    };
  }

  function candidate(candidateId) {
    return CANDIDATES.find(item => item.id === candidateId) || null;
  }

  function equipmentValue(item) {
    if (!item) return -1;
    return (Math.max(0, Number(item.rarity) || 0) * 30)
      + (Math.max(0, Number(item.workBonus) || 0) * 3)
      + (Math.max(0, Number(item.collaborationBonus) || 0) * 2);
  }

  function saleRecommendationIds(items, lockedIds = []) {
    const locked = new Set(lockedIds);
    const groups = new Map();
    (items || []).filter(item => item && !locked.has(item.id)).forEach(item => {
      const key = item.slot || "unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const recommended = [];
    groups.forEach(group => {
      group.sort((left, right) => equipmentValue(right) - equipmentValue(left));
      group.slice(3).forEach(item => {
        if ((Number(item.rarity) || 0) <= 1) recommended.push(item.id);
      });
    });
    return recommended;
  }

  function recommendTeam(employees, project, limit, statsFor = member => member) {
    const pool = (employees || []).filter(Boolean);
    const recommended = new Set(project?.recommended || []);
    const team = [];
    const score = member => {
      const stats = statsFor(member) || member;
      return (Number(stats.work) || 0) * 2
        + (Number(stats.collaboration) || 0)
        + (Number(member.speed) || 0) * .35
        + (recommended.has(member.department) ? 45 : 0);
    };
    [...recommended].forEach(department => {
      const best = pool.filter(member => member.department === department && !team.includes(member)).sort((a, b) => score(b) - score(a))[0];
      if (best && team.length < limit) team.push(best);
    });
    pool.filter(member => !team.includes(member)).sort((a, b) => score(b) - score(a)).forEach(member => {
      if (team.length < limit) team.push(member);
    });
    return team;
  }

  const api = {
    CANDIDATES,
    ROADMAP_STAGES,
    roadmap,
    equippedCount,
    normalizeSecretary,
    candidate,
    equipmentValue,
    saleRecommendationIds,
    recommendTeam
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.OfficeRaidSecretary = api;
})();
