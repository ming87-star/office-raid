"use strict";

(function attachTeamRules(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OfficeRaidTeamRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const ROLES = {
    sales: { id: "burst", name: "협상·폭발", color: "#d6a12c", description: "요구사항을 먼저 정리하고 계약·마무리 단계에서 큰 처리량을 만듭니다." },
    pm: { id: "support", name: "조율·지원", color: "#168c8b", description: "팀 모멘텀을 쌓고 일정·연계 스킬로 다른 직원의 성과를 키웁니다." },
    dev: { id: "dealer", name: "처리·딜러", color: "#c84b3c", description: "높은 실무 능력으로 업무량을 직접 줄이며 정리된 요구사항을 활용합니다." },
    finance: { id: "guard", name: "안정·방어", color: "#4a70a8", description: "불리한 상태와 손실을 줄이고 흔들리는 프로젝트를 안정시킵니다." }
  };

  const TRAITS = {
    "분위기 메이커": { description: "동료가 편하게 협업하도록 이끕니다.", effect: "협업 +2", collaboration: 2 },
    "완벽주의": { description: "작은 오류까지 끝까지 확인합니다.", effect: "실무 +2", work: 2 },
    "위기 전문가": { description: "일정이나 상황이 불리할수록 집중력이 올라갑니다.", effect: "불리한 상태 또는 잔여 업무 40% 이하에서 처리량 +15%", crisisMultiplier: 1.15 },
    "아이디어 뱅크": { description: "긴급한 순간에 더 좋은 해결책을 제시합니다.", effect: "긴급 지시 효과 +10%", directiveMultiplier: 1.1 },
    "침착한 조율자": { description: "복잡한 의견을 차분하게 정리합니다.", effect: "협업 +2", collaboration: 2 },
    "빠른 손": { description: "다른 직원보다 업무 착수가 빠릅니다.", effect: "속도 +2", speed: 2 },
    "꼼꼼한 기록가": { description: "기록을 남겨 실무와 협업의 누락을 줄입니다.", effect: "실무 +1 · 협업 +1", work: 1, collaboration: 1 },
    "발표 체질": { description: "핵심을 분명하게 전달해 대표의 판단을 돕습니다.", effect: "행동 시 긴급 지시 충전 +2", directiveCharge: 2 }
  };

  function archetype(department) {
    if (["sales", "md", "marketing", "design"].includes(department)) return "sales";
    if (["dev", "product", "production"].includes(department)) return "dev";
    if (["quality", "procurement", "finance"].includes(department)) return "finance";
    return "pm";
  }

  function role(department) { return ROLES[archetype(department)]; }
  function trait(name) { return TRAITS[name] || { description: "개성 있는 업무 방식으로 팀에 기여합니다.", effect: "별도 수치 효과 없음" }; }
  function stats(member) { const value = trait(member?.trait); return { work: value.work || 0, collaboration: value.collaboration || 0, speed: value.speed || 0 }; }
  function damageMultiplier(member, context = {}) { const value = trait(member?.trait); return value.crisisMultiplier && (context.badStatus || context.remainingRatio <= .4) ? value.crisisMultiplier : 1; }
  function directiveMultiplier(member) { return trait(member?.trait).directiveMultiplier || 1; }
  function directiveCharge(member) { return trait(member?.trait).directiveCharge || 0; }

  return { ROLES, TRAITS, archetype, role, trait, stats, damageMultiplier, directiveMultiplier, directiveCharge };
});
