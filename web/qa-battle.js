const battleAuditParams = new URLSearchParams(window.location.search);
const battleAuditMode = battleAuditParams.get("mode") || "directive";
const battleAuditBoss = battleAuditParams.get("boss") === "1";

const battleAuditMembers = [
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

if (battleAuditMode === "directive") {
  openDirective();
  battle.directiveSelections = {
    [battleAuditMembers[0].id]: "work-allocation",
    [battleAuditMembers[1].id]: "automation-deploy",
    [battleAuditMembers[2].id]: "cost-defense"
  };
  battle.directiveFocusId = battleAuditMembers[1].id;
  renderBattle();
} else {
  renderBattle();
  if (battleAuditMode === "confirm") requestBattleLeave();
}
