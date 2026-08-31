const OPTIONS = {
  skin: ["웜 베이지", "내추럴", "딥 웜"],
  face: ["둥근형", "부드러운형"],
  hair: ["내추럴", "가르마", "웨이브"],
  eyes: ["차분한 눈", "둥근 눈", "웃는 눈"],
  mouth: ["미소", "담담", "활기"],
  top: ["네이비 재킷", "틸 카디건"],
  equipment: ["장비 없음", "업무용 헤드셋"]
};

const look = { skin: 0, face: 0, hair: 0, eyes: 0, mouth: 0, top: 0, equipment: 0 };

const COLORS = {
  ink: "#122d3d",
  inkSoft: "#244557",
  skins: [
    { base: "#e6a15d", light: "#f3bd7e", shade: "#bd7041" },
    { base: "#c98550", light: "#e6a66b", shade: "#9e593b" },
    { base: "#9a573c", light: "#bf7951", shade: "#743d31" }
  ],
  hair: "#102634",
  hairLight: "#304959",
  navy: "#17364a",
  navyLight: "#294e63",
  teal: "#187f7d",
  tealLight: "#36a09a",
  shirt: "#fff1d3",
  pants: "#30383e",
  shoe: "#18242b"
};

const svg = (tag, attrs = "", children = "") => `<${tag} ${attrs}>${children}</${tag}>`;

function defs() {
  return `<defs>
    <linearGradient id="jacket" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#294f64"/><stop offset=".58" stop-color="#17364a"/><stop offset="1" stop-color="#102b3c"/></linearGradient>
    <linearGradient id="cardigan" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#36a09a"/><stop offset=".55" stop-color="#187f7d"/><stop offset="1" stop-color="#11615f"/></linearGradient>
    <linearGradient id="trouser" x1="0" x2="1"><stop stop-color="#3f494f"/><stop offset="1" stop-color="#252d32"/></linearGradient>
    <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#0c2433" flood-opacity=".24"/></filter>
  </defs>`;
}

function facePath(faceIndex) {
  return faceIndex === 0
    ? "M48 45 C47 68 49 85 61 96 C70 104 90 104 99 96 C111 85 113 68 112 45 C103 31 57 31 48 45Z"
    : "M49 43 C46 63 49 84 61 98 C70 108 90 108 99 98 C111 84 114 63 111 43 C101 30 59 30 49 43Z";
}

function backHair(style) {
  const paths = [
    "M44 56 C38 30 56 18 80 18 C108 18 123 35 115 63 C110 79 101 87 95 93 L64 93 C53 83 46 71 44 56Z",
    "M43 57 C38 34 49 19 74 17 C102 14 122 29 117 59 C114 75 105 87 96 94 L63 92 C51 82 45 70 43 57Z",
    "M42 59 C35 43 42 29 55 22 C64 12 79 16 85 20 C98 13 118 27 119 44 C126 58 115 81 99 94 L62 93 C51 84 44 73 42 59Z"
  ];
  return `<g data-layer="hair-back" filter="url(#soft-shadow)">
    <path d="${paths[style]}" fill="${COLORS.hair}" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M53 42 C65 25 94 22 108 41" fill="none" stroke="${COLORS.hairLight}" stroke-width="5" stroke-linecap="round" opacity=".62"/>
  </g>`;
}

function frontHair(style) {
  const paths = [
    "M45 52 C41 30 58 17 80 18 C103 18 119 31 115 53 C109 45 103 39 98 37 C94 49 89 55 83 59 C83 49 79 43 76 39 C69 51 61 56 51 58Z",
    "M44 53 C39 31 56 18 78 18 C101 17 119 31 116 52 C101 47 91 39 84 31 C79 45 67 55 49 59Z",
    "M43 55 C36 42 43 27 58 22 C63 14 79 18 84 23 C94 14 113 25 118 40 C123 51 117 58 113 62 C105 48 96 43 90 40 C88 50 83 58 78 62 C73 50 65 43 58 42 C56 51 51 56 46 60Z"
  ];
  const accents = [
    "M58 33 Q70 23 82 24 M91 26 Q101 30 107 38",
    "M57 34 Q69 23 79 24 M88 25 Q102 29 110 39",
    "M53 35 Q63 24 73 26 M91 25 Q104 31 111 42"
  ];
  return `<g data-layer="hair-front">
    <path d="${paths[style]}" fill="${COLORS.hair}" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${accents[style]}" fill="none" stroke="${COLORS.hairLight}" stroke-width="3" stroke-linecap="round" opacity=".72"/>
  </g>`;
}

function eyes(style) {
  if (style === 0) return `<path d="M61 66 Q66 63 71 66" fill="none" stroke="${COLORS.ink}" stroke-width="3.5" stroke-linecap="round"/><path d="M89 66 Q94 63 99 66" fill="none" stroke="${COLORS.ink}" stroke-width="3.5" stroke-linecap="round"/><circle cx="67" cy="69" r="3.8" fill="${COLORS.ink}"/><circle cx="95" cy="69" r="3.8" fill="${COLORS.ink}"/><circle cx="68.2" cy="67.8" r="1.2" fill="#fff8e6"/><circle cx="96.2" cy="67.8" r="1.2" fill="#fff8e6"/>`;
  if (style === 1) return `<ellipse cx="67" cy="69" rx="5.4" ry="6" fill="#fff8e6" stroke="${COLORS.ink}" stroke-width="2.8"/><ellipse cx="95" cy="69" rx="5.4" ry="6" fill="#fff8e6" stroke="${COLORS.ink}" stroke-width="2.8"/><circle cx="68" cy="70" r="3" fill="${COLORS.ink}"/><circle cx="96" cy="70" r="3" fill="${COLORS.ink}"/><circle cx="69" cy="68.5" r="1" fill="#fff"/><circle cx="97" cy="68.5" r="1" fill="#fff"/>`;
  return `<path d="M61 69 Q67 63 73 69" fill="none" stroke="${COLORS.ink}" stroke-width="3.5" stroke-linecap="round"/><path d="M89 69 Q95 63 101 69" fill="none" stroke="${COLORS.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
}

function mouth(style) {
  if (style === 0) return `<path d="M72 84 Q80 90 88 84" fill="none" stroke="#783f32" stroke-width="2.6" stroke-linecap="round"/>`;
  if (style === 1) return `<path d="M75 86 Q80 87 85 86" fill="none" stroke="#783f32" stroke-width="2.5" stroke-linecap="round"/>`;
  return `<path d="M72 83 Q80 94 88 83 Q80 88 72 83Z" fill="#fff5dd" stroke="#783f32" stroke-width="2.3" stroke-linejoin="round"/>`;
}

function frontBody(skin, top) {
  const jacket = top === 0 ? "url(#jacket)" : "url(#cardigan)";
  const lapel = top === 0
    ? `<path d="M61 110 L77 126 L68 147 L53 112 M99 110 L83 126 L92 147 L107 112" fill="#22495e" stroke="${COLORS.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
    : `<path d="M64 109 Q80 125 96 109" fill="none" stroke="#75c7bd" stroke-width="4"/><path d="M80 124 V179" stroke="${COLORS.ink}" stroke-width="2.5"/><circle cx="85" cy="143" r="1.8" fill="#e5c66c"/><circle cx="85" cy="160" r="1.8" fill="#e5c66c"/>`;
  return `<g data-layer="body" filter="url(#soft-shadow)">
    <path d="M58 174 L76 174 L74 222 L51 222 Q50 214 55 207Z" fill="url(#trouser)" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M84 174 L102 174 L109 207 Q112 215 109 222 L86 222Z" fill="url(#trouser)" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M48 220 Q60 214 75 219 L74 231 L46 231 Q43 226 48 220Z" fill="${COLORS.shoe}" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M86 219 Q101 214 112 220 Q117 227 112 231 L86 231Z" fill="${COLORS.shoe}" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M61 104 Q80 95 99 104 L105 178 Q80 188 55 178Z" fill="${COLORS.shirt}" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M61 103 Q46 107 42 127 L36 170 Q39 178 49 176 L57 143 L59 180 Q80 187 101 180 L103 143 L111 176 Q121 178 124 170 L118 127 Q114 107 99 103Z" fill="${jacket}" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
    ${lapel}
    <path d="M37 166 Q42 163 50 167 L49 181 Q40 186 34 177Z" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3"/>
    <path d="M110 167 Q118 163 123 168 L126 177 Q120 186 111 181Z" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3"/>
  </g>`;
}

function backBody(skin, top) {
  const jacket = top === 0 ? "url(#jacket)" : "url(#cardigan)";
  return `<g data-layer="body" filter="url(#soft-shadow)">
    <path d="M58 174 L76 174 L74 222 L51 222 Q50 214 55 207Z" fill="url(#trouser)" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M84 174 L102 174 L109 207 Q112 215 109 222 L86 222Z" fill="url(#trouser)" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M48 220 Q60 214 75 219 L74 231 L46 231 Q43 226 48 220Z" fill="${COLORS.shoe}" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M86 219 Q101 214 112 220 Q117 227 112 231 L86 231Z" fill="${COLORS.shoe}" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M61 103 Q46 107 42 127 L36 170 Q39 178 49 176 L57 143 L59 180 Q80 187 101 180 L103 143 L111 176 Q121 178 124 170 L118 127 Q114 107 99 103Z" fill="${jacket}" stroke="${COLORS.ink}" stroke-width="4"/>
    <path d="M60 108 Q80 118 100 108" fill="none" stroke="${top === 0 ? COLORS.navyLight : COLORS.tealLight}" stroke-width="3" opacity=".8"/>
    <path d="M80 116 V179" fill="none" stroke="${COLORS.ink}" stroke-width="2" opacity=".55"/>
    <path d="M37 166 Q42 163 50 167 L49 181 Q40 186 34 177Z" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3"/>
    <path d="M110 167 Q118 163 123 168 L126 177 Q120 186 111 181Z" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3"/>
  </g>`;
}

function head(skin) {
  return `<g data-layer="face">
    <path d="M69 96 L70 110 Q80 119 90 110 L91 96Z" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="4"/>
    <ellipse cx="47" cy="67" rx="8" ry="12" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3.5"/>
    <ellipse cx="113" cy="67" rx="8" ry="12" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3.5"/>
    <path d="${facePath(look.face)}" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M53 49 Q59 36 79 34 Q99 35 107 50" fill="none" stroke="${skin.light}" stroke-width="8" stroke-linecap="round" opacity=".54"/>
    <ellipse cx="57" cy="79" rx="6" ry="3" fill="#dc795c" opacity=".32"/><ellipse cx="103" cy="79" rx="6" ry="3" fill="#dc795c" opacity=".32"/>
    ${eyes(look.eyes)}
    <path d="M79 72 Q76 78 80 79" fill="none" stroke="${skin.shade}" stroke-width="2" stroke-linecap="round" opacity=".72"/>
    ${mouth(look.mouth)}
  </g>`;
}

function backHead(skin) {
  return `<g data-layer="face-back">
    <path d="M69 94 L70 110 Q80 117 90 110 L91 94Z" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="4"/>
    <ellipse cx="47" cy="67" rx="8" ry="12" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3.5"/>
    <ellipse cx="113" cy="67" rx="8" ry="12" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="3.5"/>
    <path d="${facePath(look.face)}" fill="${skin.base}" stroke="${COLORS.ink}" stroke-width="4" stroke-linejoin="round"/>
  </g>`;
}

function equipment(direction) {
  if (look.equipment === 0) return "";
  const microphone = direction === "front"
    ? `<path d="M43 70 Q39 81 50 84" fill="none" stroke="${COLORS.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="84" r="3" fill="#d6a12c" stroke="${COLORS.ink}" stroke-width="2"/>`
    : "";
  return `<g data-layer="equipment" filter="url(#soft-shadow)">
    <path d="M46 61 Q46 25 80 23 Q114 25 114 61" fill="none" stroke="${COLORS.ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M47 61 Q48 31 80 29 Q112 31 113 61" fill="none" stroke="#d6a12c" stroke-width="3" stroke-linecap="round"/>
    <rect x="39" y="58" width="13" height="23" rx="6" fill="#294e63" stroke="${COLORS.ink}" stroke-width="3"/>
    <rect x="108" y="58" width="13" height="23" rx="6" fill="#294e63" stroke="${COLORS.ink}" stroke-width="3"/>
    ${microphone}
  </g>`;
}

function figure(direction = "front", faceCrop = false) {
  const skin = COLORS.skins[look.skin];
  const isBack = direction === "back";
  const contents = isBack
    ? `${backBody(skin, look.top)}${backHead(skin)}${backHair(look.hair)}${equipment("back")}`
    : `${backHair(look.hair)}${frontBody(skin, look.top)}${head(skin)}${frontHair(look.hair)}${equipment("front")}`;
  const viewBox = faceCrop ? "34 18 92 104" : "22 10 116 228";
  return `<svg viewBox="${viewBox}" role="img" aria-label="${faceCrop ? "동일 정면 캐릭터의 얼굴 확대" : isBack ? "대표 캐릭터 뒷모습" : "대표 캐릭터 정면 모습"}" preserveAspectRatio="xMidYMid meet">${defs()}${contents}</svg>`;
}

function renderControls() {
  const controls = document.querySelector("#controls");
  controls.innerHTML = Object.entries(OPTIONS).map(([key, values]) => `<div class="part-control">
    <button type="button" data-key="${key}" data-delta="-1" aria-label="${key} 이전">‹</button>
    <div><small>${key.toUpperCase()} ${look[key] + 1}/${values.length}</small><strong>${values[look[key]]}</strong></div>
    <button type="button" data-key="${key}" data-delta="1" aria-label="${key} 다음">›</button>
  </div>`).join("");
  controls.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.key;
    const values = OPTIONS[key];
    look[key] = (look[key] + Number(button.dataset.delta) + values.length) % values.length;
    render();
  }));
}

function render() {
  document.querySelector("#front-preview").innerHTML = figure("front");
  document.querySelector("#back-preview").innerHTML = figure("back");
  document.querySelector("#face-preview").innerHTML = figure("front", true);
  renderControls();
  const combinations = Object.values(OPTIONS).reduce((total, values) => total * values.length, 1);
  document.querySelector("#combination-count").textContent = `${combinations.toLocaleString("ko-KR")}가지 조합 테스트`;
}

document.querySelector("#randomize").addEventListener("click", () => {
  Object.entries(OPTIONS).forEach(([key, values]) => { look[key] = Math.floor(Math.random() * values.length); });
  render();
});

render();
