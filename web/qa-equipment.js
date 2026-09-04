const auditStaffCount = new URLSearchParams(window.location.search).get("staff") === "3" ? 3 : 6;

function auditEquipment(name, slot, art, rarity) {
  return {
    id: `audit-${art}`,
    name,
    slot,
    art,
    rarity,
    workBonus: 4 + rarity,
    collaborationBonus: 2 + rarity
  };
}

const auditMembers = [
  employee("서대표", "management", "침착한 조율자", 18, 18, 15, 1124, 2),
  employee("이개발", "dev", "위기 전문가", 19, 13, 17, 3817, 1),
  employee("박기획", "planning", "아이디어 뱅크", 16, 18, 14, 4265, 1),
  employee("최디자인", "design", "완벽주의", 17, 16, 15, 7821, 1),
  employee("김운영", "operations", "꼼꼼한 기록가", 16, 17, 14, 6942, 1),
  employee("윤회계", "finance", "침착한 조율자", 17, 16, 13, 2471, 1)
];

auditMembers[0].isRepresentative = true;
auditMembers[0].equipment = {
  work: auditEquipment("집중형 노트북", "work", "laptop", 2),
  support: auditEquipment("협업 헤드셋", "support", "headset", 3),
  personal: auditEquipment("마감 수호 텀블러", "personal", "tumbler", 1)
};
auditMembers[1].equipment = {
  work: auditEquipment("기획자의 태블릿", "work", "planning-tablet", 1),
  support: auditEquipment("정리의 다이어리", "support", "organizer-diary", 2),
  personal: auditEquipment("새벽의 커피", "personal", "coffee", 3)
};
auditMembers[2].equipment = {
  work: auditEquipment("정밀 측정 키트", "work", "measuring-kit", 3),
  support: auditEquipment("황금 명함지갑", "support", "card-wallet", 4),
  personal: auditEquipment("행운의 부적", "personal", "charm", 2)
};

state.industry = "it";
state.companyName = `장비 점검실 · ${auditStaffCount}인 배치`;
state.cash = 9999;
state.reputation = 99;
state.capacity = auditStaffCount;
state.employees = auditMembers.slice(0, auditStaffCount);
state.teamIds = state.employees.slice(0, 3).map(member => member.id);
state.equipment = [];
state.projectClears = 9;

renderOffice("장비 9종의 착용·책상 배치와 겹침을 확인하는 개발 점검 화면입니다.");
clearOfficeDialogue();
