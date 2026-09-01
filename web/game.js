"use strict";

const COLORS = {
  ink: "#17364a", paper: "#f3ebd7", skin: ["#f7d7bd", "#edbe98", "#d99d78", "#bd7f5c", "#956044", "#704536"],
  hair: ["#29272c", "#573b32", "#8b593a", "#c2853d", "#6e3047", "#243e52"],
  outfit: ["#4a70a8", "#168c8b", "#d6a12c", "#9b6d9d", "#c84b3c", "#6d7c8c", "#3e7852", "#d17655", "#596a9b", "#a35c72", "#4d6972", "#7c6854"]
};

const DEPARTMENTS = {
  management: { name: "경영", short: "경영", color: "#4a70a8" },
  production: { name: "생산", short: "생산", color: "#b8753a" },
  quality: { name: "품질", short: "품질", color: "#55778c" },
  procurement: { name: "구매/자재", short: "구매", color: "#7c6854" },
  product: { name: "제품개발", short: "제품", color: "#168c8b" },
  md: { name: "상품기획/MD", short: "MD", color: "#9b6d9d" },
  sales: { name: "영업", short: "영업", color: "#d6a12c" },
  logistics: { name: "물류", short: "물류", color: "#d17655" },
  marketing: { name: "마케팅/CS", short: "마케팅", color: "#c84b3c" },
  planning: { name: "서비스기획", short: "기획", color: "#4a70a8" },
  dev: { name: "개발", short: "개발", color: "#168c8b" },
  design: { name: "디자인/UX", short: "UX", color: "#a35c72" },
  operations: { name: "서비스운영", short: "운영", color: "#3e7852" },
  finance: { name: "회계/재무", short: "재무", color: "#6d7c8c" }
};

const INDUSTRIES = {
  manufacturing: {
    name: "제조업", short: "제조", icon: "⚙", tone: "manufacturing",
    tagline: "좋은 제품을, 약속한 품질로",
    departments: ["production", "quality", "procurement", "product"],
    departmentLabel: "생산 · 품질 · 구매 · 제품개발",
    combatStyle: "안정적인 지속 처리와 결함 제거",
    prefixes: ["한빛", "대성", "미래", "세움", "태성", "정우", "새한", "가온"],
    suffixes: ["정밀", "산업", "기공", "테크", "제작소", "솔루션"],
    starterNotice: "생산과 품질을 책임질 창립 팀이 모였습니다.",
    firstGoal: "첫 시제품 납품",
    starters: [
      { name: "한기준", department: "production", trait: "빠른 손", work: 18, collaboration: 13, speed: 16, look: 5123 },
      { name: "윤정밀", department: "quality", trait: "완벽주의", work: 16, collaboration: 16, speed: 12, look: 7821 }
    ]
  },
  commerce: {
    name: "유통·커머스", short: "유통", icon: "▤", tone: "commerce",
    tagline: "좋은 상품을, 가장 빠르게",
    departments: ["md", "sales", "logistics", "marketing"],
    departmentLabel: "MD · 영업 · 물류 · 마케팅",
    combatStyle: "빠른 연계와 매출 폭발",
    prefixes: ["다온", "한결", "모아", "바른", "새봄", "온누리", "가득", "이음"],
    suffixes: ["유통", "상사", "커머스", "마켓", "트레이딩", "파트너스"],
    starterNotice: "영업과 물류를 책임질 창립 팀이 모였습니다.",
    firstGoal: "첫 거래처 입점",
    starters: [
      { name: "김세일", department: "sales", trait: "발표 체질", work: 15, collaboration: 14, speed: 17, look: 2471 },
      { name: "한보람", department: "logistics", trait: "침착한 조율자", work: 16, collaboration: 15, speed: 16, look: 6942 }
    ]
  },
  it: {
    name: "IT·플랫폼", short: "IT", icon: "⌘", tone: "it",
    tagline: "작은 기능에서, 거대한 서비스로",
    departments: ["planning", "dev", "design", "operations"],
    departmentLabel: "서비스기획 · 개발 · UX · 운영",
    combatStyle: "스킬 조합과 자동화 집중 처리",
    prefixes: ["넥스트", "모아", "플로우", "루프", "픽셀", "클라우드", "브릿지", "노바"],
    suffixes: ["소프트", "웍스", "랩", "시스템즈", "플랫폼", "테크"],
    starterNotice: "서비스기획과 개발을 책임질 창립 팀이 모였습니다.",
    firstGoal: "첫 서비스 MVP 출시",
    starters: [
      { name: "박다온", department: "planning", trait: "아이디어 뱅크", work: 15, collaboration: 17, speed: 14, look: 4265 },
      { name: "이코드", department: "dev", trait: "위기 전문가", work: 19, collaboration: 12, speed: 16, look: 3817 }
    ]
  }
};

const COMMON_DEPARTMENTS = ["finance"];
const RECRUITABLE_DEPARTMENTS = [...new Set([...Object.values(INDUSTRIES).flatMap(industry => industry.departments), ...COMMON_DEPARTMENTS])];

const RANKS = [
  { name: "신입", bonus: 0, color: "#6d7c8c" },
  { name: "경력자", bonus: 4, color: "#168c8b" },
  { name: "전문가", bonus: 8, color: "#4a70a8" },
  { name: "에이스", bonus: 12, color: "#9b6d9d" },
  { name: "업계 전설", bonus: 18, color: "#d6a12c" }
];
const POSITIONS = ["사원", "대리", "과장", "부장", "임원"];
const PAYROLL_PROJECT_INTERVAL = 3;
const TURNOVER_PROJECT_INTERVAL = 5;
const TURNOVER_REPUTATION_COST = 8;

const EQUIPMENT_SLOTS = {
  work: { name: "업무 도구", icon: "▣" },
  support: { name: "보조 도구", icon: "◈" },
  personal: { name: "개인 소지품", icon: "◆" }
};
const EQUIPMENT_RARITIES = [
  { name: "일반", color: "#7e8790" }, { name: "고급", color: "#4e9f67" },
  { name: "희귀", color: "#4a70a8" }, { name: "영웅", color: "#a35db3" },
  { name: "전설", color: "#d6a12c" }
];
const EQUIPMENT_CATALOG = [
  ["집중형 노트북", "work", "laptop", ["it"]], ["기획자의 태블릿", "work", "tablet", ["commerce", "it"]],
  ["정밀 측정 키트", "work", "calculator", ["manufacturing"]], ["재고 스캐너", "work", "tablet", ["commerce"]],
  ["디버깅 키보드", "work", "laptop", ["it"]], ["협업 헤드셋", "support", "headset", ["commerce", "it"]],
  ["라인 체크리스트", "support", "planner", ["manufacturing"]], ["정리의 다이어리", "support", "planner"],
  ["황금 명함지갑", "support", "wallet", ["commerce"]], ["마감 수호 텀블러", "personal", "tumbler"],
  ["새벽의 커피", "personal", "coffee"], ["행운의 부적", "personal", "charm"]
];

const DIRECTIVE_SKILLS = {
  sales: [
    { id: "requirement-brief", name: "요구사항 정리", description: "약점 노출 · 연계 피해 증가", visual: "승인 도장", cooldown: 1 },
    { id: "client-persuasion", name: "고객 설득", description: "불리한 상태 제거 · 안정 처리", visual: "프레젠테이션", cooldown: 1 },
    { id: "contract-close", name: "계약 확정", description: "약점 노출 시 강력한 마무리", visual: "계약서 폭발", cooldown: 2 }
  ],
  pm: [
    { id: "schedule-shift", name: "일정 재배치", description: "마감 +1턴 · 최대 2회", visual: "거대 캘린더", cooldown: 1 },
    { id: "work-allocation", name: "업무 분담", description: "팀 모멘텀과 연계 피해 증가", visual: "업무 연결선", cooldown: 1 },
    { id: "emergency-command", name: "전사 긴급 지시", description: "이번 지시 효과 20% 증가", visual: "지휘 방송", cooldown: 2 }
  ],
  dev: [
    { id: "focus-development", name: "집중 처리", description: "핵심에 강한 즉시 업무 처리", visual: "업무 폭발", cooldown: 1 },
    { id: "automation-deploy", name: "자동화 투입", description: "즉시 처리 + 2턴 지속 처리", visual: "자동화 흐름", cooldown: 2 },
    { id: "night-shift", name: "밤샘 해결", description: "가장 강력한 단일 업무 처리", visual: "마감 파쇄", cooldown: 3 }
  ],
  finance: [
    { id: "budget-approval", name: "자원 집중", description: "이번 지시 효과 20% 증가", visual: "자원 집결", cooldown: 2 },
    { id: "cost-defense", name: "리스크 차단", description: "불리한 상태 제거 · 손실 차단", visual: "안전 장벽", cooldown: 1 },
    { id: "emergency-approval", name: "긴급 지원", description: "마감 +1턴과 즉시 업무 처리", visual: "긴급 승인", cooldown: 2 }
  ]
};

const DIRECTIVE_SUPPORT_SKILLS = new Set([
  "requirement-brief", "client-persuasion", "schedule-shift", "work-allocation",
  "emergency-command", "budget-approval", "cost-defense", "emergency-approval"
]);

const PROJECT_EPISODES = [
  { chapter: 1, name: "기반 다지기", description: "첫 고객과 첫 성과를 만들어 회사의 기초를 세웁니다." },
  { chapter: 2, name: "성장과 확장", description: "더 큰 계약과 복잡한 협업에 도전합니다." },
  { chapter: 3, name: "위기 대응", description: "회사의 신뢰를 흔드는 사고와 변수에 맞섭니다." },
  { chapter: 4, name: "대형 도약", description: "업계를 뒤흔들 장기 프로젝트에 진입합니다." }
];

const PROJECTS = [
  { id: "revision", industry: "common", chapter: 1, art: "revision", name: "끝없는 수정 요청", difficulty: "초급", workload: 210, deadline: 8, cash: 700, reputation: 12, eventEvery: 2, recommended: ["planning", "quality", "sales"], summary: "쌓여가는 수정표와 최종 파일을 정리합니다." },
  { id: "schedule", industry: "common", chapter: 1, art: "schedule", name: "엉킨 납품 일정", difficulty: "초급+", workload: 240, deadline: 8, cash: 780, reputation: 14, eventEvery: 2, recommended: ["production", "logistics", "planning"], summary: "겹쳐버린 일정과 마감 시계를 다시 맞춥니다." },
  { id: "budget-cut", industry: "common", chapter: 2, art: "audit", name: "갑작스러운 예산 삭감", difficulty: "중급", workload: 315, deadline: 9, cash: 980, reputation: 18, eventEvery: 2, recommended: ["finance", "planning", "product", "md"], summary: "줄어든 예산 안에서 핵심 범위를 지키고 계획을 다시 세웁니다." },
  { id: "key-person-gap", industry: "common", chapter: 3, art: "schedule", name: "핵심 인력 공백 수습", difficulty: "중상급", workload: 390, deadline: 10, cash: 1240, reputation: 24, eventEvery: 1, recommended: ["production", "logistics", "operations", "finance"], summary: "갑작스러운 공백을 동료들의 협업으로 메우며 마감을 지켜냅니다." },

  { id: "mfg-prototype", industry: "manufacturing", chapter: 1, art: "revision", name: "첫 시제품 납품", difficulty: "초급", workload: 225, deadline: 8, cash: 760, reputation: 13, eventEvery: 2, recommended: ["product", "production", "quality"], summary: "설계안을 실제 제품으로 완성해 첫 고객에게 납품합니다." },
  { id: "mfg-first-line", industry: "manufacturing", chapter: 1, art: "integration", name: "첫 생산라인 가동", difficulty: "초급+", workload: 255, deadline: 8, cash: 820, reputation: 15, eventEvery: 2, recommended: ["production", "quality", "procurement"], summary: "설비와 작업 순서를 맞춰 회사의 첫 생산라인을 가동합니다." },
  { id: "mfg-supplier", industry: "manufacturing", chapter: 2, art: "migration", name: "핵심 부품 수급 위기", difficulty: "중급", workload: 290, deadline: 9, cash: 930, reputation: 17, eventEvery: 2, recommended: ["procurement", "production", "finance"], summary: "멈춰가는 생산라인에 필요한 부품을 제때 확보합니다." },
  { id: "mfg-certification", industry: "manufacturing", chapter: 2, art: "audit", name: "품질 인증 심사", difficulty: "중급+", workload: 325, deadline: 9, cash: 1030, reputation: 20, eventEvery: 2, recommended: ["quality", "product", "production"], summary: "기록과 공정을 정비해 까다로운 품질 인증을 통과합니다." },
  { id: "mfg-defect", industry: "manufacturing", chapter: 3, art: "audit", name: "불량률 0.1% 작전", difficulty: "중상급", workload: 350, deadline: 10, cash: 1120, reputation: 22, eventEvery: 2, recommended: ["quality", "production", "product"], summary: "공정 곳곳에 숨은 불량 원인을 추적해 제거합니다." },
  { id: "mfg-equipment-failure", industry: "manufacturing", chapter: 3, art: "outage", name: "노후 설비 긴급 복구", difficulty: "상급", workload: 395, deadline: 10, cash: 1270, reputation: 25, eventEvery: 1, recommended: ["production", "product", "procurement"], summary: "멈춰버린 핵심 설비를 진단하고 납기 전에 생산을 재개합니다." },
  { id: "mfg-automation", industry: "manufacturing", chapter: 4, art: "integration", name: "스마트 공장 전환", difficulty: "상급+", workload: 425, deadline: 11, cash: 1430, reputation: 28, eventEvery: 1, recommended: ["production", "product", "procurement"], summary: "기존 생산라인을 멈추지 않고 자동화 설비로 전환합니다." },
  { id: "mfg-overseas-order", industry: "manufacturing", chapter: 4, art: "launch", name: "해외 대량 주문 대응", difficulty: "최상급", workload: 485, deadline: 12, cash: 1650, reputation: 33, eventEvery: 1, recommended: ["production", "procurement", "quality"], summary: "해외 규격과 촉박한 납기를 맞춰 역대 최대 주문을 생산합니다." },

  { id: "com-entry", industry: "commerce", chapter: 1, art: "campaign", name: "첫 거래처 입점", difficulty: "초급", workload: 220, deadline: 8, cash: 750, reputation: 13, eventEvery: 2, recommended: ["sales", "md", "logistics"], summary: "상품 구성과 조건을 맞춰 첫 대형 거래처에 입점합니다." },
  { id: "com-pop-up", industry: "commerce", chapter: 1, art: "launch", name: "첫 팝업스토어 오픈", difficulty: "초급+", workload: 250, deadline: 8, cash: 820, reputation: 15, eventEvery: 2, recommended: ["md", "marketing", "logistics"], summary: "한정된 공간과 기간 안에 고객이 몰리는 첫 매장을 엽니다." },
  { id: "com-season", industry: "commerce", chapter: 2, art: "launch", name: "시즌 초대형 할인전", difficulty: "중급", workload: 300, deadline: 9, cash: 960, reputation: 18, eventEvery: 2, recommended: ["marketing", "md", "sales"], summary: "상품과 광고, 고객 요청이 몰리는 할인전을 성공시킵니다." },
  { id: "com-live-commerce", industry: "commerce", chapter: 2, art: "campaign", name: "라이브 커머스 대박 예고", difficulty: "중급+", workload: 335, deadline: 9, cash: 1060, reputation: 20, eventEvery: 2, recommended: ["marketing", "sales", "md"], summary: "생방송 한 시간에 주문과 문의가 폭발하는 판매전을 준비합니다." },
  { id: "com-inventory", industry: "commerce", chapter: 3, art: "migration", name: "창고 재고 대이동", difficulty: "중상급", workload: 355, deadline: 10, cash: 1140, reputation: 22, eventEvery: 2, recommended: ["logistics", "md", "finance"], summary: "뒤섞인 재고를 새 물류센터로 정확하게 옮깁니다." },
  { id: "com-returns", industry: "commerce", chapter: 3, art: "audit", name: "반품 폭주 수습", difficulty: "상급", workload: 420, deadline: 11, cash: 1410, reputation: 27, eventEvery: 1, recommended: ["marketing", "logistics", "sales"], summary: "쏟아지는 반품과 고객 문의를 막아 신뢰를 회복합니다." },
  { id: "com-exclusive-brand", industry: "commerce", chapter: 4, art: "revision", name: "인기 브랜드 독점 계약", difficulty: "상급+", workload: 450, deadline: 11, cash: 1510, reputation: 30, eventEvery: 1, recommended: ["sales", "md", "finance"], summary: "경쟁사보다 좋은 조건을 제시해 화제의 브랜드를 독점 확보합니다." },
  { id: "com-cross-border", industry: "commerce", chapter: 4, art: "integration", name: "해외 직구 시장 진출", difficulty: "최상급", workload: 495, deadline: 12, cash: 1680, reputation: 34, eventEvery: 1, recommended: ["logistics", "md", "marketing"], summary: "통관과 배송, 현지 상품 구성을 연결해 해외 시장을 엽니다." },

  { id: "it-mvp", industry: "it", chapter: 1, art: "campaign", name: "첫 서비스 MVP 출시", difficulty: "초급", workload: 230, deadline: 8, cash: 770, reputation: 14, eventEvery: 2, recommended: ["planning", "dev", "design"], summary: "핵심 기능을 정리해 첫 사용자에게 서비스를 공개합니다." },
  { id: "it-first-users", industry: "it", chapter: 1, art: "launch", name: "첫 1만 사용자 유입", difficulty: "초급+", workload: 260, deadline: 8, cash: 840, reputation: 16, eventEvery: 2, recommended: ["operations", "dev", "planning"], summary: "예상보다 빠르게 몰린 사용자를 맞아 서비스의 첫 성장을 지켜냅니다." },
  { id: "it-migration", industry: "it", chapter: 2, art: "migration", name: "무중단 서버 이전", difficulty: "중급", workload: 305, deadline: 9, cash: 970, reputation: 18, eventEvery: 2, recommended: ["dev", "operations", "planning"], summary: "서비스를 멈추지 않고 모든 데이터를 새 서버로 옮깁니다." },
  { id: "it-payment", industry: "it", chapter: 2, art: "integration", name: "결제 시스템 연동", difficulty: "중급+", workload: 340, deadline: 9, cash: 1080, reputation: 21, eventEvery: 2, recommended: ["dev", "planning", "finance"], summary: "복잡한 결제 흐름과 정산 기준을 하나의 안정적인 기능으로 연결합니다." },
  { id: "it-renewal", industry: "it", chapter: 3, art: "revision", name: "전면 UX 개편", difficulty: "중상급", workload: 360, deadline: 10, cash: 1160, reputation: 22, eventEvery: 2, recommended: ["design", "planning", "dev"], summary: "복잡해진 서비스를 사용자가 이해하기 쉽게 다시 설계합니다." },
  { id: "it-security", industry: "it", chapter: 3, art: "audit", name: "보안 취약점 감사", difficulty: "상급", workload: 430, deadline: 11, cash: 1450, reputation: 29, eventEvery: 1, recommended: ["operations", "dev", "planning"], summary: "서비스 곳곳의 위험 요소를 찾아 출시 전에 차단합니다." },
  { id: "it-ai-feature", industry: "it", chapter: 4, art: "campaign", name: "AI 신기능 베타 출시", difficulty: "상급+", workload: 465, deadline: 11, cash: 1570, reputation: 31, eventEvery: 1, recommended: ["dev", "design", "planning"], summary: "새로운 AI 기능을 실제 사용자가 믿고 쓸 수 있는 제품으로 다듬습니다." },
  { id: "it-global-localization", industry: "it", chapter: 4, art: "launch", name: "글로벌 서비스 현지화", difficulty: "최상급", workload: 505, deadline: 12, cash: 1720, reputation: 35, eventEvery: 1, recommended: ["planning", "design", "operations"], summary: "언어와 정책, 운영 시간을 맞춰 서비스를 여러 국가에 동시에 엽니다." }
];

const BOSS_PROJECTS = [
  { id: "boss-recall", industry: "manufacturing", chapter: 1, art: "boss-manufacturing-recall", name: "전국 제품 리콜", difficulty: "BOSS", workload: 820, deadline: 19, cash: 2800, reputation: 58, eventEvery: 1, boss: true, recommended: ["quality", "production", "product"], summary: "전국에 출고된 제품을 회수하고 원인을 고치는 초대형 장기 프로젝트입니다.", phaseNames: ["원인 추적", "전량 회수", "생산 재개"] },
  { id: "boss-mfg-line-stop", industry: "manufacturing", chapter: 2, art: "boss-manufacturing-shutdown", name: "전 공장 생산라인 정지", difficulty: "BOSS+", workload: 1030, deadline: 22, cash: 3650, reputation: 72, eventEvery: 1, boss: true, recommended: ["production", "quality", "procurement"], summary: "연쇄 고장으로 멈춘 모든 공장의 원인을 격리하고 생산을 되살립니다.", phaseNames: ["원인 격리", "설비 복구", "전면 재가동"] },
  { id: "boss-mfg-overseas-defect", industry: "manufacturing", chapter: 3, art: "boss-manufacturing-quality", name: "해외 공장 품질 붕괴", difficulty: "BOSS++", workload: 1210, deadline: 24, cash: 4300, reputation: 84, eventEvery: 1, boss: true, recommended: ["quality", "procurement", "product"], summary: "해외 생산 거점의 품질 체계를 처음부터 재건하고 거래처의 신뢰를 되찾습니다.", phaseNames: ["현지 원인 조사", "공정 재설계", "품질 승인"] },
  { id: "boss-mfg-mega-contract", industry: "manufacturing", chapter: 4, art: "boss-manufacturing-contract", name: "국가 핵심 설비 수주", difficulty: "BOSS EX", workload: 1480, deadline: 27, cash: 5600, reputation: 108, eventEvery: 1, boss: true, recommended: ["product", "production", "finance"], summary: "회사의 미래를 건 초대형 설비 계약을 설계부터 전국 납품까지 완수합니다.", phaseNames: ["기술 제안", "초도 생산", "전국 납품"] },

  { id: "boss-logistics", industry: "commerce", chapter: 1, art: "boss-commerce-logistics", name: "전국 물류망 마비", difficulty: "BOSS", workload: 830, deadline: 19, cash: 2850, reputation: 58, eventEvery: 1, boss: true, recommended: ["logistics", "md", "sales"], summary: "멈춰버린 물류센터와 배송망을 순서대로 복구하는 장기 프로젝트입니다.", phaseNames: ["병목 확인", "거점 복구", "전국 정상화"] },
  { id: "boss-com-black-friday", industry: "commerce", chapter: 2, art: "boss-commerce-orders", name: "블랙프라이데이 주문 폭주", difficulty: "BOSS+", workload: 1050, deadline: 22, cash: 3720, reputation: 73, eventEvery: 1, boss: true, recommended: ["logistics", "marketing", "md"], summary: "예측을 넘어선 주문과 문의를 견디며 모든 상품을 약속대로 배송합니다.", phaseNames: ["주문 폭발", "창고 사수", "배송 정상화"] },
  { id: "boss-com-price-war", industry: "commerce", chapter: 3, art: "boss-commerce-price", name: "전국 공급망 가격 전쟁", difficulty: "BOSS++", workload: 1200, deadline: 24, cash: 4250, reputation: 83, eventEvery: 1, boss: true, recommended: ["md", "sales", "logistics"], summary: "경쟁사의 공세 속에서 공급처와 가격, 재고를 지켜 회사의 유통망을 사수합니다.", phaseNames: ["공급처 확보", "가격 방어", "시장 회복"] },
  { id: "boss-com-national-chain", industry: "commerce", chapter: 4, art: "boss-commerce-chain", name: "전국 유통망 독점 입점", difficulty: "BOSS EX", workload: 1460, deadline: 27, cash: 5520, reputation: 106, eventEvery: 1, boss: true, recommended: ["sales", "md", "finance"], summary: "전국 매장에 독점 상품을 동시에 공급하는 회사 최대의 계약을 성사시킵니다.", phaseNames: ["조건 협상", "전국 발주", "매장 안착"] },

  { id: "boss-launch-outage", industry: "it", chapter: 1, art: "boss-it-traffic", name: "출시 당일 서버 대폭주", difficulty: "BOSS", workload: 840, deadline: 19, cash: 2900, reputation: 60, eventEvery: 1, boss: true, recommended: ["operations", "dev", "planning"], summary: "예상을 뛰어넘은 접속자를 버티며 장애를 막아내는 장기 프로젝트입니다.", phaseNames: ["트래픽 분석", "긴급 증설", "서비스 안정화"] },
  { id: "boss-it-data-center", industry: "it", chapter: 2, art: "boss-it-datacenter", name: "데이터센터 연쇄 장애", difficulty: "BOSS+", workload: 1070, deadline: 22, cash: 3800, reputation: 75, eventEvery: 1, boss: true, recommended: ["operations", "dev", "finance"], summary: "여러 지역의 장애를 격리하고 데이터를 지키며 서비스를 되살립니다.", phaseNames: ["장애 격리", "데이터 복구", "서비스 재개"] },
  { id: "boss-it-zero-day", industry: "it", chapter: 3, art: "boss-it-security", name: "제로데이 보안 침해", difficulty: "BOSS++", workload: 1230, deadline: 24, cash: 4380, reputation: 86, eventEvery: 1, boss: true, recommended: ["operations", "dev", "planning"], summary: "알려지지 않은 공격을 추적하고 고객 데이터를 지키며 서비스 전체를 정화합니다.", phaseNames: ["침입 추적", "취약점 봉쇄", "신뢰 복구"] },
  { id: "boss-it-global-platform", industry: "it", chapter: 4, art: "boss-it-platform", name: "글로벌 플랫폼 통합", difficulty: "BOSS EX", workload: 1500, deadline: 27, cash: 5700, reputation: 110, eventEvery: 1, boss: true, recommended: ["planning", "dev", "operations"], summary: "각국의 시스템과 데이터를 하나의 플랫폼으로 전환하는 초대형 통합을 완수합니다.", phaseNames: ["지역 통합", "데이터 이관", "전 세계 전환"] }
];

const DEFAULT_REPRESENTATIVE_APPEARANCE = {
  face: 0, skin: 1, hair: 1, eyes: 0, eyebrows: 0,
  nose: 0, mouth: 3, accessory: 0, outfit: 0, top: 0, bottom: 0
};

const FAMILY = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
const GIVEN = ["서준", "민서", "지우", "도윤", "하린", "예준", "서연", "현우", "유진", "수빈", "지훈", "예린", "시우", "채원"];
const TRAITS = ["분위기 메이커", "완벽주의", "위기 전문가", "아이디어 뱅크", "침착한 조율자", "빠른 손", "꼼꼼한 기록가", "발표 체질"];
const OFFICE_DIALOGUES = [
  {
    id: "schedule", opener: "오늘 일정을 조금 당길 수 있을까요?", formalOpener: "오늘 일정을 조금 당겨도 될까요?", representativeOpener: "오늘 일정은 조금 당겨서 진행하죠.", representativeResponse: "품질을 해치지 않는 선에서 일정을 조정하세요.",
    responses: {
      perfectionist: "검수 시간까지 확보된다면 가능합니다.",
      mood: "좋죠! 대신 끝나고 커피 한 잔 부탁해요.",
      realist: "범위를 조금 줄이면 가능합니다.",
      quiet: "우선순위만 정해주시면 맞추겠습니다.",
      competitive: "제가 맡은 부분부터 오늘 끝내보죠.",
      creative: "반복 작업부터 묶으면 빨라질 것 같아요."
    }
  },
  {
    id: "lunch", opener: "점심 메뉴 정하셨어요?", formalOpener: "점심 메뉴는 정하셨나요?", representativeOpener: "점심 메뉴는 정해졌나요?", representativeResponse: "업무를 정리하고 편한 메뉴로 다녀오세요.",
    responses: {
      perfectionist: "어제 목록부터 겹치지 않게 볼까요?",
      mood: "오늘은 다수결 말고 사다리 타기 어때요?",
      realist: "가까운 곳이요. 오후 회의가 있습니다.",
      quiet: "저는 아무거나 괜찮습니다.",
      competitive: "제일 빨리 나오는 메뉴로 가죠.",
      creative: "새로 생긴 가게를 한번 가보고 싶어요."
    }
  },
  {
    id: "meeting", opener: "회의 자료, 먼저 공유할까요?", formalOpener: "회의 자료를 먼저 공유드릴까요?", representativeOpener: "회의 자료는 먼저 공유해주세요.", representativeResponse: "확인해보고 필요한 부분을 정리하겠습니다.",
    responses: {
      perfectionist: "마지막 숫자만 다시 확인하고 올려주세요.",
      mood: "네, 제가 오타 탐정 한번 해볼게요.",
      realist: "결론을 첫 장에 두면 더 좋겠습니다.",
      quiet: "올려주시면 바로 보겠습니다.",
      competitive: "핵심 성과가 더 잘 보이게 바꿔보죠.",
      creative: "첫 장에 비교 그림을 넣어보면 어때요?"
    }
  },
  {
    id: "file", opener: "최종 파일이 어느 거였죠?", formalOpener: "최종 파일을 다시 확인해도 될까요?", representativeOpener: "최종 파일 위치를 공유해주세요.", representativeResponse: "공유 폴더 기준으로 하나만 남겨주세요.",
    responses: {
      perfectionist: "최종_진짜최종 말고 날짜 버전입니다.",
      mood: "이번엔 이름에 진짜최종 금지입니다.",
      realist: "공유 폴더 맨 위에 고정해뒀습니다.",
      quiet: "방금 링크 보내드렸습니다.",
      competitive: "제가 정리한 버전이 가장 최신입니다.",
      creative: "색깔 태그로 구분해두면 덜 헷갈리겠어요."
    }
  },
  {
    id: "coffee", opener: "커피 내려오는데 같이 가실래요?", formalOpener: "커피 내려오는데 함께 가시겠어요?", representativeOpener: "잠깐 커피 마시고 다시 시작하죠.", representativeResponse: "좋아요. 잠깐 쉬었다가 진행하세요.",
    responses: {
      perfectionist: "이 문단만 마무리하고 내려갈게요.",
      mood: "좋아요. 오늘은 제가 살게요!",
      realist: "십 분 뒤 회의라 테이크아웃으로 하죠.",
      quiet: "네. 잠깐 쉬고 싶었습니다.",
      competitive: "좋습니다. 돌아와서 집중해서 끝내죠.",
      creative: "커피 마시면서 새 아이디어도 이야기해요."
    }
  },
  {
    id: "handoff", opener: "이 업무, 제가 이어받을까요?", formalOpener: "이 업무를 제가 이어받을까요?", representativeOpener: "막힌 업무가 있으면 바로 공유해주세요.", representativeResponse: "현재 상태를 정리해서 넘겨주세요.",
    responses: {
      perfectionist: "체크리스트까지 정리해서 넘겨드릴게요.",
      mood: "감사합니다. 다음엔 제가 도와드릴게요.",
      realist: "막힌 부분만 부탁드리겠습니다.",
      quiet: "네, 현재 상태를 메모해뒀습니다.",
      competitive: "좋아요. 같이 오늘 안에 끝내죠.",
      creative: "제가 하던 방식도 같이 설명드릴게요."
    }
  },
  {
    id: "temperature", opener: "사무실이 조금 춥지 않아요?", formalOpener: "사무실 온도가 조금 낮지 않으세요?", representativeOpener: "사무실 온도는 괜찮은가요?", representativeResponse: "불편하지 않게 한 도 조정하세요.",
    responses: {
      perfectionist: "온도는 그대로 두고 담요를 쓰겠습니다.",
      mood: "제 자리만 겨울인 줄 알았어요.",
      realist: "한 도만 올려보고 다시 확인하죠.",
      quiet: "조금요. 괜찮습니다.",
      competitive: "전 괜찮습니다. 집중하면 안 춥더라고요.",
      creative: "창가 자리랑 한번 바꿔볼까요?"
    }
  },
  {
    id: "wrap-up", opener: "오늘은 제시간에 갈 수 있겠죠?", formalOpener: "오늘은 정시에 마무리할 수 있을까요?", representativeOpener: "오늘은 정시에 마무리합시다.", representativeResponse: "남은 업무를 정리하고 무리하지 말고 마칩시다.",
    responses: {
      perfectionist: "마지막 검수만 끝나면 가능합니다.",
      mood: "그 말을 하면 꼭 일이 생기던데요.",
      realist: "새 요청만 없으면 여섯 시에 끝납니다.",
      quiet: "제 업무는 거의 끝났습니다.",
      competitive: "남은 것까지 빨리 끝내고 갑시다.",
      creative: "회의만 짧으면 가능할 것 같아요."
    }
  }
];
const FORMAL_OFFICE_RESPONSES = {
  "좋죠! 대신 끝나고 커피 한 잔 부탁해요.": "마무리까지 힘내보겠습니다.",
  "어제 목록부터 겹치지 않게 볼까요?": "어제 메뉴와 겹치지 않게 정리해보겠습니다.",
  "오늘은 다수결 말고 사다리 타기 어때요?": "사다리 타기로 정해보겠습니다.",
  "가까운 곳이요. 오후 회의가 있습니다.": "오후 회의가 있으니 가까운 곳으로 정하겠습니다.",
  "새로 생긴 가게를 한번 가보고 싶어요.": "새로 생긴 가게도 괜찮을 것 같습니다.",
  "마지막 숫자만 다시 확인하고 올려주세요.": "마지막 숫자를 확인하고 올리겠습니다.",
  "네, 제가 오타 탐정 한번 해볼게요.": "제가 오타까지 확인해보겠습니다.",
  "올려주시면 바로 보겠습니다.": "자료를 올리고 바로 확인하겠습니다.",
  "이번엔 이름에 진짜최종 금지입니다.": "이번에는 날짜 기준으로 정리해두겠습니다.",
  "색깔 태그로 구분해두면 덜 헷갈리겠어요.": "색깔 태그로 구분해두겠습니다.",
  "이 문단만 마무리하고 내려갈게요.": "이 문단만 마무리하고 내려가겠습니다.",
  "좋아요. 오늘은 제가 살게요!": "제가 준비하겠습니다.",
  "십 분 뒤 회의라 테이크아웃으로 하죠.": "십 분 뒤 회의가 있으니 테이크아웃으로 하겠습니다.",
  "감사합니다. 다음엔 제가 도와드릴게요.": "막히는 부분은 바로 공유하겠습니다.",
  "체크리스트까지 정리해서 넘겨드릴게요.": "체크리스트까지 정리해서 넘겨드리겠습니다.",
  "막힌 부분만 부탁드리겠습니다.": "막힌 부분을 정리해 공유드리겠습니다.",
  "제가 하던 방식도 같이 설명드릴게요.": "제가 하던 방식도 함께 설명드리겠습니다.",
  "제 자리만 겨울인 줄 알았어요.": "제 자리가 조금 추웠습니다.",
  "한 도만 올려보고 다시 확인하죠.": "한 도 올린 뒤 다시 확인하겠습니다.",
  "그 말을 하면 꼭 일이 생기던데요.": "남은 업무부터 정리하겠습니다.",
  "제가 맡은 부분부터 오늘 끝내보죠.": "제가 맡은 부분부터 오늘 마무리하겠습니다.",
  "제일 빨리 나오는 메뉴로 가죠.": "제일 빨리 나오는 메뉴로 정하겠습니다.",
  "핵심 성과가 더 잘 보이게 바꿔보죠.": "핵심 성과가 더 잘 보이게 바꾸겠습니다.",
  "첫 장에 비교 그림을 넣어보면 어때요?": "첫 장에 비교 그림을 넣어보겠습니다.",
  "좋습니다. 돌아와서 집중해서 끝내죠.": "돌아와서 집중해서 마무리하겠습니다.",
  "커피 마시면서 새 아이디어도 이야기해요.": "새 아이디어도 정리해서 말씀드리겠습니다.",
  "좋아요. 같이 오늘 안에 끝내죠.": "오늘 안에 마무리하겠습니다.",
  "창가 자리랑 한번 바꿔볼까요?": "창가 자리와 바꿔보겠습니다.",
  "남은 것까지 빨리 끝내고 갑시다.": "남은 것까지 마무리하고 가겠습니다.",
  "회의만 짧으면 가능할 것 같아요.": "회의가 길어지지 않으면 가능할 것 같습니다.",
  "반복 작업부터 묶으면 빨라질 것 같아요.": "반복 작업부터 묶으면 빨라질 것 같습니다."
};
const POSTING_REFRESH_MAX = 2;
const PAID_POSTING_REFRESH_COST = 200;
const NORMAL_DAMAGE_VARIANCE = .12;
const DIRECTIVE_DAMAGE_VARIANCE = .15;
const SAVE_KEY = "office-raid-save";
const SAVE_VERSION = 1;

const app = document.querySelector("#app");
let currentView = "setup";
let regularCandidates = [];
let specialCandidates = [];
let recruitmentMode = "regular";
let regularPostingInitialized = false;
let teamDraft = [];
let battleTimer = null;
let battle = null;
let nextId = 10;
let representativeDraft = { name: "서대표", appearance: { ...DEFAULT_REPRESENTATIVE_APPEARANCE } };
let representativeMode = "basic";
let openingPage = 0;
let equipmentTargetId = null;
let officeDialogueTimer = null;
let recentOfficeDialogueIds = [];
let companyLaunchTimer = null;
let hrTerminationTargetId = null;

function createInitialState() {
  return {
    industry: "",
    companyName: "",
    cash: 1200,
    reputation: 0,
    capacity: 6,
    equipment: [],
    employees: [],
    teamIds: [],
    postingRefreshes: POSTING_REFRESH_MAX,
    projectClears: 0,
    bossClears: 0,
    specialRecruitmentTickets: 0,
    tutorialBattleCompleted: false,
    payrollPayments: 0,
    turnoverEvents: 0,
    pendingTurnover: null,
    pendingFinancialReport: null,
    financialHistory: [],
    financialPeriod: {
      number: 1, startCash: 1200, revenue: 0, payroll: 0,
      recruitment: 0, posting: 0, retention: 0, termination: 0
    }
  };
}

const state = createInitialState();

function randomInt(max) { return Math.floor(Math.random() * max); }
function damageRange(value, variance = NORMAL_DAMAGE_VARIANCE) {
  const safeValue = Math.max(0, Math.round(value));
  return {
    min: safeValue ? Math.max(1, Math.round(safeValue * (1 - variance))) : 0,
    max: safeValue ? Math.max(1, Math.round(safeValue * (1 + variance))) : 0
  };
}
function rollDamage(value, variance = NORMAL_DAMAGE_VARIANCE) {
  const range = damageRange(value, variance);
  return range.min + randomInt(range.max - range.min + 1);
}
function damageRangeText(value, variance = DIRECTIVE_DAMAGE_VARIANCE) {
  if (battle?.tutorialMode) return `업무 -${Math.max(0, Math.round(value))}`;
  const range = damageRange(value, variance);
  return `업무 -${range.min}~${range.max}`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function normalizeSavedMember(member) {
  if (!member || typeof member !== "object" || typeof member.id !== "string") return null;
  return {
    ...member,
    equipment: { work: null, support: null, personal: null, ...(member.equipment || {}) },
    appearance: { ...appearance(0), ...(member.appearance || {}) }
  };
}

function normalizeSavedState(savedState) {
  if (!savedState || typeof savedState !== "object") return null;
  const initial = createInitialState();
  const employees = Array.isArray(savedState.employees) ? savedState.employees.map(normalizeSavedMember).filter(Boolean) : [];
  if (!INDUSTRIES[savedState.industry] || !savedState.companyName || employees.length < 3) return null;
  const employeeIds = new Set(employees.map(member => member.id));
  const teamIds = Array.isArray(savedState.teamIds) ? savedState.teamIds.filter(id => employeeIds.has(id)).slice(0, 3) : [];
  employees.forEach(member => {
    if (teamIds.length < 3 && !teamIds.includes(member.id)) teamIds.push(member.id);
  });
  return {
    ...initial,
    ...savedState,
    employees,
    teamIds,
    equipment: Array.isArray(savedState.equipment) ? savedState.equipment : [],
    tutorialBattleCompleted: typeof savedState.tutorialBattleCompleted === "boolean"
      ? savedState.tutorialBattleCompleted
      : Number(savedState.projectClears || 0) > 0 || employees.length > 3,
    financialHistory: Array.isArray(savedState.financialHistory) ? savedState.financialHistory.slice(-8) : [],
    financialPeriod: { ...initial.financialPeriod, ...(savedState.financialPeriod || {}) }
  };
}

function readSavedGame() {
  try {
    const payload = JSON.parse(window.localStorage.getItem(SAVE_KEY) || "null");
    if (!payload || payload.version !== SAVE_VERSION) return null;
    const savedState = normalizeSavedState(payload.state);
    if (!savedState) return null;
    return { ...payload, state: savedState };
  } catch (error) {
    return null;
  }
}

function saveGame() {
  if (!state.industry || !state.companyName || state.employees.length < 3) return false;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      nextId,
      state,
      recruitment: {
        regularCandidates,
        specialCandidates,
        mode: recruitmentMode,
        regularPostingInitialized
      }
    }));
    return true;
  } catch (error) {
    return false;
  }
}

function savedIdCeiling(payload) {
  const pools = [payload.state.employees, payload.state.equipment, payload.recruitment?.regularCandidates, payload.recruitment?.specialCandidates];
  return pools.flatMap(pool => Array.isArray(pool) ? pool : []).reduce((highest, item) => {
    const number = Number(String(item?.id || "").match(/(\d+)$/)?.[1] || 0);
    return Math.max(highest, number + 1);
  }, 10);
}

function applySavedGame(payload) {
  clearBattleTimer();
  clearCompanyLaunchTimer();
  clearOfficeDialogue();
  Object.assign(state, createInitialState(), payload.state);
  regularCandidates = Array.isArray(payload.recruitment?.regularCandidates) ? payload.recruitment.regularCandidates.map(normalizeSavedMember).filter(Boolean) : [];
  specialCandidates = Array.isArray(payload.recruitment?.specialCandidates) ? payload.recruitment.specialCandidates.map(normalizeSavedMember).filter(Boolean) : [];
  recruitmentMode = payload.recruitment?.mode === "special" ? "special" : "regular";
  regularPostingInitialized = Boolean(payload.recruitment?.regularPostingInitialized || regularCandidates.length);
  nextId = Math.max(Number(payload.nextId) || 10, savedIdCeiling(payload));
  teamDraft = [];
  battle = null;
  representativeDraft = { name: "서대표", appearance: { ...DEFAULT_REPRESENTATIVE_APPEARANCE } };
  representativeMode = "basic";
  openingPage = 0;
  equipmentTargetId = state.employees[0]?.id || null;
  recentOfficeDialogueIds = [];
  hrTerminationTargetId = null;
}

function resetGameState() {
  clearBattleTimer();
  clearCompanyLaunchTimer();
  clearOfficeDialogue();
  Object.assign(state, createInitialState());
  regularCandidates = [];
  specialCandidates = [];
  recruitmentMode = "regular";
  regularPostingInitialized = false;
  teamDraft = [];
  battle = null;
  nextId = 10;
  representativeDraft = { name: "서대표", appearance: { ...DEFAULT_REPRESENTATIVE_APPEARANCE } };
  representativeMode = "basic";
  openingPage = 0;
  equipmentTargetId = null;
  recentOfficeDialogueIds = [];
  hrTerminationTargetId = null;
  window.localStorage.removeItem(SAVE_KEY);
}

function appearance(seed = randomInt(10000)) {
  return {
    face: seed % 8,
    skin: Math.floor(seed / 3) % 6,
    hair: Math.floor(seed / 5) % 16,
    eyes: Math.floor(seed / 7) % 10,
    eyebrows: Math.floor(seed / 11) % 8,
    nose: Math.floor(seed / 13) % 8,
    mouth: Math.floor(seed / 17) % 10,
    accessory: Math.floor(seed / 19) % 9,
    outfit: Math.floor(seed / 23) % 12,
    top: Math.floor(seed / 23) % 12,
    bottom: Math.floor(seed / 29) % 8
  };
}

function employee(name, department, trait, work, collaboration, speed, look, rank = 0) {
  return {
    id: `employee-${nextId++}`,
    name, department, trait, work, collaboration, speed,
    focus: Math.round((work + collaboration) / 2),
    salary: 120 + rank * 72,
    rank, isRepresentative: false, joinedAt: 0, retentionCount: 0,
    equipment: { work: null, support: null, personal: null },
    appearance: appearance(look)
  };
}

function effectiveStats(member) {
  const equipped = Object.values(member.equipment || {}).filter(Boolean);
  return {
    work: member.work + equipped.reduce((sum, item) => sum + item.workBonus, 0),
    collaboration: member.collaboration + equipped.reduce((sum, item) => sum + item.collaborationBonus, 0)
  };
}

function departmentArchetype(department) {
  if (["sales", "md", "marketing", "design"].includes(department)) return "sales";
  if (["dev", "product", "production"].includes(department)) return "dev";
  if (["quality", "procurement", "finance"].includes(department)) return "finance";
  return "pm";
}

function hasProjectAffinity(member, project) {
  return Boolean(project?.recommended?.includes(member.department));
}

function header(title, notice) {
  return `<header class="header"><img class="header-logo" src="assets/office-raid-logo-ui.webp?v=20260831" alt="OFFICE RAID"><p class="eyebrow">LIVE PREVIEW</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(notice)}</p></header>`;
}

const PRELOAD_ASSETS = [
  "assets/office-raid-title.webp?v=20260831",
  "assets/office-raid-logo-ui.webp?v=20260831",
  "assets/opening-office-v2.webp?v=20260831",
  "assets/opening-mail-v2.webp?v=20260831",
  "assets/opening-raid-v2.webp?v=20260831",
  "assets/company-setup-desk.webp?v=20260901-company-desk-v1",
  "assets/office-background.webp?v=20260831-topview",
  "assets/office-desk-base.webp?v=20260831",
  "assets/office-monitor-back.webp?v=20260831",
  "assets/battle-background-normal.webp?v=20260901-battle-art-v1",
  "assets/battle-background-boss.webp?v=20260901-battle-art-v1",
  "assets/perfect-workflow-vfx.webp?v=20260901-workflow-v2"
];
const preloadedImages = [];
let assetsReady = false;
let assetsLoading = false;

function updateAssetLoader(completed, total, failed = 0) {
  const percent = total ? Math.round(completed / total * 100) : 100;
  const bar = document.querySelector("#asset-load-bar");
  const percentLabel = document.querySelector("#asset-load-percent");
  const status = document.querySelector("#asset-load-status");
  const detail = document.querySelector("#asset-load-detail");
  const button = document.querySelector("#start-game");
  const newGameButton = document.querySelector("#new-game");
  if (bar) bar.style.width = `${percent}%`;
  if (percentLabel) percentLabel.textContent = `${percent}%`;
  if (status) status.textContent = failed ? "일부 이미지를 받지 못했습니다." : assetsReady ? "게임 준비 완료" : "게임 이미지 준비 중";
  if (detail) detail.textContent = failed ? `${failed}개 파일을 다시 받아야 합니다.` : assetsReady ? "모든 이미지가 준비됐습니다." : `${completed}/${total} 파일 확인`;
  if (!button) return;
  button.disabled = assetsLoading || (!assetsReady && failed === 0);
  const continueAvailable = button.dataset.continue === "true";
  button.querySelector("strong").textContent = failed ? "다시 받기" : assetsReady ? continueAvailable ? "이어하기" : "게임 시작" : "이미지 준비 중…";
  button.querySelector("small").textContent = failed ? "연결을 확인한 뒤 눌러주세요." : assetsReady ? continueAvailable ? "저장된 회사로 출근합니다." : "새 회사를 시작합니다." : `${percent}% 다운로드`;
  if (newGameButton) newGameButton.disabled = !assetsReady;
}

function preloadGameAssets() {
  if (assetsLoading || assetsReady) return;
  assetsLoading = true;
  let completed = 0;
  let failed = 0;
  updateAssetLoader(completed, PRELOAD_ASSETS.length);
  const tasks = PRELOAD_ASSETS.map(source => new Promise(resolve => {
    const image = new Image();
    let settled = false;
    const finish = success => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      completed += 1;
      if (!success) failed += 1;
      if (success) preloadedImages.push(image);
      updateAssetLoader(completed, PRELOAD_ASSETS.length, failed);
      resolve(success);
    };
    const timeout = window.setTimeout(() => finish(false), 20000);
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.decoding = "async";
    image.src = source;
  }));
  Promise.all(tasks).then(() => {
    assetsLoading = false;
    assetsReady = failed === 0;
    updateAssetLoader(completed, PRELOAD_ASSETS.length, failed);
  });
}

function renderTitle() {
  currentView = "title";
  app.classList.add("title-mode");
  const savedGame = readSavedGame();
  const saveSummary = savedGame ? `<div class="save-summary"><small>AUTO SAVE</small><strong>${escapeHtml(savedGame.state.companyName)}</strong><span>${escapeHtml(INDUSTRIES[savedGame.state.industry].name)} · 직원 ${savedGame.state.employees.length}명 · 프로젝트 ${savedGame.state.projectClears}회</span></div>` : "";
  const newGameButton = savedGame ? `<button id="new-game" class="title-secondary" disabled><strong>새 게임</strong><small>현재 회사를 초기화하고 다시 시작합니다.</small></button>` : "";
  const newGameConfirm = savedGame ? `<div id="new-game-confirm" class="title-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="new-game-confirm-title" hidden><div class="title-confirm panel"><small>NEW COMPANY</small><strong id="new-game-confirm-title">현재 회사를 초기화할까요?</strong><p>${escapeHtml(savedGame.state.companyName)}의 직원·장비·프로젝트 기록이 삭제됩니다.</p><div><button class="ink" id="cancel-new-game">취소</button><button class="red" id="confirm-new-game">초기화</button></div></div></div>` : "";
  app.innerHTML = `<section class="title-screen">
    <img class="title-art" src="assets/office-raid-title.webp?v=20260831" alt="세 명의 회사원이 거대한 프로젝트 보스를 마주한 오피스 레이드 타이틀 이미지">
    <div class="title-actions">
      <p>프로젝트는 거대하고, 퇴근은 멀었다.</p>
      ${saveSummary}
      <div class="asset-loader" role="status" aria-live="polite">
        <div class="asset-loader-head"><span id="asset-load-status">게임 이미지 준비 중</span><b id="asset-load-percent">0%</b></div>
        <div class="asset-loader-track"><i id="asset-load-bar"></i></div>
        <small id="asset-load-detail">0/${PRELOAD_ASSETS.length} 파일 확인</small>
      </div>
      <button id="start-game" class="mustard" data-continue="${Boolean(savedGame)}" disabled><strong>이미지 준비 중…</strong><small>0% 다운로드</small></button>
      ${newGameButton}
    </div>
    ${newGameConfirm}
  </section>`;
  document.querySelector("#start-game").addEventListener("click", () => {
    if (!assetsReady) {
      preloadGameAssets();
      return;
    }
    document.querySelector(".title-screen").classList.add("leaving");
    window.setTimeout(() => savedGame ? continueSavedGame() : renderOpening(), 240);
  });
  document.querySelector("#new-game")?.addEventListener("click", () => {
    document.querySelector("#new-game-confirm").hidden = false;
  });
  document.querySelector("#cancel-new-game")?.addEventListener("click", () => {
    document.querySelector("#new-game-confirm").hidden = true;
  });
  document.querySelector("#confirm-new-game")?.addEventListener("click", () => {
    resetGameState();
    document.querySelector(".title-screen").classList.add("leaving");
    window.setTimeout(renderOpening, 240);
  });
  if (assetsReady) updateAssetLoader(PRELOAD_ASSETS.length, PRELOAD_ASSETS.length);
  else preloadGameAssets();
}

function continueSavedGame() {
  const savedGame = readSavedGame();
  if (!savedGame) return renderTitle();
  applySavedGame(savedGame);
  app.classList.remove("title-mode");
  if (state.pendingFinancialReport) return renderFinancialReport();
  if (state.pendingTurnover) return renderTurnoverEvent();
  renderOffice("저장된 회사에서 업무를 이어갑니다.");
}

function renderOpening() {
  currentView = "opening";
  app.classList.remove("title-mode");
  const scenes = [
    { kicker: "창업 첫날 · 오전 8:57", title: "책상은 세 개.\n회사 이름은 아직 없다." },
    { kicker: "띵! · 새 메일 1", title: "첫 프로젝트가\n도착했다." },
    { kicker: "수정 요청 47건 · 마감 D-8", title: "혼자는 무리다.\n하지만 우리는 셋이다." }
  ];
  const sceneImages = ["opening-office-v2.webp", "opening-mail-v2.webp", "opening-raid-v2.webp"];
  const sceneAlts = [
    "아침 햇살이 들어오는 작은 사무실의 빈 책상 세 자리",
    "긴급 프로젝트 메일과 첨부파일이 표시된 사무실 모니터",
    "세 동료가 거대한 프로젝트를 마주하는 연출 장면"
  ];
  const scene = scenes[openingPage];
  const dots = scenes.map((_, index) => `<i class="${index === openingPage ? "active" : ""}"></i>`).join("");
  const visual = `<figure class="opening-visual opening-visual-${openingPage + 1}"><img src="assets/${sceneImages[openingPage]}?v=20260831" alt="${sceneAlts[openingPage]}" loading="eager" decoding="async"></figure>`;
  app.innerHTML = `<section class="opening-screen">
    <div class="opening-top"><img class="opening-logo" src="assets/office-raid-logo-ui.webp?v=20260831" alt="OFFICE RAID"><button id="skip-opening">건너뛰기</button></div>
    <article class="opening-card panel"><p>${escapeHtml(scene.kicker)}</p><h1>${escapeHtml(scene.title).replace("\n", "<br>")}</h1>${visual}</article>
    <div class="opening-dots">${dots}</div>
    <button id="next-opening" class="teal">${openingPage < 2 ? "다음" : "업종 선택하기"}</button>
  </section>`;
  document.querySelector("#skip-opening").addEventListener("click", renderIndustrySelection);
  document.querySelector("#next-opening").addEventListener("click", () => {
    if (openingPage < 2) { openingPage += 1; renderOpening(); }
    else renderIndustrySelection();
  });
}

function currentIndustry() {
  return INDUSTRIES[state.industry] || null;
}

function renderIndustrySelection() {
  currentView = "industry";
  const cards = Object.entries(INDUSTRIES).map(([id, industry]) => `<button class="industry-card industry-${industry.tone}" data-industry="${id}">
    <span class="industry-icon" aria-hidden="true">${industry.icon}</span>
    <span class="industry-copy"><small>STARTING BUSINESS</small><strong>${escapeHtml(industry.name)}</strong><em>${escapeHtml(industry.tagline)}</em></span>
    <span class="industry-detail"><b>${escapeHtml(industry.departmentLabel)}</b><small>${escapeHtml(industry.combatStyle)}</small></span>
  </button>`).join("");
  app.innerHTML = `${header("업종 선택", "어떤 회사를 만들겠습니까?")}
    <section class="screen industry-screen">
      <div class="industry-intro panel"><small>FOUNDING STEP 1</small><strong>업종에 따라 동료와 프로젝트가 달라집니다.</strong></div>
      <div class="industry-list">${cards}</div>
    </section>`;
  document.querySelectorAll("[data-industry]").forEach(button => button.addEventListener("click", () => selectIndustry(button.dataset.industry)));
}

function selectIndustry(industryId) {
  if (!INDUSTRIES[industryId]) return;
  state.industry = industryId;
  state.companyName = generateCompanyName(industryId);
  renderSetup();
}

function renderSetup() {
  currentView = "setup";
  const industry = currentIndustry();
  if (!industry) return renderIndustrySelection();
  app.innerHTML = `${header("회사 이름 정하기", `${industry.name} · ${industry.tagline}`)}
    <section class="screen"><div class="setup panel">
      <figure class="setup-story-preview">
        <img src="assets/company-setup-desk.webp?v=20260901-company-desk-v1" alt="서류 뭉치와 포스트잇, 마감 D-8 도장이 놓인 첫 프로젝트 책상">
      </figure>
      <h2>${escapeHtml(industry.name)} 창업</h2>
      <p>${escapeHtml(industry.departmentLabel)}<br>${escapeHtml(industry.combatStyle)}</p>
      <span class="genre-tag">${escapeHtml(industry.name)} · 창립 준비</span>
      <label class="sr-only" for="company-name">회사 이름</label>
      <div class="input-with-button"><input id="company-name" maxlength="18" value="${escapeHtml(state.companyName || generateCompanyName(state.industry))}" autocomplete="organization"><button id="random-company" class="mustard">랜덤 생성</button></div>
      <div class="setup-actions"><button id="back-industry" class="ink">← 업종</button><button id="create-company" class="teal">다음 · 대표 만들기</button></div>
    </div></section>`;
  document.querySelector("#random-company").addEventListener("click", randomizeCompanyName);
  document.querySelector("#back-industry").addEventListener("click", renderIndustrySelection);
  document.querySelector("#create-company").addEventListener("click", openRepresentativeSetup);
  document.querySelector("#company-name").addEventListener("keydown", event => { if (event.key === "Enter") openRepresentativeSetup(); });
}

function generateCompanyName(industryId = state.industry) {
  const industry = INDUSTRIES[industryId] || INDUSTRIES.commerce;
  return `${industry.prefixes[randomInt(industry.prefixes.length)]}${industry.suffixes[randomInt(industry.suffixes.length)]}`;
}

function randomizeCompanyName() {
  const name = generateCompanyName();
  state.companyName = name;
  document.querySelector("#company-name").value = name;
}

function openRepresentativeSetup() {
  const input = document.querySelector("#company-name");
  state.companyName = input.value.trim() || "이름 없는 회사";
  renderRepresentativeSetup();
}

function renderRepresentativeSetup() {
  currentView = "representative";
  const look = representativeDraft.appearance;
  const parts = representativeMode === "detail"
    ? [["face", "얼굴형", 8], ["eyes", "눈", 10], ["eyebrows", "눈썹", 8], ["nose", "코", 8], ["mouth", "입", 10]]
    : [["skin", "피부", 6], ["hair", "머리", 16], ["top", "상의", 12], ["bottom", "하의", 8], ["accessory", "외형 장식", 9]];
  const rows = parts.map(([part, label, count]) => {
    const optionName = part === "accessory" ? ` · ${window.OfficeRaidCharacter.cosmetics[look[part] % window.OfficeRaidCharacter.cosmetics.length]}` : "";
    return `<div class="custom-row"><strong>${label}${optionName} <span>${look[part] + 1}/${count}</span></strong><button data-part="${part}" data-delta="-1" aria-label="${label} 이전">◀</button><button data-part="${part}" data-delta="1" aria-label="${label} 다음">▶</button></div>`;
  }).join("");
  app.innerHTML = `${header("대표 만들기", "이름과 외형은 능력치에 영향을 주지 않습니다.")}
    <section class="screen"><div class="representative panel">
      <canvas id="representative-preview" class="${representativeMode === "detail" ? "face-zoom" : ""}" width="48" height="48" aria-label="${representativeMode === "detail" ? "대표 얼굴 확대 미리보기" : "대표 전신 미리보기"}"></canvas>
      ${representativeMode === "detail" ? '<small class="preview-mode-label">얼굴 확대 미리보기</small>' : ""}
      <label class="sr-only" for="representative-name">대표 이름</label>
      <div class="input-with-button"><input id="representative-name" maxlength="10" value="${escapeHtml(representativeDraft.name)}"><button id="random-representative-name" class="mustard">이름 랜덤</button></div>
      <button id="random-appearance" class="blue full-button">외형 전체 랜덤</button>
      <div class="custom-tabs"><button id="basic-parts" class="${representativeMode === "basic" ? "active" : ""}">기본 외형</button><button id="detail-parts" class="${representativeMode === "detail" ? "active" : ""}">얼굴 세부</button></div>
      <div class="custom-list">${rows}</div>
    </div>
    <div class="footer-actions"><button class="ink" id="back-company">← 회사 이름</button><button class="teal" id="finish-company">회사 시작</button></div></section>`;
  const previewMember = { department: "management", appearance: look };
  if (representativeMode === "detail") drawFacePreview(document.querySelector("#representative-preview"), previewMember);
  else drawPortrait(document.querySelector("#representative-preview"), previewMember);
  document.querySelector("#random-representative-name").addEventListener("click", () => {
    representativeDraft.name = FAMILY[randomInt(FAMILY.length)] + GIVEN[randomInt(GIVEN.length)];
    renderRepresentativeSetup();
  });
  document.querySelector("#random-appearance").addEventListener("click", () => {
    saveRepresentativeName();
    representativeDraft.appearance = appearance(randomInt(100000));
    renderRepresentativeSetup();
  });
  document.querySelector("#basic-parts").addEventListener("click", () => switchRepresentativeMode("basic"));
  document.querySelector("#detail-parts").addEventListener("click", () => switchRepresentativeMode("detail"));
  document.querySelectorAll("[data-part]").forEach(button => button.addEventListener("click", () => changeRepresentativePart(button.dataset.part, Number(button.dataset.delta))));
  document.querySelector("#back-company").addEventListener("click", () => { saveRepresentativeName(); renderSetup(); });
  document.querySelector("#finish-company").addEventListener("click", createCompany);
  document.querySelector("#representative-name").addEventListener("keydown", event => { if (event.key === "Enter") createCompany(); });
}

function switchRepresentativeMode(mode) {
  saveRepresentativeName();
  representativeMode = mode;
  renderRepresentativeSetup();
}

function saveRepresentativeName() {
  const input = document.querySelector("#representative-name");
  if (input && input.value.trim()) representativeDraft.name = input.value.trim();
}

function changeRepresentativePart(part, delta) {
  saveRepresentativeName();
  const counts = { face: 8, skin: 6, hair: 16, eyes: 10, eyebrows: 8, nose: 8, mouth: 10, top: 12, bottom: 8, accessory: 9 };
  representativeDraft.appearance[part] = (representativeDraft.appearance[part] + delta + counts[part]) % counts[part];
  if (part === "top") representativeDraft.appearance.outfit = representativeDraft.appearance.top;
  renderRepresentativeSetup();
}

function createCompany() {
  saveRepresentativeName();
  const industry = currentIndustry();
  if (!industry) return renderIndustrySelection();
  const representative = employee(representativeDraft.name, "management", "침착한 조율자", 17, 18, 14, 1103);
  representative.isRepresentative = true;
  representative.appearance = { ...representativeDraft.appearance };
  state.employees = [
    representative,
    ...industry.starters.map(member => employee(member.name, member.department, member.trait, member.work, member.collaboration, member.speed, member.look))
  ];
  state.teamIds = state.employees.map(member => member.id);
  saveGame();
  renderCompanyLaunch();
}

function clearCompanyLaunchTimer() {
  if (companyLaunchTimer) window.clearTimeout(companyLaunchTimer);
  companyLaunchTimer = null;
}

function renderCompanyLaunch() {
  currentView = "company-launch";
  clearCompanyLaunchTimer();
  const industry = currentIndustry();
  const members = state.employees.map((member, index) => `<div class="launch-member launch-member-${index + 1}">
    <span>${member.isRepresentative ? "FOUNDER" : "CREW 0" + index}</span>
    <canvas width="24" height="24" data-portrait="${member.id}" aria-label="${escapeHtml(member.name)} 정면 모습"></canvas>
    <strong>${escapeHtml(member.name)}</strong>
    <small>${DEPARTMENTS[member.department].short} · ${employeePosition(member)}</small>
  </div>`).join("");
  app.innerHTML = `<section class="company-launch-screen">
    <div class="launch-grid" aria-hidden="true"></div>
    <img class="launch-logo" src="assets/office-raid-logo-ui.webp?v=20260831" alt="OFFICE RAID">
    <article class="launch-card panel">
      <div class="launch-stamp"><span>COMPANY FOUNDED</span><b>설립 완료</b></div>
      <p class="launch-kicker">FIRST RAID TEAM</p>
      <h1>${escapeHtml(state.companyName)}</h1>
      <p class="launch-industry">${escapeHtml(industry?.name || "신생 기업")}</p>
      <p class="launch-message">${escapeHtml(industry?.starterNotice || "작은 팀이 모였습니다.")}<br>이제 첫 프로젝트를 시작할 시간입니다.</p>
      <div class="launch-team" aria-label="초기 프로젝트 팀">${members}</div>
      <div class="launch-mission"><span>첫 번째 목표</span><strong>${escapeHtml(industry?.firstGoal || "프로젝트 1건 완료")}</strong><i>준비 완료</i></div>
    </article>
    <button id="enter-office" class="mustard">사무실로 출근</button>
  </section>`;
  mountPortraits();
  document.querySelector("#enter-office").addEventListener("click", enterOfficeFromLaunch);
  companyLaunchTimer = window.setTimeout(() => document.querySelector("#enter-office")?.classList.add("ready"), 1300);
}

function enterOfficeFromLaunch() {
  clearCompanyLaunchTimer();
  const screen = document.querySelector(".company-launch-screen");
  if (!screen || screen.classList.contains("leaving")) return;
  screen.classList.add("leaving");
  companyLaunchTimer = window.setTimeout(() => {
    companyLaunchTimer = null;
    renderOffice("작지만 강한 첫 프로젝트 팀이 준비됐습니다.", true);
  }, 260);
}

function currentTeam() { return state.teamIds.map(id => state.employees.find(member => member.id === id)).filter(Boolean); }

function orderedBattleTeam(members = currentTeam(), formationIds = state.teamIds) {
  const formationOrder = new Map(formationIds.map((id, index) => [id, index]));
  return [...members].sort((left, right) => right.speed - left.speed || (formationOrder.get(left.id) ?? 99) - (formationOrder.get(right.id) ?? 99));
}

function directiveChargeFor(member) {
  return Math.min(14, Math.max(10, 8 + Math.floor((member?.speed || 0) / 4)));
}

function tutorialProjectSource() {
  const industry = currentIndustry();
  return PROJECTS.find(project => project.industry === state.industry && project.name === industry?.firstGoal)
    || PROJECTS.find(project => project.industry === state.industry && project.chapter === 1)
    || PROJECTS[0];
}

function officePersonality(member) {
  const trait = member?.trait || "";
  if (trait.includes("완벽")) return "perfectionist";
  if (trait.includes("분위기") || trait.includes("발표")) return "mood";
  if (trait.includes("침착") || trait.includes("기록")) return "realist";
  if (trait.includes("빠른")) return "quiet";
  if (trait.includes("위기")) return "competitive";
  return "creative";
}

function employeePosition(member) {
  if (member?.isRepresentative) return "대표";
  return POSITIONS[Math.max(0, Math.min(POSITIONS.length - 1, member?.rank || 0))];
}

function officeAuthority(member) {
  return member?.isRepresentative ? 100 : member?.rank || 0;
}

function officeOpener(speaker, listener, dialogue) {
  if (speaker.isRepresentative) return dialogue.representativeOpener;
  const listenerTitle = listener.isRepresentative
    ? "대표님"
    : officeAuthority(listener) > officeAuthority(speaker) ? `${employeePosition(listener)}님` : "";
  return listenerTitle ? `${listenerTitle}, ${dialogue.formalOpener}` : dialogue.opener;
}

function officeResponse(listener, speaker, dialogue) {
  if (listener.isRepresentative) return dialogue.representativeResponse;
  let response = dialogue.responses[officePersonality(listener)] || dialogue.responses.realist;
  if (officeAuthority(speaker) > officeAuthority(listener)) {
    response = FORMAL_OFFICE_RESPONSES[response] || response;
    if (!/^(네|알겠습니다|좋습니다)/.test(response)) response = `네. ${response}`;
  }
  return response;
}

function clearOfficeDialogue() {
  if (officeDialogueTimer) window.clearTimeout(officeDialogueTimer);
  officeDialogueTimer = null;
  document.querySelectorAll(".office-speech.show").forEach(bubble => bubble.classList.remove("show"));
}

function showOfficeSpeech(member, line) {
  document.querySelectorAll(".office-speech.show").forEach(bubble => bubble.classList.remove("show"));
  const bubble = document.querySelector(`[data-office-speech="${member.id}"]`);
  if (!bubble) return false;
  bubble.replaceChildren();
  const speaker = document.createElement("b");
  const message = document.createElement("span");
  speaker.textContent = `${member.name} · ${employeePosition(member)}`;
  message.textContent = line;
  bubble.append(speaker, message);
  bubble.classList.add("show");
  return true;
}

function pickOfficeDialogue() {
  const available = OFFICE_DIALOGUES.filter(dialogue => !recentOfficeDialogueIds.includes(dialogue.id));
  const pool = available.length ? available : OFFICE_DIALOGUES;
  const dialogue = pool[randomInt(pool.length)];
  recentOfficeDialogueIds = [...recentOfficeDialogueIds.slice(-2), dialogue.id];
  return dialogue;
}

function runOfficeDialogue() {
  if (currentView !== "office") return;
  const members = state.employees;
  if (members.length < 2) return;
  const speakerIndex = randomInt(members.length);
  const listenerIndex = (speakerIndex + 1 + randomInt(members.length - 1)) % members.length;
  const speaker = members[speakerIndex];
  const listener = members[listenerIndex];
  const dialogue = pickOfficeDialogue();
  if (!showOfficeSpeech(speaker, officeOpener(speaker, listener, dialogue))) return;
  officeDialogueTimer = window.setTimeout(() => {
    if (currentView !== "office") return;
    const response = officeResponse(listener, speaker, dialogue);
    if (!showOfficeSpeech(listener, response)) return;
    officeDialogueTimer = window.setTimeout(() => {
      if (currentView !== "office") return;
      clearOfficeDialogue();
      officeDialogueTimer = window.setTimeout(runOfficeDialogue, 5000 + randomInt(3000));
    }, 3000);
  }, 2600);
}

function scheduleOfficeDialogue(delay = 1400) {
  clearOfficeDialogue();
  officeDialogueTimer = window.setTimeout(runOfficeDialogue, delay);
}

function equipmentArtFor(item) {
  if (item.art) return item.art;
  return EQUIPMENT_CATALOG.find(([name]) => name === item.name)?.[2] || item.slot || "personal";
}

function equipmentIconMarkup(item, className = "") {
  return `<canvas class="equipment-icon ${className}" width="24" height="24" data-equipment-icon="${escapeHtml(equipmentArtFor(item))}" data-equipment-rarity="${item.rarity}" aria-label="${escapeHtml(item.name)} 아이콘"></canvas>`;
}

function officeEquipmentUsage(item) {
  const art = equipmentArtFor(item);
  if (art === "headset") return "머리에 착용 중";
  if (["laptop", "tablet", "calculator"].includes(art)) return "모니터 앞에서 사용 중";
  if (art === "planner") return "책상 왼쪽에서 사용 중";
  if (art === "wallet") return "책상 왼쪽에 보관 중";
  if (["coffee", "tumbler"].includes(art)) return "책상 오른쪽에서 사용 중";
  return "모니터 모서리에 걸어둠";
}

function officeEquipmentPlacement(item) {
  const art = equipmentArtFor(item);
  if (art === "headset") return "wearable";
  if (art === "charm") return "monitor-mounted";
  if (["coffee", "tumbler"].includes(art)) return "desk-right";
  if (["planner", "wallet"].includes(art)) return "desk-left";
  return "desk-center";
}

function equippedEquipmentCount() {
  return state.employees.reduce((total, member) => total + Object.values(member.equipment || {}).filter(Boolean).length, 0);
}

function totalPayroll() {
  return state.employees.reduce((total, member) => total + (member.salary || 0), 0);
}

function recordFinancialAmount(category, amount) {
  if (!state.financialPeriod || !Object.prototype.hasOwnProperty.call(state.financialPeriod, category)) return;
  state.financialPeriod[category] += Math.max(0, amount || 0);
}

function financialExpenseTotal(period) {
  return period.payroll + period.recruitment + period.posting + period.retention + period.termination;
}

function closeFinancialPeriodIfDue() {
  if (state.projectClears <= 0 || state.projectClears % PAYROLL_PROJECT_INTERVAL !== 0) return null;
  const period = state.financialPeriod;
  const expenses = financialExpenseTotal(period);
  const report = {
    ...period,
    expenses,
    operatingProfit: period.revenue - expenses,
    endingCash: state.cash,
    headcount: state.employees.length,
    reputation: state.reputation,
    projectClears: state.projectClears
  };
  state.financialHistory = [...state.financialHistory.slice(-7), report];
  state.pendingFinancialReport = report;
  state.financialPeriod = {
    number: period.number + 1, startCash: state.cash, revenue: 0, payroll: 0,
    recruitment: 0, posting: 0, retention: 0, termination: 0
  };
  return report;
}

function projectsUntilPayroll() {
  const remainder = state.projectClears % PAYROLL_PROJECT_INTERVAL;
  return remainder === 0 ? PAYROLL_PROJECT_INTERVAL : PAYROLL_PROJECT_INTERVAL - remainder;
}

function returnMemberEquipment(member) {
  Object.keys(member.equipment || {}).forEach(slot => {
    const item = member.equipment[slot];
    if (item) state.equipment.push(item);
    member.equipment[slot] = null;
  });
}

function repairProjectTeam() {
  const validIds = new Set(state.employees.map(member => member.id));
  state.teamIds = state.teamIds.filter(id => validIds.has(id));
  state.employees.forEach(member => {
    if (state.teamIds.length < 3 && !state.teamIds.includes(member.id)) state.teamIds.push(member.id);
  });
}

function removeEmployee(member) {
  if (!member || member.isRepresentative) return [];
  const returnedEquipment = Object.values(member.equipment || {}).filter(Boolean).map(item => item.name);
  returnMemberEquipment(member);
  state.employees = state.employees.filter(employeeItem => employeeItem.id !== member.id);
  repairProjectTeam();
  if (equipmentTargetId === member.id) equipmentTargetId = state.employees[0]?.id || null;
  return returnedEquipment;
}

function contractSettlement(member) {
  return Math.max(80, Math.ceil((member.salary || 120) * .75 / 10) * 10);
}

function officeEquipmentMarkup(member) {
  const equipped = Object.values(member.equipment || {}).filter(Boolean);
  const props = equipped.map(item => {
    const art = equipmentArtFor(item);
    const rarity = EQUIPMENT_RARITIES[item.rarity];
    return `<canvas class="office-equipment-prop placement-${officeEquipmentPlacement(item)} prop-${escapeHtml(art)} rarity-${item.rarity}" width="24" height="24" data-equipment-icon="${escapeHtml(art)}" data-equipment-rarity="${item.rarity}" style="--rarity-color:${rarity.color}" aria-label="${escapeHtml(item.name)} · ${officeEquipmentUsage(item)}"></canvas>`;
  }).join("");
  const details = equipped.length
    ? equipped.map(item => `<span><b style="color:${EQUIPMENT_RARITIES[item.rarity].color}">${escapeHtml(item.name)}</b><small>${officeEquipmentUsage(item)}</small></span>`).join("")
    : `<span class="office-no-equipment">사용 중인 장비가 없습니다.</span>`;
  return `<div class="office-workspace" aria-hidden="true">
    <div class="office-character"><canvas class="office-portrait" width="24" height="24" data-portrait="${member.id}"></canvas>${props}</div>
    <img class="office-desk-base" src="assets/office-desk-base.webp?v=20260831" alt="">
    <img class="office-monitor-back" src="assets/office-monitor-back.webp?v=20260831" alt="">
  </div><div class="office-loadout-popover" aria-hidden="true"><em>현재 사용 장비</em>${details}</div>`;
}

function renderOffice(notice = "면접으로 동료를 채용하고 프로젝트 팀을 편성하세요.", animateEntry = false) {
  currentView = "office";
  clearCompanyLaunchTimer();
  clearBattleTimer();
  repairProjectTeam();
  saveGame();
  const tutorialPending = !state.tutorialBattleCompleted;
  const officeNotice = tutorialPending ? "창립팀으로 첫 프로젝트를 완료해 면접 기능을 해금하세요." : notice;
  const teamNames = orderedBattleTeam().map(member => escapeHtml(member.name)).join(" → ");
  const specialRecruitment = state.specialRecruitmentTickets > 0
    ? `이용권 ${state.specialRecruitmentTickets}장 보유`
    : specialRecruitmentProgress();
  const officeMembers = state.employees.slice(0, state.capacity);
  const equippedCount = equippedEquipmentCount();
  const industry = currentIndustry();
  const desks = officeMembers.map(member => `<div class="desk" data-office-worker="${member.id}" role="button" tabindex="0" aria-label="${escapeHtml(member.name)}의 사용 장비 확인"><span class="office-speech" data-office-speech="${member.id}" aria-live="polite"></span>${officeEquipmentMarkup(member)}<strong>${escapeHtml(member.name)}</strong><small>${DEPARTMENTS[member.department].short} · ${employeePosition(member)}</small></div>`).join("");
  app.innerHTML = `${header("작은 사무실", officeNotice)}
    <section class="screen">
      <div class="office-room panel staff-${officeMembers.length}${animateEntry ? " office-entry" : ""}" aria-label="직원 ${officeMembers.length}명이 근무하는 작은 사무실">${desks}</div>
      <div class="company-card panel">
        <div class="company-card-head"><div><small>COMPANY FILE</small><h2>${escapeHtml(state.companyName)}</h2></div><b>${escapeHtml(industry?.short || "운영")}</b></div>
        <div class="company-stats" aria-label="회사 현황">
          <span><small>직원</small><strong>${state.employees.length}<i>/ ${state.capacity}</i></strong></span>
          <span><small>현금</small><strong>${state.cash}<i>만원</i></strong></span>
          <span><small>평판</small><strong>${state.reputation}<i>점</i></strong></span>
        </div>
        <div class="company-notes">
          <p><b>ACTION ORDER</b><span>${teamNames}</span></p>
          <p><b>성과 ${state.projectClears}회 · 급여 D-${projectsUntilPayroll()}</b><span>월급 ${totalPayroll()} · 특별채용 ${specialRecruitment}</span></p>
          ${tutorialPending ? `<p class="onboarding-note"><b>FIRST MISSION</b><span>첫 프로젝트 성공 시 면접 기능 해금</span></p>` : ""}
        </div>
      </div>
      <div class="actions office-actions">
        <button class="blue ${tutorialPending ? "tutorial-locked" : ""}" id="interview" ${tutorialPending ? "disabled" : ""}>${tutorialPending ? "면접 잠김" : "면접"}</button>
        <button class="teal" id="team">팀 편성</button>
        <button class="mustard" id="equipment" aria-label="장착 장비 ${equippedCount}개, 보관 장비 ${state.equipment.length}개">장착 ${equippedCount} · 보관 ${state.equipment.length}</button>
        <button class="ink" id="hr">인사 관리</button>
        <button class="red ${tutorialPending ? "tutorial-next" : ""}" id="project">${tutorialPending ? "첫 프로젝트 시작" : "프로젝트"}</button>
      </div>
    </section>`;
  mountPortraits();
  mountEquipmentIcons();
  document.querySelector("#interview").addEventListener("click", () => openInterview());
  document.querySelector("#team").addEventListener("click", openTeam);
  document.querySelector("#equipment").addEventListener("click", () => openEquipment());
  document.querySelector("#hr").addEventListener("click", () => openHumanResources());
  document.querySelector("#project").addEventListener("click", renderProjectBoard);
  document.querySelectorAll("[data-office-worker]").forEach(desk => {
    const toggleLoadout = () => {
      const willOpen = !desk.classList.contains("loadout-open");
      document.querySelectorAll("[data-office-worker].loadout-open").forEach(openDesk => {
        openDesk.classList.remove("loadout-open");
        openDesk.querySelector(".office-loadout-popover")?.setAttribute("aria-hidden", "true");
      });
      desk.classList.toggle("loadout-open", willOpen);
      desk.querySelector(".office-loadout-popover")?.setAttribute("aria-hidden", willOpen ? "false" : "true");
    };
    desk.addEventListener("click", toggleLoadout);
    desk.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleLoadout();
    });
  });
  scheduleOfficeDialogue();
}

function openHumanResources(notice = "직원 계약과 급여 현황을 관리하세요.") {
  currentView = "hr";
  hrTerminationTargetId = null;
  renderHumanResources(notice);
}

function renderHumanResources(notice = "직원 계약과 급여 현황을 관리하세요.") {
  currentView = "hr";
  saveGame();
  const target = state.employees.find(member => member.id === hrTerminationTargetId && !member.isRepresentative);
  const cards = state.employees.map(member => {
    const stats = effectiveStats(member);
    const equipped = Object.values(member.equipment || {}).filter(Boolean).length;
    const tenure = Math.max(0, state.projectClears - (member.joinedAt || 0));
    const protectedMember = member.isRepresentative || state.employees.length <= 3;
    return `<article class="team-card hr-card ${member.isRepresentative ? "representative-card" : ""}">
      <canvas width="24" height="24" data-portrait="${member.id}"></canvas>
      <div><h3>${escapeHtml(member.name)} ${member.isRepresentative ? `<span class="rank representative-rank">대표</span>` : ""}</h3>
      <p class="dept">${DEPARTMENTS[member.department].name} · ${employeePosition(member)} · ${escapeHtml(member.trait)}</p>
      <p>실무 ${stats.work}　협업 ${stats.collaboration}　장비 ${equipped}개</p>
      <p>월급 ${member.salary}만원 · 근속 프로젝트 ${tenure}건</p></div>
      <button class="${protectedMember ? "ink" : "red"}" data-end-contract="${member.id}" ${protectedMember ? "disabled" : ""}>${member.isRepresentative ? "대표" : state.employees.length <= 3 ? "최소 인원" : "계약 종료"}</button>
    </article>`;
  }).join("");
  const confirm = target ? contractTerminationConfirm(target) : "";
  app.innerHTML = `${header("인사 관리", `${notice} · 월 급여 ${totalPayroll()}만원`)}<section class="screen hr-screen">
    <div class="hr-summary panel"><span><small>직원</small><strong>${state.employees.length}/${state.capacity}</strong></span><span><small>월 급여</small><strong>${totalPayroll()}만원</strong></span><span><small>다음 정산</small><strong>D-${projectsUntilPayroll()}</strong></span></div>
    <div class="card-list">${cards}</div>
    <button class="ink" id="back-from-hr">← 사무실</button>
    ${confirm}
  </section>`;
  mountPortraits();
  document.querySelectorAll("[data-end-contract]:not(:disabled)").forEach(button => button.addEventListener("click", () => requestContractTermination(button.dataset.endContract)));
  document.querySelector("#back-from-hr").addEventListener("click", () => renderOffice());
  document.querySelector("#cancel-contract-termination")?.addEventListener("click", cancelContractTermination);
  document.querySelector("#confirm-contract-termination")?.addEventListener("click", confirmContractTermination);
}

function contractTerminationConfirm(member) {
  const settlement = contractSettlement(member);
  const equipmentNames = Object.values(member.equipment || {}).filter(Boolean).map(item => item.name);
  const canAfford = state.cash >= settlement;
  return `<div class="hr-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="contract-end-title"><div class="hr-confirm panel">
    <small>CONTRACT REVIEW</small><strong id="contract-end-title">${escapeHtml(member.name)}의 계약을 종료할까요?</strong>
    <p>계약 종료 정산금 <b>${settlement}만원</b>이 지급되고 평판이 2 감소합니다.${equipmentNames.length ? `<br>장비 ${escapeHtml(equipmentNames.join(" · "))}은 보관함으로 회수됩니다.` : ""}</p>
    ${canAfford ? "" : `<em>정산금이 부족합니다. 현재 현금 ${state.cash}만원</em>`}
    <div><button class="teal" id="cancel-contract-termination">계속 근무</button><button class="red" id="confirm-contract-termination" ${canAfford ? "" : "disabled"}>계약 종료</button></div>
  </div></div>`;
}

function requestContractTermination(memberId) {
  const member = state.employees.find(employeeItem => employeeItem.id === memberId);
  if (!member || member.isRepresentative) return renderHumanResources("대표의 계약은 종료할 수 없습니다.");
  if (state.employees.length <= 3) return renderHumanResources("프로젝트 진행에 필요한 최소 직원 3명은 유지해야 합니다.");
  hrTerminationTargetId = memberId;
  renderHumanResources(`${member.name}의 계약 조건을 확인하세요.`);
}

function cancelContractTermination() {
  hrTerminationTargetId = null;
  renderHumanResources("계약을 유지했습니다.");
}

function confirmContractTermination() {
  const member = state.employees.find(employeeItem => employeeItem.id === hrTerminationTargetId);
  if (!member || member.isRepresentative) return renderHumanResources("계약 종료 대상을 찾을 수 없습니다.");
  if (state.employees.length <= 3) return renderHumanResources("프로젝트 진행에 필요한 최소 직원 3명은 유지해야 합니다.");
  const settlement = contractSettlement(member);
  if (state.cash < settlement) return renderHumanResources("계약 종료 정산금이 부족합니다.");
  state.cash -= settlement;
  recordFinancialAmount("termination", settlement);
  state.reputation = Math.max(0, state.reputation - 2);
  const returnedEquipment = removeEmployee(member);
  hrTerminationTargetId = null;
  const equipmentNotice = returnedEquipment.length ? ` · 장비 ${returnedEquipment.length}개 회수` : "";
  renderHumanResources(`${member.name}과의 계약을 종료했습니다. 정산금 ${settlement}만원${equipmentNotice}`);
}

function turnoverReason(member) {
  if (!state.teamIds.includes(member.id)) return "최근 핵심 프로젝트에서 역할을 찾기 어렵다며 새로운 기회를 고민하고 있습니다.";
  if (member.trait.includes("완벽")) return "더 높은 기준의 업무와 성장 기회를 원한다며 이직 제안을 검토하고 있습니다.";
  if (member.trait.includes("위기")) return "반복되는 긴급 대응으로 지쳤다며 근무 조건에 대한 면담을 요청했습니다.";
  if (["dev", "product", "design", "md"].includes(member.department)) return "자신이 주도할 수 있는 더 큰 역할을 제안받아 고민하고 있습니다.";
  return "외부 회사에서 더 좋은 조건을 제안받아 대표와의 면담을 요청했습니다.";
}

function maybeQueueTurnoverEvent() {
  if (state.pendingTurnover || state.employees.length <= 3 || state.projectClears < TURNOVER_PROJECT_INTERVAL || state.projectClears % TURNOVER_PROJECT_INTERVAL !== 0) return null;
  const eligible = state.employees.filter(member => !member.isRepresentative && state.projectClears - (member.joinedAt || 0) >= 3 && (member.turnoverShieldUntil || 0) <= state.projectClears);
  if (!eligible.length) return null;
  const bench = eligible.filter(member => !state.teamIds.includes(member.id));
  const pool = bench.length ? bench : eligible;
  const member = pool[randomInt(pool.length)];
  state.pendingTurnover = {
    employeeId: member.id,
    reason: turnoverReason(member),
    retentionCost: member.salary + 100 + member.rank * 50
  };
  return member;
}

function processPayrollIfDue() {
  if (state.projectClears <= 0 || state.projectClears % PAYROLL_PROJECT_INTERVAL !== 0) return 0;
  const payroll = totalPayroll();
  state.cash -= payroll;
  recordFinancialAmount("payroll", payroll);
  state.payrollPayments += 1;
  return payroll;
}

function renderTurnoverEvent(notice = "직원이 이직을 고민하고 있습니다. 대응 방법을 선택하세요.") {
  currentView = "turnover";
  clearBattleTimer();
  const event = state.pendingTurnover;
  const member = state.employees.find(employeeItem => employeeItem.id === event?.employeeId);
  if (!event || !member) {
    state.pendingTurnover = null;
    return renderOffice("인사 면담이 종료됐습니다.");
  }
  saveGame();
  const rank = RANKS[member.rank];
  const improvedSalary = Math.ceil(member.salary * 1.1 / 10) * 10;
  app.innerHTML = `${header("이직 면담", notice)}<section class="screen turnover-screen">
    <article class="turnover-card panel">
      <span class="turnover-stamp">RETENTION MEETING</span>
      <canvas width="24" height="24" data-portrait="${member.id}" aria-label="${escapeHtml(member.name)}"></canvas>
      <h2>${escapeHtml(member.name)} <i style="background:${rank.color}">${rank.name}</i></h2>
      <p class="turnover-role">${DEPARTMENTS[member.department].name} · ${employeePosition(member)} · ${escapeHtml(member.trait)}</p>
      <blockquote>“${escapeHtml(event.reason)}”</blockquote>
      <div class="turnover-current"><span>현재 월급 <b>${member.salary}만원</b></span><span>근속 <b>${Math.max(0, state.projectClears - (member.joinedAt || 0))}건</b></span></div>
    </article>
    <div class="turnover-options">
      <button class="mustard" id="retain-with-pay" ${state.cash < event.retentionCost ? "disabled" : ""}><strong>처우 개선</strong><small>보너스 ${event.retentionCost}만원 · 월급 ${improvedSalary}만원</small></button>
      <button class="teal" id="retain-with-talk" ${state.reputation < TURNOVER_REPUTATION_COST ? "disabled" : ""}><strong>면담으로 설득</strong><small>평판 ${TURNOVER_REPUTATION_COST} 사용 · 성공 확률 70%</small></button>
      <button class="ink" id="accept-turnover"><strong>보내주기</strong><small>비용 없이 퇴사 · 장비 자동 회수</small></button>
    </div>
  </section>`;
  mountPortraits();
  document.querySelector("#retain-with-pay")?.addEventListener("click", retainEmployeeWithPay);
  document.querySelector("#retain-with-talk")?.addEventListener("click", retainEmployeeWithTalk);
  document.querySelector("#accept-turnover").addEventListener("click", acceptEmployeeTurnover);
}

function retainEmployeeWithPay() {
  const event = state.pendingTurnover;
  const member = state.employees.find(employeeItem => employeeItem.id === event?.employeeId);
  if (!event || !member) return renderOffice("면담 대상을 찾을 수 없습니다.");
  if (state.cash < event.retentionCost) return renderTurnoverEvent("처우 개선에 필요한 자금이 부족합니다.");
  state.cash -= event.retentionCost;
  recordFinancialAmount("retention", event.retentionCost);
  member.salary = Math.ceil(member.salary * 1.1 / 10) * 10;
  member.retentionCount = (member.retentionCount || 0) + 1;
  member.turnoverShieldUntil = state.projectClears + 10;
  state.turnoverEvents += 1;
  state.pendingTurnover = null;
  renderOffice(`${member.name}과 처우 개선에 합의했습니다. 당분간 이직을 고민하지 않습니다.`);
}

function retainEmployeeWithTalk() {
  const event = state.pendingTurnover;
  const member = state.employees.find(employeeItem => employeeItem.id === event?.employeeId);
  if (!event || !member) return renderOffice("면담 대상을 찾을 수 없습니다.");
  if (state.reputation < TURNOVER_REPUTATION_COST) return renderTurnoverEvent("면담을 설득력 있게 이끌 평판이 부족합니다.");
  state.reputation -= TURNOVER_REPUTATION_COST;
  state.turnoverEvents += 1;
  if (randomInt(100) < 70) {
    member.retentionCount = (member.retentionCount || 0) + 1;
    member.turnoverShieldUntil = state.projectClears + 7;
    state.pendingTurnover = null;
    return renderOffice(`${member.name}을 설득했습니다. 역할과 성장 방향을 다시 약속했습니다.`);
  }
  const returnedEquipment = removeEmployee(member);
  state.pendingTurnover = null;
  renderOffice(`${member.name}을 설득하지 못해 퇴사했습니다.${returnedEquipment.length ? ` 장비 ${returnedEquipment.length}개를 회수했습니다.` : ""}`);
}

function acceptEmployeeTurnover() {
  const event = state.pendingTurnover;
  const member = state.employees.find(employeeItem => employeeItem.id === event?.employeeId);
  if (!event || !member) return renderOffice("면담 대상을 찾을 수 없습니다.");
  const returnedEquipment = removeEmployee(member);
  state.turnoverEvents += 1;
  state.pendingTurnover = null;
  renderOffice(`${member.name}의 새로운 도전을 응원하며 퇴사를 수락했습니다.${returnedEquipment.length ? ` 장비 ${returnedEquipment.length}개를 회수했습니다.` : ""}`);
}

function financialGrade(report) {
  if (report.operatingProfit < 0 || report.endingCash < 0) return { label: "적자 경고", tone: "danger", description: "비용이 매출을 넘었습니다. 채용과 급여 규모를 다시 점검하세요." };
  if (report.operatingProfit >= report.revenue * .45) return { label: "고속 성장", tone: "growth", description: "높은 수익성을 유지하고 있습니다. 다음 확장에 투자할 여력이 있습니다." };
  return { label: "안정 운영", tone: "stable", description: "흑자를 유지하고 있습니다. 인건비 증가 속도만 주의하세요." };
}

function renderFinancialReport() {
  currentView = "financial-report";
  clearBattleTimer();
  const report = state.pendingFinancialReport;
  if (!report) return state.pendingTurnover ? renderTurnoverEvent() : renderOffice("확인할 결산 보고서가 없습니다.");
  const grade = financialGrade(report);
  const maxValue = Math.max(1, report.revenue, report.expenses);
  const revenueWidth = Math.max(4, Math.round(report.revenue / maxValue * 100));
  const expenseWidth = Math.max(4, Math.round(report.expenses / maxValue * 100));
  const profitSign = report.operatingProfit >= 0 ? "+" : "";
  app.innerHTML = `${header("분기 결산", `${state.companyName} · 제${report.number}분기 재무 보고서`)}<section class="screen financial-screen">
    <article class="financial-report panel ${grade.tone}">
      <div class="financial-title"><div><small>QUARTERLY REPORT</small><h2>제${report.number}분기 손익 요약</h2></div><span>${grade.label}</span></div>
      <div class="financial-chart" aria-label="매출과 비용 비교">
        <div><b>프로젝트 매출</b><i><em style="width:${revenueWidth}%"></em></i><strong>+${report.revenue}</strong></div>
        <div class="expense"><b>총비용</b><i><em style="width:${expenseWidth}%"></em></i><strong>-${report.expenses}</strong></div>
      </div>
      <div class="financial-statement">
        <p><span>프로젝트 매출</span><b class="positive">+${report.revenue}만원</b></p>
        <p><span>급여</span><b>-${report.payroll}만원</b></p>
        <p><span>채용 계약금</span><b>-${report.recruitment}만원</b></p>
        <p><span>채용 공고</span><b>-${report.posting}만원</b></p>
        <p><span>직원 유지 비용</span><b>-${report.retention}만원</b></p>
        <p><span>계약 종료 정산금</span><b>-${report.termination}만원</b></p>
        <p class="profit"><span>영업이익</span><b class="${report.operatingProfit >= 0 ? "positive" : "negative"}">${profitSign}${report.operatingProfit}만원</b></p>
      </div>
      <div class="financial-balance"><span><small>기초 현금</small><strong>${report.startCash}만원</strong></span><i>→</i><span><small>기말 현금</small><strong>${report.endingCash}만원</strong></span></div>
      <div class="financial-company"><span>직원 <b>${report.headcount}명</b></span><span>평판 <b>${report.reputation}점</b></span><span>누적 성과 <b>${report.projectClears}건</b></span></div>
      <p class="financial-advice">${grade.description}</p>
    </article>
    <button class="mustard" id="close-financial-report">${state.pendingTurnover ? "확인 · 이직 면담으로" : "확인 · 사무실로"}</button>
  </section>`;
  document.querySelector("#close-financial-report").addEventListener("click", closeFinancialReport);
}

function closeFinancialReport() {
  state.pendingFinancialReport = null;
  if (state.pendingTurnover) return renderTurnoverEvent();
  renderOffice("분기 결산을 완료했습니다. 다음 분기 운영을 시작합니다.");
}

function generateEquipmentReward(minimumRarity = 0) {
  const roll = randomInt(100);
  const rolledRarity = roll < 60 ? 0 : roll < 85 ? 1 : roll < 96 ? 2 : roll < 99 ? 3 : 4;
  const rarity = Math.max(minimumRarity, rolledRarity);
  const industryCatalog = EQUIPMENT_CATALOG.filter(([, , , industries]) => !industries || industries.includes(state.industry));
  const rewardPool = Math.random() < .8 && industryCatalog.length ? industryCatalog : EQUIPMENT_CATALOG;
  const [name, slot, art] = rewardPool[randomInt(rewardPool.length)];
  const bonus = 2 + rarity * 2;
  return {
    id: `equipment-${nextId++}`, name, slot, art, rarity,
    workBonus: slot === "work" ? bonus + 1 : bonus,
    collaborationBonus: slot === "support" ? bonus : Math.max(1, Math.floor(bonus / 2))
  };
}

function scaledProject(project) {
  const growth = Math.floor(state.projectClears / 4);
  const workloadBonus = growth * (project.boss ? 55 : 22);
  return {
    ...project,
    max: project.workload + workloadBonus,
    cash: project.cash + growth * (project.boss ? 300 : 90),
    reputation: project.reputation + growth * (project.boss ? 5 : 2)
  };
}

function currentProjectChapter() {
  return Math.min(PROJECT_EPISODES.length, Math.floor(state.projectClears / 5) + 1);
}

function projectEpisode(project) {
  return PROJECT_EPISODES.find(episode => episode.chapter === (project.chapter || 1)) || PROJECT_EPISODES[0];
}

function regularProjectOptions() {
  if (!state.tutorialBattleCompleted) return [scaledProject(tutorialProjectSource())];
  const chapter = currentProjectChapter();
  const industryProjects = PROJECTS.filter(project => project.industry === state.industry && project.chapter <= chapter);
  const commonProjects = PROJECTS.filter(project => project.industry === "common" && project.chapter <= chapter);
  const pool = [...industryProjects, ...commonProjects];
  const start = state.projectClears % pool.length;
  return [0, 1, 2].map(offset => scaledProject(pool[(start + offset) % pool.length]));
}

function nextBossProject() {
  const pool = BOSS_PROJECTS.filter(project => project.industry === state.industry);
  return scaledProject(pool[Math.min(state.bossClears, pool.length - 1)] || BOSS_PROJECTS[0]);
}

function bossProjectReady() {
  return state.projectClears >= state.bossClears * 5 + 4;
}

function bossProjectProgress() {
  return Math.min(4, Math.max(0, state.projectClears - state.bossClears * 5));
}

function projectCard(project, locked = false) {
  const reward = project.boss ? `현금 ${project.cash} · 희귀 장비 2개` : `현금 ${project.cash} · 평판 ${project.reputation}`;
  const recommended = (project.recommended || []).map(department => DEPARTMENTS[department]?.short).filter(Boolean).join(" · ");
  const episode = projectEpisode(project);
  return `<article class="project-card panel ${project.boss ? "boss-project" : ""} ${locked ? "locked" : ""}">
    <div class="project-card-head"><span>${escapeHtml(project.difficulty)}</span><strong>${escapeHtml(project.name)}</strong><small>EP.${episode.chapter} ${escapeHtml(episode.name)}</small></div>
    <p>${escapeHtml(project.summary)}</p>
    <div class="project-affinity"><b>추천 부서</b><span>${escapeHtml(recommended || "모든 부서")}</span><em>상성 피해 +18%</em></div>
    <div class="project-spec"><span>업무량 ${project.max}</span><span>마감 ${project.deadline}턴</span></div>
    <div class="project-reward">${locked ? `일반 프로젝트 ${bossProjectProgress()}/4 완료` : escapeHtml(reward)}</div>
    <button class="${project.boss ? "red" : "teal"}" data-project-id="${project.id}" ${locked ? "disabled" : ""}>${locked ? "보스 계약 잠김" : project.boss ? "장기 프로젝트 도전" : "계약 선택"}</button>
  </article>`;
}

function renderProjectBoard() {
  currentView = "projects";
  clearBattleTimer();
  clearOfficeDialogue();
  const regularCards = regularProjectOptions().map(project => projectCard(project)).join("");
  const tutorialPending = !state.tutorialBattleCompleted;
  const boss = tutorialPending ? null : nextBossProject();
  const bossCard = boss ? projectCard(boss, !bossProjectReady()) : "";
  const industry = currentIndustry();
  const episode = PROJECT_EPISODES[currentProjectChapter() - 1];
  const boardNotice = tutorialPending
    ? `${industry?.name || "회사"} 창립팀 첫 임무 · 전투 규칙을 배우고 면접을 해금하세요.`
    : `${industry?.name || "회사"} · EP.${episode.chapter} ${episode.name} · ${episode.description}`;
  app.innerHTML = `${header(tutorialPending ? "첫 프로젝트" : "프로젝트 선택", boardNotice)}
    <section class="screen project-board">
      <div class="project-list">${regularCards}${bossCard}</div>
      <button class="ink" id="back-from-projects">← 사무실</button>
    </section>`;
  document.querySelectorAll("[data-project-id]:not(:disabled)").forEach(button => button.addEventListener("click", () => startBattle(button.dataset.projectId)));
  document.querySelector("#back-from-projects").addEventListener("click", () => renderOffice());
}

function openEquipment(notice = "직원을 선택하고 장비를 장착하세요.") {
  currentView = "equipment";
  equipmentTargetId = state.employees.some(member => member.id === equipmentTargetId) ? equipmentTargetId : state.employees[0]?.id;
  renderEquipment(notice);
}

function renderEquipment(notice) {
  const target = state.employees.find(member => member.id === equipmentTargetId) || state.employees[0];
  if (!target) return renderOffice("장비를 사용할 직원이 없습니다.");
  saveGame();
  const stats = effectiveStats(target);
  const people = state.employees.map(member => {
    const selected = member.id === target.id;
    const department = DEPARTMENTS[member.department];
    return `<button class="equipment-person ${selected ? "active" : ""}" data-equipment-target="${member.id}" aria-pressed="${selected}" style="--department-color:${department.color}">
      <span class="equipment-person-portrait"><canvas width="24" height="24" data-portrait="${member.id}" data-portrait-crop="face" aria-label="${escapeHtml(member.name)} 얼굴"></canvas></span>
      <span class="equipment-person-copy"><small>${department.name}</small><strong>${escapeHtml(member.name)}</strong></span>
      ${selected ? `<i aria-hidden="true">✓</i>` : ""}
    </button>`;
  }).join("");
  const slots = Object.entries(EQUIPMENT_SLOTS).map(([slot, info]) => {
    const item = target.equipment[slot];
    return `<article class="equipment-slot ${item ? "filled" : ""}"><span style="${item ? `--rarity-color:${EQUIPMENT_RARITIES[item.rarity].color}` : ""}">${item ? equipmentIconMarkup(item) : info.icon}</span><div><small>${info.name}</small><strong>${item ? escapeHtml(item.name) : "비어 있음"}</strong>${item ? `<em style="color:${EQUIPMENT_RARITIES[item.rarity].color}">${EQUIPMENT_RARITIES[item.rarity].name} · 실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em>` : ""}</div>${item ? `<button class="ink" data-unequip="${item.id}">해제</button>` : ""}</article>`;
  }).join("");
  const inventory = state.equipment.length ? state.equipment.map(item => `<article class="equipment-item"><span style="--rarity-color:${EQUIPMENT_RARITIES[item.rarity].color}">${equipmentIconMarkup(item)}</span><div><strong>${escapeHtml(item.name)}</strong><small>${EQUIPMENT_RARITIES[item.rarity].name} ${EQUIPMENT_SLOTS[item.slot].name}</small><em>실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em></div><button class="teal" data-equip="${item.id}">장착</button></article>`).join("") : `<div class="empty-inventory">프로젝트를 완료하면 장비를 획득합니다.</div>`;
  app.innerHTML = `${header("장비 관리", `${target.name} · 실무 ${stats.work} · 협업 ${stats.collaboration} · ${notice}`)}<section class="screen equipment-screen">
    <div class="equipment-people">${people}</div>
    <div class="equipment-slots panel">${slots}</div>
    <p class="section-label">보관함 · ${state.equipment.length}</p>
    <div class="equipment-inventory">${inventory}</div>
    <button class="ink" id="back-from-equipment">← 사무실</button>
  </section>`;
  mountPortraits();
  mountEquipmentIcons();
  document.querySelectorAll("[data-equipment-target]").forEach(button => button.addEventListener("click", () => { equipmentTargetId = button.dataset.equipmentTarget; renderEquipment("장착 대상을 변경했습니다."); }));
  document.querySelectorAll("[data-equip]").forEach(button => button.addEventListener("click", () => equipItem(button.dataset.equip)));
  document.querySelectorAll("[data-unequip]").forEach(button => button.addEventListener("click", () => unequipItem(button.dataset.unequip)));
  document.querySelector("#back-from-equipment").addEventListener("click", () => renderOffice());
}

function equipItem(itemId) {
  const target = state.employees.find(member => member.id === equipmentTargetId);
  const index = state.equipment.findIndex(item => item.id === itemId);
  if (!target || index < 0) return renderEquipment("장착할 장비를 찾을 수 없습니다.");
  const item = state.equipment.splice(index, 1)[0];
  const replaced = target.equipment[item.slot];
  if (replaced) state.equipment.push(replaced);
  target.equipment[item.slot] = item;
  renderEquipment(replaced ? `${EQUIPMENT_SLOTS[item.slot].name} 장비를 교체했습니다.` : `${item.name}을(를) 장착했습니다.`);
}

function unequipItem(itemId) {
  const target = state.employees.find(member => member.id === equipmentTargetId);
  const slot = Object.keys(target?.equipment || {}).find(key => target.equipment[key]?.id === itemId);
  if (!target || !slot) return renderEquipment("해제할 장비를 찾을 수 없습니다.");
  state.equipment.push(target.equipment[slot]);
  target.equipment[slot] = null;
  renderEquipment("장비를 보관함으로 옮겼습니다.");
}

function rollRank(mode = "regular") {
  const roll = randomInt(100);
  if (mode === "special") {
    if (roll < 55) return 1;
    if (roll < 85) return 2;
    if (roll < 98) return 3;
    return 4;
  }
  if (roll < 60) return 0;
  if (roll < 90) return 1;
  if (roll < 99) return 2;
  return 3;
}

function generateCandidate(mode = "regular") {
  const rank = rollRank(mode);
  const bonus = RANKS[rank].bonus;
  const industryDepartments = currentIndustry()?.departments || RECRUITABLE_DEPARTMENTS;
  const outsideDepartments = RECRUITABLE_DEPARTMENTS.filter(department => !industryDepartments.includes(department) && !COMMON_DEPARTMENTS.includes(department));
  const departmentRoll = randomInt(100);
  const departments = departmentRoll < 70
    ? industryDepartments
    : departmentRoll < 90 ? COMMON_DEPARTMENTS : outsideDepartments.length ? outsideDepartments : industryDepartments;
  const candidate = employee(
    FAMILY[randomInt(FAMILY.length)] + GIVEN[randomInt(GIVEN.length)],
    departments[randomInt(departments.length)], TRAITS[randomInt(TRAITS.length)],
    8 + bonus + randomInt(7), 8 + bonus + randomInt(7), 8 + bonus + randomInt(7), randomInt(100000), rank
  );
  candidate.signingCost = candidate.salary + 100 + rank * 100;
  return candidate;
}

function openInterview(notice = "공고에 지원한 후보자의 능력과 조건을 비교하세요.") {
  if (!state.tutorialBattleCompleted) return renderOffice("첫 프로젝트를 완료하면 면접 기능이 열립니다.");
  currentView = "interview";
  if (recruitmentMode === "regular" && !regularPostingInitialized) {
    regularCandidates = generateCandidates(3, "regular");
    regularPostingInitialized = true;
  }
  if (recruitmentMode === "special" && state.specialRecruitmentTickets > 0 && specialCandidates.length === 0) specialCandidates = generateCandidates(5, "special");
  renderInterview(notice);
}

function generateCandidates(count, mode) {
  return Array.from({ length: count }, () => generateCandidate(mode));
}

function activeRecruitmentCandidates() {
  return recruitmentMode === "special" ? specialCandidates : regularCandidates;
}

function specialRecruitmentProgress() {
  if (state.projectClears < 5) return `${state.projectClears}/5`;
  return `${(state.projectClears - 5) % 10}/10`;
}

function switchRecruitmentMode(mode) {
  recruitmentMode = mode;
  if (mode === "regular" && !regularPostingInitialized) {
    regularCandidates = generateCandidates(3, "regular");
    regularPostingInitialized = true;
  }
  if (mode === "special" && state.specialRecruitmentTickets > 0 && specialCandidates.length === 0) specialCandidates = generateCandidates(5, "special");
  const notice = mode === "special"
    ? state.specialRecruitmentTickets > 0 ? "헤드헌팅권 1장으로 후보자 한 명을 채용할 수 있습니다." : "프로젝트를 성공해 특별채용 기회를 확보하세요."
    : "상시채용 공고에 지원한 후보자입니다.";
  renderInterview(notice);
}

function renderInterview(notice) {
  saveGame();
  const candidates = activeRecruitmentCandidates();
  const cards = candidates.map(candidate => {
    const department = DEPARTMENTS[candidate.department];
    const rank = RANKS[candidate.rank];
    return `<article class="candidate">
      <canvas width="24" height="24" data-candidate="${candidate.id}"></canvas>
      <div><h3>${escapeHtml(candidate.name)} <span class="rank" style="background:${rank.color}">${rank.name}</span></h3>
      <p class="dept">${department.name} · ${employeePosition(candidate)} · ${escapeHtml(candidate.trait)}</p>
      <p>실무 ${candidate.work}　협업 ${candidate.collaboration}　속도 ${candidate.speed}</p>
      <p>계약금 ${candidate.signingCost} · 월급 ${candidate.salary}</p></div>
      <button class="teal" data-hire="${candidate.id}">채용</button>
    </article>`;
  }).join("") || `<div class="empty-recruitment">${recruitmentMode === "special" ? `특별채용은 헤드헌팅권이 필요합니다.<br>현재 진행 ${specialRecruitmentProgress()}` : "현재 공고에 남은 지원자가 없습니다.<br>공고를 갱신하거나 프로젝트를 진행하세요."}</div>`;
  const refreshCost = state.postingRefreshes === POSTING_REFRESH_MAX ? 0 : PAID_POSTING_REFRESH_COST;
  const regularFooter = `<button class="mustard" id="refresh-posting" ${state.postingRefreshes <= 0 ? "disabled" : ""}>${state.postingRefreshes > 0 ? `공고 갱신 ${state.postingRefreshes}/${POSTING_REFRESH_MAX}${refreshCost > 0 ? ` · ${refreshCost}` : ""}` : "공고 갱신 완료"}</button>`;
  const specialFooter = `<button class="mustard" disabled>헤드헌팅권 ${state.specialRecruitmentTickets}장</button>`;
  const industry = currentIndustry();
  app.innerHTML = `${header("면접실", `${industry?.short || "회사"} 인재풀 · ${notice}`)}<section class="screen interview-screen">
    <div class="recruitment-tabs"><button class="${recruitmentMode === "regular" ? "active" : ""}" data-recruitment-mode="regular">상시채용</button><button class="${recruitmentMode === "special" ? "active" : ""}" data-recruitment-mode="special">특별채용 · ${state.specialRecruitmentTickets > 0 ? state.specialRecruitmentTickets + "장" : specialRecruitmentProgress()}</button></div>
    <div class="card-list">${cards}</div>
    <div class="footer-actions"><button class="ink" id="back-office">← 사무실</button>${recruitmentMode === "regular" ? regularFooter : specialFooter}</div>
  </section>`;
  document.querySelectorAll("[data-candidate]").forEach(canvas => drawPortrait(canvas, candidates.find(candidate => candidate.id === canvas.dataset.candidate)));
  document.querySelectorAll("[data-hire]").forEach(button => button.addEventListener("click", () => hireCandidate(button.dataset.hire)));
  document.querySelectorAll("[data-recruitment-mode]").forEach(button => button.addEventListener("click", () => switchRecruitmentMode(button.dataset.recruitmentMode)));
  document.querySelector("#back-office").addEventListener("click", () => renderOffice());
  document.querySelector("#refresh-posting")?.addEventListener("click", refreshJobPosting);
}

function hireCandidate(id) {
  const candidates = activeRecruitmentCandidates();
  const candidate = candidates.find(item => item.id === id);
  if (!candidate) return renderInterview("채용할 지원자를 찾을 수 없습니다.");
  if (state.employees.length >= state.capacity) return renderInterview("직원 정원이 가득 찼습니다. 사무실 확장이 필요합니다.");
  if (state.cash < candidate.signingCost) return renderInterview("계약금이 부족합니다. 프로젝트를 먼저 완료하세요.");
  state.cash -= candidate.signingCost;
  recordFinancialAmount("recruitment", candidate.signingCost);
  candidate.joinedAt = state.projectClears;
  state.employees.push(candidate);
  if (recruitmentMode === "special") {
    state.specialRecruitmentTickets = Math.max(0, state.specialRecruitmentTickets - 1);
    specialCandidates = state.specialRecruitmentTickets > 0 ? generateCandidates(5, "special") : [];
  } else {
    regularCandidates = regularCandidates.filter(item => item.id !== id);
  }
  renderInterview(`${candidate.name} 님을 채용했습니다.`);
}

function refreshJobPosting() {
  if (state.postingRefreshes <= 0) return renderInterview("다음 프로젝트 성공 시 공고 갱신 횟수가 회복됩니다.");
  const cost = state.postingRefreshes === POSTING_REFRESH_MAX ? 0 : PAID_POSTING_REFRESH_COST;
  if (state.cash < cost) return renderInterview(`공고 갱신에 필요한 자금 ${cost}이 부족합니다.`);
  state.cash -= cost;
  recordFinancialAmount("posting", cost);
  state.postingRefreshes -= 1;
  regularCandidates = generateCandidates(3, "regular");
  regularPostingInitialized = true;
  renderInterview(cost > 0 ? `자금 ${cost}을 사용해 채용 공고를 갱신했습니다.` : "채용 공고를 무료로 갱신했습니다.");
}

function openTeam() {
  currentView = "team";
  teamDraft = [...state.teamIds];
  renderTeam("참가할 직원 3명을 선택하세요. 속도가 높은 직원부터 행동합니다.");
}

function renderTeam(notice) {
  const selectedMembers = teamDraft.map(id => state.employees.find(member => member.id === id)).filter(Boolean);
  const actionOrder = orderedBattleTeam(selectedMembers, teamDraft);
  const actionOrderIds = actionOrder.map(member => member.id);
  const actionOrderSummary = actionOrder.length
    ? actionOrder.map((member, index) => `<span><i>${index + 1}</i><b>${escapeHtml(member.name)}</b><small>속도 ${member.speed} · 지시 +${directiveChargeFor(member)}</small></span>`).join("")
    : `<em>직원을 선택하면 예상 행동 순서가 표시됩니다.</em>`;
  const cards = state.employees.map(member => {
    const selectedIndex = teamDraft.indexOf(member.id);
    const actionIndex = actionOrderIds.indexOf(member.id);
    const stats = effectiveStats(member);
    return `<article class="team-card ${selectedIndex >= 0 ? "selected" : ""}">
      <canvas width="24" height="24" data-portrait="${member.id}"></canvas>
      <div><h3>${actionIndex >= 0 ? `<span class="order">${actionIndex + 1}</span>` : ""}${escapeHtml(member.name)}</h3>
      <p class="dept">${DEPARTMENTS[member.department].name} · ${employeePosition(member)} · ${escapeHtml(member.trait)}</p>
      <p>실무 ${stats.work}　협업 ${stats.collaboration}　속도 ${member.speed}</p>
      <p class="team-speed-effect">${actionIndex >= 0 ? `행동 ${actionIndex + 1}순위 · 긴급 지시 +${directiveChargeFor(member)}` : `긴급 지시 +${directiveChargeFor(member)}`}</p></div>
      <button class="${selectedIndex >= 0 ? "red" : "teal"}" data-toggle="${member.id}">${selectedIndex >= 0 ? "제외" : "선택"}</button>
    </article>`;
  }).join("");
  app.innerHTML = `${header("프로젝트 팀 편성", `선택 ${teamDraft.length}/3 · ${notice}`)}<section class="screen">
    <div class="team-order-preview panel"><small>예상 행동 순서</small><div>${actionOrderSummary}</div></div>
    <div class="card-list">${cards}</div>
    <div class="footer-actions"><button class="ink" id="cancel-team">취소</button><button class="mustard" id="save-team">편성 저장</button></div>
  </section>`;
  mountPortraits();
  document.querySelectorAll("[data-toggle]").forEach(button => button.addEventListener("click", () => toggleTeam(button.dataset.toggle)));
  document.querySelector("#cancel-team").addEventListener("click", () => renderOffice());
  document.querySelector("#save-team").addEventListener("click", saveTeam);
}

function toggleTeam(id) {
  const index = teamDraft.indexOf(id);
  if (index >= 0) teamDraft.splice(index, 1);
  else if (teamDraft.length < 3) teamDraft.push(id);
  else return renderTeam("프로젝트에는 3명만 참가할 수 있습니다.");
  renderTeam("속도가 같으면 선택 순서가 우선합니다.");
}

function saveTeam() {
  if (teamDraft.length !== 3) return renderTeam("프로젝트 참가자는 정확히 3명이어야 합니다.");
  state.teamIds = [...teamDraft];
  renderOffice("프로젝트 팀 편성을 저장했습니다.");
}

function startBattle(projectId) {
  currentView = "battle";
  const tutorialMode = !state.tutorialBattleCompleted;
  const selectedSource = [...PROJECTS, ...BOSS_PROJECTS].find(project => project.id === projectId) || PROJECTS[0];
  const source = tutorialMode ? tutorialProjectSource() : selectedSource;
  if (source.boss && !bossProjectReady()) return renderProjectBoard();
  const project = scaledProject(source);
  battle = {
    project,
    max: project.max, workload: project.max, action: 0, deadline: project.deadline, momentum: 0, requirements: false,
    result: null, rewardClaimed: false, log: "업무 분담을 시작합니다.", status: null,
    eventText: "", nextEventRound: tutorialMode ? Number.POSITIVE_INFINITY : project.eventEvery, eventCursor: randomInt(4), preparedRound: 0,
    directiveGauge: 50, awaitingDirective: false, directiveReason: "", directiveSelections: {}, directiveFocusId: null, directiveCooldowns: {},
    thresholdSeventy: false, thresholdForty: false, phase: 1, phaseAnnouncement: "",
    deadlineBonus: 0, automationDamage: 0, automationTurns: 0, skillFx: null, confirmingLeave: false,
    tutorialMode, tutorialPage: tutorialMode ? 0 : null, tutorialSkipped: false, tutorialDirectiveExplained: false, tutorialReplay: false, tutorialUnlock: false
  };
  renderBattle();
  if (!tutorialMode) battleTimer = window.setTimeout(battleStep, 900);
}

function clearBattleTimer() {
  if (battleTimer !== null) window.clearTimeout(battleTimer);
  battleTimer = null;
}

function battleStep() {
  if (currentView !== "battle" || battle.result || battle.awaitingDirective || battle.skillFx || battle.tutorialPage !== null) return;
  const team = orderedBattleTeam();
  const member = team[battle.action % team.length];
  const round = Math.floor(battle.action / team.length) + 1;
  if (battle.action % team.length === 0 && battle.preparedRound !== round) {
    battle.preparedRound = round;
    advanceBattleStatus();
    battle.eventText = "";
    if (battle.automationTurns > 0) {
      const automationResult = battle.tutorialMode ? battle.automationDamage : rollDamage(battle.automationDamage);
      battle.workload = Math.max(0, battle.workload - automationResult);
      battle.automationTurns -= 1;
      battle.eventText = `✓ 자동화 배포! 업무량 ${automationResult} 처리`;
      checkWorkloadThresholds();
      if (battle.workload <= 0) return finishBattleSuccess();
    }
    if (round >= battle.nextEventRound) {
      triggerBattleEvent();
      battle.nextEventRound += battle.project.eventEvery;
    }
    if (battle.directiveGauge >= 100) return openDirective();
  }
  const stats = effectiveStats(member);
  let damage = Math.round(stats.work * .72 + stats.collaboration * .25);
  let skill = "집중 업무";
  const archetype = departmentArchetype(member.department);
  if (archetype === "sales") {
    battle.requirements = true;
    damage += 5;
    skill = "요구사항 정리";
  } else if (archetype === "pm") {
    battle.momentum += 4;
    damage += battle.momentum;
    skill = "업무 조율";
  } else if (archetype === "dev") {
    if (battle.requirements) damage += 8;
    damage += battle.momentum;
    skill = "집중 처리";
  } else if (archetype === "finance") {
    damage += 4;
    skill = "리스크 관리";
  }
  const affinity = hasProjectAffinity(member, battle.project);
  if (affinity) damage = Math.round(damage * 1.18);
  if (battle.status) {
    damage = Math.round(damage * battle.status.efficiency) + battle.status.flat;
  }
  damage = battle.tutorialMode ? Math.max(1, damage) : rollDamage(Math.max(1, damage));
  battle.workload = Math.max(0, battle.workload - damage);
  const eventLine = battle.eventText ? `${battle.eventText}\n` : "";
  const directiveCharge = directiveChargeFor(member);
  battle.log = `${eventLine}${member.name}의 ${skill}! 업무량 ${damage} 처리${affinity ? " · 부서 상성!" : ""} · 속도 지시 +${directiveCharge}`;
  battle.eventText = "";
  battle.action += 1;
  addDirectiveGauge(directiveCharge, `${member.name}의 빠른 대응으로 긴급 지시가 충전됐습니다.`);
  checkWorkloadThresholds();
  animatePacket(member.department, battle.action % 3);
  updateBattleNumbers(round);

  if (battle.workload <= 0) return finishBattleSuccess();
  if (battle.directiveGauge >= 100) return openDirective();
  if (round >= battle.deadline && battle.action % team.length === 0) {
    battle.result = "failure";
    battle.log = "마감을 넘겼습니다. 팀을 재편성해 다시 도전하세요.";
    battleTimer = window.setTimeout(renderBattle, 650);
    return;
  }
  battleTimer = window.setTimeout(battleStep, 950);
}

function finishBattleSuccess(scheduleRender = true) {
  battle.result = "success";
  battle.workload = 0;
  if (!battle.rewardClaimed) {
    battle.rewardClaimed = true;
    state.cash += battle.project.cash;
    recordFinancialAmount("revenue", battle.project.cash);
    state.reputation += battle.project.reputation;
    state.projectClears += 1;
    if (battle.project.boss) state.bossClears += 1;
    if (battle.tutorialMode && !state.tutorialBattleCompleted) {
      state.tutorialBattleCompleted = true;
      battle.tutorialUnlock = true;
    }
    const payroll = processPayrollIfDue();
    state.postingRefreshes = POSTING_REFRESH_MAX;
    const specialUnlocked = state.projectClears === 5 || (state.projectClears > 5 && (state.projectClears - 5) % 10 === 0);
    if (specialUnlocked) {
      state.specialRecruitmentTickets += 1;
      specialCandidates = [];
    }
    battle.recruitmentNotice = battle.tutorialUnlock
      ? "면접 기능 해금! 이제 새로운 직원을 채용할 수 있습니다."
      : specialUnlocked ? "헤드헌팅권 1장 획득!" : `공고 갱신 ${POSTING_REFRESH_MAX}/${POSTING_REFRESH_MAX} 회복`;
    battle.payrollNotice = payroll ? `급여 정산 -${payroll}만원 · 현재 현금 ${state.cash}만원` : "";
    battle.rewards = battle.project.boss
      ? [generateEquipmentReward(2), generateEquipmentReward(2)]
      : [generateEquipmentReward()];
    battle.reward = battle.rewards[0];
    state.equipment.push(...battle.rewards);
    const financialReport = closeFinancialPeriodIfDue();
    battle.financialNotice = financialReport ? `${financialReport.number}분기 결산이 준비됐습니다.` : "";
    const turnoverMember = maybeQueueTurnoverEvent();
    battle.turnoverNotice = turnoverMember ? `${turnoverMember.name}이(가) 이직 면담을 요청했습니다.` : "";
    saveGame();
  }
  if (scheduleRender) battleTimer = window.setTimeout(renderBattle, 650);
}

function addDirectiveGauge(amount, reason) {
  battle.directiveGauge = Math.min(100, battle.directiveGauge + amount);
  if (battle.directiveGauge >= 100) battle.directiveReason = reason;
}

function checkWorkloadThresholds() {
  const ratio = battle.workload / battle.max;
  if (!battle.thresholdSeventy && ratio <= .70) {
    battle.thresholdSeventy = true;
    if (battle.project.boss) {
      battle.phase = 2;
      battle.phaseAnnouncement = `PHASE 2 · ${battle.project.phaseNames[1]}`;
      battle.log = battle.phaseAnnouncement;
      addDirectiveGauge(40, "보스 프로젝트가 두 번째 단계로 전환됐습니다.");
    } else {
      addDirectiveGauge(30, "프로젝트의 첫 약점이 노출됐습니다.");
    }
  }
  if (!battle.thresholdForty && ratio <= .40) {
    battle.thresholdForty = true;
    if (battle.project.boss) {
      battle.phase = 3;
      battle.phaseAnnouncement = `FINAL PHASE · ${battle.project.phaseNames[2]}`;
      battle.log = battle.phaseAnnouncement;
      addDirectiveGauge(50, "보스 프로젝트의 최종 단계가 시작됐습니다.");
    } else {
      addDirectiveGauge(30, "프로젝트의 핵심 약점이 노출됐습니다.");
    }
  }
}

function openDirective() {
  clearBattleTimer();
  const team = orderedBattleTeam();
  ensureDirectiveAvailability(team);
  battle.awaitingDirective = true;
  battle.directiveSelections = {};
  battle.directiveFocusId = team[0]?.id || null;
  battle.log = `긴급 지시 · ${battle.directiveReason || "스킬을 선택하세요."}`;
  if (battle.tutorialMode && !battle.tutorialSkipped && !battle.tutorialDirectiveExplained) {
    battle.tutorialDirectiveExplained = true;
    battle.tutorialPage = 3;
  }
  renderBattle();
}

function directivePanel(team) {
  if (!battle.awaitingDirective) return "";
  const calculating = battle.skillFx?.phase === "calculating";
  const focus = team.find(member => member.id === battle.directiveFocusId) || team[0];
  const selectedCount = Object.keys(battle.directiveSelections).length;
  const plan = directivePlanEstimate(team);
  const tabs = team.map(member => {
    const selected = battle.directiveSelections[member.id];
    return `<button class="directive-tab ${member.id === focus.id ? "active" : ""} ${selected ? "done" : ""}" data-directive-member="${member.id}" ${calculating ? "disabled" : ""}>${selected ? "✓ " : ""}${escapeHtml(member.name)}</button>`;
  }).join("");
  const options = directiveSkillsFor(focus.department).map(skill => {
    const preview = directiveSkillPreview(focus, skill.id);
    const selected = battle.directiveSelections[focus.id] === skill.id;
    const cooldown = directiveCooldownFor(focus.id, skill.id);
    const cooldownText = cooldown ? `대기 ${cooldown}회` : `재사용 ${skill.cooldown}회`;
    return `<button class="skill-option effect-${preview.tone} ${selected ? "selected" : ""} ${cooldown ? "cooling" : ""}" data-directive-skill="${skill.id}" data-member-id="${focus.id}" aria-pressed="${selected}" ${cooldown || calculating ? "disabled" : ""}><span class="skill-effect"><i>${preview.icon}</i><b>${escapeHtml(preview.primary)}</b></span><strong>${escapeHtml(skill.name)}</strong><span>${escapeHtml(preview.secondary)}</span><small class="skill-cooldown ${cooldown ? "waiting" : ""}">${cooldownText}</small><em>${escapeHtml(skill.visual)}</em></button>`;
  }).join("");
  const summary = directiveExecutionTeam(team).map(member => {
    const skill = directiveSkillsFor(member.department).find(option => option.id === battle.directiveSelections[member.id]);
    return skill ? skill.name : "미선택";
  }).join(" → ");
  const ready = selectedCount === team.length && !calculating;
  const actionText = calculating ? "계획 분석 중…" : ready ? "계획 실행" : `${team.length - selectedCount}명 스킬 선택`;
  const actionDetail = calculating
    ? "처리량 · 연계 · 변수 확인 중"
    : ready
    ? `예상 업무량 ${plan.min}~${plan.max} 처리${plan.combo ? ` · ${plan.combo} 연계` : ""}`
    : "모든 직원의 스킬을 선택하면 실행할 수 있습니다.";
  return `<div class="directive-panel"><div class="directive-head"><div><strong>긴급 지시</strong><small>직원별 스킬을 고른 뒤 계획을 실행하세요.</small></div><b>${selectedCount}/${team.length}</b></div><div class="directive-tabs">${tabs}</div><div class="skill-options">${options}</div><div class="directive-footer"><div class="directive-plan-summary"><small>선택 계획</small><span>${escapeHtml(summary)}</span></div><button id="execute-directive" class="mustard execute-directive" ${ready ? "" : "disabled"}><strong>${actionText}</strong><small>${escapeHtml(actionDetail)}</small></button></div></div>`;
}

function directiveExecutionTeam(team) {
  return [...team].sort((left, right) => {
    const leftSupport = DIRECTIVE_SUPPORT_SKILLS.has(battle.directiveSelections[left.id]);
    const rightSupport = DIRECTIVE_SUPPORT_SKILLS.has(battle.directiveSelections[right.id]);
    return Number(rightSupport) - Number(leftSupport);
  });
}

function directivePlanEstimate(team) {
  let total = 0;
  let requirements = battle.requirements;
  let deadlineBonus = battle.deadlineBonus;
  const skills = team.map(member => battle.directiveSelections[member.id]).filter(Boolean);
  directiveExecutionTeam(team).forEach(member => {
    const stats = effectiveStats(member);
    const skill = battle.directiveSelections[member.id];
    if (skill === "requirement-brief") { requirements = true; total += 8 + Math.floor(stats.collaboration / 2); }
    else if (skill === "client-persuasion") total += 6 + Math.floor(stats.collaboration / 2);
    else if (skill === "contract-close") total += 15 + stats.work + (requirements ? 10 : 0);
    else if (skill === "schedule-shift") { if (deadlineBonus < 2) deadlineBonus += 1; total += 6 + Math.floor(stats.collaboration / 3); }
    else if (skill === "work-allocation") total += 8 + stats.collaboration;
    else if (skill === "emergency-command") total += 8 + team.length * 3;
    else if (skill === "focus-development") total += 16 + stats.work + (requirements ? 8 : 0);
    else if (skill === "automation-deploy") total += 8;
    else if (skill === "night-shift") total += 24 + stats.work;
    else if (skill === "budget-approval") total += 6 + Math.floor(member.speed / 2);
    else if (skill === "cost-defense") total += 7 + Math.floor(stats.collaboration / 2);
    else if (skill === "emergency-approval") { if (deadlineBonus < 2) deadlineBonus += 1; total += 12 + member.speed; }
  });
  let combo = "";
  if (skills.includes("requirement-brief") && skills.includes("focus-development")) { total += 18; combo = "명확한 목표"; }
  else if (skills.includes("work-allocation") && skills.includes("automation-deploy")) { total += 14; combo = "완벽한 업무 흐름"; }
  if (skills.includes("emergency-command") || skills.includes("budget-approval")) total = Math.round(total * 1.2);
  const range = battle.tutorialMode
    ? { min: total, max: total }
    : damageRange(total, DIRECTIVE_DAMAGE_VARIANCE);
  return { total, min: range.min, max: range.max, combo };
}

function withDirectiveRange(preview) {
  const range = battle.tutorialMode
    ? { min: preview.damage || 0, max: preview.damage || 0 }
    : damageRange(preview.damage || 0, DIRECTIVE_DAMAGE_VARIANCE);
  const repeatRange = battle.tutorialMode
    ? { min: preview.repeat || 0, max: preview.repeat || 0 }
    : damageRange(preview.repeat || 0, NORMAL_DAMAGE_VARIANCE);
  return { ...preview, damageMin: range.min, damageMax: range.max, repeatMin: repeatRange.min, repeatMax: repeatRange.max };
}

function directiveSkillPreview(member, skillId) {
  const stats = effectiveStats(member);
  const badStatus = battle.status && battle.status.tone === "bad";
  if (skillId === "requirement-brief") {
    const damage = 8 + Math.floor(stats.collaboration / 2);
    return withDirectiveRange({ icon: "◎", tone: "mark", target: "project", primary: damageRangeText(damage), secondary: "약점 노출 · 연계 강화", damage });
  }
  if (skillId === "client-persuasion") {
    const damage = 6 + Math.floor(stats.collaboration / 2);
    return withDirectiveRange({ icon: "◇", tone: "cleanse", target: badStatus ? "status" : "project", primary: badStatus ? "상태 제거" : damageRangeText(damage), secondary: `불리한 효과 해제 · ${damageRangeText(damage)}`, damage });
  }
  if (skillId === "contract-close") {
    const damage = 15 + stats.work + (battle.requirements ? 10 : 0);
    return withDirectiveRange({ icon: "✦", tone: "damage", target: "project", primary: damageRangeText(damage), secondary: battle.requirements ? "약점 보너스 +10 적용" : "약점 노출 시 +10", damage });
  }
  if (skillId === "schedule-shift") {
    const damage = 6 + Math.floor(stats.collaboration / 3);
    const available = battle.deadlineBonus < 2;
    return withDirectiveRange({ icon: "＋", tone: "time", target: "deadline", primary: available ? "마감 +1턴" : "연장 한도", secondary: `${damageRangeText(damage)} · 최대 2회`, damage, deadline: available ? 1 : 0 });
  }
  if (skillId === "work-allocation") {
    const damage = 8 + stats.collaboration;
    return withDirectiveRange({ icon: "↗", tone: "team", target: "team", primary: "전원 강화", secondary: `모멘텀 +8 · ${damageRangeText(damage)}`, damage });
  }
  if (skillId === "emergency-command") {
    const damage = 8 + currentTeam().length * 3;
    return withDirectiveRange({ icon: "×", tone: "boost", target: "team", primary: "전체 ×1.2", secondary: `모든 지시 강화 · ${damageRangeText(damage)}`, damage });
  }
  if (skillId === "focus-development") {
    const damage = 16 + stats.work + (battle.requirements ? 8 : 0);
    return withDirectiveRange({ icon: "◆", tone: "damage", target: "project", primary: damageRangeText(damage), secondary: battle.requirements ? "약점 보너스 +8 적용" : "약점 노출 시 +8", damage });
  }
  if (skillId === "automation-deploy") {
    const repeat = 8 + Math.floor(stats.work / 2);
    const immediate = battle.tutorialMode ? { min: 8, max: 8 } : damageRange(8, DIRECTIVE_DAMAGE_VARIANCE);
    const lasting = battle.tutorialMode ? { min: repeat, max: repeat } : damageRange(repeat, NORMAL_DAMAGE_VARIANCE);
    const immediateText = immediate.min === immediate.max ? String(immediate.min) : `${immediate.min}~${immediate.max}`;
    const lastingText = lasting.min === lasting.max ? String(lasting.min) : `${lasting.min}~${lasting.max}`;
    return withDirectiveRange({ icon: "↻", tone: "lasting", target: "project", primary: `즉시 -${immediateText}`, secondary: `이후 2턴 × -${lastingText}`, damage: 8, repeat });
  }
  if (skillId === "night-shift") {
    const damage = 24 + stats.work;
    return withDirectiveRange({ icon: "⚡", tone: "damage", target: "project", primary: damageRangeText(damage), secondary: "강력한 단일 처리", damage });
  }
  if (skillId === "budget-approval") {
    const damage = 6 + Math.floor(member.speed / 2);
    return withDirectiveRange({ icon: "×", tone: "boost", target: "team", primary: "전체 ×1.2", secondary: `모든 지시 강화 · ${damageRangeText(damage)}`, damage });
  }
  if (skillId === "cost-defense") {
    const damage = 7 + Math.floor(stats.collaboration / 2);
    return withDirectiveRange({ icon: "▣", tone: "cleanse", target: badStatus ? "status" : "project", primary: badStatus ? "상태 제거" : damageRangeText(damage), secondary: `불리한 효과 해제 · ${damageRangeText(damage)}`, damage });
  }
  if (skillId === "emergency-approval") {
    const damage = 12 + member.speed;
    const available = battle.deadlineBonus < 2;
    return withDirectiveRange({ icon: "＋", tone: "time", target: "deadline", primary: available ? "마감 +1턴" : damageRangeText(damage), secondary: `${damageRangeText(damage)}${available ? " · 마감 연장" : " · 연장 한도"}`, damage, deadline: available ? 1 : 0 });
  }
  return withDirectiveRange({ icon: "◆", tone: "damage", target: "project", primary: "효과 확인", secondary: "업무를 처리합니다.", damage: 0 });
}

function activeDirectivePreview(team) {
  if (!battle.awaitingDirective) return null;
  const focus = team.find(member => member.id === battle.directiveFocusId) || team[0];
  const skillId = battle.directiveSelections[focus.id];
  if (!skillId) return null;
  const skill = directiveSkillsFor(focus.department).find(option => option.id === skillId);
  return { member: focus, skill, ...directiveSkillPreview(focus, skillId) };
}

function directivePreviewOverlay(preview) {
  if (!preview) return "";
  return `<div class="effect-preview effect-${preview.tone} target-${preview.target}"><i>${preview.icon}</i><div><small>${escapeHtml(preview.member.name)} · ${escapeHtml(preview.skill.name)}</small><strong>${escapeHtml(preview.primary)}</strong><span>${escapeHtml(preview.secondary)}</span></div></div>`;
}

function directiveSkillsFor(department) {
  return DIRECTIVE_SKILLS[departmentArchetype(department)];
}

function directiveCooldownFor(memberId, skillId) {
  return battle.directiveCooldowns?.[memberId]?.[skillId] || 0;
}

function setDirectiveCooldown(memberId, skillId, value) {
  if (!battle.directiveCooldowns[memberId]) battle.directiveCooldowns[memberId] = {};
  battle.directiveCooldowns[memberId][skillId] = Math.max(0, value);
}

function tickDirectiveCooldowns(team) {
  team.forEach(member => {
    directiveSkillsFor(member.department).forEach(skill => {
      const remaining = directiveCooldownFor(member.id, skill.id);
      if (remaining > 0) setDirectiveCooldown(member.id, skill.id, remaining - 1);
    });
  });
}

function ensureDirectiveAvailability(team) {
  team.forEach(member => {
    const skills = directiveSkillsFor(member.department);
    if (skills.some(skill => directiveCooldownFor(member.id, skill.id) === 0)) return;
    const earliest = skills.reduce((best, skill) => directiveCooldownFor(member.id, skill.id) < directiveCooldownFor(member.id, best.id) ? skill : best, skills[0]);
    setDirectiveCooldown(member.id, earliest.id, 0);
  });
}

function selectDirectiveMember(id) {
  battle.directiveFocusId = id;
  renderBattle();
}

function selectDirectiveSkill(memberId, skillId) {
  if (directiveCooldownFor(memberId, skillId) > 0) return;
  battle.directiveSelections[memberId] = skillId;
  battle.directiveFocusId = memberId;
  renderBattle();
}

function clearNegativeBattleStatus() {
  if (!battle.status || battle.status.tone === "good") return false;
  battle.status = null;
  return true;
}

function executeDirective() {
  const team = orderedBattleTeam();
  if (battle.skillFx) return;
  if (team.some(member => !battle.directiveSelections[member.id])) return;
  if (team.some(member => directiveCooldownFor(member.id, battle.directiveSelections[member.id]) > 0)) return;
  const plan = directivePlanEstimate(team);
  battle.log = "계획 실행 중 · 처리량을 계산하고 있습니다.";
  battle.skillFx = {
    phase: "calculating",
    title: "계획 분석 중",
    detail: "처리량 · 연계 · 변수 확인",
    outcome: "normal",
    range: plan
  };
  renderBattle();
  let calculationTick = 0;
  const calculationSpan = Math.max(1, plan.max - plan.min + 1);
  const calculationTicker = window.setInterval(() => {
    const readout = document.querySelector("#calculation-value");
    if (!readout) return;
    const offset = (calculationTick * 7 + calculationTick * calculationTick * 3) % calculationSpan;
    readout.textContent = String(plan.min + offset);
    calculationTick += 1;
  }, 95);
  window.setTimeout(() => {
    window.clearInterval(calculationTicker);
    if (currentView !== "battle" || battle.skillFx?.phase !== "calculating") return;
    resolveDirective();
  }, 1300);
}

function resolveDirective() {
  const team = orderedBattleTeam();
  const skills = Object.values(battle.directiveSelections);
  let total = 0;
  let cleared = false;
  const boosted = skills.includes("emergency-command") || skills.includes("budget-approval");
  directiveExecutionTeam(team).forEach(member => {
    const stats = effectiveStats(member);
    const skill = battle.directiveSelections[member.id];
    if (skill === "requirement-brief") { battle.requirements = true; total += 8 + Math.floor(stats.collaboration / 2); }
    else if (skill === "client-persuasion") { cleared = clearNegativeBattleStatus() || cleared; total += 6 + Math.floor(stats.collaboration / 2); }
    else if (skill === "contract-close") total += 15 + stats.work + (battle.requirements ? 10 : 0);
    else if (skill === "schedule-shift") { if (battle.deadlineBonus < 2) { battle.deadline += 1; battle.deadlineBonus += 1; } total += 6 + Math.floor(stats.collaboration / 3); }
    else if (skill === "work-allocation") { battle.momentum += 8; total += 8 + stats.collaboration; }
    else if (skill === "emergency-command") total += 8 + team.length * 3;
    else if (skill === "focus-development") total += 16 + stats.work + (battle.requirements ? 8 : 0);
    else if (skill === "automation-deploy") { battle.automationDamage = 8 + Math.floor(stats.work / 2); battle.automationTurns = 2; total += 8; }
    else if (skill === "night-shift") total += 24 + stats.work;
    else if (skill === "budget-approval") total += 6 + Math.floor(member.speed / 2);
    else if (skill === "cost-defense") { cleared = clearNegativeBattleStatus() || cleared; total += 7 + Math.floor(stats.collaboration / 2); }
    else if (skill === "emergency-approval") { if (battle.deadlineBonus < 2) { battle.deadline += 1; battle.deadlineBonus += 1; } total += 12 + member.speed; }
  });
  let combo = "";
  if (skills.includes("requirement-brief") && skills.includes("focus-development")) { total += 18; combo = "명확한 목표"; }
  else if (skills.includes("work-allocation") && skills.includes("automation-deploy")) { total += 14; battle.automationTurns += 1; combo = "완벽한 업무 흐름"; }
  if (boosted) total = Math.round(total * 1.2);
  const expected = battle.tutorialMode
    ? { min: total, max: total }
    : damageRange(total, DIRECTIVE_DAMAGE_VARIANCE);
  const actualTotal = battle.tutorialMode ? total : rollDamage(total, DIRECTIVE_DAMAGE_VARIANCE);
  battle.workload = Math.max(0, battle.workload - actualTotal);
  tickDirectiveCooldowns(team);
  team.forEach(member => {
    const skillId = battle.directiveSelections[member.id];
    const skill = directiveSkillsFor(member.department).find(option => option.id === skillId);
    setDirectiveCooldown(member.id, skillId, skill?.cooldown || 1);
  });
  battle.directiveGauge = 0;
  battle.awaitingDirective = false;
  battle.directiveReason = "";
  checkWorkloadThresholds();
  const outcome = actualTotal >= Math.round(total * 1.1) ? "great" : actualTotal <= Math.round(total * .9) ? "low" : "normal";
  const varianceResult = outcome === "great" ? " · GREAT!" : outcome === "low" ? " · 변동 최소" : "";
  const detail = `업무량 ${actualTotal} 처리 · 예상 ${expected.min}~${expected.max}${varianceResult}${combo ? ` · ${combo} 연계` : ""}${cleared ? " · 상태 제거" : ""}`;
  battle.log = `PERFECT WORKFLOW! ${detail}`;
  battle.skillFx = { phase: "result", title: combo || "PERFECT WORKFLOW", detail, outcome };
  if (battle.workload <= 0) finishBattleSuccess(false);
  else if (Math.floor(battle.action / team.length) >= battle.deadline && battle.action % team.length === 0) {
    battle.result = "failure";
    battle.log = "마감 직전 긴급 지시로도 업무를 끝내지 못했습니다.";
  }
  renderBattle();
  window.setTimeout(() => {
    if (currentView !== "battle") return;
    battle.skillFx = null;
    renderBattle();
    if (!battle.result) battleTimer = window.setTimeout(battleStep, 650);
  }, 2100);
}

function advanceBattleStatus() {
  if (!battle.status) return;
  battle.status.turns -= 1;
  if (battle.status.turns <= 0) battle.status = null;
}

function triggerBattleEvent() {
  const event = battle.eventCursor % 4;
  battle.eventCursor += 1;
  if (event === 0) {
    const added = 12;
    battle.workload = Math.min(battle.max + 30, battle.workload + added);
    battle.requirements = false;
    battle.status = { name: "재작업", turns: 1, efficiency: .9, flat: 0, tone: "bad" };
    battle.eventText = `⚠ 요구사항 변경! 업무량 +${added}`;
    addDirectiveGauge(20, "요구사항 변경에 대응해야 합니다.");
  } else if (event === 1) {
    battle.status = { name: "긴급회의", turns: 1, efficiency: .75, flat: 0, tone: "bad" };
    battle.eventText = "⚠ 긴급회의! 오늘 업무 효율 -25%";
    addDirectiveGauge(20, "긴급회의 대응이 필요합니다.");
  } else if (event === 2) {
    battle.status = { name: "예산 압박", turns: 2, efficiency: 1, flat: -3, tone: "bad" };
    battle.eventText = "⚠ 예산 삭감! 2턴 동안 처리량 -3";
    addDirectiveGauge(20, "예산 삭감에 대응해야 합니다.");
  } else {
    battle.momentum += 4;
    battle.status = { name: "합의 완료", turns: 2, efficiency: 1, flat: 4, tone: "good" };
    battle.eventText = "✓ 고객의 빠른 승인! 2턴 동안 처리량 +4";
    addDirectiveGauge(12, "고객 승인을 활용할 기회입니다.");
  }
}

function equipmentRewardCard(reward) {
  const rarity = EQUIPMENT_RARITIES[reward.rarity];
  const sparkle = reward.rarity >= 2 ? `<span class="reward-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i></span>` : "";
  return `<article class="reward-item rarity-${reward.rarity} ${reward.rarity >= 2 ? "good-drop" : ""}" style="--rarity-color:${rarity.color}">${sparkle}<span class="reward-icon">${equipmentIconMarkup(reward)}</span><div><small>${rarity.name} · ${EQUIPMENT_SLOTS[reward.slot].name}</small><strong>${escapeHtml(reward.name)}</strong><em>실무 +${reward.workBonus} · 협업 +${reward.collaborationBonus}</em></div></article>`;
}

function normalDamagePreview(member) {
  const stats = effectiveStats(member);
  const archetype = departmentArchetype(member.department);
  let damage = Math.round(stats.work * .72 + stats.collaboration * .25);
  if (archetype === "sales") damage += 5;
  else if (archetype === "pm") damage += battle.momentum + 4;
  else if (archetype === "dev") damage += (battle.requirements ? 8 : 0) + battle.momentum;
  else if (archetype === "finance") damage += 4;
  if (hasProjectAffinity(member, battle.project)) damage = Math.round(damage * 1.18);
  if (battle.status) damage = Math.round(damage * battle.status.efficiency) + battle.status.flat;
  if (battle.tutorialMode) return { min: Math.max(1, damage), max: Math.max(1, damage) };
  return damageRange(Math.max(1, damage), NORMAL_DAMAGE_VARIANCE);
}

function battleTutorialPages(team) {
  const actionOrder = team.map((member, index) => `<span><i>${index + 1}</i><b>${escapeHtml(member.name)}</b><small>${DEPARTMENTS[member.department].short} · 속도 ${member.speed} · 지시 +${directiveChargeFor(member)}</small></span>`).join("");
  return [
    {
      kicker: "BATTLE GUIDE 1",
      title: "업무량을 마감 전에 끝내세요",
      body: `프로젝트 업무량 <b>${battle.max}</b>을 0으로 만들면 성공합니다. <b>${battle.deadline}턴</b>이 끝나기 전에 창립팀의 업무를 연결하세요.`,
      detail: `<div class="tutorial-rule-grid"><span><small>승리 조건</small><strong>업무량 0</strong></span><span><small>제한 조건</small><strong>마감 ${battle.deadline}턴</strong></span></div>`
    },
    {
      kicker: "BATTLE GUIDE 2",
      title: "세 능력치는 역할이 다릅니다",
      body: "직원의 장점을 조합하면 같은 세 명으로도 전투 흐름이 달라집니다.",
      detail: `<div class="tutorial-stat-list"><span><b>실무</b><small>평상시 직접 업무 처리량</small></span><span><b>협업</b><small>지원·연계 스킬 효과</small></span><span><b>속도</b><small>행동 순서와 긴급 지시 충전량</small></span></div>`
    },
    {
      kicker: "BATTLE GUIDE 3",
      title: "빠른 직원부터 행동합니다",
      body: "먼저 사용된 지원 효과만 뒤의 공격에 적용됩니다. 속도가 같은 직원은 팀 편성에서 먼저 선택한 순서로 행동합니다.",
      detail: `<div class="tutorial-action-order">${actionOrder}</div>`
    },
    {
      kicker: "DIRECTIVE GUIDE",
      title: "긴급 지시는 하나의 계획입니다",
      body: "직원 세 명의 스킬을 모두 고르면 지원 효과를 먼저 계산하고 공격 효과와 연계 보너스를 적용합니다. 이때는 속도 순서 때문에 연계가 끊기지 않습니다.",
      detail: `<div class="tutorial-directive-flow"><span><i>1</i><b>지원 효과</b></span><span><i>2</i><b>공격 효과</b></span><span><i>3</i><b>연계 보너스</b></span></div>`
    }
  ];
}

function battleTutorialOverlay(team) {
  if (battle.tutorialPage === null || battle.tutorialPage === undefined) return "";
  const pages = battleTutorialPages(team);
  const page = pages[battle.tutorialPage] || pages[0];
  const replay = battle.tutorialReplay;
  const contextualDirective = battle.awaitingDirective && battle.tutorialPage === 3;
  const maxPage = replay ? pages.length - 1 : contextualDirective ? 3 : 2;
  const lastPage = battle.tutorialPage >= maxPage;
  const actionLabel = lastPage ? contextualDirective ? "스킬 선택하기" : replay ? "전투로 돌아가기" : "전투 시작" : "다음";
  const skip = battle.tutorialMode && !replay && !contextualDirective
    ? `<button class="ink" id="skip-battle-tutorial">설명 건너뛰기</button>` : "";
  return `<div class="battle-tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="battle-tutorial-title"><article class="battle-tutorial panel"><small>${page.kicker}</small><strong id="battle-tutorial-title">${page.title}</strong><p>${page.body}</p>${page.detail}<div class="battle-tutorial-actions">${skip}<button class="mustard" id="next-battle-tutorial">${actionLabel}</button></div></article></div>`;
}

function closeBattleTutorial(skipped = false) {
  if (skipped) battle.tutorialSkipped = true;
  battle.tutorialPage = null;
  battle.tutorialReplay = false;
  renderBattle();
  if (!battle.awaitingDirective && !battle.result && !battle.skillFx) battleTimer = window.setTimeout(battleStep, 650);
}

function advanceBattleTutorial() {
  const contextualDirective = battle.awaitingDirective && battle.tutorialPage === 3;
  const maxPage = battle.tutorialReplay ? 3 : contextualDirective ? 3 : 2;
  if (battle.tutorialPage < maxPage) {
    battle.tutorialPage += 1;
    return renderBattle();
  }
  closeBattleTutorial(false);
}

function skipBattleTutorial() {
  closeBattleTutorial(true);
}

function openBattleHelp() {
  clearBattleTimer();
  battle.confirmingLeave = false;
  battle.tutorialReplay = true;
  battle.tutorialPage = 0;
  renderBattle();
}

function requestBattleLeave() {
  if (battle.skillFx?.phase === "calculating") return;
  if (battle.result) {
    if (battle.result === "success" && state.pendingFinancialReport) return renderFinancialReport();
    if (battle.result === "success" && state.pendingTurnover) return renderTurnoverEvent();
    return renderOffice(battle.tutorialUnlock
      ? "첫 프로젝트를 완료했습니다. 면접 기능이 열렸습니다!"
      : battle.result === "success" ? "프로젝트 보상을 획득했습니다." : "사무실로 돌아왔습니다.");
  }
  clearBattleTimer();
  battle.confirmingLeave = true;
  renderBattle();
}

function cancelBattleLeave() {
  battle.confirmingLeave = false;
  renderBattle();
  if (!battle.awaitingDirective && !battle.result && !battle.skillFx && battle.tutorialPage === null) battleTimer = window.setTimeout(battleStep, 650);
}

function confirmBattleLeave() {
  clearBattleTimer();
  renderOffice("프로젝트를 중단하고 사무실로 돌아왔습니다.");
}

function renderBattle() {
  const team = orderedBattleTeam();
  const preview = activeDirectivePreview(team);
  const rewards = battle.rewards || (battle.reward ? [battle.reward] : []);
  const bestRewardRarity = rewards.length ? Math.max(...rewards.map(reward => reward.rarity)) : 0;
  const rewardShowcase = rewards.length ? `<div class="reward-showcase best-rarity-${bestRewardRarity}" style="--rarity-color:${EQUIPMENT_RARITIES[bestRewardRarity].color}"><small class="reward-label">PROJECT REWARD</small><div class="reward-items">${rewards.map(equipmentRewardCard).join("")}</div></div>` : "";
  const interviewUnlock = battle.tutorialUnlock ? `<div class="tutorial-unlock"><small>NEW FEATURE</small><strong>면접 기능 해금</strong><span>새로운 직원을 채용해 다음 팀을 구성할 수 있습니다.</span></div>` : "";
  const result = battle.result === "success" ? `<div class="battle-result"><h2>${battle.project.boss ? "BOSS PROJECT CLEAR" : "PROJECT CLEAR"}</h2><p>현금 +${battle.project.cash} · 평판 +${battle.project.reputation}</p>${interviewUnlock}${rewardShowcase}${battle.recruitmentNotice ? `<p class="reward-notice">${escapeHtml(battle.recruitmentNotice)}</p>` : ""}${battle.payrollNotice ? `<p class="reward-notice payroll-notice">${escapeHtml(battle.payrollNotice)}</p>` : ""}${battle.financialNotice ? `<p class="reward-notice financial-notice">${escapeHtml(battle.financialNotice)}</p>` : ""}${battle.turnoverNotice ? `<p class="reward-notice turnover-notice">${escapeHtml(battle.turnoverNotice)}</p>` : ""}</div>` : battle.result === "failure" ? `<div class="battle-result"><h2 style="color:#c84b3c">DEADLINE OVER</h2><p>${battle.tutorialMode ? "능력치와 행동 순서를 확인한 뒤 첫 프로젝트에 다시 도전하세요." : "팀 편성과 부서 연계를 바꿔 다시 도전하세요."}</p></div>` : "";
  const actingMemberId = battle.awaitingDirective ? battle.directiveFocusId : team[battle.action % Math.max(1, team.length)]?.id;
  const fighters = team.map((member, index) => {
    const damage = normalDamagePreview(member);
    const affinity = hasProjectAffinity(member, battle.project);
    const damageText = damage.min === damage.max ? String(damage.min) : `${damage.min}~${damage.max}`;
    return `<div class="fighter ${preview?.target === "team" ? "preview-target" : ""} ${member.id === actingMemberId ? "active-fighter" : ""}" data-fighter-id="${member.id}"><span class="fighter-role" style="--department-color:${DEPARTMENTS[member.department].color}">행동 ${index + 1} · ${DEPARTMENTS[member.department].short}${affinity ? " · 상성" : ""}</span><canvas width="24" height="24" data-portrait="${member.id}" data-facing="back"></canvas><strong>${escapeHtml(member.name)}</strong><small class="fighter-range">예상 ${damageText} · 지시 +${directiveChargeFor(member)}</small></div>`;
  }).join("");
  const round = Math.min(battle.deadline, Math.floor(battle.action / Math.max(1, team.length)) + 1);
  const statusName = battle.status ? `${battle.status.name} ${battle.status.turns}턴` : "안정";
  const statusTone = battle.status ? battle.status.tone : "good";
  const directive = directivePanel(team);
  const skillFxPhase = battle.skillFx?.phase === "calculating" ? "calculating" : "result";
  const skillFxOutcome = ["low", "normal", "great"].includes(battle.skillFx?.outcome) ? battle.skillFx.outcome : "normal";
  const calculationValue = battle.skillFx?.range ? Math.round((battle.skillFx.range.min + battle.skillFx.range.max) / 2) : 0;
  const calculationReadout = skillFxPhase === "calculating" ? `<b class="calculation-readout" aria-hidden="true"><small>예상 처리량</small><em id="calculation-value">${calculationValue}</em><small>분석 중</small></b>` : "";
  const skillFx = battle.skillFx ? `<div class="skill-cinematic phase-${skillFxPhase} outcome-${skillFxOutcome}" role="status" aria-live="polite"><i></i><i></i><i></i><strong>${escapeHtml(battle.skillFx.title)}</strong>${calculationReadout}<span>${escapeHtml(battle.skillFx.detail)}</span></div>` : "";
  const phaseText = battle.project.boss ? `PHASE ${battle.phase}/3 · ${battle.project.phaseNames[battle.phase - 1]}` : battle.project.difficulty;
  const workloadPercent = Math.min(100, battle.workload / battle.max * 100);
  const previewMin = preview?.damageMin || 0;
  const previewMax = preview?.damageMax || 0;
  const previewMinPercent = Math.min(workloadPercent, previewMin / battle.max * 100);
  const previewMaxPercent = Math.min(workloadPercent, previewMax / battle.max * 100);
  const guaranteedLeft = Math.max(0, workloadPercent - previewMinPercent);
  const possibleLeft = Math.max(0, workloadPercent - previewMaxPercent);
  const possibleWidth = Math.max(0, previewMaxPercent - previewMinPercent);
  const workloadPreview = previewMax ? `<span class="workload-preview possible" style="left:${possibleLeft}%;width:${possibleWidth}%"></span><span class="workload-preview guaranteed" style="left:${guaranteedLeft}%;width:${previewMinPercent}%" aria-label="예상 업무 처리량 ${previewMin}에서 ${previewMax}"></span>` : "";
  const arenaPreview = directivePreviewOverlay(preview);
  const recommendedDepartments = (battle.project.recommended || []).map(department => DEPARTMENTS[department]?.short).filter(Boolean).join(" · ");
  const affinityCount = team.filter(member => hasProjectAffinity(member, battle.project)).length;
  const arenaTheme = `arena-theme-${String(battle.project.art || battle.project.id).replace(/[^a-z0-9-]/gi, "")}`;
  const abortConfirm = battle.confirmingLeave ? `<div class="battle-abort-backdrop" role="dialog" aria-modal="true" aria-labelledby="abort-title"><div class="battle-abort-confirm panel"><small>PROJECT PAUSE</small><strong id="abort-title">프로젝트를 중단할까요?</strong><p>현재 전투 진행도는 저장되지 않으며 보상도 받을 수 없습니다.</p><div><button class="teal" id="cancel-battle-leave">계속 진행</button><button class="red" id="confirm-battle-leave">중단하기</button></div></div></div>` : "";
  const tutorialOverlay = battleTutorialOverlay(team);
  app.innerHTML = `${header("프로젝트 돌입", battle.result ? "프로젝트 결과를 확인하세요." : battle.awaitingDirective ? "자동 전투 일시 정지 · 직원 아래에서 스킬을 선택하세요." : "아군은 아래에서 위쪽의 프로젝트를 공략합니다.")}
    <section class="screen battle-screen ${battle.awaitingDirective ? "directive-active" : ""}">
      <div class="boss-card panel ${battle.project.boss ? "boss-active" : ""}"><div class="boss-row"><div><span class="project-kicker">${battle.project.boss ? "BOSS PROJECT" : "PROJECT TARGET"}</span><strong>${escapeHtml(battle.project.name)}</strong><small>${escapeHtml(phaseText)}</small></div><span class="workload-count" id="workload-text">업무량 ${battle.workload}/${battle.max}</span></div><div class="bar" aria-label="남은 프로젝트 업무량"><i id="workload-bar" style="width:${workloadPercent}%"></i>${workloadPreview}</div><div class="battle-condition-grid"><span class="status-chip ${statusTone} ${preview?.target === "status" ? "preview-target" : ""}" id="status-chip"><small>현재 상태</small><b>${escapeHtml(statusName)}</b></span><span class="deadline ${preview?.target === "deadline" ? "preview-target" : ""}" id="deadline"><small>마감 턴</small><b>${round}/${battle.deadline}${preview?.deadline ? ` → ${round}/${battle.deadline + preview.deadline}` : ""}</b></span><span class="affinity-chip ${affinityCount ? "matched" : ""}"><small>추천 ${escapeHtml(recommendedDepartments || "전체")}</small><b>상성 ${affinityCount}/${team.length}</b></span></div><div class="directive-meter"><b>긴급 지시</b><div><i id="directive-gauge" style="width:${battle.directiveGauge}%"></i></div><span id="directive-text">${battle.awaitingDirective ? "READY" : battle.directiveGauge + "%"}</span></div></div>
      <div class="arena panel ${arenaTheme} ${battle.project.boss ? "boss-arena" : ""} ${preview ? `preview-${preview.target}` : ""}" id="arena"><div class="battle-lanes" aria-hidden="true"><i></i><i></i><i></i></div><canvas id="boss-canvas" width="64" height="64" aria-label="${escapeHtml(battle.project.name)}"></canvas><div class="battle-team">${fighters}</div>${arenaPreview}${skillFx}</div>
      ${directive}
      <div class="battle-log panel" id="battle-log">${result || escapeHtml(battle.log)}</div>
      <div class="battle-footer-actions ${battle.result ? "result-footer" : ""}">${battle.result || battle.skillFx ? "" : `<button class="battle-help-button teal" id="battle-help">? 전투 도움말</button>`}<button class="battle-exit-button ${battle.result ? "result-exit mustard" : "ink"}" id="leave-battle" ${skillFxPhase === "calculating" ? "disabled" : ""}>${skillFxPhase === "calculating" ? "계획 분석 중…" : battle.result ? state.pendingFinancialReport ? "분기 결산 보기" : state.pendingTurnover ? "이직 면담으로" : battle.tutorialUnlock ? "사무실 · 면접 확인" : "사무실로" : "프로젝트 중단"}</button></div>
      ${abortConfirm}
      ${tutorialOverlay}
    </section>`;
  drawBoss(document.querySelector("#boss-canvas"), battle.project.art || battle.project.id, battle.phase);
  mountPortraits();
  mountEquipmentIcons();
  document.querySelectorAll("[data-directive-member]").forEach(button => button.addEventListener("click", () => selectDirectiveMember(button.dataset.directiveMember)));
  document.querySelectorAll("[data-directive-skill]").forEach(button => button.addEventListener("click", () => selectDirectiveSkill(button.dataset.memberId, button.dataset.directiveSkill)));
  document.querySelector("#execute-directive")?.addEventListener("click", executeDirective);
  document.querySelector("#battle-help")?.addEventListener("click", openBattleHelp);
  document.querySelector("#leave-battle").addEventListener("click", requestBattleLeave);
  document.querySelector("#cancel-battle-leave")?.addEventListener("click", cancelBattleLeave);
  document.querySelector("#confirm-battle-leave")?.addEventListener("click", confirmBattleLeave);
  document.querySelector("#next-battle-tutorial")?.addEventListener("click", advanceBattleTutorial);
  document.querySelector("#skip-battle-tutorial")?.addEventListener("click", skipBattleTutorial);
}

function updateBattleNumbers(round) {
  const bar = document.querySelector("#workload-bar");
  const text = document.querySelector("#workload-text");
  const deadline = document.querySelector("#deadline");
  const log = document.querySelector("#battle-log");
  const boss = document.querySelector("#boss-canvas");
  const status = document.querySelector("#status-chip");
  const directiveGauge = document.querySelector("#directive-gauge");
  const directiveText = document.querySelector("#directive-text");
  if (!bar) return;
  bar.style.width = `${Math.min(100, battle.workload / battle.max * 100)}%`;
  text.textContent = `업무량 ${battle.workload}/${battle.max}`;
  deadline.querySelector("b").textContent = `${round}/${battle.deadline}`;
  log.textContent = battle.log;
  status.querySelector("b").textContent = battle.status ? `${battle.status.name} ${battle.status.turns}턴` : "안정";
  status.className = `status-chip ${battle.status ? battle.status.tone : "good"}`;
  directiveGauge.style.width = `${battle.directiveGauge}%`;
  directiveText.textContent = battle.directiveGauge >= 100 ? "READY" : `${battle.directiveGauge}%`;
  const team = orderedBattleTeam();
  const nextMemberId = team[battle.action % Math.max(1, team.length)]?.id;
  document.querySelectorAll("[data-fighter-id]").forEach(fighter => fighter.classList.toggle("active-fighter", fighter.dataset.fighterId === nextMemberId));
  boss.classList.remove("hit");
  void boss.offsetWidth;
  boss.classList.add("hit");
}

function animatePacket(department, lane) {
  const arena = document.querySelector("#arena");
  if (!arena) return;
  const packet = document.createElement("i");
  packet.className = "packet";
  packet.style.left = `${20 + lane * 30}%`;
  packet.style.background = DEPARTMENTS[department].color;
  arena.appendChild(packet);
  window.setTimeout(() => packet.remove(), 800);
}

function mountPortraits() {
  document.querySelectorAll("[data-portrait]").forEach(canvas => {
    const member = state.employees.find(item => item.id === canvas.dataset.portrait);
    if (member) {
      if (canvas.dataset.facing === "back") drawBackPortrait(canvas, member);
      else if (canvas.dataset.portraitCrop === "face") drawFacePreview(canvas, member);
      else drawPortrait(canvas, member);
    }
  });
}

function mountEquipmentIcons() {
  document.querySelectorAll("[data-equipment-icon]").forEach(canvas => {
    drawEquipmentIcon(canvas, canvas.dataset.equipmentIcon, Number(canvas.dataset.equipmentRarity || 0));
  });
}

function drawEquipmentIcon(canvas, art, rarity = 0) {
  if (!canvas) return;
  const context = pixelContext(canvas);
  const pixel = (color, x, y, width, height) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  };
  const outline = COLORS.ink;
  const accent = EQUIPMENT_RARITIES[Math.max(0, Math.min(EQUIPMENT_RARITIES.length - 1, rarity))].color;
  const light = rarity >= 3 ? "#ffe6a1" : COLORS.paper;
  if (rarity >= 2) {
    pixel(accent, 1, 10, 3, 3); pixel(accent, 20, 5, 2, 2); pixel(accent, 19, 19, 3, 3);
    pixel(light, 2, 3, 2, 2); pixel(light, 21, 13, 2, 2);
  }
  if (art === "laptop") {
    pixel(outline, 4, 3, 16, 13); pixel("#4a70a8", 6, 5, 12, 9); pixel(light, 8, 7, 8, 2);
    pixel(outline, 2, 16, 20, 4); pixel(accent, 5, 17, 14, 1); pixel(light, 10, 18, 4, 1);
  } else if (art === "tablet") {
    pixel(outline, 5, 2, 14, 20); pixel(accent, 7, 4, 10, 15); pixel(light, 9, 6, 6, 2); pixel(light, 11, 19, 2, 1);
  } else if (art === "calculator") {
    pixel(outline, 5, 2, 14, 20); pixel("#6d7c8c", 7, 4, 10, 5); pixel(light, 8, 5, 8, 2);
    [[7,11],[11,11],[15,11],[7,15],[11,15],[15,15],[7,19],[11,19],[15,19]].forEach(([x,y], index) => pixel(index === 8 ? accent : COLORS.paper, x, y, 2, 2));
  } else if (art === "headset") {
    pixel(outline, 5, 3, 14, 3); pixel(outline, 3, 6, 4, 11); pixel(outline, 17, 6, 4, 11);
    pixel(accent, 5, 6, 2, 8); pixel(accent, 17, 6, 2, 8); pixel(outline, 4, 14, 5, 6); pixel(outline, 15, 14, 5, 6); pixel(light, 6, 16, 3, 2); pixel(light, 15, 16, 3, 2);
  } else if (art === "planner") {
    pixel(outline, 4, 2, 16, 20); pixel(accent, 7, 4, 11, 16); pixel(light, 9, 7, 7, 2); pixel(light, 9, 11, 7, 1); pixel(light, 9, 14, 5, 1);
    pixel(outline, 4, 5, 3, 2); pixel(outline, 4, 10, 3, 2); pixel(outline, 4, 15, 3, 2);
  } else if (art === "wallet") {
    pixel(outline, 3, 7, 18, 12); pixel(accent, 5, 9, 14, 8); pixel(outline, 12, 10, 9, 6); pixel(light, 14, 12, 2, 2); pixel("#d6a12c", 5, 5, 12, 3);
  } else if (art === "tumbler") {
    pixel(outline, 7, 3, 10, 19); pixel(accent, 9, 6, 6, 13); pixel(light, 10, 8, 2, 8); pixel(outline, 6, 2, 12, 4); pixel("#6d7c8c", 9, 0, 6, 3);
  } else if (art === "coffee") {
    pixel(outline, 4, 8, 14, 12); pixel("#fffaf0", 6, 10, 10, 8); pixel("#7c4f36", 7, 10, 8, 3); pixel(outline, 17, 11, 5, 7); pixel("#fffaf0", 18, 13, 2, 3);
    pixel(accent, 7, 3, 2, 4); pixel(accent, 12, 2, 2, 5); pixel(accent, 16, 4, 2, 3);
  } else {
    pixel(outline, 10, 1, 4, 5); pixel(accent, 6, 6, 12, 10); pixel(light, 9, 8, 6, 6); pixel(outline, 10, 16, 4, 6); pixel(accent, 7, 20, 3, 3); pixel(accent, 14, 20, 3, 3);
  }
}

function pixelContext(canvas) {
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  return context;
}

function rect(context, color, x, y, width, height) {
  context.fillStyle = color;
  context.fillRect(x, context.canvas.height - y - height, width, height);
}

function centeredRect(context, color, width, y, height, offset = 0) {
  rect(context, color, Math.floor((24 - width) / 2) + offset, y, width, height);
}

function drawFaceShape(context, skin, style) {
  const shapes = [
    [16, 16, 14, 10], [16, 16, 16, 14], [14, 16, 14, 8], [12, 14, 12, 8],
    [16, 16, 12, 6], [12, 16, 12, 8], [18, 18, 16, 12], [16, 14, 16, 10]
  ];
  const [temple, cheek, jaw, chin] = shapes[style % shapes.length];
  const layers = [[temple, 15, 4], [cheek, 10, 5], [jaw, 7, 3], [chin, 5, 2]];
  layers.forEach(([width, y, height]) => centeredRect(context, COLORS.ink, width + 2, y, height));
  layers.forEach(([width, y, height]) => centeredRect(context, skin, width, y, height));
}

function drawEyebrows(context, color, style) {
  const eyebrow = style % 8;
  if (eyebrow === 0) { rect(context, color, 6, 16, 3, 1); rect(context, color, 15, 16, 3, 1); }
  if (eyebrow === 1) { rect(context, color, 6, 16, 3, 2); rect(context, color, 15, 16, 3, 2); }
  if (eyebrow === 2) { rect(context, color, 6, 15, 2, 1); rect(context, color, 8, 16, 2, 1); rect(context, color, 14, 16, 2, 1); rect(context, color, 16, 15, 2, 1); }
  if (eyebrow === 3) { rect(context, color, 6, 16, 2, 1); rect(context, color, 8, 15, 2, 1); rect(context, color, 14, 15, 2, 1); rect(context, color, 16, 16, 2, 1); }
  if (eyebrow === 4) { rect(context, color, 7, 16, 2, 1); rect(context, color, 15, 16, 2, 1); }
  if (eyebrow === 5) { rect(context, color, 5, 16, 4, 1); rect(context, color, 15, 16, 4, 1); }
  if (eyebrow === 6) { rect(context, color, 6, 17, 3, 1); rect(context, color, 15, 17, 3, 1); }
  if (eyebrow === 7) { rect(context, color, 6, 16, 1, 1); rect(context, color, 7, 17, 2, 1); rect(context, color, 15, 17, 2, 1); rect(context, color, 17, 16, 1, 1); }
}

function drawEyes(context, style) {
  const eye = style % 10;
  if (eye === 0) { rect(context, COLORS.ink, 7, 13, 2, 1); rect(context, COLORS.ink, 15, 13, 2, 1); }
  if (eye === 1) { rect(context, COLORS.ink, 6, 13, 3, 1); rect(context, COLORS.ink, 15, 13, 3, 1); }
  if (eye === 2) { rect(context, COLORS.ink, 7, 12, 2, 2); rect(context, COLORS.ink, 15, 12, 2, 2); }
  if (eye === 3) { rect(context, COLORS.ink, 7, 12, 1, 2); rect(context, COLORS.ink, 16, 12, 1, 2); }
  if (eye === 4) { rect(context, COLORS.ink, 7, 12, 2, 1); rect(context, COLORS.ink, 15, 12, 2, 1); }
  if (eye === 5) { rect(context, COLORS.ink, 6, 13, 3, 2); rect(context, COLORS.paper, 7, 14, 1, 1); rect(context, COLORS.ink, 15, 13, 3, 2); rect(context, COLORS.paper, 16, 14, 1, 1); }
  if (eye === 6) { rect(context, COLORS.ink, 7, 13, 1, 1); rect(context, COLORS.ink, 8, 12, 1, 1); rect(context, COLORS.ink, 15, 12, 1, 1); rect(context, COLORS.ink, 16, 13, 1, 1); }
  if (eye === 7) { rect(context, COLORS.ink, 6, 13, 3, 1); rect(context, COLORS.ink, 6, 14, 1, 1); rect(context, COLORS.ink, 15, 13, 3, 1); rect(context, COLORS.ink, 17, 14, 1, 1); }
  if (eye === 8) { rect(context, COLORS.ink, 7, 13, 1, 1); rect(context, COLORS.ink, 8, 14, 1, 1); rect(context, COLORS.ink, 15, 14, 1, 1); rect(context, COLORS.ink, 16, 13, 1, 1); }
  if (eye === 9) { rect(context, COLORS.ink, 7, 13, 2, 1); rect(context, COLORS.ink, 6, 14, 1, 1); rect(context, COLORS.ink, 15, 13, 2, 1); rect(context, COLORS.ink, 17, 14, 1, 1); }
}

function drawNose(context, style) {
  const color = "rgba(80,35,25,.55)";
  const nose = style % 8;
  if (nose === 0) rect(context, color, 11, 10, 1, 1);
  if (nose === 1) rect(context, color, 12, 10, 1, 1);
  if (nose === 2) rect(context, color, 11, 10, 1, 2);
  if (nose === 3) rect(context, color, 12, 10, 1, 2);
  if (nose === 4) { rect(context, color, 11, 10, 2, 1); rect(context, color, 12, 11, 1, 1); }
  if (nose === 5) { rect(context, color, 10, 10, 1, 1); rect(context, color, 13, 10, 1, 1); }
  if (nose === 6) { rect(context, color, 11, 10, 2, 1); rect(context, color, 11, 11, 1, 2); }
  if (nose === 7) { rect(context, color, 10, 10, 4, 1); rect(context, color, 12, 11, 1, 1); }
}

function drawMouth(context, style) {
  const mouth = style % 10;
  const lip = "#a94d5e";
  if (mouth === 0) centeredRect(context, COLORS.ink, 3, 8, 1);
  if (mouth === 1) centeredRect(context, COLORS.ink, 5, 8, 1);
  if (mouth === 2) centeredRect(context, COLORS.ink, 7, 8, 1);
  if (mouth === 3) { rect(context, COLORS.ink, 9, 9, 1, 1); rect(context, COLORS.ink, 10, 8, 4, 1); rect(context, COLORS.ink, 14, 9, 1, 1); }
  if (mouth === 4) { rect(context, COLORS.ink, 9, 8, 1, 1); rect(context, COLORS.ink, 10, 9, 4, 1); rect(context, COLORS.ink, 14, 8, 1, 1); }
  if (mouth === 5) { centeredRect(context, COLORS.ink, 4, 7, 2); centeredRect(context, COLORS.paper, 2, 8, 1); }
  if (mouth === 6) { centeredRect(context, COLORS.ink, 6, 7, 2); centeredRect(context, COLORS.paper, 4, 8, 1); }
  if (mouth === 7) centeredRect(context, lip, 4, 8, 1);
  if (mouth === 8) { centeredRect(context, lip, 6, 7, 2); centeredRect(context, COLORS.ink, 4, 8, 1); }
  if (mouth === 9) { centeredRect(context, COLORS.ink, 3, 7, 3); centeredRect(context, lip, 1, 8, 1); }
}

function drawBackPortrait(target, member) {
  return window.OfficeRaidCharacter.mount(target, member, "back", false);
}

function drawPortrait(target, member) {
  return window.OfficeRaidCharacter.mount(target, member, "front", false);
}

function drawFacePreview(target, member) {
  return window.OfficeRaidCharacter.mount(target, member, "front", true);
}

const BOTTOM_COLORS = ["#314c68", "#b89b72", "#405a55", "#5c536b", "#65727c", "#725145", "#435f78", "#79636a"];

function shadeColor(hex, amount) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = shift => Math.max(0, Math.min(255, ((value >> shift) & 255) + amount)).toString(16).padStart(2, "0");
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

function centeredRect48(context, color, width, y, height, offset = 0) {
  rect(context, color, Math.floor((48 - width) / 2) + offset, y, width, height);
}

function characterLook(member) {
  const look = member.appearance || {};
  const legacyOutfit = Number.isFinite(look.outfit) ? look.outfit : 0;
  return {
    face: look.face || 0, skin: look.skin || 0, hair: look.hair || 0,
    eyes: look.eyes || 0, eyebrows: look.eyebrows || 0, nose: look.nose || 0,
    mouth: look.mouth || 0, accessory: look.accessory || 0,
    top: Number.isFinite(look.top) ? look.top : legacyOutfit,
    bottom: Number.isFinite(look.bottom) ? look.bottom : Math.floor(legacyOutfit / 2) % BOTTOM_COLORS.length
  };
}

function drawCharacter48(canvas, member, back) {
  if (!canvas || !member) return;
  if (canvas.width !== 48) canvas.width = 48;
  if (canvas.height !== 48) canvas.height = 48;
  const context = pixelContext(canvas);
  const look = characterLook(member);
  const skin = COLORS.skin[look.skin % COLORS.skin.length];
  const hair = COLORS.hair[Math.floor(look.hair / 3) % COLORS.hair.length];
  drawCharacterBody48(context, look, skin, back);
  if (back) drawHeadBack48(context, look, skin, hair);
  else drawHeadFront48(context, look, skin, hair);
}

function drawCharacterBody48(context, look, skin, back) {
  const top = COLORS.outfit[look.top % COLORS.outfit.length];
  const topDark = shadeColor(top, -34);
  const topLight = shadeColor(top, 34);
  const bottom = BOTTOM_COLORS[look.bottom % BOTTOM_COLORS.length];
  const bottomDark = shadeColor(bottom, -30);
  const bottomLight = shadeColor(bottom, 24);
  const shoe = ["#47372f", "#273746", "#75513a", "#40515c"][look.bottom % 4];

  // Shoes and tapered legs. These use one-pixel accents that were not possible in the old 24px sprites.
  rect(context, COLORS.ink, 10, 0, 12, 5); rect(context, COLORS.ink, 26, 0, 12, 5);
  rect(context, shoe, 12, 1, 9, 3); rect(context, shoe, 27, 1, 9, 3);
  rect(context, shadeColor(shoe, 28), 13, 3, 6, 1); rect(context, shadeColor(shoe, 28), 28, 3, 5, 1);
  rect(context, COLORS.ink, 12, 4, 11, 14); rect(context, COLORS.ink, 25, 4, 11, 14);
  rect(context, bottom, 14, 5, 7, 12); rect(context, bottom, 27, 5, 7, 12);
  rect(context, bottomDark, 14, 5, 2, 10); rect(context, bottomLight, 32, 7, 2, 9);
  rect(context, bottomDark, 21, 13, 2, 5); rect(context, bottomDark, 25, 13, 2, 5);
  rect(context, COLORS.ink, 11, 15, 26, 6); rect(context, bottom, 13, 16, 22, 4);
  rect(context, bottomLight, 15, 18, 14, 1); rect(context, bottomDark, 32, 16, 3, 3);

  // Narrower torso and articulated arms create a new silhouette instead of a scaled-up 24px block.
  rect(context, COLORS.ink, 7, 17, 7, 12); rect(context, COLORS.ink, 34, 17, 7, 12);
  rect(context, topDark, 9, 18, 4, 10); rect(context, top, 35, 18, 4, 10);
  rect(context, topLight, 9, 25, 3, 2); rect(context, topDark, 37, 19, 2, 7);
  rect(context, COLORS.ink, 8, 14, 6, 6); rect(context, COLORS.ink, 34, 14, 6, 6);
  rect(context, skin, 9, 15, 4, 4); rect(context, skin, 35, 15, 4, 4);
  rect(context, shadeColor(skin, -18), 9, 15, 1, 3); rect(context, shadeColor(skin, -18), 38, 15, 1, 3);

  rect(context, COLORS.ink, 9, 22, 30, 8);
  rect(context, COLORS.ink, 11, 17, 26, 11);
  rect(context, top, 11, 23, 26, 6); rect(context, top, 13, 18, 22, 8);
  rect(context, topLight, 13, 27, 19, 1); rect(context, topDark, 33, 19, 2, 8);
  rect(context, COLORS.ink, 19, 27, 10, 5); rect(context, skin, 21, 28, 6, 4);

  const style = look.top % 12;
  if (style === 0) {
    rect(context, "#fffaf0", 20, 18, 8, 10);
    rect(context, topDark, 13, 19, 7, 8); rect(context, topDark, 28, 19, 6, 8);
    if (!back) { rect(context, "#d6a12c", 23, 20, 2, 6); rect(context, "#d6a12c", 22, 25, 4, 3); }
  } else if (style === 1) {
    rect(context, "#fffaf0", 19, 18, 10, 9); rect(context, topDark, 23, 18, 2, 9);
    if (!back) { rect(context, COLORS.paper, 23, 20, 2, 2); rect(context, COLORS.paper, 23, 24, 2, 2); }
  } else if (style === 2) {
    rect(context, topDark, 14, 25, 20, 4); rect(context, topLight, 17, 26, 14, 2);
    if (!back) { rect(context, COLORS.paper, 19, 20, 1, 6); rect(context, COLORS.paper, 28, 20, 1, 6); }
  } else if (style === 3) {
    rect(context, "#fffaf0", 19, 25, 10, 3); rect(context, topDark, 23, 18, 2, 9);
    rect(context, topDark, 9, 20, 4, 2); rect(context, topDark, 35, 20, 4, 2);
  } else if (style === 4) {
    rect(context, topDark, 13, 18, 22, 3); rect(context, topLight, 15, 23, 18, 2);
    rect(context, topLight, 17, 26, 14, 1);
  } else if (style === 5 || style === 11) {
    rect(context, topDark, 23, 18, 2, 10); rect(context, topDark, 14, 20, 5, 3); rect(context, topDark, 29, 20, 5, 3);
    if (!back) { rect(context, COLORS.paper, 16, 21, 2, 1); rect(context, COLORS.paper, 30, 21, 2, 1); rect(context, topLight, 20, 26, 2, 1); }
  } else if (style === 6) {
    rect(context, "#fffaf0", 18, 18, 12, 10); rect(context, topDark, 13, 19, 5, 9); rect(context, topDark, 30, 19, 5, 9);
  } else if (style === 7) {
    rect(context, topDark, 18, 25, 12, 3); rect(context, topLight, 21, 26, 6, 2); rect(context, topDark, 13, 18, 22, 2);
  } else if (style === 8) {
    rect(context, topDark, 23, 18, 2, 10); rect(context, COLORS.paper, 16, 22, 3, 2); rect(context, COLORS.paper, 29, 22, 3, 2);
  } else if (style === 9) {
    rect(context, topDark, 13, 18, 22, 3); rect(context, topDark, 9, 18, 4, 3); rect(context, topDark, 35, 18, 4, 3);
    rect(context, topLight, 16, 26, 16, 1);
  } else if (style === 10) {
    if (!back) { rect(context, topDark, 20, 25, 8, 4); rect(context, COLORS.paper, 22, 24, 4, 2); }
    rect(context, topLight, 14, 20, 3, 7); rect(context, topLight, 31, 20, 3, 7);
  }
}

function drawFaceBase48(context, look, skin) {
  const shapes = [
    [24, 28, 24, 18], [26, 30, 26, 20], [24, 28, 22, 16], [22, 28, 22, 18],
    [26, 28, 20, 16], [24, 30, 24, 16], [28, 30, 26, 20], [26, 28, 24, 20]
  ];
  const [upper, middle, jaw, chin] = shapes[look.face % shapes.length];
  // Rounded multi-step contour: wider cheeks, tapered chin, and visible ears.
  rect(context, COLORS.ink, 8, 33, 5, 7); rect(context, COLORS.ink, 35, 33, 5, 7);
  rect(context, skin, 9, 34, 4, 5); rect(context, skin, 35, 34, 4, 5);
  rect(context, shadeColor(skin, -16), 9, 34, 1, 3); rect(context, shadeColor(skin, -16), 38, 34, 1, 3);
  centeredRect48(context, COLORS.ink, upper + 4, 40, 5);
  centeredRect48(context, COLORS.ink, middle + 4, 34, 8);
  centeredRect48(context, COLORS.ink, jaw + 4, 30, 5);
  centeredRect48(context, COLORS.ink, chin + 4, 28, 3);
  centeredRect48(context, skin, upper, 41, 3);
  centeredRect48(context, skin, middle, 35, 6);
  centeredRect48(context, skin, jaw, 31, 4);
  centeredRect48(context, skin, chin, 29, 2);
  rect(context, shadeColor(skin, 18), 14, 39, 4, 3);
  rect(context, shadeColor(skin, 12), 12, 36, 2, 3);
  rect(context, shadeColor(skin, -16), 34, 32, 2, 5);
}

function drawHair48(context, look, hair, back) {
  const style = look.hair % 8;
  const light = shadeColor(hair, 30);
  const shine = shadeColor(hair, 46);
  const dark = shadeColor(hair, -26);
  if (style === 5) { rect(context, COLORS.ink, 19, 45, 10, 3); rect(context, hair, 20, 46, 8, 2); rect(context, light, 22, 47, 4, 1); }
  centeredRect48(context, COLORS.ink, 26, 43, 5);
  centeredRect48(context, COLORS.ink, 32, 39, 5);
  centeredRect48(context, hair, 24, 44, 4);
  centeredRect48(context, hair, 30, 40, 4);
  rect(context, light, 14, 44, 8, 2); rect(context, shine, 17, 46, 5, 1);
  rect(context, dark, 31, 40, 6, 4);
  if (back) {
    centeredRect48(context, COLORS.ink, 30, 33, 9);
    centeredRect48(context, hair, 28, 34, 8);
    rect(context, light, 13, 39, 6, 3); rect(context, dark, 30, 34, 6, 7);
    rect(context, dark, 20, 34, 2, 5); rect(context, light, 24, 37, 2, 5);
  } else {
    if (style === 0) {
      rect(context, hair, 11, 39, 13, 4); rect(context, hair, 12, 37, 9, 3);
      rect(context, dark, 24, 40, 13, 3); rect(context, dark, 28, 38, 8, 3);
      rect(context, light, 15, 41, 5, 2);
    }
    if (style === 1) {
      rect(context, hair, 11, 39, 26, 4); rect(context, hair, 13, 37, 7, 3); rect(context, hair, 22, 36, 5, 4); rect(context, hair, 29, 37, 6, 3);
      rect(context, light, 15, 41, 8, 2);
    }
    if (style === 2 || style === 3) { rect(context, hair, 9, 31, 5, 11); rect(context, hair, 34, 31, 5, 11); rect(context, light, 10, 37, 2, 4); rect(context, dark, 36, 32, 2, 7); }
    if (style === 4) { rect(context, hair, 12, 40, 24, 3); rect(context, light, 16, 42, 11, 2); rect(context, dark, 31, 39, 5, 3); }
    if (style === 6) {
      rect(context, hair, 9, 36, 6, 6); rect(context, hair, 33, 36, 6, 6);
      rect(context, light, 11, 42, 4, 3); rect(context, light, 19, 44, 4, 3); rect(context, light, 27, 43, 4, 3);
      rect(context, dark, 34, 38, 4, 3);
    }
    if (style === 7) { rect(context, hair, 28, 36, 9, 7); rect(context, dark, 33, 33, 5, 8); rect(context, light, 15, 42, 10, 2); }
  }
  if (style === 2) { rect(context, COLORS.ink, 8, 28, 6, 12); rect(context, COLORS.ink, 34, 28, 6, 12); rect(context, hair, 9, 29, 4, 10); rect(context, hair, 35, 29, 4, 10); }
  if (style === 3) { rect(context, COLORS.ink, 7, 22, 7, 18); rect(context, COLORS.ink, 34, 22, 7, 18); rect(context, hair, 8, 23, 5, 16); rect(context, hair, 35, 23, 5, 16); rect(context, light, 9, 31, 2, 6); rect(context, dark, 37, 24, 2, 10); }
}

function drawFaceDetails48(context, look, hair) {
  const brow = hair === COLORS.ink ? "#573b32" : shadeColor(hair, -22);
  const browY = 38 + (look.eyebrows % 3 === 1 ? 1 : 0);
  if (look.eyebrows % 4 === 2) {
    rect(context, brow, 15, browY, 4, 1); rect(context, brow, 29, browY + 1, 4, 1);
  } else if (look.eyebrows % 4 === 3) {
    rect(context, brow, 15, browY + 1, 4, 1); rect(context, brow, 29, browY, 4, 1);
  } else {
    rect(context, brow, 15, browY, 4, look.eyebrows % 2 + 1); rect(context, brow, 29, browY, 4, look.eyebrows % 2 + 1);
  }

  const eye = look.eyes % 10;
  if (eye === 3 || eye === 6) {
    rect(context, COLORS.ink, 16, 35, 3, 1); rect(context, COLORS.ink, 29, 35, 3, 1);
  } else if (eye === 7 || eye === 8) {
    rect(context, COLORS.ink, 16, 35, 2, 2); rect(context, COLORS.ink, 30, 35, 2, 2);
  } else {
    const eyeHeight = eye === 2 || eye === 5 || eye === 9 ? 3 : 2;
    rect(context, COLORS.ink, 16, 34, 3, eyeHeight); rect(context, COLORS.ink, 29, 34, 3, eyeHeight);
    if (eye === 5 || eye === 9) { rect(context, COLORS.paper, 16, 36, 1, 1); rect(context, COLORS.paper, 29, 36, 1, 1); }
  }

  const noseColor = "rgba(92,48,38,.62)";
  if (look.nose % 4 === 0) rect(context, noseColor, 24, 32, 1, 1);
  if (look.nose % 4 === 1) rect(context, noseColor, 24, 32, 1, 2);
  if (look.nose % 4 === 2) { rect(context, noseColor, 23, 32, 2, 1); rect(context, noseColor, 24, 33, 1, 2); }
  if (look.nose % 4 === 3) { rect(context, noseColor, 22, 32, 4, 1); rect(context, noseColor, 24, 33, 1, 1); }

  const mouth = look.mouth % 10;
  const mouthWidth = [3, 4, 6, 6, 6, 5, 6, 4, 5, 4][mouth];
  const mouthY = mouth === 4 ? 29 : 30;
  centeredRect48(context, mouth >= 7 ? "#a94d5e" : COLORS.ink, mouthWidth, mouthY, 1);
  if (mouth === 3 || mouth === 5) { rect(context, COLORS.ink, 21, 31, 1, 1); rect(context, COLORS.ink, 26, 31, 1, 1); }
  if (mouth === 6 || mouth === 8) centeredRect48(context, COLORS.paper, Math.max(2, mouthWidth - 3), mouthY, 1);
}

function drawAccessory48(context, look, skin, back) {
  const accessory = look.accessory % 9;
  if ((accessory === 1 || accessory === 2) && !back) {
    const frame = accessory === 1 ? "#4a70a8" : COLORS.ink;
    rect(context, frame, 13, 33, 9, 4); rect(context, frame, 26, 33, 9, 4);
    rect(context, skin, 15, 34, 5, 2); rect(context, skin, 28, 34, 5, 2); rect(context, frame, 22, 35, 4, 1);
    rect(context, frame, 11, 35, 2, 1); rect(context, frame, 35, 35, 2, 1);
  }
  if (accessory === 3 && !back) { rect(context, "#d6a12c", 9, 32, 2, 2); rect(context, "#d6a12c", 37, 32, 2, 2); rect(context, "#fff3b4", 10, 33, 1, 1); }
  if (accessory === 4 && !back) { rect(context, COLORS.ink, 32, 41, 5, 3); rect(context, "#c84b3c", 33, 42, 3, 2); rect(context, "#fffaf0", 34, 43, 1, 1); }
  if (accessory === 5) {
    rect(context, COLORS.ink, 7, 34, 4, 9); rect(context, COLORS.ink, 37, 34, 4, 9);
    rect(context, "#4a70a8", 8, 35, 2, 6); rect(context, "#4a70a8", 38, 35, 2, 6);
    if (!back) { rect(context, COLORS.ink, 36, 31, 5, 2); rect(context, "#4a70a8", 35, 31, 3, 1); }
  }
  if (accessory === 6 && !back) { rect(context, COLORS.ink, 13, 34, 9, 4); rect(context, COLORS.ink, 26, 34, 9, 4); rect(context, "#4a70a8", 15, 35, 5, 2); rect(context, "#4a70a8", 28, 35, 5, 2); rect(context, COLORS.ink, 22, 36, 4, 1); rect(context, "#88b7d2", 16, 36, 2, 1); rect(context, "#88b7d2", 29, 36, 2, 1); }
  if (accessory === 7 && !back) { rect(context, "#b97862", 14, 32, 2, 1); rect(context, "#b97862", 32, 32, 2, 1); rect(context, "#b97862", 17, 31, 1, 1); rect(context, "#b97862", 30, 31, 1, 1); }
  if (accessory === 8) { rect(context, COLORS.ink, 10, 42, 28, 3); rect(context, "#d6a12c", 11, 43, 26, 2); }
}

function drawHeadFront48(context, look, skin, hair) {
  drawFaceBase48(context, look, skin);
  drawHair48(context, look, hair, false);
  drawFaceDetails48(context, look, hair);
  drawAccessory48(context, look, skin, false);
}

function drawHeadBack48(context, look, skin, hair) {
  rect(context, COLORS.ink, 8, 33, 5, 7); rect(context, COLORS.ink, 35, 33, 5, 7);
  rect(context, skin, 9, 34, 4, 5); rect(context, skin, 35, 34, 4, 5);
  centeredRect48(context, COLORS.ink, 28, 40, 5);
  centeredRect48(context, COLORS.ink, 32, 34, 8);
  centeredRect48(context, COLORS.ink, 26, 29, 6);
  centeredRect48(context, skin, 24, 41, 3);
  centeredRect48(context, skin, 28, 35, 6);
  centeredRect48(context, skin, 22, 30, 4);
  drawHair48(context, look, hair, true);
  drawAccessory48(context, look, skin, true);
}

function drawRevisionProject(context) {
  rect(context, COLORS.ink, 4, 7, 56, 48);
  rect(context, "#6d7c8c", 7, 10, 50, 42);
  rect(context, "#9aa6ab", 10, 13, 44, 13);
  rect(context, "#9aa6ab", 10, 30, 44, 13);
  rect(context, COLORS.ink, 25, 20, 14, 3);
  rect(context, COLORS.ink, 25, 37, 14, 3);
  rect(context, COLORS.paper, 8, 45, 18, 15);
  rect(context, "#d6a12c", 32, 42, 21, 18);
  rect(context, "#168c8b", 23, 47, 5, 16);
  rect(context, COLORS.ink, 40, 20, 21, 21);
  rect(context, "#c84b3c", 42, 22, 17, 17);
  rect(context, COLORS.paper, 49, 25, 2, 8);
  rect(context, COLORS.paper, 49, 31, 6, 2);
}

function drawScheduleProject(context) {
  rect(context, COLORS.ink, 6, 7, 52, 50);
  rect(context, COLORS.paper, 9, 10, 46, 43);
  rect(context, "#c84b3c", 9, 43, 46, 10);
  rect(context, COLORS.ink, 15, 51, 4, 10);
  rect(context, COLORS.ink, 45, 51, 4, 10);
  rect(context, "#d6a12c", 13, 32, 9, 7);
  rect(context, "#4a70a8", 27, 32, 9, 7);
  rect(context, "#168c8b", 41, 32, 9, 7);
  rect(context, "#9aa6ab", 13, 20, 9, 7);
  rect(context, "#c84b3c", 27, 20, 9, 7);
  rect(context, "#9aa6ab", 41, 20, 9, 7);
  rect(context, COLORS.ink, 24, 5, 28, 28);
  rect(context, COLORS.paper, 27, 8, 22, 22);
  rect(context, COLORS.ink, 37, 18, 3, 10);
  rect(context, COLORS.ink, 37, 17, 9, 3);
  rect(context, "#c84b3c", 36, 16, 5, 5);
}

function drawMigrationProject(context) {
  rect(context, COLORS.ink, 5, 8, 24, 49);
  rect(context, "#4a70a8", 8, 11, 18, 43);
  rect(context, COLORS.ink, 11, 43, 12, 3);
  rect(context, COLORS.ink, 11, 32, 12, 3);
  rect(context, COLORS.ink, 11, 21, 12, 3);
  rect(context, "#168c8b", 11, 48, 4, 3);
  rect(context, "#d6a12c", 18, 48, 4, 3);
  rect(context, "#168c8b", 11, 37, 4, 3);
  rect(context, "#c84b3c", 18, 37, 4, 3);
  rect(context, COLORS.ink, 35, 13, 24, 44);
  rect(context, "#6d7c8c", 38, 16, 18, 38);
  rect(context, COLORS.ink, 41, 43, 12, 3);
  rect(context, COLORS.ink, 41, 32, 12, 3);
  rect(context, COLORS.ink, 41, 21, 12, 3);
  rect(context, "#d6a12c", 41, 48, 4, 3);
  rect(context, "#168c8b", 48, 48, 4, 3);
  rect(context, "#168c8b", 27, 7, 10, 4);
  rect(context, "#168c8b", 31, 3, 4, 8);
  rect(context, "#c84b3c", 27, 2, 5, 5);
  rect(context, "#d6a12c", 36, 2, 5, 5);
}

function drawCampaignProject(context) {
  rect(context, COLORS.ink, 6, 13, 43, 38);
  rect(context, COLORS.paper, 9, 16, 37, 32);
  rect(context, "#4a70a8", 12, 37, 31, 7);
  rect(context, "#d6a12c", 12, 25, 12, 7);
  rect(context, "#168c8b", 28, 25, 15, 7);
  rect(context, COLORS.ink, 19, 9, 16, 5);
  rect(context, COLORS.ink, 25, 5, 4, 7);
  rect(context, COLORS.ink, 43, 22, 16, 25);
  rect(context, "#c84b3c", 47, 25, 12, 19);
  rect(context, COLORS.paper, 50, 29, 6, 11);
  rect(context, COLORS.ink, 52, 17, 5, 9);
  rect(context, "#c84b3c", 55, 48, 4, 9);
  rect(context, "#c84b3c", 59, 45, 3, 5);
  rect(context, COLORS.ink, 2, 50, 17, 11);
  rect(context, COLORS.paper, 5, 53, 11, 5);
  rect(context, "#168c8b", 8, 55, 5, 2);
}

function drawAuditProject(context) {
  rect(context, COLORS.ink, 8, 8, 48, 49);
  rect(context, COLORS.paper, 11, 11, 42, 43);
  rect(context, "#4a70a8", 15, 43, 25, 6);
  rect(context, "#168c8b", 15, 34, 5, 5);
  rect(context, COLORS.ink, 23, 35, 21, 3);
  rect(context, "#168c8b", 15, 24, 5, 5);
  rect(context, COLORS.ink, 23, 25, 17, 3);
  rect(context, "#c84b3c", 15, 14, 5, 5);
  rect(context, COLORS.ink, 23, 15, 13, 3);
  rect(context, COLORS.ink, 35, 5, 24, 24);
  rect(context, "#d6a12c", 38, 8, 18, 18);
  rect(context, COLORS.paper, 42, 12, 10, 10);
  rect(context, COLORS.ink, 52, 2, 5, 9);
}

function drawOutageProject(context) {
  rect(context, COLORS.ink, 6, 10, 52, 45);
  rect(context, "#6d7c8c", 9, 13, 46, 39);
  rect(context, "#c84b3c", 9, 44, 46, 8);
  rect(context, COLORS.paper, 14, 33, 36, 7);
  rect(context, COLORS.ink, 18, 35, 28, 3);
  rect(context, COLORS.paper, 14, 20, 15, 8);
  rect(context, COLORS.paper, 35, 20, 15, 8);
  rect(context, "#d6a12c", 15, 5, 7, 11);
  rect(context, "#c84b3c", 21, 2, 8, 15);
  rect(context, "#d6a12c", 28, 6, 7, 11);
  rect(context, COLORS.ink, 40, 4, 4, 12);
  rect(context, "#d6a12c", 36, 9, 9, 5);
  rect(context, "#d6a12c", 42, 5, 9, 5);
}

function drawLaunchProject(context) {
  rect(context, COLORS.ink, 5, 9, 42, 42);
  rect(context, "#4a70a8", 8, 12, 36, 36);
  rect(context, "#168c8b", 11, 22, 30, 8);
  rect(context, "#168c8b", 17, 14, 8, 32);
  rect(context, COLORS.paper, 8, 29, 36, 3);
  rect(context, COLORS.paper, 24, 12, 3, 36);
  rect(context, COLORS.ink, 39, 7, 20, 40);
  rect(context, COLORS.paper, 44, 16, 10, 24);
  rect(context, "#c84b3c", 47, 30, 5, 13);
  rect(context, "#d6a12c", 44, 8, 4, 10);
  rect(context, "#d6a12c", 51, 8, 4, 10);
  rect(context, "#c84b3c", 47, 3, 5, 13);
}

function drawIntegrationProject(context) {
  rect(context, COLORS.ink, 3, 8, 24, 46);
  rect(context, "#4a70a8", 6, 11, 18, 40);
  rect(context, COLORS.paper, 9, 42, 5, 5);
  rect(context, COLORS.paper, 17, 42, 4, 5);
  rect(context, COLORS.paper, 9, 31, 5, 5);
  rect(context, COLORS.paper, 17, 31, 4, 5);
  rect(context, COLORS.ink, 37, 8, 24, 46);
  rect(context, "#9b6d9d", 40, 11, 18, 40);
  rect(context, COLORS.paper, 43, 42, 5, 5);
  rect(context, COLORS.paper, 51, 42, 4, 5);
  rect(context, COLORS.paper, 43, 31, 5, 5);
  rect(context, COLORS.paper, 51, 31, 4, 5);
  rect(context, COLORS.ink, 20, 20, 24, 9);
  rect(context, "#d6a12c", 23, 23, 18, 3);
  rect(context, "#168c8b", 29, 14, 6, 6);
}

function drawTransformationBoss(context) {
  rect(context, COLORS.ink, 4, 4, 56, 56);
  rect(context, "#243e52", 7, 7, 50, 50);
  rect(context, "#4a70a8", 10, 10, 12, 44);
  rect(context, "#6d7c8c", 42, 10, 12, 44);
  rect(context, COLORS.ink, 14, 43, 4, 4);
  rect(context, "#168c8b", 14, 33, 4, 4);
  rect(context, "#d6a12c", 46, 43, 4, 4);
  rect(context, "#c84b3c", 46, 33, 4, 4);
  rect(context, COLORS.ink, 20, 16, 24, 32);
  rect(context, "#168c8b", 23, 19, 18, 26);
  rect(context, COLORS.paper, 27, 25, 10, 14);
  rect(context, "#d6a12c", 29, 28, 6, 8);
  rect(context, "#c84b3c", 30, 30, 4, 4);
  rect(context, "#168c8b", 14, 3, 36, 4);
}

function drawGlobalLaunchBoss(context) {
  rect(context, COLORS.ink, 8, 8, 48, 48);
  rect(context, "#4a70a8", 11, 11, 42, 42);
  rect(context, "#168c8b", 15, 24, 34, 12);
  rect(context, "#168c8b", 24, 14, 16, 36);
  rect(context, COLORS.paper, 11, 30, 42, 4);
  rect(context, COLORS.paper, 30, 11, 4, 42);
  rect(context, COLORS.ink, 0, 40, 18, 20);
  rect(context, "#c84b3c", 3, 43, 12, 14);
  rect(context, COLORS.paper, 6, 47, 6, 6);
  rect(context, COLORS.ink, 46, 40, 18, 20);
  rect(context, "#d6a12c", 49, 43, 12, 14);
  rect(context, COLORS.paper, 52, 47, 6, 6);
  rect(context, COLORS.ink, 22, 2, 20, 14);
  rect(context, "#c84b3c", 25, 5, 14, 8);
  rect(context, COLORS.paper, 29, 7, 6, 4);
}

function drawManufacturingBoss(context, variant) {
  rect(context, COLORS.ink, 4, 11, 56, 45);
  rect(context, "#596a6f", 7, 14, 50, 39);
  rect(context, "#9aa2a0", 11, 18, 19, 18);
  rect(context, "#384f59", 34, 18, 19, 31);
  rect(context, COLORS.ink, 14, 22, 13, 10);
  rect(context, "#d6a12c", 17, 24, 7, 6);
  rect(context, "#168c8b", 38, 23, 11, 5);
  rect(context, COLORS.ink, 38, 32, 11, 4);
  rect(context, COLORS.ink, 38, 41, 11, 4);
  rect(context, COLORS.ink, 8, 52, 12, 8);
  rect(context, COLORS.ink, 44, 52, 12, 8);
  if (variant === "recall") {
    rect(context, "#c84b3c", 22, 4, 25, 14);
    rect(context, COLORS.paper, 26, 8, 17, 3);
    rect(context, COLORS.paper, 32, 6, 4, 10);
    rect(context, "#c84b3c", 2, 35, 17, 17);
    rect(context, COLORS.paper, 6, 39, 9, 9);
  } else if (variant === "shutdown") {
    rect(context, "#c84b3c", 25, 1, 7, 14);
    rect(context, "#d6a12c", 31, 5, 8, 5);
    rect(context, "#c84b3c", 37, 1, 5, 13);
    rect(context, COLORS.ink, 2, 39, 23, 5);
    rect(context, "#c84b3c", 13, 36, 5, 11);
  } else if (variant === "quality") {
    rect(context, "#4a70a8", 20, 2, 24, 15);
    rect(context, COLORS.paper, 24, 5, 16, 9);
    rect(context, "#c84b3c", 29, 7, 6, 5);
    rect(context, "#168c8b", 1, 31, 13, 20);
    rect(context, COLORS.paper, 4, 35, 7, 12);
  } else {
    rect(context, "#d6a12c", 20, 2, 24, 15);
    rect(context, COLORS.ink, 24, 5, 16, 9);
    rect(context, COLORS.paper, 28, 7, 8, 5);
    rect(context, "#d6a12c", 52, 4, 7, 24);
    rect(context, COLORS.ink, 45, 5, 14, 4);
  }
}

function drawCommerceBoss(context, variant) {
  rect(context, COLORS.ink, 5, 17, 54, 39);
  rect(context, "#d17655", 8, 20, 48, 33);
  rect(context, COLORS.paper, 12, 24, 12, 10);
  rect(context, COLORS.paper, 28, 24, 12, 10);
  rect(context, COLORS.paper, 44, 24, 8, 10);
  rect(context, COLORS.ink, 12, 39, 40, 4);
  rect(context, "#d6a12c", 15, 45, 10, 8);
  rect(context, "#168c8b", 29, 45, 10, 8);
  rect(context, "#4a70a8", 43, 45, 7, 8);
  if (variant === "logistics") {
    rect(context, "#c84b3c", 3, 4, 13, 13);
    rect(context, "#c84b3c", 48, 4, 13, 13);
    rect(context, COLORS.ink, 14, 9, 36, 4);
    rect(context, COLORS.paper, 7, 8, 5, 5);
    rect(context, COLORS.paper, 52, 8, 5, 5);
  } else if (variant === "orders") {
    rect(context, COLORS.ink, 16, 2, 32, 18);
    rect(context, "#c84b3c", 19, 5, 26, 12);
    rect(context, COLORS.paper, 23, 8, 4, 6);
    rect(context, COLORS.paper, 31, 6, 4, 8);
    rect(context, COLORS.paper, 39, 9, 3, 5);
  } else if (variant === "price") {
    rect(context, "#9b6d9d", 19, 1, 26, 17);
    rect(context, COLORS.paper, 23, 5, 18, 9);
    rect(context, "#c84b3c", 29, 4, 6, 11);
    rect(context, COLORS.ink, 1, 34, 11, 17);
    rect(context, "#d6a12c", 4, 38, 5, 9);
  } else {
    rect(context, "#4a70a8", 8, 4, 14, 14);
    rect(context, "#168c8b", 25, 1, 14, 17);
    rect(context, "#d6a12c", 42, 4, 14, 14);
    rect(context, COLORS.ink, 20, 9, 7, 4);
    rect(context, COLORS.ink, 37, 9, 7, 4);
    rect(context, COLORS.paper, 29, 5, 6, 8);
  }
}

function drawItBoss(context, variant) {
  rect(context, COLORS.ink, 6, 7, 52, 50);
  rect(context, "#243e52", 9, 10, 46, 44);
  rect(context, "#4a70a8", 13, 14, 13, 36);
  rect(context, "#4a70a8", 38, 14, 13, 36);
  rect(context, COLORS.ink, 16, 20, 7, 3);
  rect(context, "#168c8b", 16, 28, 7, 3);
  rect(context, "#d6a12c", 16, 36, 7, 3);
  rect(context, "#c84b3c", 41, 20, 7, 3);
  rect(context, "#168c8b", 41, 28, 7, 3);
  rect(context, "#d6a12c", 41, 36, 7, 3);
  rect(context, COLORS.ink, 25, 29, 14, 5);
  if (variant === "traffic") {
    rect(context, "#c84b3c", 1, 17, 9, 5);
    rect(context, "#c84b3c", 54, 17, 9, 5);
    rect(context, "#c84b3c", 1, 39, 9, 5);
    rect(context, "#c84b3c", 54, 39, 9, 5);
    rect(context, "#d6a12c", 28, 1, 8, 13);
  } else if (variant === "datacenter") {
    rect(context, "#6d7c8c", 22, 2, 20, 13);
    rect(context, COLORS.paper, 26, 5, 12, 3);
    rect(context, "#c84b3c", 29, 10, 6, 3);
    rect(context, "#c84b3c", 27, 49, 10, 12);
  } else if (variant === "security") {
    rect(context, "#c84b3c", 21, 1, 22, 20);
    rect(context, COLORS.ink, 25, 5, 14, 12);
    rect(context, COLORS.paper, 28, 8, 3, 3);
    rect(context, COLORS.paper, 34, 8, 3, 3);
    rect(context, COLORS.paper, 30, 13, 5, 2);
  } else {
    rect(context, "#168c8b", 20, 1, 24, 20);
    rect(context, COLORS.paper, 24, 5, 16, 12);
    rect(context, "#4a70a8", 29, 5, 6, 12);
    rect(context, "#4a70a8", 24, 9, 16, 4);
    rect(context, "#d6a12c", 1, 28, 9, 9);
    rect(context, "#d6a12c", 54, 28, 9, 9);
  }
}

function drawBossPhase(context, phase) {
  if (phase >= 2) {
    rect(context, "#c84b3c", 1, 55, 10, 5);
    rect(context, "#c84b3c", 53, 55, 10, 5);
    rect(context, "#c84b3c", 1, 4, 10, 5);
    rect(context, "#c84b3c", 53, 4, 10, 5);
  }
  if (phase >= 3) {
    rect(context, "#d6a12c", 28, 56, 8, 8);
    rect(context, "#d6a12c", 28, 0, 8, 8);
    rect(context, COLORS.paper, 31, 58, 2, 4);
    rect(context, COLORS.paper, 31, 2, 2, 4);
  }
}

function drawBoss(canvas, projectId = "revision", phase = 1) {
  if (!canvas) return;
  const context = pixelContext(canvas);
  if (projectId === "schedule") drawScheduleProject(context);
  else if (projectId === "migration") drawMigrationProject(context);
  else if (projectId === "campaign") drawCampaignProject(context);
  else if (projectId === "audit") drawAuditProject(context);
  else if (projectId === "outage") drawOutageProject(context);
  else if (projectId === "launch") drawLaunchProject(context);
  else if (projectId === "integration") drawIntegrationProject(context);
  else if (projectId === "boss-transformation") drawTransformationBoss(context);
  else if (projectId === "boss-global-launch") drawGlobalLaunchBoss(context);
  else if (projectId.startsWith("boss-manufacturing-")) drawManufacturingBoss(context, projectId.replace("boss-manufacturing-", ""));
  else if (projectId.startsWith("boss-commerce-")) drawCommerceBoss(context, projectId.replace("boss-commerce-", ""));
  else if (projectId.startsWith("boss-it-")) drawItBoss(context, projectId.replace("boss-it-", ""));
  else drawRevisionProject(context);
  if (projectId.startsWith("boss-")) drawBossPhase(context, phase);
}

renderTitle();
