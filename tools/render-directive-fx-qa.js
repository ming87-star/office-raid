const path = require("node:path");
const sharp = require("sharp");

const outputPath = process.argv[2] || path.resolve(__dirname, "..", "directive-fx-qa.png");
const effects = [
  { group: "SALES", name: "REQUIREMENT BRIEF", visual: "APPROVAL STAMP", icon: "◎", tone: "#8a668f", motif: "stamp" },
  { group: "SALES", name: "CLIENT PERSUASION", visual: "PRESENTATION", icon: "◇", tone: "#4a70a8", motif: "presentation" },
  { group: "SALES", name: "CONTRACT CLOSE", visual: "CONTRACT BURST", icon: "✦", tone: "#c84b3c", motif: "contract" },
  { group: "PM", name: "SCHEDULE SHIFT", visual: "GIANT CALENDAR", icon: "+", tone: "#d6a12c", motif: "calendar" },
  { group: "PM", name: "WORK ALLOCATION", visual: "TASK NETWORK", icon: "↗", tone: "#168c8b", motif: "network" },
  { group: "PM", name: "EMERGENCY COMMAND", visual: "BROADCAST WAVE", icon: "×", tone: "#168c8b", motif: "broadcast" },
  { group: "DEV", name: "FOCUS DEVELOPMENT", visual: "FOCUS BURST", icon: "◆", tone: "#c84b3c", motif: "focus" },
  { group: "DEV", name: "AUTOMATION DEPLOY", visual: "AUTOMATION LOOP", icon: "↻", tone: "#8a668f", motif: "automation" },
  { group: "DEV", name: "NIGHT SHIFT", visual: "DEADLINE SHRED", icon: "⚡", tone: "#c84b3c", motif: "shred" },
  { group: "FINANCE", name: "RESOURCE FOCUS", visual: "RESOURCE CONVERGE", icon: "×", tone: "#168c8b", motif: "resource" },
  { group: "FINANCE", name: "RISK DEFENSE", visual: "SAFETY BARRIER", icon: "▣", tone: "#4a70a8", motif: "shield" },
  { group: "FINANCE", name: "EMERGENCY SUPPORT", visual: "URGENT APPROVAL", icon: "+", tone: "#d6a12c", motif: "approval" }
];

function motif(effect, x, y) {
  const cx = x + 58;
  const cy = y + 70;
  const color = effect.tone;
  if (effect.motif === "stamp") return `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="3 3" transform="rotate(-10 ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="${color}" stroke-width="2"/>`;
  if (effect.motif === "presentation") return `<path d="M${cx - 34} ${cy + 26}H${cx + 35}M${cx - 25} ${cy + 20}V${cy - 2}M${cx - 4} ${cy + 20}V${cy - 22}M${cx + 17} ${cy + 20}V${cy - 12}" fill="none" stroke="${color}" stroke-width="7"/>`;
  if (effect.motif === "contract") return `<path d="M${cx - 30} ${cy - 36}H${cx + 20}L${cx + 34} ${cy - 22}V${cy + 34}H${cx - 30}Z" fill="none" stroke="${color}" stroke-width="4"/><path d="M${cx - 18} ${cy - 14}H${cx + 18}M${cx - 18} ${cy}H${cx + 18}M${cx - 18} ${cy + 14}H${cx + 5}" stroke="${color}" stroke-width="4"/>`;
  if (effect.motif === "calendar") return `<rect x="${cx - 34}" y="${cy - 31}" width="68" height="62" fill="none" stroke="${color}" stroke-width="4"/><path d="M${cx - 34} ${cy - 12}H${cx + 34}M${cx - 12} ${cy - 12}V${cy + 31}M${cx + 12} ${cy - 12}V${cy + 31}M${cx - 34} ${cy + 9}H${cx + 34}" stroke="${color}" stroke-width="3"/>`;
  if (effect.motif === "network") return `<path d="M${cx} ${cy}L${cx - 31} ${cy - 23}M${cx} ${cy}L${cx + 31} ${cy - 22}M${cx} ${cy}L${cx - 28} ${cy + 27}M${cx} ${cy}L${cx + 30} ${cy + 25}" stroke="${color}" stroke-width="4"/><g fill="${color}"><circle cx="${cx}" cy="${cy}" r="10"/><circle cx="${cx - 31}" cy="${cy - 23}" r="8"/><circle cx="${cx + 31}" cy="${cy - 22}" r="8"/><circle cx="${cx - 28}" cy="${cy + 27}" r="8"/><circle cx="${cx + 30}" cy="${cy + 25}" r="8"/></g>`;
  if (effect.motif === "broadcast") return `<circle cx="${cx}" cy="${cy}" r="9" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="${color}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="36" fill="none" stroke="${color}" stroke-width="3" opacity=".65"/>`;
  if (effect.motif === "focus") return `<circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${color}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${color}" stroke-width="4"/><path d="M${cx - 43} ${cy}H${cx - 20}M${cx + 20} ${cy}H${cx + 43}M${cx} ${cy - 43}V${cy - 20}M${cx} ${cy + 20}V${cy + 43}" stroke="${color}" stroke-width="4"/>`;
  if (effect.motif === "automation") return `<circle cx="${cx}" cy="${cy}" r="31" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="10 7"/><path d="M${cx + 18} ${cy - 29}L${cx + 37} ${cy - 28}L${cx + 29} ${cy - 11}" fill="${color}"/><path d="M${cx - 18} ${cy + 29}L${cx - 37} ${cy + 28}L${cx - 29} ${cy + 11}" fill="${color}"/>`;
  if (effect.motif === "shred") return `<path d="M${cx - 34} ${cy - 35}L${cx - 8} ${cy - 6}L${cx - 24} ${cy - 3}L${cx + 6} ${cy + 34}M${cx + 2} ${cy - 34}L${cx + 25} ${cy - 8}L${cx + 10} ${cy - 4}L${cx + 35} ${cy + 30}" fill="none" stroke="${color}" stroke-width="8"/>`;
  if (effect.motif === "resource") return `<path d="M${cx - 38} ${cy - 28}L${cx - 9} ${cy - 7}M${cx + 38} ${cy - 28}L${cx + 9} ${cy - 7}M${cx - 38} ${cy + 28}L${cx - 9} ${cy + 7}M${cx + 38} ${cy + 28}L${cx + 9} ${cy + 7}" stroke="${color}" stroke-width="6"/><rect x="${cx - 13}" y="${cy - 13}" width="26" height="26" fill="${color}" transform="rotate(45 ${cx} ${cy})"/>`;
  if (effect.motif === "shield") return `<path d="M${cx} ${cy - 38}L${cx + 31} ${cy - 27}V${cy + 2}Q${cx + 30} ${cy + 27} ${cx} ${cy + 39}Q${cx - 30} ${cy + 27} ${cx - 31} ${cy + 2}V${cy - 27}Z" fill="none" stroke="${color}" stroke-width="6"/><path d="M${cx - 15} ${cy}L${cx - 3} ${cy + 13}L${cx + 19} ${cy - 13}" fill="none" stroke="${color}" stroke-width="6"/>`;
  return `<rect x="${cx - 34}" y="${cy - 30}" width="68" height="60" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="5 3" transform="rotate(-4 ${cx} ${cy})"/><path d="M${cx} ${cy - 19}V${cy + 19}M${cx - 19} ${cy}H${cx + 19}" stroke="${color}" stroke-width="8"/>`;
}

function card(effect, index) {
  const column = index % 4;
  const row = Math.floor(index / 4);
  const x = 34 + column * 286;
  const y = 126 + row * 216;
  const words = effect.name.split(" ");
  const nameLines = [""];
  words.forEach(word => {
    const current = nameLines[nameLines.length - 1];
    if (current && `${current} ${word}`.length > 15 && nameLines.length === 1) nameLines.push(word);
    else nameLines[nameLines.length - 1] = current ? `${current} ${word}` : word;
  });
  return `<g>
    <rect x="${x}" y="${y}" width="266" height="194" fill="#fffaf0" stroke="#17364a" stroke-width="4"/>
    <rect x="${x + 4}" y="${y + 4}" width="258" height="25" fill="${effect.tone}"/>
    <text x="${x + 14}" y="${y + 22}" fill="white" font-family="sans-serif" font-size="13" font-weight="900">${effect.group} · ${String(index + 1).padStart(2, "0")}</text>
    ${motif(effect, x + 10, y + 28)}
    <rect x="${x + 112}" y="${y + 46}" width="132" height="38" fill="${effect.tone}"/>
    <text x="${x + 178}" y="${y + 74}" text-anchor="middle" fill="white" font-family="sans-serif" font-size="26" font-weight="900">${effect.icon}</text>
    <text x="${x + 112}" y="${y + 113}" fill="#17364a" font-family="sans-serif" font-size="12" font-weight="900">${nameLines[0]}</text>
    ${nameLines[1] ? `<text x="${x + 112}" y="${y + 130}" fill="#17364a" font-family="sans-serif" font-size="12" font-weight="900">${nameLines[1]}</text>` : ""}
    <text x="${x + 112}" y="${y + 153}" fill="#6d7c8c" font-family="sans-serif" font-size="11" font-weight="800">${effect.visual}</text>
    <text x="${x + 14}" y="${y + 180}" fill="${effect.tone}" font-family="sans-serif" font-size="11" font-weight="900">SUPPORT → DIRECT → COMBO</text>
  </g>`;
}

async function main() {
  const svg = `<svg width="1200" height="820" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="820" fill="#f3e8d1"/>
    <text x="34" y="50" fill="#17364a" font-family="sans-serif" font-size="34" font-weight="900">OFFICE RAID · DIRECTIVE SKILL EFFECTS</text>
    <text x="34" y="82" fill="#168c8b" font-family="sans-serif" font-size="17" font-weight="900">12 SKILLS · CODE-BASED MOTION QA · NOT DEPLOYED</text>
    <text x="1166" y="50" text-anchor="end" fill="#c84b3c" font-family="sans-serif" font-size="14" font-weight="900">LOW · NORMAL · GREAT INTENSITY</text>
    ${effects.map(card).join("")}
    <rect x="34" y="784" width="1132" height="4" fill="#17364a"/>
    <text x="34" y="810" fill="#6d7c8c" font-family="sans-serif" font-size="13" font-weight="800">ANALYSIS SHOWS THE EXECUTION ORDER. SKILLS FIRE IN SEQUENCE, THEN PERFECT WORKFLOW CLOSES THE PLAN.</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
