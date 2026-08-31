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

const PROJECTS = [
  { id: "revision", industry: "common", art: "revision", name: "끝없는 수정 요청", difficulty: "초급", workload: 210, deadline: 8, cash: 700, reputation: 12, eventEvery: 2, recommended: ["planning", "quality", "sales"], summary: "쌓여가는 수정표와 최종 파일을 정리합니다." },
  { id: "schedule", industry: "common", art: "schedule", name: "엉킨 납품 일정", difficulty: "초급+", workload: 240, deadline: 8, cash: 780, reputation: 14, eventEvery: 2, recommended: ["management", "production", "logistics", "planning"], summary: "겹쳐버린 일정과 마감 시계를 다시 맞춥니다." },

  { id: "mfg-prototype", industry: "manufacturing", art: "revision", name: "첫 시제품 납품", difficulty: "초급", workload: 225, deadline: 8, cash: 760, reputation: 13, eventEvery: 2, recommended: ["product", "production", "quality"], summary: "설계안을 실제 제품으로 완성해 첫 고객에게 납품합니다." },
  { id: "mfg-supplier", industry: "manufacturing", art: "migration", name: "핵심 부품 수급 위기", difficulty: "중급", workload: 290, deadline: 9, cash: 930, reputation: 17, eventEvery: 2, recommended: ["procurement", "production", "finance"], summary: "멈춰가는 생산라인에 필요한 부품을 제때 확보합니다." },
  { id: "mfg-defect", industry: "manufacturing", art: "audit", name: "불량률 0.1% 작전", difficulty: "중상급", workload: 350, deadline: 10, cash: 1120, reputation: 22, eventEvery: 2, recommended: ["quality", "production", "product"], summary: "공정 곳곳에 숨은 불량 원인을 추적해 제거합니다." },
  { id: "mfg-automation", industry: "manufacturing", art: "integration", name: "스마트 공장 전환", difficulty: "상급", workload: 425, deadline: 11, cash: 1430, reputation: 28, eventEvery: 1, recommended: ["production", "product", "procurement"], summary: "기존 생산라인을 멈추지 않고 자동화 설비로 전환합니다." },

  { id: "com-entry", industry: "commerce", art: "campaign", name: "첫 거래처 입점", difficulty: "초급", workload: 220, deadline: 8, cash: 750, reputation: 13, eventEvery: 2, recommended: ["sales", "md", "logistics"], summary: "상품 구성과 조건을 맞춰 첫 대형 거래처에 입점합니다." },
  { id: "com-season", industry: "commerce", art: "launch", name: "시즌 초대형 할인전", difficulty: "중급", workload: 300, deadline: 9, cash: 960, reputation: 18, eventEvery: 2, recommended: ["marketing", "md", "sales"], summary: "상품과 광고, 고객 요청이 몰리는 할인전을 성공시킵니다." },
  { id: "com-inventory", industry: "commerce", art: "migration", name: "창고 재고 대이동", difficulty: "중상급", workload: 355, deadline: 10, cash: 1140, reputation: 22, eventEvery: 2, recommended: ["logistics", "md", "finance"], summary: "뒤섞인 재고를 새 물류센터로 정확하게 옮깁니다." },
  { id: "com-returns", industry: "commerce", art: "audit", name: "반품 폭주 수습", difficulty: "상급", workload: 420, deadline: 11, cash: 1410, reputation: 27, eventEvery: 1, recommended: ["marketing", "logistics", "sales"], summary: "쏟아지는 반품과 고객 문의를 막아 신뢰를 회복합니다." },

  { id: "it-mvp", industry: "it", art: "campaign", name: "첫 서비스 MVP 출시", difficulty: "초급", workload: 230, deadline: 8, cash: 770, reputation: 14, eventEvery: 2, recommended: ["planning", "dev", "design"], summary: "핵심 기능을 정리해 첫 사용자에게 서비스를 공개합니다." },
  { id: "it-migration", industry: "it", art: "migration", name: "무중단 서버 이전", difficulty: "중급", workload: 305, deadline: 9, cash: 970, reputation: 18, eventEvery: 2, recommended: ["dev", "operations", "planning"], summary: "서비스를 멈추지 않고 모든 데이터를 새 서버로 옮깁니다." },
  { id: "it-renewal", industry: "it", art: "revision", name: "전면 UX 개편", difficulty: "중상급", workload: 360, deadline: 10, cash: 1160, reputation: 22, eventEvery: 2, recommended: ["design", "planning", "dev"], summary: "복잡해진 서비스를 사용자가 이해하기 쉽게 다시 설계합니다." },
  { id: "it-security", industry: "it", art: "audit", name: "보안 취약점 감사", difficulty: "상급", workload: 430, deadline: 11, cash: 1450, reputation: 29, eventEvery: 1, recommended: ["operations", "dev", "planning"], summary: "서비스 곳곳의 위험 요소를 찾아 출시 전에 차단합니다." }
];

const BOSS_PROJECTS = [
  { id: "boss-recall", industry: "manufacturing", art: "boss-transformation", name: "전국 제품 리콜", difficulty: "BOSS", workload: 820, deadline: 19, cash: 2800, reputation: 58, eventEvery: 1, boss: true, recommended: ["quality", "production", "product"], summary: "전국에 출고된 제품을 회수하고 원인을 고치는 초대형 장기 프로젝트입니다.", phaseNames: ["원인 추적", "전량 회수", "생산 재개"] },
  { id: "boss-logistics", industry: "commerce", art: "boss-global-launch", name: "전국 물류망 마비", difficulty: "BOSS", workload: 830, deadline: 19, cash: 2850, reputation: 58, eventEvery: 1, boss: true, recommended: ["logistics", "md", "sales"], summary: "멈춰버린 물류센터와 배송망을 순서대로 복구하는 장기 프로젝트입니다.", phaseNames: ["병목 확인", "거점 복구", "전국 정상화"] },
  { id: "boss-launch-outage", industry: "it", art: "boss-transformation", name: "출시 당일 서버 대폭주", difficulty: "BOSS", workload: 840, deadline: 19, cash: 2900, reputation: 60, eventEvery: 1, boss: true, recommended: ["operations", "dev", "planning"], summary: "예상을 뛰어넘은 접속자를 버티며 장애를 막아내는 장기 프로젝트입니다.", phaseNames: ["트래픽 분석", "긴급 증설", "서비스 안정화"] }
];

const DEFAULT_REPRESENTATIVE_APPEARANCE = {
  face: 0, skin: 1, hair: 1, eyes: 0, eyebrows: 0,
  nose: 0, mouth: 3, accessory: 0, outfit: 0
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

const state = {
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
  specialRecruitmentTickets: 0
};

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
  const range = damageRange(value, variance);
  return `업무 -${range.min}~${range.max}`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
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
    outfit: Math.floor(seed / 23) % 12
  };
}

function employee(name, department, trait, work, collaboration, speed, look, rank = 0) {
  return {
    id: `employee-${nextId++}`,
    name, department, trait, work, collaboration, speed,
    focus: Math.round((work + collaboration) / 2),
    salary: 120 + rank * 72,
    rank, isRepresentative: false, equipment: { work: null, support: null, personal: null },
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

function renderTitle() {
  currentView = "title";
  app.classList.add("title-mode");
  app.innerHTML = `<section class="title-screen">
    <img class="title-art" src="assets/office-raid-title.webp?v=20260831" alt="세 명의 회사원이 거대한 프로젝트 보스를 마주한 오피스 레이드 타이틀 이미지">
    <div class="title-actions">
      <p>프로젝트는 거대하고, 퇴근은 멀었다.</p>
      <button id="start-game" class="mustard">게임 시작</button>
    </div>
  </section>`;
  document.querySelector("#start-game").addEventListener("click", () => {
    document.querySelector(".title-screen").classList.add("leaving");
    window.setTimeout(renderOpening, 240);
  });
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
      <div class="setup-story-preview" aria-label="거대한 프로젝트에 도전하는 팀의 연출 장면">
        <span class="setup-project-glow" aria-hidden="true"></span>
        <span class="setup-deadline-stamp">DEADLINE<br><strong>D-8</strong></span>
        <canvas id="setup-boss" width="64" height="64" aria-label="프로젝트 보스"></canvas>
        <i class="story-paper story-paper-one" aria-hidden="true"></i>
        <i class="story-paper story-paper-two" aria-hidden="true"></i>
        <i class="story-paper story-paper-three" aria-hidden="true"></i>
        <div class="setup-story-team">
          <canvas width="24" height="24" data-setup-member="0" aria-label="대표의 뒷모습"></canvas>
          <canvas width="24" height="24" data-setup-member="1" aria-label="${escapeHtml(DEPARTMENTS[industry.starters[0].department].name)} 담당자의 뒷모습"></canvas>
          <canvas width="24" height="24" data-setup-member="2" aria-label="${escapeHtml(DEPARTMENTS[industry.starters[1].department].name)} 담당자의 뒷모습"></canvas>
        </div>
      </div>
      <h2>${escapeHtml(industry.name)} 창업</h2>
      <p>${escapeHtml(industry.departmentLabel)}<br>${escapeHtml(industry.combatStyle)}</p>
      <span class="genre-tag">${escapeHtml(industry.name)} · 창립 준비</span>
      <label class="sr-only" for="company-name">회사 이름</label>
      <div class="input-with-button"><input id="company-name" maxlength="18" value="${escapeHtml(state.companyName || generateCompanyName(state.industry))}" autocomplete="organization"><button id="random-company" class="mustard">랜덤 생성</button></div>
      <div class="setup-actions"><button id="back-industry" class="ink">← 업종</button><button id="create-company" class="teal">다음 · 대표 만들기</button></div>
    </div></section>`;
  drawBoss(document.querySelector("#setup-boss"));
  const setupDepartments = ["management", ...industry.starters.map(member => member.department)];
  document.querySelectorAll("[data-setup-member]").forEach((canvas, index) => {
    const department = setupDepartments[index];
    drawBackPortrait(canvas, { department, appearance: appearance([1103, industry.starters[0].look, industry.starters[1].look][index]) });
  });
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
    : [["skin", "피부", 6], ["hair", "머리", 16], ["outfit", "의상", 12], ["accessory", "액세서리", 9]];
  const rows = parts.map(([part, label, count]) => `<div class="custom-row"><strong>${label} <span>${look[part] + 1}/${count}</span></strong><button data-part="${part}" data-delta="-1" aria-label="${label} 이전">◀</button><button data-part="${part}" data-delta="1" aria-label="${label} 다음">▶</button></div>`).join("");
  app.innerHTML = `${header("대표 만들기", "이름과 외형은 능력치에 영향을 주지 않습니다.")}
    <section class="screen"><div class="representative panel">
      <canvas id="representative-preview" width="24" height="24" aria-label="대표 정면 미리보기"></canvas>
      <label class="sr-only" for="representative-name">대표 이름</label>
      <div class="input-with-button"><input id="representative-name" maxlength="10" value="${escapeHtml(representativeDraft.name)}"><button id="random-representative-name" class="mustard">이름 랜덤</button></div>
      <button id="random-appearance" class="blue full-button">외형 전체 랜덤</button>
      <div class="custom-tabs"><button id="basic-parts" class="${representativeMode === "basic" ? "active" : ""}">기본 외형</button><button id="detail-parts" class="${representativeMode === "detail" ? "active" : ""}">얼굴 세부</button></div>
      <div class="custom-list">${rows}</div>
    </div>
    <div class="footer-actions"><button class="ink" id="back-company">← 회사 이름</button><button class="teal" id="finish-company">회사 시작</button></div></section>`;
  drawPortrait(document.querySelector("#representative-preview"), { department: "management", appearance: look });
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
  const counts = { face: 8, skin: 6, hair: 16, eyes: 10, eyebrows: 8, nose: 8, mouth: 10, outfit: 12, accessory: 9 };
  representativeDraft.appearance[part] = (representativeDraft.appearance[part] + delta + counts[part]) % counts[part];
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
  if (["laptop", "tablet", "calculator", "planner"].includes(art)) return "업무에 사용 중";
  if (art === "wallet") return "영업 활동에 휴대 중";
  if (["coffee", "tumbler"].includes(art)) return "틈틈이 마시는 중";
  return "책상에 놓고 사용 중";
}

function officeEquipmentMarkup(member) {
  const equipped = Object.values(member.equipment || {}).filter(Boolean);
  const props = equipped.map(item => {
    const art = equipmentArtFor(item);
    const rarity = EQUIPMENT_RARITIES[item.rarity];
    return `<canvas class="office-equipment-prop prop-${escapeHtml(art)} rarity-${item.rarity}" width="24" height="24" data-equipment-icon="${escapeHtml(art)}" data-equipment-rarity="${item.rarity}" style="--rarity-color:${rarity.color}" aria-label="${escapeHtml(item.name)} · ${officeEquipmentUsage(item)}"></canvas>`;
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
  const teamNames = currentTeam().map(member => escapeHtml(member.name)).join(" · ");
  const specialRecruitment = state.specialRecruitmentTickets > 0
    ? `이용권 ${state.specialRecruitmentTickets}장 보유`
    : specialRecruitmentProgress();
  const officeMembers = state.employees.slice(0, state.capacity);
  const industry = currentIndustry();
  const desks = officeMembers.map(member => `<div class="desk" data-office-worker="${member.id}" role="button" tabindex="0" aria-label="${escapeHtml(member.name)}의 사용 장비 확인"><span class="office-speech" data-office-speech="${member.id}" aria-live="polite"></span>${officeEquipmentMarkup(member)}<strong>${escapeHtml(member.name)}</strong><small>${DEPARTMENTS[member.department].short} · ${employeePosition(member)}</small></div>`).join("");
  app.innerHTML = `${header("작은 사무실", notice)}
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
          <p><b>PROJECT TEAM</b><span>${teamNames}</span></p>
          <p><b>성과 ${state.projectClears}회</b><span>특별채용 · ${specialRecruitment}</span></p>
        </div>
      </div>
      <div class="actions office-actions">
        <button class="blue" id="interview">면접</button>
        <button class="teal" id="team">팀 편성</button>
        <button class="mustard" id="equipment">장비 ${state.equipment.length}</button>
        <button class="red" id="project">프로젝트</button>
      </div>
    </section>`;
  mountPortraits();
  mountEquipmentIcons();
  document.querySelector("#interview").addEventListener("click", () => openInterview());
  document.querySelector("#team").addEventListener("click", openTeam);
  document.querySelector("#equipment").addEventListener("click", () => openEquipment());
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

function regularProjectOptions() {
  const industryProjects = PROJECTS.filter(project => project.industry === state.industry);
  const commonProjects = PROJECTS.filter(project => project.industry === "common");
  const pool = [...industryProjects, ...commonProjects];
  const start = state.projectClears % pool.length;
  return [0, 1, 2].map(offset => scaledProject(pool[(start + offset) % pool.length]));
}

function nextBossProject() {
  const pool = BOSS_PROJECTS.filter(project => project.industry === state.industry);
  return scaledProject(pool[state.bossClears % pool.length] || BOSS_PROJECTS[0]);
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
  return `<article class="project-card panel ${project.boss ? "boss-project" : ""} ${locked ? "locked" : ""}">
    <div class="project-card-head"><span>${escapeHtml(project.difficulty)}</span><strong>${escapeHtml(project.name)}</strong></div>
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
  const boss = nextBossProject();
  const bossCard = projectCard(boss, !bossProjectReady());
  const industry = currentIndustry();
  app.innerHTML = `${header("프로젝트 선택", `${industry?.name || "회사"} 계약 · 추천 부서를 편성하면 처리량이 증가합니다.`)}
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
  const stats = effectiveStats(target);
  const people = state.employees.map(member => `<button class="${member.id === target.id ? "active" : ""}" data-equipment-target="${member.id}">${escapeHtml(member.name)}</button>`).join("");
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
  state.postingRefreshes -= 1;
  regularCandidates = generateCandidates(3, "regular");
  regularPostingInitialized = true;
  renderInterview(cost > 0 ? `자금 ${cost}을 사용해 채용 공고를 갱신했습니다.` : "채용 공고를 무료로 갱신했습니다.");
}

function openTeam() {
  currentView = "team";
  teamDraft = [...state.teamIds];
  renderTeam("참가할 직원 3명을 선택하세요. 선택 순서대로 배치됩니다.");
}

function renderTeam(notice) {
  const cards = state.employees.map(member => {
    const selectedIndex = teamDraft.indexOf(member.id);
    const stats = effectiveStats(member);
    return `<article class="team-card ${selectedIndex >= 0 ? "selected" : ""}">
      <canvas width="24" height="24" data-portrait="${member.id}"></canvas>
      <div><h3>${selectedIndex >= 0 ? `<span class="order">${selectedIndex + 1}</span>` : ""}${escapeHtml(member.name)}</h3>
      <p class="dept">${DEPARTMENTS[member.department].name} · ${employeePosition(member)} · ${escapeHtml(member.trait)}</p>
      <p>실무 ${stats.work}　협업 ${stats.collaboration}　속도 ${member.speed}</p></div>
      <button class="${selectedIndex >= 0 ? "red" : "teal"}" data-toggle="${member.id}">${selectedIndex >= 0 ? "제외" : "선택"}</button>
    </article>`;
  }).join("");
  app.innerHTML = `${header("프로젝트 팀 편성", `선택 ${teamDraft.length}/3 · ${notice}`)}<section class="screen">
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
  renderTeam("참가할 직원 3명을 선택하세요.");
}

function saveTeam() {
  if (teamDraft.length !== 3) return renderTeam("프로젝트 참가자는 정확히 3명이어야 합니다.");
  state.teamIds = [...teamDraft];
  renderOffice("프로젝트 팀 편성을 저장했습니다.");
}

function startBattle(projectId) {
  currentView = "battle";
  const source = [...PROJECTS, ...BOSS_PROJECTS].find(project => project.id === projectId) || PROJECTS[0];
  if (source.boss && !bossProjectReady()) return renderProjectBoard();
  const project = scaledProject(source);
  battle = {
    project,
    max: project.max, workload: project.max, action: 0, deadline: project.deadline, momentum: 0, requirements: false,
    result: null, rewardClaimed: false, log: "업무 분담을 시작합니다.", status: null,
    eventText: "", nextEventRound: project.eventEvery, eventCursor: randomInt(4), preparedRound: 0,
    directiveGauge: 50, awaitingDirective: false, directiveReason: "", directiveSelections: {}, directiveFocusId: null, directiveCooldowns: {},
    thresholdSeventy: false, thresholdForty: false, phase: 1, phaseAnnouncement: "",
    deadlineBonus: 0, automationDamage: 0, automationTurns: 0, skillFx: null
  };
  renderBattle();
  battleTimer = window.setTimeout(battleStep, 900);
}

function clearBattleTimer() {
  if (battleTimer !== null) window.clearTimeout(battleTimer);
  battleTimer = null;
}

function battleStep() {
  if (currentView !== "battle" || battle.result || battle.awaitingDirective || battle.skillFx) return;
  const team = currentTeam();
  const member = team[battle.action % team.length];
  const round = Math.floor(battle.action / team.length) + 1;
  if (battle.action % team.length === 0 && battle.preparedRound !== round) {
    battle.preparedRound = round;
    advanceBattleStatus();
    battle.eventText = "";
    if (battle.automationTurns > 0) {
      const automationResult = rollDamage(battle.automationDamage);
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
  damage = rollDamage(Math.max(1, damage));
  battle.workload = Math.max(0, battle.workload - damage);
  const eventLine = battle.eventText ? `${battle.eventText}\n` : "";
  battle.log = `${eventLine}${member.name}의 ${skill}! 업무량 ${damage} 처리${affinity ? " · 부서 상성!" : ""}`;
  battle.eventText = "";
  battle.action += 1;
  addDirectiveGauge(10, "팀의 업무 흐름이 모였습니다.");
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
    state.reputation += battle.project.reputation;
    state.projectClears += 1;
    if (battle.project.boss) state.bossClears += 1;
    state.postingRefreshes = POSTING_REFRESH_MAX;
    const specialUnlocked = state.projectClears === 5 || (state.projectClears > 5 && (state.projectClears - 5) % 10 === 0);
    if (specialUnlocked) {
      state.specialRecruitmentTickets += 1;
      specialCandidates = [];
    }
    battle.recruitmentNotice = specialUnlocked ? "헤드헌팅권 1장 획득!" : `공고 갱신 ${POSTING_REFRESH_MAX}/${POSTING_REFRESH_MAX} 회복`;
    battle.rewards = battle.project.boss
      ? [generateEquipmentReward(2), generateEquipmentReward(2)]
      : [generateEquipmentReward()];
    battle.reward = battle.rewards[0];
    state.equipment.push(...battle.rewards);
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
  const team = currentTeam();
  ensureDirectiveAvailability(team);
  battle.awaitingDirective = true;
  battle.directiveSelections = {};
  battle.directiveFocusId = team[0]?.id || null;
  battle.log = `긴급 지시 · ${battle.directiveReason || "스킬을 선택하세요."}`;
  renderBattle();
}

function directivePanel(team) {
  if (!battle.awaitingDirective) return "";
  const focus = team.find(member => member.id === battle.directiveFocusId) || team[0];
  const selectedCount = Object.keys(battle.directiveSelections).length;
  const tabs = team.map(member => {
    const selected = battle.directiveSelections[member.id];
    return `<button class="directive-tab ${member.id === focus.id ? "active" : ""} ${selected ? "done" : ""}" data-directive-member="${member.id}">${selected ? "✓ " : ""}${escapeHtml(member.name)}</button>`;
  }).join("");
  const options = directiveSkillsFor(focus.department).map(skill => {
    const preview = directiveSkillPreview(focus, skill.id);
    const selected = battle.directiveSelections[focus.id] === skill.id;
    const cooldown = directiveCooldownFor(focus.id, skill.id);
    const cooldownText = cooldown ? `대기 ${cooldown}회` : `재사용 ${skill.cooldown}회`;
    return `<button class="skill-option effect-${preview.tone} ${selected ? "selected" : ""} ${cooldown ? "cooling" : ""}" data-directive-skill="${skill.id}" data-member-id="${focus.id}" aria-pressed="${selected}" ${cooldown ? "disabled" : ""}><span class="skill-effect"><i>${preview.icon}</i><b>${escapeHtml(preview.primary)}</b></span><strong>${escapeHtml(skill.name)}</strong><span>${escapeHtml(preview.secondary)}</span><small class="skill-cooldown ${cooldown ? "waiting" : ""}">${cooldownText}</small><em>${escapeHtml(skill.visual)}</em></button>`;
  }).join("");
  const summary = team.map(member => {
    const skill = directiveSkillsFor(member.department).find(option => option.id === battle.directiveSelections[member.id]);
    return skill ? skill.name : "미선택";
  }).join(" → ");
  const actionText = selectedCount < team.length ? `${team.length - selectedCount}명 선택` : "지시 실행";
  return `<div class="directive-panel"><div class="directive-head"><div><strong>긴급 지시</strong><small>스킬을 누르면 전투 화면에 효과가 표시됩니다.</small></div><b>${selectedCount}/${team.length}</b></div><div class="directive-tabs">${tabs}</div><div class="skill-options">${options}</div><div class="directive-footer"><small>${escapeHtml(summary)}</small><button id="execute-directive" class="mustard" ${selectedCount < team.length ? "disabled" : ""}>${actionText}</button></div></div>`;
}

function withDirectiveRange(preview) {
  const range = damageRange(preview.damage || 0, DIRECTIVE_DAMAGE_VARIANCE);
  const repeatRange = damageRange(preview.repeat || 0, NORMAL_DAMAGE_VARIANCE);
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
    const immediate = damageRange(8, DIRECTIVE_DAMAGE_VARIANCE);
    const lasting = damageRange(repeat, NORMAL_DAMAGE_VARIANCE);
    return withDirectiveRange({ icon: "↻", tone: "lasting", target: "project", primary: `즉시 -${immediate.min}~${immediate.max}`, secondary: `이후 2턴 × -${lasting.min}~${lasting.max}`, damage: 8, repeat });
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
  const team = currentTeam();
  if (team.some(member => !battle.directiveSelections[member.id])) return;
  if (team.some(member => directiveCooldownFor(member.id, battle.directiveSelections[member.id]) > 0)) return;
  const skills = Object.values(battle.directiveSelections);
  let total = 0;
  let cleared = false;
  const boosted = skills.includes("emergency-command") || skills.includes("budget-approval");
  team.forEach(member => {
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
  const expected = damageRange(total, DIRECTIVE_DAMAGE_VARIANCE);
  const actualTotal = rollDamage(total, DIRECTIVE_DAMAGE_VARIANCE);
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
  const varianceResult = actualTotal >= Math.round(total * 1.1) ? " · GREAT!" : actualTotal <= Math.round(total * .9) ? " · 변동 최소" : "";
  const detail = `업무량 ${actualTotal} 처리 · 예상 ${expected.min}~${expected.max}${varianceResult}${combo ? ` · ${combo} 연계` : ""}${cleared ? " · 상태 제거" : ""}`;
  battle.log = `PERFECT WORKFLOW! ${detail}`;
  battle.skillFx = { title: combo || "PERFECT WORKFLOW", detail };
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
  }, 1300);
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

function renderBattle() {
  const team = currentTeam();
  const preview = activeDirectivePreview(team);
  const rewards = battle.rewards || (battle.reward ? [battle.reward] : []);
  const bestRewardRarity = rewards.length ? Math.max(...rewards.map(reward => reward.rarity)) : 0;
  const rewardShowcase = rewards.length ? `<div class="reward-showcase best-rarity-${bestRewardRarity}" style="--rarity-color:${EQUIPMENT_RARITIES[bestRewardRarity].color}"><small class="reward-label">PROJECT REWARD</small><div class="reward-items">${rewards.map(equipmentRewardCard).join("")}</div></div>` : "";
  const result = battle.result === "success" ? `<div class="battle-result"><h2>${battle.project.boss ? "BOSS PROJECT CLEAR" : "PROJECT CLEAR"}</h2><p>현금 +${battle.project.cash} · 평판 +${battle.project.reputation}</p>${rewardShowcase}${battle.recruitmentNotice ? `<p class="reward-notice">${escapeHtml(battle.recruitmentNotice)}</p>` : ""}</div>` : battle.result === "failure" ? `<div class="battle-result"><h2 style="color:#c84b3c">DEADLINE OVER</h2><p>팀 편성과 부서 연계를 바꿔 다시 도전하세요.</p></div>` : "";
  const fighters = team.map(member => `<div class="fighter ${preview?.target === "team" ? "preview-target" : ""}"><canvas width="24" height="24" data-portrait="${member.id}" data-facing="back"></canvas><strong>${escapeHtml(member.name)}</strong></div>`).join("");
  const round = Math.min(battle.deadline, Math.floor(battle.action / Math.max(1, team.length)) + 1);
  const statusName = battle.status ? `${battle.status.name} ${battle.status.turns}턴` : "안정";
  const statusTone = battle.status ? battle.status.tone : "good";
  const directive = directivePanel(team);
  const skillFx = battle.skillFx ? `<div class="skill-cinematic"><i></i><i></i><i></i><strong>${escapeHtml(battle.skillFx.title)}</strong><span>${escapeHtml(battle.skillFx.detail)}</span></div>` : "";
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
  app.innerHTML = `${header("프로젝트 돌입", battle.result ? "프로젝트 결과를 확인하세요." : battle.awaitingDirective ? "자동 전투 일시 정지 · 직원 아래에서 스킬을 선택하세요." : "지시 게이지가 가득 차면 전투가 잠시 멈춥니다.")}
    <section class="screen battle-screen ${battle.awaitingDirective ? "directive-active" : ""}">
      <div class="boss-card panel ${battle.project.boss ? "boss-active" : ""}"><div class="boss-row"><div><strong>${escapeHtml(battle.project.name)}</strong><small>${escapeHtml(phaseText)}</small></div><span id="workload-text">업무량 ${battle.workload}/${battle.max}</span></div><div class="bar"><i id="workload-bar" style="width:${workloadPercent}%"></i>${workloadPreview}</div><div class="directive-meter"><b>긴급 지시</b><div><i id="directive-gauge" style="width:${battle.directiveGauge}%"></i></div><span id="directive-text">${battle.awaitingDirective ? "READY" : battle.directiveGauge + "%"}</span></div></div>
      <div class="arena panel ${battle.project.boss ? "boss-arena" : ""} ${preview ? `preview-${preview.target}` : ""}" id="arena"><canvas id="boss-canvas" width="64" height="64" aria-label="${escapeHtml(battle.project.name)}"></canvas><div class="status-chip ${statusTone} ${preview?.target === "status" ? "preview-target" : ""}" id="status-chip">STATUS · ${statusName}</div><div class="deadline ${preview?.target === "deadline" ? "preview-target" : ""}" id="deadline">마감 ${round}/${battle.deadline}${preview?.deadline ? ` → ${round}/${battle.deadline + preview.deadline}` : ""}</div><div class="battle-team">${fighters}</div>${arenaPreview}${skillFx}</div>
      ${directive}
      <div class="battle-log panel" id="battle-log">${result || escapeHtml(battle.log)}</div>
      <button class="ink" id="leave-battle">${battle.result ? "사무실로" : "프로젝트 중단"}</button>
    </section>`;
  drawBoss(document.querySelector("#boss-canvas"), battle.project.art || battle.project.id, battle.phase);
  mountPortraits();
  mountEquipmentIcons();
  document.querySelectorAll("[data-directive-member]").forEach(button => button.addEventListener("click", () => selectDirectiveMember(button.dataset.directiveMember)));
  document.querySelectorAll("[data-directive-skill]").forEach(button => button.addEventListener("click", () => selectDirectiveSkill(button.dataset.memberId, button.dataset.directiveSkill)));
  document.querySelector("#execute-directive")?.addEventListener("click", executeDirective);
  document.querySelector("#leave-battle").addEventListener("click", () => renderOffice(battle.result === "success" ? "프로젝트 보상을 획득했습니다." : "사무실로 돌아왔습니다."));
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
  deadline.textContent = `마감 ${round}/${battle.deadline}`;
  log.textContent = battle.log;
  status.textContent = battle.status ? `STATUS · ${battle.status.name} ${battle.status.turns}턴` : "STATUS · 안정";
  status.className = `status-chip ${battle.status ? battle.status.tone : "good"}`;
  directiveGauge.style.width = `${battle.directiveGauge}%`;
  directiveText.textContent = battle.directiveGauge >= 100 ? "READY" : `${battle.directiveGauge}%`;
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

function drawBackPortrait(canvas, member) {
  if (!canvas || !member) return;
  const context = pixelContext(canvas);
  const look = member.appearance;
  const skin = COLORS.skin[look.skin];
  const hair = COLORS.hair[Math.floor(look.hair / 3) % COLORS.hair.length];
  const shirt = COLORS.outfit[look.outfit];
  const department = DEPARTMENTS[member.department].color;
  rect(context, COLORS.ink, 3, 0, 18, 6);
  rect(context, shirt, 4, 1, 16, 5);
  rect(context, department, 10, 1, 4, 5);
  rect(context, skin, 10, 5, 4, 2);
  rect(context, COLORS.ink, 4, 7, 16, 13);
  rect(context, hair, 5, 8, 14, 12);
  rect(context, COLORS.ink, 5, 18, 14, 4);
  rect(context, hair, 6, 19, 12, 4);
  if (look.hair % 4 === 2) { rect(context, hair, 3, 8, 3, 10); rect(context, hair, 18, 8, 3, 10); }
  if (look.hair % 4 === 3) { rect(context, hair, 2, 6, 4, 12); rect(context, hair, 18, 6, 4, 12); }
}

function drawPortrait(canvas, member) {
  if (!canvas || !member) return;
  const context = pixelContext(canvas);
  const look = member.appearance;
  const skin = COLORS.skin[look.skin];
  const hair = COLORS.hair[Math.floor(look.hair / 3) % COLORS.hair.length];
  const shirt = COLORS.outfit[look.outfit];
  const department = DEPARTMENTS[member.department].color;

  rect(context, COLORS.ink, 2, 0, 20, 6);
  rect(context, shirt, 3, 0, 18, 5);
  rect(context, skin, 10, 4, 4, 3);
  if (look.outfit % 3 === 0) rect(context, department, 11, 1, 2, 4);
  else if (look.outfit % 3 === 1) rect(context, department, 9, 2, 6, 2);

  drawFaceShape(context, skin, look.face);

  if (look.hair !== 15) {
    rect(context, COLORS.ink, 4, 17, 16, 4);
    rect(context, hair, 5, 18, 14, 4);
  } else {
    rect(context, COLORS.ink, 6, 17, 12, 2);
    rect(context, hair, 7, 18, 10, 1);
  }
  const hairStyle = look.hair % 8;
  if (hairStyle === 1) rect(context, hair, 5, 14, 4, 5);
  if (hairStyle === 2) { rect(context, hair, 3, 10, 3, 9); rect(context, hair, 18, 10, 3, 9); }
  if (hairStyle === 3) { rect(context, hair, 3, 6, 3, 13); rect(context, hair, 18, 6, 3, 13); }
  if (hairStyle === 4) { rect(context, hair, 5, 15, 14, 4); }
  if (hairStyle === 5) { rect(context, COLORS.ink, 9, 21, 6, 3); rect(context, hair, 10, 22, 4, 2); }
  if (hairStyle === 6) { rect(context, hair, 2, 11, 3, 6); rect(context, hair, 19, 11, 3, 6); }
  if (hairStyle === 7) rect(context, hair, 17, 10, 4, 9);

  const eyebrowColor = hair === COLORS.ink ? "#573b32" : COLORS.ink;
  drawEyebrows(context, eyebrowColor, look.eyebrows);
  drawEyes(context, look.eyes);
  drawNose(context, look.nose);
  drawMouth(context, look.mouth);

  if (look.accessory === 1 || look.accessory === 2) {
    const frame = look.accessory === 1 ? "#4a70a8" : COLORS.ink;
    rect(context, frame, 5, 12, 6, 3); rect(context, frame, 13, 12, 6, 3);
    rect(context, skin, 6, 13, 4, 1); rect(context, skin, 14, 13, 4, 1); rect(context, frame, 11, 13, 2, 1);
  }
  if (look.accessory === 3) { rect(context, "#d6a12c", 3, 10, 1, 1); rect(context, "#d6a12c", 20, 10, 1, 1); }
  if (look.accessory === 4) rect(context, "#c84b3c", 16, 20, 3, 1);
  if (look.accessory === 5) { rect(context, COLORS.ink, 2, 11, 2, 7); rect(context, COLORS.ink, 20, 11, 2, 7); rect(context, "#4a70a8", 18, 9, 3, 1); }
  if (look.accessory === 6) { rect(context, COLORS.ink, 8, 9, 3, 1); rect(context, COLORS.ink, 13, 9, 3, 1); rect(context, COLORS.ink, 10, 8, 4, 1); }
  if (look.accessory === 7) { rect(context, "#b97862", 6, 10, 1, 1); rect(context, "#b97862", 8, 9, 1, 1); rect(context, "#b97862", 15, 9, 1, 1); rect(context, "#b97862", 17, 10, 1, 1); }
  if (look.accessory === 8) { rect(context, COLORS.ink, 4, 20, 16, 2); rect(context, "#d6a12c", 5, 21, 14, 2); }
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
  else drawRevisionProject(context);
  if (projectId.startsWith("boss-")) drawBossPhase(context, phase);
}

renderTitle();
