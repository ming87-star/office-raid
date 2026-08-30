"use strict";

const COLORS = {
  ink: "#17364a", paper: "#f3ebd7", skin: ["#f7d7bd", "#edbe98", "#d99d78", "#bd7f5c", "#956044", "#704536"],
  hair: ["#29272c", "#573b32", "#8b593a", "#c2853d", "#6e3047", "#243e52"],
  outfit: ["#4a70a8", "#168c8b", "#d6a12c", "#9b6d9d", "#c84b3c", "#6d7c8c", "#3e7852", "#d17655", "#596a9b", "#a35c72", "#4d6972", "#7c6854"]
};

const DEPARTMENTS = {
  pm: { name: "기획/PM", short: "PM", color: "#4a70a8" },
  sales: { name: "영업", short: "영업", color: "#d6a12c" },
  dev: { name: "개발/R&D", short: "개발", color: "#168c8b" },
  finance: { name: "회계/재무", short: "재무", color: "#6d7c8c" }
};

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
  ["집중형 노트북", "work"], ["기획자의 태블릿", "work"], ["정밀 계산기", "work"],
  ["협업 헤드셋", "support"], ["정리의 다이어리", "support"], ["황금 명함지갑", "support"],
  ["마감 수호 텀블러", "personal"], ["새벽의 커피", "personal"], ["행운의 부적", "personal"]
];

const DIRECTIVE_SKILLS = {
  sales: [
    { id: "requirement-brief", name: "요구사항 정리", description: "약점 노출 · 연계 피해 증가", visual: "승인 도장" },
    { id: "client-persuasion", name: "고객 설득", description: "불리한 상태 제거 · 안정 처리", visual: "프레젠테이션" },
    { id: "contract-close", name: "계약 확정", description: "약점 노출 시 강력한 마무리", visual: "계약서 폭발" }
  ],
  pm: [
    { id: "schedule-shift", name: "일정 재배치", description: "마감 +1턴 · 최대 2회", visual: "거대 캘린더" },
    { id: "work-allocation", name: "업무 분담", description: "팀 모멘텀과 연계 피해 증가", visual: "업무 연결선" },
    { id: "emergency-command", name: "전사 긴급 지시", description: "이번 지시 효과 20% 증가", visual: "지휘 방송" }
  ],
  dev: [
    { id: "focus-development", name: "집중 개발", description: "핵심에 강한 즉시 업무 처리", visual: "코드 폭포" },
    { id: "automation-deploy", name: "자동화 배포", description: "즉시 처리 + 2턴 지속 처리", visual: "자동화 드론" },
    { id: "night-shift", name: "밤샘 해결", description: "가장 강력한 단일 업무 처리", visual: "오류창 파쇄" }
  ],
  finance: [
    { id: "budget-approval", name: "추가 예산 승인", description: "이번 지시 효과 20% 증가", visual: "황금 결재" },
    { id: "cost-defense", name: "비용 방어", description: "불리한 상태 제거 · 손실 차단", visual: "예산 장벽" },
    { id: "emergency-approval", name: "긴급 결재", description: "마감 +1턴과 즉시 업무 처리", visual: "결재 도장" }
  ]
};

const PROJECTS = [
  { id: "revision", name: "끝없는 수정 요청" },
  { id: "schedule", name: "엉킨 출시 일정" },
  { id: "migration", name: "데이터 이전 대작전" },
  { id: "campaign", name: "긴급 캠페인 런칭" }
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
const COMPANY_PREFIXES = ["반짝", "단단", "빠른", "작은", "푸른", "새벽", "모아", "한걸음"];
const COMPANY_SUFFIXES = ["랩", "스튜디오", "웍스", "컴퍼니", "프로젝트", "오피스", "팩토리", "파트너스"];
const POSTING_REFRESH_MAX = 2;
const PAID_POSTING_REFRESH_COST = 200;

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

const state = {
  companyName: "",
  cash: 1200,
  reputation: 0,
  capacity: 6,
  equipment: [],
  employees: [],
  teamIds: [],
  postingRefreshes: POSTING_REFRESH_MAX,
  projectClears: 0,
  specialRecruitmentTickets: 0
};

function randomInt(max) { return Math.floor(Math.random() * max); }
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

function header(title, notice) {
  return `<header class="header"><p class="eyebrow">OFFICE RAID · LIVE PREVIEW</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(notice)}</p></header>`;
}

function renderOpening() {
  currentView = "opening";
  const scenes = [
    { kicker: "창업 첫날 · 오전 8:57", title: "책상은 세 개.\n회사 이름은 아직 없다." },
    { kicker: "띵! · 새 메일 1", title: "첫 프로젝트가\n도착했다." },
    { kicker: "수정 요청 47건 · 마감 D-8", title: "혼자는 무리다.\n하지만 우리는 셋이다." }
  ];
  const scene = scenes[openingPage];
  const dots = scenes.map((_, index) => `<i class="${index === openingPage ? "active" : ""}"></i>`).join("");
  let visual = `<div class="empty-office">
    <span class="office-window" aria-hidden="true"><i></i><i></i></span>
    <span class="office-clock" aria-hidden="true"><i class="clock-hour"></i><i class="clock-minute"></i><b></b></span>
    <span class="office-shelf" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="office-workstations">${[0, 1, 2].map((_, index) => `<span class="empty-workstation"><i class="empty-monitor"></i><b class="empty-desk"></b><em class="empty-chair chair-${index + 1}"></em></span>`).join("")}</div>
  </div>`;
  if (openingPage === 1) {
    visual = `<div class="opening-mail-window">
      <div class="mail-toolbar"><strong>MAIL · 받은편지함</strong><time>오전 8:57</time></div>
      <div class="mail-sender"><b>대형 고객사</b><small>&lt;project@bigclient.co.kr&gt;</small></div>
      <div class="mail-subject"><small>제목</small><strong>긴급 프로젝트 의뢰드립니다</strong></div>
      <div class="mail-body"><p>안녕하세요, 대표님.</p><p>첨부드린 프로젝트를 검토 부탁드립니다.</p><strong>오늘 안에 가능하시죠?</strong></div>
      <div class="mail-attachment"><canvas id="opening-boss" width="64" height="64" aria-label="첨부 프로젝트 미리보기"></canvas><span><b>project_final_FINAL_v7.zip</b><small>수정사항 47개 · 12.8MB</small></span></div>
      <div class="mail-actions"><span>↩ 답장</span><span>→ 전달</span></div>
    </div>`;
  } else if (openingPage === 2) {
    visual = `<div class="opening-raid"><canvas id="opening-boss" width="64" height="64" aria-label="거대한 프로젝트"></canvas><div class="opening-team"><canvas width="24" height="24" data-opening-member="pm"></canvas><canvas width="24" height="24" data-opening-member="dev"></canvas><canvas width="24" height="24" data-opening-member="sales"></canvas></div></div>`;
  }
  app.innerHTML = `<section class="opening-screen">
    <div class="opening-top"><strong>OFFICE RAID</strong><button id="skip-opening">건너뛰기</button></div>
    <article class="opening-card panel"><p>${escapeHtml(scene.kicker)}</p><h1>${escapeHtml(scene.title).replace("\n", "<br>")}</h1>${visual}</article>
    <div class="opening-dots">${dots}</div>
    <button id="next-opening" class="teal">${openingPage < 2 ? "다음" : "회사 이름 정하기"}</button>
  </section>`;
  if (openingPage > 0) drawBoss(document.querySelector("#opening-boss"));
  if (openingPage === 2) {
    const looks = { pm: appearance(1103), dev: appearance(3817), sales: appearance(2471) };
    document.querySelectorAll("[data-opening-member]").forEach(canvas => drawBackPortrait(canvas, { department: canvas.dataset.openingMember, appearance: looks[canvas.dataset.openingMember] }));
  }
  document.querySelector("#skip-opening").addEventListener("click", renderSetup);
  document.querySelector("#next-opening").addEventListener("click", () => {
    if (openingPage < 2) { openingPage += 1; renderOpening(); }
    else renderSetup();
  });
}

function renderSetup() {
  currentView = "setup";
  app.innerHTML = `${header("OFFICE RAID", "프로젝트는 거대하고, 퇴근은 멀었다.")}
    <section class="screen"><div class="setup panel">
      <div class="setup-story-preview" aria-label="거대한 프로젝트에 도전하는 팀의 연출 장면">
        <span class="setup-project-glow" aria-hidden="true"></span>
        <span class="setup-deadline-stamp">DEADLINE<br><strong>D-8</strong></span>
        <canvas id="setup-boss" width="64" height="64" aria-label="프로젝트 보스"></canvas>
        <i class="story-paper story-paper-one" aria-hidden="true"></i>
        <i class="story-paper story-paper-two" aria-hidden="true"></i>
        <i class="story-paper story-paper-three" aria-hidden="true"></i>
        <div class="setup-story-team">
          <canvas width="24" height="24" data-setup-member="pm" aria-label="기획 담당자의 뒷모습"></canvas>
          <canvas width="24" height="24" data-setup-member="dev" aria-label="개발 담당자의 뒷모습"></canvas>
          <canvas width="24" height="24" data-setup-member="sales" aria-label="영업 담당자의 뒷모습"></canvas>
        </div>
      </div>
      <h2>작은 팀, 큰 프로젝트</h2>
      <p>동료를 모아 회사를 키우고<br>거대한 프로젝트를 공략하세요.</p>
      <span class="genre-tag">인재 수집형 오피스 전투 RPG</span>
      <label class="sr-only" for="company-name">회사 이름</label>
      <div class="input-with-button"><input id="company-name" maxlength="18" value="${escapeHtml(state.companyName || "오피스 레이드 주식회사")}" autocomplete="organization"><button id="random-company" class="mustard">랜덤 생성</button></div>
      <button id="create-company">다음 · 대표 만들기</button>
    </div></section>`;
  drawBoss(document.querySelector("#setup-boss"));
  const setupLooks = { pm: appearance(1103), dev: appearance(3817), sales: appearance(2471) };
  document.querySelectorAll("[data-setup-member]").forEach(canvas => {
    drawBackPortrait(canvas, { department: canvas.dataset.setupMember, appearance: setupLooks[canvas.dataset.setupMember] });
  });
  document.querySelector("#random-company").addEventListener("click", randomizeCompanyName);
  document.querySelector("#create-company").addEventListener("click", openRepresentativeSetup);
  document.querySelector("#company-name").addEventListener("keydown", event => { if (event.key === "Enter") openRepresentativeSetup(); });
}

function randomizeCompanyName() {
  document.querySelector("#company-name").value = `${COMPANY_PREFIXES[randomInt(COMPANY_PREFIXES.length)]} ${COMPANY_SUFFIXES[randomInt(COMPANY_SUFFIXES.length)]}`;
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
  drawPortrait(document.querySelector("#representative-preview"), { department: "pm", appearance: look });
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
  const representative = employee(representativeDraft.name, "pm", "침착한 조율자", 17, 18, 14, 1103);
  representative.isRepresentative = true;
  representative.appearance = { ...representativeDraft.appearance };
  state.employees = [
    representative,
    employee("김세일", "sales", "발표 체질", 15, 14, 17, 2471),
    employee("이코드", "dev", "위기 전문가", 19, 12, 16, 3817)
  ];
  state.teamIds = state.employees.map(member => member.id);
  renderOffice("작지만 강한 첫 프로젝트 팀이 준비됐습니다.");
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
  const members = currentTeam();
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

function renderOffice(notice = "면접으로 동료를 채용하고 프로젝트 팀을 편성하세요.") {
  currentView = "office";
  clearBattleTimer();
  const desks = currentTeam().map(member => `<div class="desk"><span class="office-speech" data-office-speech="${member.id}" aria-live="polite"></span><canvas width="24" height="24" data-portrait="${member.id}"></canvas><strong>${escapeHtml(member.name)}</strong><small>${DEPARTMENTS[member.department].short} · ${employeePosition(member)}</small></div>`).join("");
  app.innerHTML = `${header("작은 사무실", notice)}
    <section class="screen">
      <div class="office-room panel">${desks}</div>
      <div class="company-card panel">
        <h2>${escapeHtml(state.companyName)}</h2>
        <p>직원 ${state.employees.length}/${state.capacity}　현금 ${state.cash}　평판 ${state.reputation}</p>
        <p>프로젝트 팀: ${currentTeam().map(member => escapeHtml(member.name)).join(" · ")}</p>
        <p>프로젝트 성공 ${state.projectClears}회　특별채용 ${state.specialRecruitmentTickets > 0 ? state.specialRecruitmentTickets + "장" : specialRecruitmentProgress()}</p>
      </div>
      <div class="actions">
        <button class="blue" id="interview">면접</button>
        <button class="teal" id="team">팀 편성</button>
        <button class="mustard" id="equipment">장비 ${state.equipment.length}</button>
        <button class="red" id="project">프로젝트</button>
      </div>
    </section>`;
  mountPortraits();
  document.querySelector("#interview").addEventListener("click", () => openInterview());
  document.querySelector("#team").addEventListener("click", openTeam);
  document.querySelector("#equipment").addEventListener("click", () => openEquipment());
  document.querySelector("#project").addEventListener("click", startBattle);
  scheduleOfficeDialogue();
}

function generateEquipmentReward() {
  const roll = randomInt(100);
  const rarity = roll < 60 ? 0 : roll < 85 ? 1 : roll < 96 ? 2 : roll < 99 ? 3 : 4;
  const [name, slot] = EQUIPMENT_CATALOG[randomInt(EQUIPMENT_CATALOG.length)];
  const bonus = 2 + rarity * 2;
  return {
    id: `equipment-${nextId++}`, name, slot, rarity,
    workBonus: slot === "work" ? bonus + 1 : bonus,
    collaborationBonus: slot === "support" ? bonus : Math.max(1, Math.floor(bonus / 2))
  };
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
    return `<article class="equipment-slot ${item ? "filled" : ""}"><span>${info.icon}</span><div><small>${info.name}</small><strong>${item ? escapeHtml(item.name) : "비어 있음"}</strong>${item ? `<em style="color:${EQUIPMENT_RARITIES[item.rarity].color}">${EQUIPMENT_RARITIES[item.rarity].name} · 실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em>` : ""}</div>${item ? `<button class="ink" data-unequip="${item.id}">해제</button>` : ""}</article>`;
  }).join("");
  const inventory = state.equipment.length ? state.equipment.map(item => `<article class="equipment-item"><span style="background:${EQUIPMENT_RARITIES[item.rarity].color}">${EQUIPMENT_SLOTS[item.slot].icon}</span><div><strong>${escapeHtml(item.name)}</strong><small>${EQUIPMENT_RARITIES[item.rarity].name} ${EQUIPMENT_SLOTS[item.slot].name}</small><em>실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em></div><button class="teal" data-equip="${item.id}">장착</button></article>`).join("") : `<div class="empty-inventory">프로젝트를 완료하면 장비를 획득합니다.</div>`;
  app.innerHTML = `${header("장비 관리", `${target.name} · 실무 ${stats.work} · 협업 ${stats.collaboration} · ${notice}`)}<section class="screen equipment-screen">
    <div class="equipment-people">${people}</div>
    <div class="equipment-slots panel">${slots}</div>
    <p class="section-label">보관함 · ${state.equipment.length}</p>
    <div class="equipment-inventory">${inventory}</div>
    <button class="ink" id="back-from-equipment">← 사무실</button>
  </section>`;
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
  const departments = Object.keys(DEPARTMENTS);
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
  app.innerHTML = `${header("면접실", notice)}<section class="screen interview-screen">
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

function startBattle() {
  currentView = "battle";
  const project = PROJECTS[state.projectClears % PROJECTS.length];
  battle = {
    project,
    max: 190, workload: 190, action: 0, deadline: 8, momentum: 0, requirements: false,
    result: null, rewardClaimed: false, log: "업무 분담을 시작합니다.", status: null,
    eventText: "", nextEventRound: 2, eventCursor: randomInt(4), preparedRound: 0,
    directiveGauge: 50, awaitingDirective: false, directiveReason: "", directiveSelections: {}, directiveFocusId: null,
    thresholdSeventy: false, thresholdForty: false, deadlineBonus: 0, automationDamage: 0, automationTurns: 0, skillFx: null
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
      battle.workload = Math.max(0, battle.workload - battle.automationDamage);
      battle.automationTurns -= 1;
      battle.eventText = `✓ 자동화 배포! 업무량 ${battle.automationDamage} 처리`;
      checkWorkloadThresholds();
      if (battle.workload <= 0) return finishBattleSuccess();
    }
    if (round >= battle.nextEventRound) {
      triggerBattleEvent();
      battle.nextEventRound += 2;
    }
    if (battle.directiveGauge >= 100) return openDirective();
  }
  const stats = effectiveStats(member);
  let damage = Math.round(stats.work * .72 + stats.collaboration * .25);
  let skill = "집중 업무";
  if (member.department === "sales") {
    battle.requirements = true;
    damage += 5;
    skill = "요구사항 정리";
  } else if (member.department === "pm") {
    battle.momentum += 4;
    damage += battle.momentum;
    skill = "일정 통합";
  } else if (member.department === "dev") {
    if (battle.requirements) damage += 8;
    damage += battle.momentum;
    skill = "집중 개발";
  } else if (member.department === "finance") {
    damage += 4;
    skill = "예산 재배치";
  }
  if (battle.status) {
    damage = Math.round(damage * battle.status.efficiency) + battle.status.flat;
  }
  damage = Math.max(1, damage);
  battle.workload = Math.max(0, battle.workload - damage);
  const eventLine = battle.eventText ? `${battle.eventText}\n` : "";
  battle.log = `${eventLine}${member.name}의 ${skill}! 업무량 ${damage} 처리`;
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
    state.cash += 700;
    state.reputation += 12;
    state.projectClears += 1;
    state.postingRefreshes = POSTING_REFRESH_MAX;
    const specialUnlocked = state.projectClears === 5 || (state.projectClears > 5 && (state.projectClears - 5) % 10 === 0);
    if (specialUnlocked) {
      state.specialRecruitmentTickets += 1;
      specialCandidates = [];
    }
    battle.recruitmentNotice = specialUnlocked ? "헤드헌팅권 1장 획득!" : `공고 갱신 ${POSTING_REFRESH_MAX}/${POSTING_REFRESH_MAX} 회복`;
    battle.reward = generateEquipmentReward();
    state.equipment.push(battle.reward);
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
    addDirectiveGauge(30, "프로젝트의 첫 약점이 노출됐습니다.");
  }
  if (!battle.thresholdForty && ratio <= .40) {
    battle.thresholdForty = true;
    addDirectiveGauge(30, "프로젝트의 핵심 약점이 노출됐습니다.");
  }
}

function openDirective() {
  clearBattleTimer();
  const team = currentTeam();
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
  const options = directiveSkillsFor(focus.department).map(skill => `<button class="skill-option ${battle.directiveSelections[focus.id] === skill.id ? "selected" : ""}" data-directive-skill="${skill.id}" data-member-id="${focus.id}"><strong>${escapeHtml(skill.name)}</strong><span>${escapeHtml(skill.description)}</span><em>${escapeHtml(skill.visual)}</em></button>`).join("");
  const summary = team.map(member => {
    const skill = directiveSkillsFor(member.department).find(option => option.id === battle.directiveSelections[member.id]);
    return skill ? skill.name : "미선택";
  }).join(" → ");
  return `<div class="directive-panel"><div class="directive-head"><div><strong>긴급 지시</strong><small>${escapeHtml(battle.directiveReason)}</small></div><b>${selectedCount}/${team.length}</b></div><div class="directive-tabs">${tabs}</div><div class="skill-options">${options}</div><div class="directive-footer"><small>${escapeHtml(summary)}</small><button id="execute-directive" class="mustard" ${selectedCount < team.length ? "disabled" : ""}>지시 실행</button></div></div>`;
}

function directiveSkillsFor(department) {
  if (DIRECTIVE_SKILLS[department]) return DIRECTIVE_SKILLS[department];
  if (department === "design" || department === "marketing") return DIRECTIVE_SKILLS.sales;
  if (department === "hr" || department === "legal") return DIRECTIVE_SKILLS.finance;
  if (department === "qa" || department === "it") return DIRECTIVE_SKILLS.dev;
  return DIRECTIVE_SKILLS.pm;
}

function selectDirectiveMember(id) {
  battle.directiveFocusId = id;
  renderBattle();
}

function selectDirectiveSkill(memberId, skillId) {
  battle.directiveSelections[memberId] = skillId;
  const next = currentTeam().find(member => !battle.directiveSelections[member.id]);
  if (next) battle.directiveFocusId = next.id;
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
  battle.workload = Math.max(0, battle.workload - total);
  battle.directiveGauge = 0;
  battle.awaitingDirective = false;
  battle.directiveReason = "";
  checkWorkloadThresholds();
  const detail = `업무량 ${total} 처리${combo ? ` · ${combo} 연계` : ""}${cleared ? " · 상태 제거" : ""}`;
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

function renderBattle() {
  const team = currentTeam();
  const reward = battle.reward;
  const rewardText = reward ? `${EQUIPMENT_RARITIES[reward.rarity].name} ${escapeHtml(reward.name)} 획득<br>실무 +${reward.workBonus} · 협업 +${reward.collaborationBonus}${battle.recruitmentNotice ? `<br>${escapeHtml(battle.recruitmentNotice)}` : ""}` : "장비 보상 확인 중";
  const result = battle.result === "success" ? `<div class="battle-result"><h2>PROJECT CLEAR</h2><p>현금 +700 · 평판 +12<br>${rewardText}</p></div>` : battle.result === "failure" ? `<div class="battle-result"><h2 style="color:#c84b3c">DEADLINE OVER</h2><p>팀 편성과 부서 연계를 바꿔 다시 도전하세요.</p></div>` : "";
  const fighters = team.map(member => `<div class="fighter"><canvas width="24" height="24" data-portrait="${member.id}" data-facing="back"></canvas><strong>${escapeHtml(member.name)}</strong></div>`).join("");
  const round = Math.min(battle.deadline, Math.floor(battle.action / Math.max(1, team.length)) + 1);
  const statusName = battle.status ? `${battle.status.name} ${battle.status.turns}턴` : "안정";
  const statusTone = battle.status ? battle.status.tone : "good";
  const directive = directivePanel(team);
  const skillFx = battle.skillFx ? `<div class="skill-cinematic"><i></i><i></i><i></i><strong>${escapeHtml(battle.skillFx.title)}</strong><span>${escapeHtml(battle.skillFx.detail)}</span></div>` : "";
  app.innerHTML = `${header("프로젝트 돌입", battle.result ? "프로젝트 결과를 확인하세요." : battle.awaitingDirective ? "자동 전투 일시 정지 · 직원 아래에서 스킬을 선택하세요." : "지시 게이지가 가득 차면 전투가 잠시 멈춥니다.")}
    <section class="screen battle-screen ${battle.awaitingDirective ? "directive-active" : ""}">
      <div class="boss-card panel"><div class="boss-row"><strong>${escapeHtml(battle.project.name)}</strong><span id="workload-text">업무량 ${battle.workload}/${battle.max}</span></div><div class="bar"><i id="workload-bar" style="width:${Math.min(100, battle.workload / battle.max * 100)}%"></i></div><div class="directive-meter"><b>긴급 지시</b><div><i id="directive-gauge" style="width:${battle.directiveGauge}%"></i></div><span id="directive-text">${battle.awaitingDirective ? "READY" : battle.directiveGauge + "%"}</span></div></div>
      <div class="arena panel" id="arena"><canvas id="boss-canvas" width="64" height="64" aria-label="${escapeHtml(battle.project.name)}"></canvas><div class="status-chip ${statusTone}" id="status-chip">STATUS · ${statusName}</div><div class="deadline" id="deadline">마감 ${round}/${battle.deadline}</div><div class="battle-team">${fighters}</div>${skillFx}</div>
      ${directive}
      <div class="battle-log panel" id="battle-log">${result || escapeHtml(battle.log)}</div>
      <button class="ink" id="leave-battle">${battle.result ? "사무실로" : "프로젝트 중단"}</button>
    </section>`;
  drawBoss(document.querySelector("#boss-canvas"), battle.project.id);
  mountPortraits();
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

function drawBoss(canvas, projectId = "revision") {
  if (!canvas) return;
  const context = pixelContext(canvas);
  if (projectId === "schedule") drawScheduleProject(context);
  else if (projectId === "migration") drawMigrationProject(context);
  else if (projectId === "campaign") drawCampaignProject(context);
  else drawRevisionProject(context);
}

renderOpening();
