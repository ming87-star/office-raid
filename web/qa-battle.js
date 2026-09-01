const battleAuditParams = new URLSearchParams(window.location.search);
const battleAuditMode = battleAuditParams.get("mode") || "directive";
const battleAuditBoss = battleAuditParams.get("boss") === "1";
const battleAuditFxGroup = battleAuditParams.get("fx") || "mixed";
const battleAuditOutcome = battleAuditParams.get("outcome") || "great";
const battleAuditFxStepParam = battleAuditParams.get("step");
const battleAuditFxStep = battleAuditFxStepParam === null ? null : Number(battleAuditFxStepParam);
const battleAuditFreeze = battleAuditParams.get("freeze") === "1";
if (battleAuditFreeze) document.body.classList.add("qa-fx-freeze");

const battleAuditFxProfiles = {
  sales: { department: "sales", skills: ["requirement-brief", "client-persuasion", "contract-close"] },
  pm: { department: "management", skills: ["schedule-shift", "work-allocation", "emergency-command"] },
  dev: { department: "dev", skills: ["focus-development", "automation-deploy", "night-shift"] },
  finance: { department: "finance", skills: ["budget-approval", "cost-defense", "emergency-approval"] }
};
const battleAuditFxProfile = battleAuditFxProfiles[battleAuditFxGroup];

const battleAuditMembers = battleAuditFxProfile
  ? ["김하나", "이두리", "박세진"].map((name, index) => employee(name, battleAuditFxProfile.department, "이펙트 점검", 18 + index, 17 + index, 15 + index, 1124 + index * 937, 2))
  : [
      employee("서대표", "management", "침착한 조율자", 18, 18, 15, 1124, 2),
      employee("이개발", "dev", "위기 전문가", 20, 14, 18, 3817, 2),
      employee("윤회계", "finance", "꼼꼼한 기록가", 17, 19, 14, 2471, 1)
    ];
battleAuditMembers[0].isRepresentative = true;

state.industry = "it";
state.companyName = "전투 UI 점검실";
state.cash = 5000;
state.reputation = 40;
state.capacity = 6;
state.employees = battleAuditMembers;
state.teamIds = battleAuditMembers.map(member => member.id);
state.projectClears = 4;

startBattle(battleAuditBoss ? "boss-launch-outage" : "it-mvp");
clearBattleTimer();
battle.action = 3;
battle.workload = Math.round(battle.max * .72);
battle.directiveGauge = battleAuditMode === "running" ? 82 : 100;
battle.status = { name: "긴급회의", turns: 1, efficiency: .75, flat: 0, tone: "bad" };
battle.log = battleAuditBoss ? "보스 프로젝트의 압도적인 규모를 점검합니다." : "전투 정보와 공격 방향을 점검합니다.";

if (["directive", "effect", "calculating"].includes(battleAuditMode)) {
  openDirective();
  battle.directiveSelections = battleAuditFxProfile
    ? Object.fromEntries(battleAuditMembers.map((member, index) => [member.id, battleAuditFxProfile.skills[index]]))
    : {
        [battleAuditMembers[0].id]: "work-allocation",
        [battleAuditMembers[1].id]: "automation-deploy",
        [battleAuditMembers[2].id]: "cost-defense"
      };
  battle.directiveFocusId = battleAuditMembers[1].id;
  if (battleAuditMode === "effect") {
    const allFxSteps = directiveFxSteps(orderedBattleTeam());
    const visibleFxSteps = battleAuditFxStep !== null && Number.isInteger(battleAuditFxStep) && allFxSteps[battleAuditFxStep]
      ? [allFxSteps[battleAuditFxStep]]
      : allFxSteps;
    battle.awaitingDirective = false;
    battle.skillFx = {
      phase: "result",
      title: battleAuditFxGroup === "mixed" ? "완벽한 업무 흐름" : `${battleAuditFxGroup.toUpperCase()} EFFECTS`,
      detail: "지원 → 공격 순서 · 스킬별 고유 연출",
      outcome: ["low", "normal", "great"].includes(battleAuditOutcome) ? battleAuditOutcome : "great",
      steps: visibleFxSteps
    };
  } else if (battleAuditMode === "calculating") {
    const plan = directivePlanEstimate(orderedBattleTeam());
    battle.skillFx = { phase: "calculating", title: "계획 분석 중", detail: "처리량 · 연계 · 변수 확인", outcome: "normal", range: plan, steps: directiveFxSteps(orderedBattleTeam()) };
  }
  renderBattle();
} else {
  renderBattle();
  if (battleAuditMode === "confirm") requestBattleLeave();
}
