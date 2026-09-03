(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidActivities = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidActivities() {
  "use strict";

  const DURATION = 3;
  const TRIP_REFUSAL_REPUTATION = 15;
  const TRIP_COOLDOWN_MIN = 5;
  const TRIP_COOLDOWN_VARIANCE = 3;

  const GROWTH_LEVELS = [
    { id: 0, label: "C", score: 46, color: "#6d7c8c" },
    { id: 1, label: "B", score: 58, color: "#4a70a8" },
    { id: 2, label: "A", score: 70, color: "#168c8b" }
  ];

  const TRAINING_COURSES = {
    work: { id: "work", name: "실무 집중 교육", stat: "work", statLabel: "실무", cost: 500 },
    collaboration: { id: "collaboration", name: "협업 집중 교육", stat: "collaboration", statLabel: "협업", cost: 500 },
    speed: { id: "speed", name: "현장 대응 교육", stat: "speed", statLabel: "속도", cost: 700 }
  };

  const DEPARTMENT_TRIPS = {
    management: { name: "지사 운영 컨설팅", type: "negotiation", stat: "collaboration" },
    production: { name: "협력 공장 생산 안정화", type: "inspection", stat: "work" },
    quality: { name: "협력사 품질 감사", type: "inspection", stat: "work" },
    procurement: { name: "신규 공급처 발굴", type: "negotiation", stat: "work" },
    product: { name: "고객사 제품 개선 지원", type: "inspection", stat: "work" },
    md: { name: "지역 상품 소싱", type: "negotiation", stat: "collaboration" },
    sales: { name: "신규 거래처 수주", type: "negotiation", stat: "collaboration" },
    logistics: { name: "물류센터 정상화 지원", type: "response", stat: "speed" },
    marketing: { name: "지역 캠페인 운영", type: "negotiation", stat: "collaboration" },
    planning: { name: "고객사 서비스 기획 지원", type: "response", stat: "collaboration" },
    dev: { name: "외부 시스템 구축", type: "inspection", stat: "work" },
    design: { name: "브랜드·UX 개선 컨설팅", type: "inspection", stat: "collaboration" },
    operations: { name: "서비스 운영 안정화", type: "response", stat: "speed" },
    finance: { name: "결산·원가 개선 자문", type: "negotiation", stat: "work" }
  };

  const MINI_GAME_STEPS = {
    training: {
      work: ["업무 기준 확인", "자료 정리", "과제 실습", "결과 피드백"],
      collaboration: ["역할 확인", "의견 공유", "업무 합의", "협업 회고"],
      speed: ["우선순위 설정", "긴급 업무 처리", "결과 확인", "처리 보고"]
    },
    negotiation: ["요구 조건 확인", "핵심 조건 협상", "합의 내용 검토", "계약 확정"],
    inspection: ["현장 안전 확보", "문제 원인 파악", "개선 조치 실행", "결과 보고"],
    response: ["피해 확산 차단", "우선 업무 배정", "긴급 복구 실행", "정상화 보고"]
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hashString(value) {
    let hash = 2166136261;
    String(value).split("").forEach(character => {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let value = hashString(seed) || 1;
    return function nextRandom() {
      value += 0x6D2B79F5;
      let mixed = value;
      mixed = Math.imul(mixed ^ mixed >>> 15, mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
      return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
    };
  }

  function growthLevel(value) {
    return GROWTH_LEVELS[clamp(Math.round(Number(value) || 0), 0, GROWTH_LEVELS.length - 1)];
  }

  function trainingBaseScore(member = {}, courseId = "work") {
    const course = TRAINING_COURSES[courseId] || TRAINING_COURSES.work;
    const potential = growthLevel(member.growthPotential);
    const stats = [Number(member.work) || 0, Number(member.collaboration) || 0, Number(member.speed) || 0];
    const selected = Number(member[course.stat]) || 0;
    const weakest = selected <= Math.min(...stats);
    const priorSessions = Math.max(0, Number(member.trainingCount) || 0);
    return clamp(potential.score + (weakest ? 12 : 4) - priorSessions * 3, 35, 88);
  }

  function tripDefinition(department) {
    return DEPARTMENT_TRIPS[department] || { name: "외부 업무 지원", type: "response", stat: "collaboration" };
  }

  function tripPrimaryStat(member = {}, effective = {}) {
    const trip = tripDefinition(member.department);
    if (trip.stat === "speed") return Number(member.speed) || 0;
    return Number(effective[trip.stat] ?? member[trip.stat]) || 0;
  }

  function tripBaseScore(member = {}, effective = {}) {
    const primary = tripPrimaryStat(member, effective);
    const rank = Math.max(0, Number(member.rank) || 0);
    const equipped = Object.values(member.equipment || {}).filter(Boolean).length;
    return clamp(20 + primary * 2 + rank * 3 + equipped * 2, 42, 90);
  }

  function expectedTripPayout(member = {}, effective = {}) {
    const primary = tripPrimaryStat(member, effective);
    const rank = Math.max(0, Number(member.rank) || 0);
    return Math.round((650 + primary * 35 + rank * 120) / 10) * 10;
  }

  function resultForScore(score) {
    const value = Math.round(Number(score) || 0);
    if (value < 50) return { id: "failure", label: "실패", tone: "danger", multiplier: 0 };
    if (value < 70) return { id: "normal", label: "보통", tone: "stable", multiplier: .7 };
    if (value < 90) return { id: "success", label: "성공", tone: "growth", multiplier: 1 };
    return { id: "great", label: "대성공", tone: "great", multiplier: 1.4 };
  }

  function miniGameModifier(correct, total = 4) {
    const safeTotal = Math.max(1, Math.round(Number(total) || 1));
    const safeCorrect = clamp(Math.round(Number(correct) || 0), 0, safeTotal);
    if (safeCorrect === safeTotal) return 10;
    if (safeCorrect >= safeTotal - 1) return 5;
    if (safeCorrect >= Math.ceil(safeTotal / 2)) return 0;
    return -5;
  }

  function finalScore(baseScore, modifier = 0, variance = 0) {
    return clamp(Math.round((Number(baseScore) || 0) + (Number(modifier) || 0) + clamp(Number(variance) || 0, -5, 5)), 0, 100);
  }

  function trainingGain(courseId, resultId, rank = 0) {
    if (resultId === "failure") return 0;
    const baseGain = courseId === "speed"
      ? resultId === "great" ? 2 : 1
      : resultId === "normal" ? 1 : resultId === "success" ? 2 : 3;
    const experiencePenalty = clamp(Math.floor(Math.max(0, Number(rank) || 0) / 2), 0, 2);
    return Math.max(0, baseGain - experiencePenalty);
  }

  function tripPayout(expected, resultId) {
    const multiplier = { failure: 0, normal: .7, success: 1, great: 1.4 }[resultId] ?? 0;
    return Math.round(Math.max(0, Number(expected) || 0) * multiplier / 10) * 10;
  }

  function miniGameSteps(activity = {}) {
    if (activity.type === "training") {
      return MINI_GAME_STEPS.training[activity.courseId] || MINI_GAME_STEPS.training.work;
    }
    return MINI_GAME_STEPS[activity.tripType] || MINI_GAME_STEPS.response;
  }

  function createMiniGame(activity = {}) {
    const steps = [...miniGameSteps(activity)];
    const random = seededRandom(`${activity.id}|${activity.employeeId}|${activity.type}`);
    const options = steps.map((label, order) => ({ id: `${activity.id}-step-${order}`, label, order }));
    for (let index = options.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [options[index], options[target]] = [options[target], options[index]];
    }
    return {
      title: activity.type === "training" ? "교육 과제 정리" : activity.tripType === "negotiation" ? "출장 협상 준비" : activity.tripType === "inspection" ? "현장 점검 절차" : "긴급 대응 순서",
      prompt: "업무 단계를 올바른 순서대로 선택하세요.",
      options,
      answerIds: steps.map((_, order) => `${activity.id}-step-${order}`)
    };
  }

  function gradeMiniGamePicks(problem = {}, picks = []) {
    const answers = Array.isArray(problem.answerIds) ? problem.answerIds : [];
    const correct = answers.reduce((total, answer, index) => total + (picks[index] === answer ? 1 : 0), 0);
    return { correct, total: answers.length, modifier: miniGameModifier(correct, answers.length) };
  }

  function canOfferTrip({ availableCount = 0, teamLimit = 3, cycle = 0, nextCycle = 5, hasTrip = false, hasOffer = false } = {}) {
    return !hasTrip && !hasOffer && availableCount - 1 >= teamLimit && cycle >= nextCycle;
  }

  function nextTripCycle(cycle, random = Math.random()) {
    return Math.max(0, Math.round(Number(cycle) || 0)) + TRIP_COOLDOWN_MIN + Math.floor(clamp(Number(random) || 0, 0, .999999) * TRIP_COOLDOWN_VARIANCE);
  }

  return {
    DURATION,
    TRIP_REFUSAL_REPUTATION,
    GROWTH_LEVELS,
    TRAINING_COURSES,
    DEPARTMENT_TRIPS,
    growthLevel,
    trainingBaseScore,
    tripDefinition,
    tripPrimaryStat,
    tripBaseScore,
    expectedTripPayout,
    resultForScore,
    miniGameModifier,
    finalScore,
    trainingGain,
    tripPayout,
    createMiniGame,
    gradeMiniGamePicks,
    canOfferTrip,
    nextTripCycle
  };
});
