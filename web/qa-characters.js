const characterAuditMembers = [
  ["서대표", "management", { face: 0, skin: 1, hair: 1, eyes: 5, eyebrows: 0, nose: 0, mouth: 3, accessory: 0, top: 0, bottom: 1 }],
  ["김하린", "dev", { face: 1, skin: 0, hair: 6, eyes: 2, eyebrows: 4, nose: 2, mouth: 5, accessory: 1, top: 2, bottom: 0 }],
  ["박도윤", "production", { face: 2, skin: 2, hair: 10, eyes: 0, eyebrows: 2, nose: 1, mouth: 0, accessory: 3, top: 4, bottom: 2 }],
  ["정서연", "design", { face: 5, skin: 1, hair: 11, eyes: 8, eyebrows: 6, nose: 3, mouth: 7, accessory: 4, top: 10, bottom: 3 }],
  ["윤현우", "sales", { face: 3, skin: 3, hair: 4, eyes: 6, eyebrows: 3, nose: 4, mouth: 4, accessory: 2, top: 5, bottom: 4 }],
  ["최유진", "finance", { face: 6, skin: 4, hair: 15, eyes: 9, eyebrows: 7, nose: 6, mouth: 8, accessory: 8, top: 8, bottom: 6 }]
].map(([name, department, look], index) => ({
  id: `character-audit-${index}`,
  name,
  department,
  appearance: { ...look, outfit: look.top }
}));

app.innerHTML = `${header("48×48 캐릭터 점검", "큰 머리 비율 · 직종과 무관한 사복 · 정면/후면 연결")}
  <section class="screen">
    <div class="character-audit">
      ${characterAuditMembers.map(member => `<article class="character-audit-card panel">
        <div class="character-audit-pair">
          <canvas width="48" height="48" data-audit-front="${member.id}" aria-label="${member.name} 정면"></canvas>
          <canvas width="48" height="48" data-audit-back="${member.id}" aria-label="${member.name} 후면"></canvas>
        </div>
        <strong>${member.name}</strong>
        <small>${DEPARTMENTS[member.department].name} · 개인 복장</small>
      </article>`).join("")}
      <p class="character-audit-note panel">왼쪽은 면접·사무실용 정면, 오른쪽은 전투용 후면입니다. 부서 색은 이름표와 UI에만 표시되고 캐릭터 의상에는 강제로 적용되지 않습니다.</p>
    </div>
  </section>`;

document.querySelectorAll("[data-audit-front]").forEach(canvas => drawPortrait(canvas, characterAuditMembers.find(member => member.id === canvas.dataset.auditFront)));
document.querySelectorAll("[data-audit-back]").forEach(canvas => drawBackPortrait(canvas, characterAuditMembers.find(member => member.id === canvas.dataset.auditBack)));
