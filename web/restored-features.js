"use strict";

(function attachOfficeRaidFeatures(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.OfficeRaidFeatures = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createOfficeRaidFeatures() {
  const DROP_RATES = [0.60, 0.65, 0.70, 0.75];
  const RESALE_BASE = [80, 160, 320, 620, 1200];

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

  function randomInt(random, max) {
    return Math.floor(random() * max);
  }

  function equipmentResalePrice(item) {
    const rarity = clamp(Math.round(Number(item?.rarity) || 0), 0, RESALE_BASE.length - 1);
    const bonuses = Math.max(0, Number(item?.workBonus) || 0) + Math.max(0, Number(item?.collaborationBonus) || 0);
    return Math.round((RESALE_BASE[rarity] + bonuses * 5) / 10) * 10;
  }

  function equipmentDropChance(project = {}, tutorial = false) {
    if (tutorial || project.boss) return 1;
    const chapter = clamp(Math.round(Number(project.chapter) || 1), 1, DROP_RATES.length);
    return DROP_RATES[chapter - 1];
  }

  function resolveEquipmentDrops({ project = {}, tutorial = false, pity = 0, roll = Math.random() } = {}) {
    const chance = equipmentDropChance(project, tutorial);
    if (project.boss) return { chance, dropCount: 2, minimumRarity: 2, nextPity: 0, guaranteed: true };
    if (tutorial) return { chance, dropCount: 1, minimumRarity: 0, nextPity: 0, guaranteed: true };
    const safePity = clamp(Math.round(Number(pity) || 0), 0, 2);
    const guaranteed = safePity >= 2;
    const dropped = guaranteed || Number(roll) < chance;
    return {
      chance,
      dropCount: dropped ? 1 : 0,
      minimumRarity: 0,
      nextPity: dropped ? 0 : safePity + 1,
      guaranteed
    };
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function shuffledOptions(correct, distractors, random) {
    const unique = [correct, ...distractors.filter(value => value !== correct)]
      .filter((value, index, values) => values.indexOf(value) === index)
      .slice(0, 4)
      .map((value, index) => ({ value: String(value), correct: index === 0 }));
    while (unique.length < 4) unique.push({ value: `검토 필요 ${unique.length}`, correct: false });
    for (let index = unique.length - 1; index > 0; index -= 1) {
      const target = randomInt(random, index + 1);
      [unique[index], unique[target]] = [unique[target], unique[index]];
    }
    return {
      options: unique.map(option => option.value),
      answerIndex: unique.findIndex(option => option.correct)
    };
  }

  function arithmeticProblem(random, senderName) {
    const quantityA = 12 + randomInt(random, 5) * 4;
    const priceA = 8 + randomInt(random, 8);
    const quantityB = 6 + randomInt(random, 5) * 3;
    const priceB = 5 + randomInt(random, 6);
    const total = quantityA * priceA + quantityB * priceB;
    const choices = shuffledOptions(
      `${total}만원`,
      [`${total + priceA}만원`, `${total - priceB}만원`, `${quantityA * priceA}만원`],
      random
    );
    return {
      type: "math",
      typeLabel: "견적 검산",
      senderName,
      subject: "[도움 요청] 거래처 견적 합계 확인 부탁드립니다",
      body: `대표님, 거래처에 보내기 전에 금액을 한 번만 확인해 주세요. A품목은 ${quantityA}개 × ${priceA}만원, B품목은 ${quantityB}개 × ${priceB}만원입니다.`,
      question: "부가세와 할인 전 공급 합계는 얼마인가요?",
      explanation: `${quantityA}×${priceA} + ${quantityB}×${priceB} = ${total}만원입니다.`,
      ...choices
    };
  }

  function excelProblem(random, senderName) {
    const variant = randomInt(random, 3);
    const templates = [
      {
        subject: "[도움 요청] 발주금액 엑셀 수식 확인",
        body: "B2:B8에는 수량, C2:C8에는 단가가 있습니다. 각 행의 수량×단가를 모두 더해 총 발주금액을 구하려고 합니다.",
        question: "가장 정확하고 간단한 수식은 무엇인가요?",
        correct: "=SUMPRODUCT(B2:B8,C2:C8)",
        wrong: ["=SUM(B2:B8)*SUM(C2:C8)", "=SUM(B2:C8)", "=COUNT(B2:B8,C2:C8)"],
        explanation: "SUMPRODUCT는 같은 행의 수량과 단가를 곱한 뒤 결과를 합산합니다."
      },
      {
        subject: "[도움 요청] 납기 지연 건수 수식 확인",
        body: "D2:D30에 납기 상태가 입력되어 있고, 지연된 행에는 '지연'이라고 표시되어 있습니다.",
        question: "'지연'인 행의 개수를 세는 수식은 무엇인가요?",
        correct: '=COUNTIF(D2:D30,"지연")',
        wrong: ['=SUMIF(D2:D30,"지연")', '=COUNT(D2:D30,"지연")', '=IF(D2:D30="지연",1,0)'],
        explanation: "COUNTIF는 지정 범위에서 조건과 일치하는 셀의 개수를 셉니다."
      },
      {
        subject: "[도움 요청] 안전재고 표시 수식 확인",
        body: "B2는 현재고, C2는 안전재고입니다. 현재고가 안전재고보다 적으면 '발주', 아니면 '정상'으로 표시하려고 합니다.",
        question: "D2에 입력할 올바른 수식은 무엇인가요?",
        correct: '=IF(B2<C2,"발주","정상")',
        wrong: ['=IF(B2>C2,"발주","정상")', '=COUNTIF(B2<C2,"발주")', '=SUM(B2:C2,"정상")'],
        explanation: "IF로 현재고가 안전재고보다 작은지 비교하면 됩니다."
      }
    ];
    const template = templates[variant];
    return {
      type: "excel",
      typeLabel: "엑셀 검토",
      senderName,
      subject: template.subject,
      body: template.body,
      question: template.question,
      explanation: template.explanation,
      ...shuffledOptions(template.correct, template.wrong, random)
    };
  }

  function drawingProblem(random, senderName) {
    const variant = randomInt(random, 3);
    if (variant === 0) {
      const holes = 4 + randomInt(random, 3);
      const pitch = 30 + randomInt(random, 5) * 5;
      const margin = 15 + randomInt(random, 3) * 5;
      const length = margin * 2 + pitch * (holes - 1);
      return {
        type: "drawing", typeLabel: "도면 검토", senderName,
        subject: "[도움 요청] 등간격 홀 피치 확인",
        body: `전체 길이 ${length}mm 판재에 홀 ${holes}개가 등간격으로 배치됩니다. 양 끝 홀 중심에서 판 끝까지 여유는 각각 ${margin}mm입니다.`,
        question: "인접한 홀 중심 사이의 피치는 얼마인가요?",
        explanation: `(${length}-${margin * 2})÷(${holes}-1) = ${pitch}mm입니다.`,
        ...shuffledOptions(`${pitch}mm`, [`${pitch + 5}mm`, `${pitch - 5}mm`, `${Math.round(length / holes)}mm`], random)
      };
    }
    if (variant === 1) {
      const raw = 24 + randomInt(random, 5) * 2;
      const cut = 1 + randomInt(random, 3);
      const finished = raw - cut * 2;
      return {
        type: "drawing", typeLabel: "도면 검토", senderName,
        subject: "[도움 요청] 양면 가공 후 두께 확인",
        body: `원소재 두께는 ${raw}mm이고, 앞면과 뒷면에서 각각 ${cut}mm씩 평면 가공합니다.`,
        question: "가공 완료 후 최종 두께는 얼마인가요?",
        explanation: `${raw}-${cut}×2 = ${finished}mm입니다.`,
        ...shuffledOptions(`${finished}mm`, [`${raw - cut}mm`, `${finished + 2}mm`, `${finished - 2}mm`], random)
      };
    }
    const diameter = 40 + randomInt(random, 6) * 10;
    const radius = diameter / 2;
    return {
      type: "drawing", typeLabel: "도면 검토", senderName,
      subject: "[도움 요청] 원형 치수 반경 확인",
      body: `도면에 원형 가공부가 Ø${diameter}로 표기되어 있습니다. 작업 기준점에서 원 외곽까지의 거리가 필요합니다.`,
      question: "이 원의 반경은 얼마인가요?",
      explanation: `Ø${diameter}는 지름이므로 반경은 ${diameter}÷2 = ${radius}mm입니다.`,
      ...shuffledOptions(`${radius}mm`, [`${diameter}mm`, `${radius + 5}mm`, `${Math.max(1, radius - 5)}mm`], random)
    };
  }

  function createWorkMailProblem({ seed = "", type = "auto", senderName = "직원" } = {}) {
    const random = seededRandom(seed);
    const types = ["math", "excel", "drawing"];
    const selected = type === "auto" ? types[randomInt(random, types.length)] : type;
    if (selected === "excel") return excelProblem(random, senderName);
    if (selected === "drawing") return drawingProblem(random, senderName);
    return arithmeticProblem(random, senderName);
  }

  function validateWorkMailAnswer(problem, answerIndex) {
    return Number(answerIndex) === Number(problem?.answerIndex);
  }

  function workMailAccuracy(stats = {}) {
    const total = Math.max(0, Number(stats.total) || 0);
    const correct = clamp(Math.max(0, Number(stats.correct) || 0), 0, total);
    return total ? Math.round(correct / total * 100) : 0;
  }

  return {
    DROP_RATES: [...DROP_RATES],
    hashString,
    seededRandom,
    equipmentResalePrice,
    equipmentDropChance,
    resolveEquipmentDrops,
    todayKey,
    createWorkMailProblem,
    validateWorkMailAnswer,
    workMailAccuracy
  };
});
