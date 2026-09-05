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
    { id: "first-hire", label: "첫 직원 채용", detail: "채용에서 네 번째 직원을 영입하세요.", target: 4, metric: "employeeJoinSequence", rewardCash: 0, rewardReputation: 2 },
    { id: "three-equipment", label: "장비 4개 장착", detail: "직원들의 업무 장비를 충분히 준비하세요.", target: 4, metric: "equipped", rewardCash: 180, rewardReputation: 0 },
    { id: "three-projects", label: "프로젝트 6회 완료", detail: "팀 편성과 긴급 지시에 익숙해지세요.", target: 6, metric: "projectClears", rewardCash: 0, rewardReputation: 3 },
    { id: "medium-office", label: "중형 사무실 확장", detail: "더 많은 직원을 위한 공간을 확보하세요.", target: 1, metric: "companyLevel", rewardCash: 300, rewardReputation: 0 },
    { id: "six-employees", label: "직원 7명 달성", detail: "반복 관리가 필요한 규모까지 성장하세요.", target: 7, metric: "employees", rewardCash: 0, rewardReputation: 5 },
    { id: "ten-projects", label: "프로젝트 누적 20회", detail: "경영지원실을 개설할 충분한 신뢰를 증명하세요.", target: 20, metric: "projectClears", rewardCash: 0, rewardReputation: 0 }
  ];

  const TAP_COMMON = [
    "대표님, 오늘도 먼저 오셨네요.", "필요하신 건 가까이 두었습니다.", "잠깐 쉬셔도 괜찮아요. 제가 흐름을 보고 있을게요.",
    "회의 전에 핵심만 한 장으로 정리해둘게요.", "오늘 일정은 무리하지 않게 나눠두었습니다.", "대표님이 놓친 일은 제가 조용히 챙겨둘게요.",
    "직원들 표정까지 살펴보고 있습니다.", "사무실 분위기가 제법 회사다워졌어요.", "방금 좋은 소식이 들어왔어요. 조금 뒤에 말씀드릴게요.",
    "오늘은 어제보다 일이 잘 풀릴 것 같아요.", "대표님 책상 위 서류는 순서대로 놓아뒀습니다.", "급한 일과 중요한 일을 따로 표시해뒀어요.",
    "어려운 결정일수록 천천히 보셔도 됩니다.", "제가 먼저 확인할 수 있는 건 확인해둘게요.", "대표님이 믿고 맡겨주신 만큼 꼼꼼히 하겠습니다.",
    "다들 대표님이 생각하는 것보다 잘 따라오고 있어요.", "오늘도 너무 늦게까지 계실 건 아니죠?", "따뜻한 음료라도 준비해드릴까요?",
    "작은 성과도 기록해두면 나중에 큰 힘이 됩니다.", "아직 서툴지만 대표님 곁에서 더 잘하고 싶어요.", "제가 있어서 조금은 편해지셨으면 좋겠습니다.",
    "중요한 건 제가 두 번 확인해둘게요.", "부르시면 바로 올 수 있는 자리에 있을게요.", "오늘 해야 할 일, 같이 하나씩 지워봐요."
  ];

  const TAP_TOPICS = ["프로젝트 준비", "장비 정리", "팀 일정", "직원 상태", "예산 흐름", "다음 회의", "확장 계획", "교육 일정", "중고거래 목록", "마감 순서", "오늘 우선순위", "내일 준비"];
  const TAP_STYLES = {
    a: topic => [
      `${topic}, 제가 먼저 차근차근 챙겨둘게요.`, `${topic}은 잊지 않도록 수첩에 적어뒀어요.`,
      `대표님은 중요한 판단에 집중하세요. ${topic}은 제가 살펴볼게요.`, `${topic}까지 신경 쓰고 계셨군요. 너무 무리하지 마세요.`,
      `오늘은 ${topic}부터 같이 정리해볼까요?`
    ],
    b: topic => [
      `${topic}, 벌써 준비 시작했어요!`, `${topic}은 제가 빠르게 확인하고 알려드릴게요.`,
      `대표님, ${topic}만 끝나면 한숨 돌릴 수 있어요!`, `${topic}도 걱정 마세요. 제가 옆에 있잖아요.`,
      `좋아요! 이번엔 ${topic}부터 시원하게 끝내봐요.`
    ],
    c: topic => [
      `${topic}, 우선순위와 위험 요소를 정리했습니다.`, `${topic}은 제가 먼저 검토하겠습니다.`,
      `대표님 판단 전에 ${topic}의 선택지를 줄여두겠습니다.`, `${topic}까지 보시는군요. 역시 빈틈이 없으십니다.`,
      `${topic}은 효율적인 순서로 처리하겠습니다.`
    ]
  };

  const TAP_PERSONAL = {
    a: [
      "대표님이 편해지는 게 제가 일을 잘하고 있다는 뜻이겠죠?", "바쁘셔도 식사는 거르지 마세요. 제가 시간을 비워둘게요.",
      "처음 합류한 날보다 대표님 표정을 더 잘 알게 된 것 같아요.", "힘든 일이 있으면 결정하기 전에 제게 먼저 말씀해주셔도 돼요.",
      "대표님이 고맙다고 해주신 말, 아직 기억하고 있어요.", "오늘은 제가 조금 더 가까이서 도와드려도 될까요?",
      "회사가 커져도 지금처럼 편하게 불러주세요.", "대표님이 웃으시면 사무실 분위기도 금방 좋아져요.",
      "저를 선택해주신 이유에 계속 보답하고 싶어요.", "바쁜 날일수록 대표님 목소리가 차분해서 안심돼요.",
      "퇴근 전에 오늘 잘한 일 하나는 꼭 말씀드릴게요.", "대표님 몫까지 하겠다는 건 아니에요. 다만 옆에서 덜 힘들게 해드리고 싶어요."
    ],
    b: [
      "대표님! 저 부르신 거 맞죠? 괜히 반가워서 먼저 대답했네요.", "오늘 성과가 좋으면 같이 작은 축하라도 해요!",
      "대표님이 칭찬해주시면 이상하게 두 배로 힘이 나요.", "제가 온 뒤로 조금 덜 심심하시죠? 그렇다고 해주세요!",
      "힘들 땐 제 쪽을 한번 보세요. 제가 웃게 해드릴게요.", "대표님과 같이 바쁜 건 생각보다 싫지 않아요.",
      "회사 커지는 모습, 제일 가까이서 계속 보고 싶어요.", "오늘 대표님 컨디션은 제가 만점으로 만들어볼게요!",
      "제가 너무 신나 보이나요? 대표님이 잘하고 계셔서 그래요.", "저를 뽑은 선택, 매일 정답으로 만들어드릴게요.",
      "퇴근할 때는 일 얘기 말고 재미있는 얘기도 해요.", "대표님이 믿어주시면 어려운 일도 겁나지 않아요!"
    ],
    c: [
      "대표님의 판단 기준은 이제 꽤 정확히 파악했습니다.", "저를 선택하신 결정이 틀리지 않았다는 걸 증명하겠습니다.",
      "대표님이 망설이는 순간까지 계산에 넣어두겠습니다.", "업무 외 질문인가요? 대표님이라면 예외로 답해드리죠.",
      "칭찬은 불필요하다고 생각했는데, 대표님께 들으니 나쁘지 않군요.", "대표님 곁이 가장 많은 정보를 확인할 수 있는 자리입니다.",
      "회사가 더 커져도 제 자리는 그대로였으면 합니다.", "대표님이 과로하면 전체 효율이 떨어집니다. 제 개인적인 걱정도 포함해서요.",
      "예상 밖의 변수가 하나 있네요. 대표님과 일하는 게 꽤 즐겁습니다.", "대표님의 신뢰는 숫자로 환산하기 어렵군요. 그래서 더 가치가 있습니다.",
      "퇴근 시간 이후라면 조금 덜 공식적으로 말씀드려도 될까요?", "제가 먼저 다가가는 경우는 드뭅니다. 기억해두세요."
    ]
  };

  const TAP_RARE = {
    a: ["사실 첫 면접 때부터 대표님과 오래 일할 것 같았어요.", "대표님이 지친 날엔 제가 먼저 알아볼 수 있었으면 좋겠어요.", "언젠가 이 회사의 시작을 둘이서 오래 이야기할 날이 오겠죠?", "오늘은 업무가 아니라 대표님 안부가 궁금해서 보고 있었어요."],
    b: ["대표님, 아주 가끔은 제가 보고 싶어서 불러주셔도 돼요!", "비밀인데요, 출근길에 대표님 생각나서 조금 빨리 왔어요.", "회사가 성공한 날 가장 먼저 대표님 옆에서 웃고 싶어요.", "대표님이랑 일하는 오늘이 제일 재미있는 날이에요!"],
    c: ["이건 분석 결과가 아닙니다. 대표님과 더 오래 일하고 싶습니다.", "대표님 앞에서는 가끔 계산이 늦어집니다. 원인은 아직 비밀입니다.", "제가 지키고 싶은 건 회사의 효율만은 아닙니다.", "대표님의 시선이 오래 머물면… 집중력이 3%쯤 떨어지는군요."]
  };

  const TAP_COMPLAINTS = {
    a: ["대표님, 자주 불러주시는 건 좋지만 이 서류만 마저 정리할게요.", "조금만 기다려주세요. 대표님 일을 제대로 도와드리고 싶어요."],
    b: ["대표님, 저도 반갑지만 이러다 둘 다 야근해요!", "한 번만 더 부르시면… 대답하고 정말 일하러 갈 거예요."],
    c: ["대표님, 반복 호출로 업무 효율이 낮아지고 있습니다.", "용건이 없다면 이제 제 업무로 돌아가겠습니다."]
  };
  const TAP_FINALS = { a: "네, 이제 일부터 끝내고 다시 말씀드릴게요.", b: "좋아요, 이제 진짜 일 좀 하고 올게요!", c: "이후 호출에는 반응하지 않겠습니다. 업무를 시작합니다." };

  function tapDialoguePool(candidateId) {
    const id = CANDIDATES.some(item => item.id === candidateId) ? candidateId : "a";
    const generated = TAP_TOPICS.flatMap(topic => TAP_STYLES[id](topic));
    return [...TAP_COMMON, ...generated, ...(TAP_PERSONAL[id] || [])];
  }

  function rareTapDialogues(candidateId) { return TAP_RARE[candidateId] || TAP_RARE.a; }
  function tapComplaint(candidateId, index = 0) { const lines = TAP_COMPLAINTS[candidateId] || TAP_COMPLAINTS.a; return lines[Math.abs(index) % lines.length]; }
  function tapFinal(candidateId) { return TAP_FINALS[candidateId] || TAP_FINALS.a; }

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
      battleSpeed: 2,
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
    recommendTeam,
    tapDialoguePool,
    rareTapDialogues,
    tapComplaint,
    tapFinal
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.OfficeRaidSecretary = api;
})();
