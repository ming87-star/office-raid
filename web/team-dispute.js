(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidTeamDispute = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidTeamDispute() {
  "use strict";

  const PROJECT_DISPUTE_CHANCE = .22;
  const CHOICES = Object.freeze(["proceed", "review", "compromise"]);
  const SCENARIOS = Object.freeze([
    {
      id: "quality",
      title: "진행 방식 충돌",
      firstLine: "일단 진행하죠. 수정은 결과를 보고 해도 됩니다.",
      secondLine: "확인 없이 넘기면 재작업이 더 커집니다."
    },
    {
      id: "priority",
      title: "우선순위 충돌",
      firstLine: "급한 일부터 끝내야 전체 일정이 맞습니다.",
      secondLine: "중요한 기준부터 잡지 않으면 또 흔들립니다."
    },
    {
      id: "scope",
      title: "업무 범위 충돌",
      firstLine: "지금 범위로 밀어붙여야 마감을 지킬 수 있습니다.",
      secondLine: "빠진 부분을 두고 가면 결국 다시 돌아옵니다."
    }
  ]);

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Number(value) || 0));
  }

  function shouldArm({ tutorialMode = false, teamSize = 0 } = {}, randomValue = Math.random()) {
    return !tutorialMode && teamSize >= 2 && clamp(randomValue, 0, 1) < PROJECT_DISPUTE_CHANCE;
  }

  function buildDispute(team = [], participantRoll = Math.random(), scenarioRoll = Math.random()) {
    if (!Array.isArray(team) || team.length < 2) return null;
    const firstIndex = Math.min(team.length - 1, Math.floor(clamp(participantRoll, 0, .999999) * team.length));
    const secondOffset = 1 + Math.min(team.length - 2, Math.floor(clamp(scenarioRoll, 0, .999999) * (team.length - 1)));
    const secondIndex = (firstIndex + secondOffset) % team.length;
    const scenarioIndex = Math.min(SCENARIOS.length - 1, Math.floor(clamp((participantRoll + scenarioRoll) % 1, 0, .999999) * SCENARIOS.length));
    const scenario = SCENARIOS[scenarioIndex];
    return {
      scenarioId: scenario.id,
      title: scenario.title,
      firstId: team[firstIndex].id,
      firstName: team[firstIndex].name,
      firstLine: scenario.firstLine,
      secondId: team[secondIndex].id,
      secondName: team[secondIndex].name,
      secondLine: scenario.secondLine
    };
  }

  function resolveChoice(choice, battleState = {}) {
    const selected = CHOICES.includes(choice) ? choice : "compromise";
    const maxWorkload = Math.max(1, Number(battleState.maxWorkload) || 1);
    const workload = Math.max(0, Number(battleState.workload) || 0);
    const directiveGauge = clamp(battleState.directiveGauge, 0, 100);
    const status = battleState.status ? { ...battleState.status } : null;
    if (selected === "proceed") {
      const reduced = Math.max(10, Math.round(maxWorkload * .04));
      return {
        choice: selected,
        workload: Math.max(0, workload - reduced),
        directiveGauge: clamp(directiveGauge + 8, 0, 100),
        status,
        label: "진행 우선",
        detail: `논쟁을 멈추고 업무량 ${Math.min(workload, reduced)}을 즉시 처리했습니다.`
      };
    }
    if (selected === "review") {
      const added = Math.max(6, Math.round(maxWorkload * .02));
      return {
        choice: selected,
        workload: Math.min(Math.round(maxWorkload * 1.1), workload + added),
        directiveGauge,
        status: status?.tone === "bad" ? null : status,
        label: "검토 우선",
        detail: `검토 업무량 ${added}이 늘었지만 불리한 상태를 제거했습니다.`
      };
    }
    let shortenedStatus = status;
    if (shortenedStatus?.tone === "bad") {
      shortenedStatus.turns = Math.max(0, (shortenedStatus.turns || 0) - 1);
      if (!shortenedStatus.turns) shortenedStatus = null;
    }
    return {
      choice: selected,
      workload,
      directiveGauge: clamp(directiveGauge + 20, 0, 100),
      status: shortenedStatus,
      label: "절충안",
      detail: "양쪽 의견을 조율해 불리한 상태를 1턴 줄이고 긴급 지시를 20 충전했습니다."
    };
  }

  return {
    PROJECT_DISPUTE_CHANCE,
    CHOICES,
    SCENARIOS,
    shouldArm,
    buildDispute,
    resolveChoice
  };
});
