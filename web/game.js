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

const FAMILY = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
const GIVEN = ["서준", "민서", "지우", "도윤", "하린", "예준", "서연", "현우", "유진", "수빈", "지훈", "예린", "시우", "채원"];
const TRAITS = ["분위기 메이커", "완벽주의", "위기 전문가", "아이디어 뱅크", "침착한 조율자", "빠른 손", "꼼꼼한 기록가", "발표 체질"];
const COMPANY_PREFIXES = ["반짝", "단단", "빠른", "작은", "푸른", "새벽", "모아", "한걸음"];
const COMPANY_SUFFIXES = ["랩", "스튜디오", "웍스", "컴퍼니", "프로젝트", "오피스", "팩토리", "파트너스"];

const app = document.querySelector("#app");
let currentView = "setup";
let candidates = [];
let teamDraft = [];
let battleTimer = null;
let battle = null;
let nextId = 10;
let representativeDraft = { name: "서대표", appearance: appearance(1103) };
let representativeMode = "basic";
let openingPage = 0;
let equipmentTargetId = null;

const state = {
  companyName: "",
  cash: 1200,
  reputation: 0,
  capacity: 6,
  equipment: [],
  employees: [],
  teamIds: []
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
    rank, equipment: { work: null, support: null, personal: null },
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
    <span class="office-clock" aria-hidden="true">◷</span>
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

function renderOffice(notice = "면접으로 동료를 채용하고 프로젝트 팀을 편성하세요.") {
  currentView = "office";
  clearBattleTimer();
  const desks = currentTeam().map(member => `<div class="desk"><canvas width="24" height="24" data-portrait="${member.id}"></canvas><strong>${escapeHtml(member.name)}</strong><small>${DEPARTMENTS[member.department].short}</small></div>`).join("");
  app.innerHTML = `${header("작은 사무실", notice)}
    <section class="screen">
      <div class="office-room panel">${desks}</div>
      <div class="company-card panel">
        <h2>${escapeHtml(state.companyName)}</h2>
        <p>직원 ${state.employees.length}/${state.capacity}　현금 ${state.cash}　평판 ${state.reputation}</p>
        <p>프로젝트 팀: ${currentTeam().map(member => escapeHtml(member.name)).join(" · ")}</p>
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

function rollRank() {
  const roll = randomInt(100);
  if (roll < 60) return 0;
  if (roll < 85) return 1;
  if (roll < 95) return 2;
  if (roll < 99) return 3;
  return 4;
}

function generateCandidate() {
  const rank = rollRank();
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

function openInterview(notice = "능력과 연봉 조건을 비교해 동료를 채용하세요.") {
  currentView = "interview";
  candidates = [generateCandidate(), generateCandidate(), generateCandidate()];
  renderInterview(notice);
}

function renderInterview(notice) {
  const cards = candidates.map(candidate => {
    const department = DEPARTMENTS[candidate.department];
    const rank = RANKS[candidate.rank];
    return `<article class="candidate">
      <canvas width="24" height="24" data-candidate="${candidate.id}"></canvas>
      <div><h3>${escapeHtml(candidate.name)} <span class="rank" style="background:${rank.color}">${rank.name}</span></h3>
      <p class="dept">${department.name} · ${escapeHtml(candidate.trait)}</p>
      <p>실무 ${candidate.work}　협업 ${candidate.collaboration}　속도 ${candidate.speed}</p>
      <p>계약금 ${candidate.signingCost} · 월급 ${candidate.salary}</p></div>
      <button class="teal" data-hire="${candidate.id}">채용</button>
    </article>`;
  }).join("");
  app.innerHTML = `${header("면접실", notice)}<section class="screen">
    <div class="card-list">${cards}</div>
    <div class="footer-actions"><button class="ink" id="back-office">← 사무실</button><button class="mustard" id="reroll">새 후보</button></div>
  </section>`;
  document.querySelectorAll("[data-candidate]").forEach(canvas => drawPortrait(canvas, candidates.find(candidate => candidate.id === canvas.dataset.candidate)));
  document.querySelectorAll("[data-hire]").forEach(button => button.addEventListener("click", () => hireCandidate(button.dataset.hire)));
  document.querySelector("#back-office").addEventListener("click", () => renderOffice());
  document.querySelector("#reroll").addEventListener("click", () => openInterview("새로운 지원자 3명이 도착했습니다."));
}

function hireCandidate(id) {
  const candidate = candidates.find(item => item.id === id);
  if (state.employees.length >= state.capacity) return renderInterview("직원 정원이 가득 찼습니다. 사무실 확장이 필요합니다.");
  if (state.cash < candidate.signingCost) return renderInterview("계약금이 부족합니다. 프로젝트를 먼저 완료하세요.");
  state.cash -= candidate.signingCost;
  state.employees.push(candidate);
  candidates = candidates.filter(item => item.id !== id);
  while (candidates.length < 3) candidates.push(generateCandidate());
  renderInterview(`${candidate.name} 님을 채용했습니다.`);
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
      <p class="dept">${DEPARTMENTS[member.department].name} · ${escapeHtml(member.trait)}</p>
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
  battle = {
    max: 190, workload: 190, action: 0, deadline: 8, momentum: 0, requirements: false,
    result: null, rewardClaimed: false, log: "업무 분담을 시작합니다.", status: null,
    eventText: "", nextEventRound: 2, eventCursor: randomInt(4)
  };
  renderBattle();
  battleTimer = window.setTimeout(battleStep, 900);
}

function clearBattleTimer() {
  if (battleTimer !== null) window.clearTimeout(battleTimer);
  battleTimer = null;
}

function battleStep() {
  if (currentView !== "battle" || battle.result) return;
  const team = currentTeam();
  const member = team[battle.action % team.length];
  const round = Math.floor(battle.action / team.length) + 1;
  if (battle.action % team.length === 0) {
    advanceBattleStatus();
    battle.eventText = "";
    if (round >= battle.nextEventRound) {
      triggerBattleEvent();
      battle.nextEventRound += 2;
    }
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
  animatePacket(member.department, battle.action % 3);
  updateBattleNumbers(round);

  if (battle.workload <= 0) {
    battle.result = "success";
    if (!battle.rewardClaimed) {
      battle.rewardClaimed = true;
      state.cash += 700;
      state.reputation += 12;
      battle.reward = generateEquipmentReward();
      state.equipment.push(battle.reward);
    }
    battleTimer = window.setTimeout(renderBattle, 650);
    return;
  }
  if (round >= battle.deadline && battle.action % team.length === 0) {
    battle.result = "failure";
    battle.log = "마감을 넘겼습니다. 팀을 재편성해 다시 도전하세요.";
    battleTimer = window.setTimeout(renderBattle, 650);
    return;
  }
  battleTimer = window.setTimeout(battleStep, 950);
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
  } else if (event === 1) {
    battle.status = { name: "긴급회의", turns: 1, efficiency: .75, flat: 0, tone: "bad" };
    battle.eventText = "⚠ 긴급회의! 오늘 업무 효율 -25%";
  } else if (event === 2) {
    battle.status = { name: "예산 압박", turns: 2, efficiency: 1, flat: -3, tone: "bad" };
    battle.eventText = "⚠ 예산 삭감! 2턴 동안 처리량 -3";
  } else {
    battle.momentum += 4;
    battle.status = { name: "합의 완료", turns: 2, efficiency: 1, flat: 4, tone: "good" };
    battle.eventText = "✓ 고객의 빠른 승인! 2턴 동안 처리량 +4";
  }
}

function renderBattle() {
  const team = currentTeam();
  const reward = battle.reward;
  const rewardText = reward ? `${EQUIPMENT_RARITIES[reward.rarity].name} ${escapeHtml(reward.name)} 획득<br>실무 +${reward.workBonus} · 협업 +${reward.collaborationBonus}` : "장비 보상 확인 중";
  const result = battle.result === "success" ? `<div class="battle-result"><h2>PROJECT CLEAR</h2><p>현금 +700 · 평판 +12<br>${rewardText}</p></div>` : battle.result === "failure" ? `<div class="battle-result"><h2 style="color:#c84b3c">DEADLINE OVER</h2><p>팀 편성과 부서 연계를 바꿔 다시 도전하세요.</p></div>` : "";
  const fighters = team.map(member => `<div class="fighter"><canvas width="24" height="24" data-portrait="${member.id}" data-facing="back"></canvas><strong>${escapeHtml(member.name)}</strong></div>`).join("");
  const round = Math.min(battle.deadline, Math.floor(battle.action / Math.max(1, team.length)) + 1);
  const statusName = battle.status ? `${battle.status.name} ${battle.status.turns}턴` : "안정";
  const statusTone = battle.status ? battle.status.tone : "good";
  app.innerHTML = `${header("프로젝트 돌입", battle.result ? "프로젝트 결과를 확인하세요." : "업무 효과는 직원에서 프로젝트를 향해 올라갑니다.")}
    <section class="screen battle-screen">
      <div class="boss-card panel"><div class="boss-row"><strong>끝없는 수정 요청</strong><span id="workload-text">업무량 ${battle.workload}/${battle.max}</span></div><div class="bar"><i id="workload-bar" style="width:${Math.min(100, battle.workload / battle.max * 100)}%"></i></div></div>
      <div class="arena panel" id="arena"><canvas id="boss-canvas" width="64" height="64"></canvas><div class="status-chip ${statusTone}" id="status-chip">STATUS · ${statusName}</div><div class="deadline" id="deadline">마감 ${round}/${battle.deadline}</div><div class="battle-team">${fighters}</div></div>
      <div class="battle-log panel" id="battle-log">${result || escapeHtml(battle.log)}</div>
      <button class="ink" id="leave-battle">${battle.result ? "사무실로" : "프로젝트 중단"}</button>
    </section>`;
  drawBoss(document.querySelector("#boss-canvas"));
  mountPortraits();
  document.querySelector("#leave-battle").addEventListener("click", () => renderOffice(battle.result === "success" ? "프로젝트 보상을 획득했습니다." : "사무실로 돌아왔습니다."));
}

function updateBattleNumbers(round) {
  const bar = document.querySelector("#workload-bar");
  const text = document.querySelector("#workload-text");
  const deadline = document.querySelector("#deadline");
  const log = document.querySelector("#battle-log");
  const boss = document.querySelector("#boss-canvas");
  const status = document.querySelector("#status-chip");
  if (!bar) return;
  bar.style.width = `${Math.min(100, battle.workload / battle.max * 100)}%`;
  text.textContent = `업무량 ${battle.workload}/${battle.max}`;
  deadline.textContent = `마감 ${round}/${battle.deadline}`;
  log.textContent = battle.log;
  status.textContent = battle.status ? `STATUS · ${battle.status.name} ${battle.status.turns}턴` : "STATUS · 안정";
  status.className = `status-chip ${battle.status ? battle.status.tone : "good"}`;
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
  const width = [16,16,14,14,16,14,16,14][look.face];
  const left = Math.floor((24 - width) / 2);

  rect(context, COLORS.ink, 2, 0, 20, 6);
  rect(context, shirt, 3, 0, 18, 5);
  rect(context, skin, 10, 4, 4, 3);
  if (look.outfit % 3 === 0) rect(context, department, 11, 1, 2, 4);
  else if (look.outfit % 3 === 1) rect(context, department, 9, 2, 6, 2);

  rect(context, COLORS.ink, left - 1, 7, width + 2, 11);
  rect(context, skin, left, 6, width, 12);
  rect(context, COLORS.ink, left + 1, 5, width - 2, 2);
  rect(context, skin, left + 2, 6, width - 4, 2);

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

  const browY = look.eyebrows % 4 === 0 ? 16 : 15;
  rect(context, hair, 6, browY, 3, 1);
  rect(context, hair, 15, browY, 3, 1);
  const eyeY = look.eyes % 5 === 4 ? 12 : 13;
  const eyeWidth = look.eyes % 3 === 1 ? 3 : 2;
  rect(context, COLORS.ink, 6, eyeY, eyeWidth, 1);
  rect(context, COLORS.ink, 16 - eyeWidth + 1, eyeY, eyeWidth, 1);
  rect(context, "rgba(80,35,25,.55)", 11 + look.nose % 2, 10, 1, 1 + Math.floor(look.nose / 4));
  const mouthWidth = 3 + look.mouth % 4;
  rect(context, look.mouth > 6 ? "#a94d5e" : COLORS.ink, Math.floor((24 - mouthWidth) / 2), 8, mouthWidth, look.mouth === 5 ? 2 : 1);

  if (look.accessory === 1 || look.accessory === 2) {
    const frame = look.accessory === 1 ? "#4a70a8" : COLORS.ink;
    rect(context, frame, 5, 12, 6, 3); rect(context, frame, 13, 12, 6, 3);
    rect(context, skin, 6, 13, 4, 1); rect(context, skin, 14, 13, 4, 1); rect(context, frame, 11, 13, 2, 1);
  }
  if (look.accessory === 3) { rect(context, "#d6a12c", 3, 10, 1, 1); rect(context, "#d6a12c", 20, 10, 1, 1); }
  if (look.accessory === 4) rect(context, "#c84b3c", 16, 20, 3, 1);
  if (look.accessory === 5) { rect(context, COLORS.ink, 2, 11, 2, 7); rect(context, COLORS.ink, 20, 11, 2, 7); rect(context, "#4a70a8", 18, 9, 3, 1); }
  if (look.accessory === 8) { rect(context, COLORS.ink, 4, 20, 16, 2); rect(context, "#d6a12c", 5, 21, 14, 2); }
}

function drawBoss(canvas) {
  if (!canvas) return;
  const context = pixelContext(canvas);
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

renderOpening();
