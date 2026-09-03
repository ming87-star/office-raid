"use strict";

(() => {
  const COSTS = [50, 150, 450, 1200];
  let tradeIds = [];
  let tradeBaseId = null;
  let equipmentTab = "equip";
  let marketMode = "upgrade";
  let saleIds = [];
  let equipmentSortMode = "newest";
  let selectedMailId = null;
  const P = (id, typeLabel, department, subject, body, question, options, answerIndex, explanation) =>
    ({ id, typeLabel, department, subject, body, question, options, answerIndex, explanation });

  const PROBLEMS = {
    manufacturing: [
      P("mfg-defect","엑셀 검토","quality","[검토 요청] BTD-125 불량률 수식 승인","대표님, BTD-125 실적표를 마감하려고 합니다. 계획 240개, 생산 228개, 불량 6개, 양품 222개입니다. C2는 생산수량, D2는 불량수량이며 F2에 불량률을 표시합니다.","F2에 넣을 가장 적절한 수식은 무엇인가요?",["=IFERROR(D2/C2,0)","=IFERROR(C2/D2,0)","=D2/240","=SUM(C2:D2)"],0,"불량률은 불량수량÷생산수량이므로 =IFERROR(D2/C2,0)이 맞습니다."),
      P("mfg-drawing","도면 검토","product","[승인 요청] 브래킷 초도품 치수 판정","대표님, 도면은 홀 피치 50.0 ±0.2mm, 홀 2-⌀10.0 ±0.1mm입니다. 출하 가능한 초도품을 승인해 주세요.","공차를 모두 만족하는 측정 결과는 무엇인가요?",["A · 피치 50.24 / 지름 10.02","B · 피치 49.88 / 지름 9.98","C · 피치 50.05 / 지름 10.14","D · 피치 49.76 / 지름 9.95"],1,"B는 피치 49.80~50.20mm, 지름 9.90~10.10mm 범위에 모두 들어옵니다."),
      P("mfg-shortage","생산 계획","production","[확인 요청] 납품 부족 수량","대표님, 납품 목표 480개 중 현재 양품 356개가 있고 오늘 추가 생산분의 예상 양품은 96개입니다.","목표를 맞추려면 양품이 최소 몇 개 더 필요할까요?",["18개","28개","38개","124개"],1,"480-(356+96)=28개입니다."),
      P("mfg-stock","재고 검토","procurement","[승인 요청] 안전재고 발주","대표님, AX-04 현재고는 720개, 확정 소요량은 560개, 안전재고 기준은 200개입니다.","사용 후 판단으로 맞는 것은 무엇인가요?",["160개가 남으므로 40개 이상 발주","200개가 남으므로 발주 불필요","360개가 남으므로 발주 불필요","40개 부족하므로 생산 중단"],0,"720-560=160개로 안전재고보다 40개 부족합니다."),
      P("mfg-yield","실적 검산","quality","[검토 요청] 공정 수율 보고","대표님, 투입 500개 중 양품 470개를 확보했습니다. 수율은 소수점 첫째 자리까지 보고합니다.","보고할 수율은 얼마인가요?",["6.0%","94.0%","96.0%","106.4%"],1,"470÷500×100=94.0%입니다."),
      P("mfg-overtime","생산 계획","production","[확인 요청] 잔업 필요 시간","대표님, 남은 주문은 180개, 생산성은 시간당 45개이며 교대 종료까지 3시간 남았습니다.","필요한 잔업 시간은 얼마인가요?",["없음","1시간","2시간","4시간"],1,"총 4시간이 필요하므로 잔업은 1시간입니다.")
    ],
    commerce: [
      P("com-margin","매출 검산","md","[검토 요청] 행사 상품 이익률","대표님, 판매가 50,000원, 매입가 32,000원이며 쿠폰 비용은 없습니다.","판매가 기준 매출총이익률은 얼마인가요?",["18%","36%","56.25%","64%"],1,"(50,000-32,000)÷50,000=36%입니다."),
      P("com-stock","엑셀 검토","logistics","[승인 요청] 재고 부족 표시 수식","대표님, B2는 현재고, C2는 안전재고입니다. 부족하면 발주, 아니면 정상으로 표시합니다.","D2의 수식은 무엇인가요?",['=IF(B2<C2,"발주","정상")','=IF(B2>C2,"발주","정상")','=COUNTIF(B2<C2,"발주")','=SUM(B2:C2)'],0,"현재고가 안전재고보다 작은지를 IF로 비교합니다."),
      P("com-conversion","판매 분석","marketing","[검토 요청] 방송 전환율","대표님, 방문자 2,400명 중 구매 완료 고객은 192명입니다.","구매 전환율은 얼마인가요?",["6%","8%","12.5%","19.2%"],1,"192÷2,400×100=8%입니다."),
      P("com-shipping","물류 검토","logistics","[판단 요청] 당일 출고 수량","대표님, 주문 350건 중 주소 오류 12건과 결제 보류 8건은 출고할 수 없습니다.","정상 출고 가능한 주문은 몇 건인가요?",["320건","330건","338건","342건"],1,"350-12-8=330건입니다."),
      P("com-discount","가격 검토","sales","[승인 요청] 거래처 할인 단가","대표님, 정상 단가 80,000원에 계약 할인율 15%를 적용합니다.","제시할 단가는 얼마인가요?",["12,000원","65,000원","68,000원","72,000원"],2,"80,000×0.85=68,000원입니다."),
      P("com-return","CS 분석","marketing","[검토 요청] 주간 반품률","대표님, 배송 완료 1,250건 중 반품 접수는 25건입니다.","반품률은 얼마인가요?",["0.2%","2.0%","5.0%","20.0%"],1,"25÷1,250×100=2.0%입니다.")
    ],
    it: [
      P("it-uptime","운영 지표","operations","[검토 요청] 월간 가용성","대표님, 집계 기간 10,000분 중 장애 시간은 20분입니다.","서비스 가용성은 얼마인가요?",["98.0%","99.0%","99.8%","99.98%"],2,"(10,000-20)÷10,000×100=99.8%입니다."),
      P("it-http","장애 검토","dev","[판단 요청] API 응답 코드","대표님, 로그인하지 않은 사용자가 인증 필수 API를 호출했습니다. 서버 장애는 아닙니다.","가장 적절한 HTTP 상태 코드는 무엇인가요?",["200","401","404","500"],1,"인증 정보가 없을 때는 401이 적절합니다."),
      P("it-excel","엑셀 검토","planning","[승인 요청] 긴급 이슈 집계","대표님, B열은 우선순위, C열은 상태입니다. 긴급이면서 미해결인 행을 셉니다.","가장 적절한 수식은 무엇인가요?",['=COUNTIFS(B2:B100,"긴급",C2:C100,"미해결")','=COUNTIF(B2:C100,"긴급")','=SUMIFS(B2:B100,C2:C100,"미해결")','=COUNT(B2:B100,C2:C100)'],0,"여러 조건을 동시에 세려면 COUNTIFS를 사용합니다."),
      P("it-sprint","일정 검토","planning","[검토 요청] 스프린트 잔여 용량","대표님, 용량은 42포인트이고 확정 작업은 17, 9, 8포인트입니다.","추가 배정 가능한 용량은 얼마인가요?",["6","8","10","17"],1,"42-(17+9+8)=8입니다."),
      P("it-funnel","UX 분석","design","[판단 요청] 가입 흐름 이탈률","대표님, 가입 시작 800명 중 완료 사용자는 680명입니다.","이탈률은 얼마인가요?",["15%","17.6%","20%","85%"],0,"(800-680)÷800×100=15%입니다."),
      P("it-server","서버 계획","operations","[승인 요청] 서버 증설 수량","대표님, 피크는 초당 1,000건, 서버 한 대의 안전 처리량은 초당 220건입니다.","필요한 최소 서버 수는 몇 대인가요?",["4대","5대","6대","10대"],1,"1,000÷220=4.55이므로 올림해 5대입니다.")
    ]
  };

  function tone(member, phase) {
    const key = officePersonality(member);
    const copy = {
      perfectionist:["수치와 기준을 대조했습니다. 최종 승인 부탁드립니다.","기준을 다시 대조하겠습니다. 재검토 부탁드립니다.","확인 감사합니다. 기준대로 정확히 반영하겠습니다."],
      mood:["팀에는 제가 설명할게요. 대표님 판단만 부탁드립니다!","선택지를 더 분명히 볼게요. 다시 봐주세요.","역시 정리가 됐네요! 바로 공유하겠습니다."],
      realist:["현재 자료 기준으로 정리했습니다. 실행 여부를 확인해 주세요.","조건을 다시 나눠 보겠습니다. 재검토 부탁드립니다.","결정 사항을 기록해 두겠습니다."],
      quiet:["필요한 내용만 정리했습니다. 확인 부탁드립니다.","기준을 다시 확인하겠습니다.","감사합니다. 바로 처리하겠습니다."],
      competitive:["마감 전에 끝낼 수 있습니다. 승인만 부탁드립니다.","이번에는 놓치지 않겠습니다. 다시 확인해 주세요.","좋습니다. 확실하게 마무리하겠습니다."],
      creative:["초안을 만들었습니다. 대표님 시선으로 점검해 주세요.","다른 관점에서 다시 보겠습니다.","감사합니다. 더 매끄럽게 반영하겠습니다."]
    };
    return (copy[key]||copy.realist)[phase==="request"?0:phase==="retry"?1:2];
  }
  function senderFor(problem, previous, seed) {
    const staff=state.employees.filter(m=>!m.isRepresentative&&!isEmployeeUnavailable(m.id));
    let pool=staff.filter(m=>m.department===problem.department);
    if(!pool.length)pool=staff;
    const other=pool.filter(m=>m.id!==previous); if(other.length)pool=other;
    return pool[FEATURES.hashString(seed)%Math.max(1,pool.length)]||state.employees[0];
  }
  function problemFor(item){return (PROBLEMS[state.industry]||PROBLEMS.it).find(p=>p.id===item?.problemId);}
  function syncLegacy(daily){
    const next=daily.items.find(x=>x.arrived&&!x.completed);
    const sender=state.employees.find(m=>m.id===next?.senderId);
    state.workMail={date:daily.date,completed:daily.items.every(x=>x.completed),hasPending:Boolean(next),problem:{senderName:sender?.name||"직원"}};
    state.workMailStats={...(state.workMailStats||{}),streak:0};
  }

  ensureWorkMail=function(){
    if(!state.tutorialBattleCompleted)return null;
    const date=FEATURES.todayKey(new Date());
    if(!state.dailyMissions||state.dailyMissions.date!==date){
      const total=Math.min(4,2+Math.max(0,Math.min(2,state.companyLevel||0)));
      const pool=[...(PROBLEMS[state.industry]||PROBLEMS.it)];
      const random=FEATURES.seededRandom(`${date}|${state.companyName}|${state.industry}`);
      for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
      let due=state.projectClears,previous=null;
      const items=pool.slice(0,total).map((p,i)=>{
        if(i)due+=1+(FEATURES.hashString(`${date}|${i}`)%2);
        const sender=senderFor(p,previous,`${date}|${p.id}`);previous=sender?.id;
        return{id:`${date}-${p.id}`,problemId:p.id,senderId:sender?.id,completed:false,wrongAttempts:0,arrived:i===0,deliveryClears:due};
      });
      state.dailyMissions={date,total,accuracy:100,rewardClaimed:false,rewardName:"",items};
      selectedMailId=items[0]?.id;
    }
    state.dailyMissions.items.forEach(x=>{if(state.projectClears>=x.deliveryClears)x.arrived=true;});
    syncLegacy(state.dailyMissions);return state.dailyMissions;
  };
  workMailAccuracyLabel=function(){
    const d=ensureWorkMail();if(!d)return"업무 없음";
    return `${d.accuracy}% · ${d.items.filter(x=>x.completed).length}/${d.total}`;
  };
  openWorkMail=function(id=null,notice="직원들이 보낸 검토 요청을 확인하세요."){
    currentView="work-mail";clearBattleTimer();clearOfficeDialogue();
    const d=ensureWorkMail();if(!d)return renderOffice("첫 프로젝트 완료 후 업무 메일이 도착합니다.");
    const a=d.items.filter(x=>x.arrived),m=a.find(x=>x.id===id)||a.find(x=>x.id===selectedMailId)||a.find(x=>!x.completed)||a[0];
    selectedMailId=m?.id;renderWorkMail(notice);
  };
  renderWorkMail=function(notice){
    const d=ensureWorkMail(),arrived=d?.items.filter(x=>x.arrived)||[];
    const mail=arrived.find(x=>x.id===selectedMailId)||arrived.find(x=>!x.completed)||arrived[0];
    if(!mail)return renderOffice("도착한 업무 메일이 없습니다.");
    selectedMailId=mail.id;
    const p=problemFor(mail),sender=state.employees.find(m=>m.id===mail.senderId)||senderFor(p,null,mail.id);
    const done=d.items.filter(x=>x.completed).length,all=done===d.total;
    const tabs=arrived.map((x,i)=>{const xp=problemFor(x),xs=state.employees.find(m=>m.id===x.senderId);return `<button class="work-mail-tab ${x.id===mail.id?"active":""} ${x.completed?"done":""}" data-mail-id="${x.id}"><b>${x.completed?"✓":i+1}</b><span>${escapeHtml(xs?.name||"직원")}<small>${escapeHtml(xp?.typeLabel||"검토")}</small></span></button>`;}).join("");
    const options=mail.completed?"":p.options.map((o,i)=>`<button class="work-mail-option" data-mail-answer="${i}"><i>${i+1}</i><span>${escapeHtml(o)}</span></button>`).join("");
    const result=mail.completed?`<div class="work-mail-complete"><small>${all?"TODAY'S TASK COMPLETE":"REVIEW COMPLETE"}</small><strong>${all?"오늘의 임무 완료!":"검토 완료"}</strong><span>${escapeHtml(tone(sender,"thanks"))}${all&&d.rewardName?` · 장비 ${escapeHtml(d.rewardName)} 획득`:""}</span></div>`:`<div class="work-mail-options">${options}</div>`;
    app.innerHTML=`${header("업무 메일",notice)}<section class="screen work-mail-screen">
      <div class="work-mail-summary panel"><span><small>오늘의 요청</small><strong>${done}/${d.total}</strong></span><span><small>정확도</small><strong>${d.accuracy}%</strong></span><span><small>도착</small><strong>${arrived.length}/${d.total}</strong></span></div>
      <div class="work-mail-list">${tabs}</div><article class="work-mail panel">
      <div class="work-mail-toolbar"><span>받은편지함 · ${escapeHtml(d.date)}</span><b>${mail.completed?"처리 완료":"답변 필요"}</b></div>
      <div class="work-mail-head"><span class="work-mail-avatar"><canvas width="24" height="24" data-portrait="${sender?.id||""}" data-portrait-crop="face"></canvas></span><div><small>보낸 사람</small><strong>${escapeHtml(sender?.name||"직원")}</strong><span>${escapeHtml(DEPARTMENTS[sender?.department]?.name||"담당 부서")} · ${escapeHtml(employeePosition(sender))}</span></div></div>
      <h2>${escapeHtml(p.subject)}</h2><p class="work-mail-body">${escapeHtml(p.body)}\n\n${escapeHtml(tone(sender,mail.wrongAttempts?"retry":"request"))}</p>
      <div class="work-mail-question"><small>대표 검토 요청 · ${escapeHtml(p.typeLabel)}</small><strong>${escapeHtml(p.question)}</strong></div>${result}
      ${mail.completed?`<p class="work-mail-explanation">${escapeHtml(p.explanation)}</p>`:`<p class="work-mail-penalty">오답 시 오늘의 정확도 -20 · 정답을 찾을 때까지 다시 검토할 수 있습니다.</p>`}
      </article>${secretaryMailAssistMarkup(mail.id)}<button class="ink" id="back-from-work-mail">← 사무실</button></section>`;
    mountPortraits();
    document.querySelectorAll("[data-mail-id]").forEach(b=>b.addEventListener("click",()=>openWorkMail(b.dataset.mailId)));
    document.querySelectorAll("[data-mail-answer]").forEach(b=>b.addEventListener("click",()=>submitWorkMailAnswer(Number(b.dataset.mailAnswer))));
    document.querySelector("#back-from-work-mail").addEventListener("click",()=>renderOffice());
  };
  function dailyReward(accuracy){
    const roll=randomInt(100),rare=2+Math.floor(accuracy/25),advanced=23+Math.floor(accuracy/10);
    const rarity=roll<rare?2:roll<rare+advanced?1:0,item=generateEquipmentReward(0),bonus=2+rarity*2;
    item.rarity=rarity;item.workBonus=item.slot==="work"?bonus+1:bonus;item.collaborationBonus=item.slot==="support"?bonus:Math.max(1,Math.floor(bonus/2));return item;
  }
  submitWorkMailAnswer=function(answer){
    const d=ensureWorkMail(),mail=d?.items.find(x=>x.id===selectedMailId&&x.arrived),p=problemFor(mail);
    if(!d||!mail||!p)return renderWorkMail("처리할 메일을 찾을 수 없습니다.");
    if(mail.completed)return renderWorkMail("이미 완료한 요청입니다.");
    if(Number(answer)===p.answerIndex){
      mail.completed=true;mail.completedAt=new Date().toISOString();let extra="";
      if(d.items.every(x=>x.completed)&&!d.rewardClaimed){const reward=dailyReward(d.accuracy);state.equipment.push(reward);d.rewardClaimed=true;d.rewardName=reward.name;extra=` 오늘의 임무 완료! ${reward.name} 획득.`;}
      syncLegacy(d);saveGame();return renderWorkMail(`정확하게 승인했습니다.${extra}`);
    }
    mail.wrongAttempts++;d.accuracy=Math.max(0,d.accuracy-20);syncLegacy(d);saveGame();renderWorkMail(`조건과 맞지 않습니다. 오늘의 정확도 ${d.accuracy}%. 다시 검토해 주세요.`);
  };

  renderEquipment = function(notice) {
    const target = state.employees.find(member => member.id === equipmentTargetId && !isEmployeeUnavailable(member.id)) || availableEmployees()[0];
    if (!target) return renderOffice("장비를 사용할 직원이 없습니다.");
    equipmentTargetId = target.id;

    tradeIds = tradeIds.filter(id => state.equipment.some(item => item.id === id));
    saleIds = saleIds.filter(id => state.equipment.some(item => item.id === id) && !secretaryEquipmentLocked(id));
    if (!tradeIds.includes(tradeBaseId)) tradeBaseId = tradeIds[0] || null;
    if (!Object.prototype.hasOwnProperty.call(state.financialPeriod, "equipmentTrade")) state.financialPeriod.equipmentTrade = 0;

    saveGame();
    const stats = effectiveStats(target);
    const order = orderedBattleTeam().map(member => member.id);
    const sortedEquipment = OfficeRaidEquipmentSort.sortEquipment(state.equipment, equipmentSortMode);
    const saleRecommendations = new Set(secretarySaleRecommendationsVisible && equipmentTab === "trade" && marketMode === "sale" ? secretarySaleRecommendationIds() : []);
    const sortControl = `<label class="equipment-sort"><span>정렬</span><select data-equipment-sort aria-label="보유 장비 정렬 기준">
      <option value="newest" ${equipmentSortMode === "newest" ? "selected" : ""}>최신 획득순</option>
      <option value="rarity" ${equipmentSortMode === "rarity" ? "selected" : ""}>희귀도 높은순</option>
      <option value="stats" ${equipmentSortMode === "stats" ? "selected" : ""}>능력치 합계순</option>
      <option value="slot" ${equipmentSortMode === "slot" ? "selected" : ""}>장비 부위순</option>
    </select></label>`;
    const tabs = `<div class="equipment-tabs" role="tablist" aria-label="장비 관리 메뉴">
      <button class="${equipmentTab === "equip" ? "active" : ""}" data-equipment-tab="equip" role="tab" aria-selected="${equipmentTab === "equip"}">장착 관리</button>
      <button class="${equipmentTab === "trade" ? "active" : ""}" data-equipment-tab="trade" role="tab" aria-selected="${equipmentTab === "trade"}">중고거래${tradeIds.length ? ` <b>${tradeIds.length}/3</b>` : ""}</button>
    </div>`;

    const people = state.employees.map(member => {
      const department = DEPARTMENTS[member.department];
      const actionOrder = order.indexOf(member.id);
      const away = isEmployeeUnavailable(member.id);
      return `<button class="equipment-person ${member.id === target.id ? "active" : ""} ${actionOrder >= 0 ? "project-member" : ""} ${away ? "employee-away" : ""}" data-equipment-target="${member.id}" style="--department-color:${department.color}" ${away ? "disabled" : ""}>
        <span class="equipment-person-portrait"><canvas width="24" height="24" data-portrait="${member.id}" data-portrait-crop="face"></canvas></span>
        <span class="equipment-person-copy"><small>${department.name}</small><strong>${escapeHtml(member.name)}</strong><em class="equipment-team-badge ${actionOrder < 0 ? "off-team" : ""}">${away ? escapeHtml(activityStatusText(employeeActivity(member.id))) : actionOrder >= 0 ? `<b>프로젝트 팀</b> · 행동 ${actionOrder + 1}` : "대기 직원"}</em></span>
      </button>`;
    }).join("");

    const slots = Object.entries(EQUIPMENT_SLOTS).map(([slot, info]) => {
      const item = target.equipment[slot];
      const locked = item && secretaryEquipmentLocked(item.id);
      return `<article class="equipment-slot ${item ? "filled" : ""}">
        <span>${item ? equipmentIconMarkup(item) : info.icon}</span>
        <div><small>${info.name}</small><strong>${item ? escapeHtml(item.name) : "비어 있음"}</strong>${item ? `<em>${EQUIPMENT_RARITIES[item.rarity].name} · 실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em>` : ""}</div>
        ${item ? `<div class="equipment-slot-actions">${equipmentLockButton(item.id)}<button class="ink" data-unequip="${item.id}" ${locked ? "disabled" : ""}>해제</button></div>` : ""}
      </article>`;
    }).join("");

    const equipInventory = state.equipment.length ? sortedEquipment.map(item => {
      const locked = secretaryEquipmentLocked(item.id);
      return `<article class="equipment-item ${locked ? "equipment-locked" : ""}">
        <span>${equipmentIconMarkup(item)}</span>
        <div><strong>${escapeHtml(item.name)}</strong><small>${EQUIPMENT_RARITIES[item.rarity].name} ${EQUIPMENT_SLOTS[item.slot].name}</small><em>실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em></div>
        <div class="equipment-item-actions">${equipmentLockButton(item.id)}<button class="teal" data-equip="${item.id}">장착</button></div>
      </article>`;
    }).join("") : `<div class="empty-inventory">프로젝트에서 장비를 획득하면 여기에 표시됩니다.</div>`;

    const saleItems = state.equipment.filter(item => equipmentSaleTargetIds.includes(item.id));
    const saleConfirmTotal = saleItems.reduce((sum, item) => sum + FEATURES.equipmentResalePrice(item), 0);
    const saleConfirm = saleItems.length ? `<div class="equipment-sale-backdrop" role="dialog" aria-modal="true" aria-labelledby="equipment-sale-title"><div class="equipment-sale-confirm panel"><small>USED EQUIPMENT MARKET</small><strong id="equipment-sale-title">선택 장비 ${saleItems.length}개를 판매할까요?</strong><p>예상 판매가 <b>${saleConfirmTotal}만원</b>을 받고 보관함에서 제거합니다. 판매 후에는 되돌릴 수 없습니다.</p><div><button class="ink" id="cancel-equipment-sale">취소</button><button class="mustard" id="confirm-equipment-sale">판매 확정</button></div></div></div>` : "";

    const selected = tradeIds.map(id => state.equipment.find(item => item.id === id)).filter(Boolean);
    const first = selected[0];
    const base = state.equipment.find(item => item.id === tradeBaseId);
    const ready = selected.length === 3 && selected.every(item => item.slot === first.slot && item.rarity === first.rarity) && first.rarity < 4 && base;
    const cost = first ? COSTS[first.rarity] : 0;

    const tradeInventory = state.equipment.length ? sortedEquipment.map(item => {
      const chosen = tradeIds.includes(item.id);
      const locked = secretaryEquipmentLocked(item.id);
      const selectable = !locked && item.rarity < 4 && (!first || (item.slot === first.slot && item.rarity === first.rarity) || chosen);
      return `<article class="equipment-item ${chosen ? "trade-selected" : ""} ${locked ? "equipment-locked" : ""}">
        <span>${equipmentIconMarkup(item)}</span>
        <div><strong>${escapeHtml(item.name)}</strong><small>${EQUIPMENT_RARITIES[item.rarity].name} ${EQUIPMENT_SLOTS[item.slot].name}</small><em>실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em></div>
        <div class="equipment-market-actions">${equipmentLockButton(item.id)}<button class="${chosen ? "red" : locked ? "ink" : "mustard"}" data-trade="${item.id}" ${selectable ? "" : "disabled"}>${locked ? "선택 불가" : chosen ? "선택 해제" : "거래 선택"}</button></div>
        ${chosen && !locked ? `<label class="trade-base-choice"><input type="radio" name="trade-base" data-trade-base="${item.id}" ${tradeBaseId === item.id ? "checked" : ""}> 받을 모델</label>` : ""}
      </article>`;
    }).join("") : `<div class="empty-inventory">거래할 보관 장비가 없습니다.</div>`;

    const saleInventory = state.equipment.length ? sortedEquipment.map(item => {
      const selectedForSale = saleIds.includes(item.id);
      const locked = secretaryEquipmentLocked(item.id);
      const recommended = saleRecommendations.has(item.id);
      const resale = FEATURES.equipmentResalePrice(item);
      return `<article class="equipment-item sale-market-item ${selectedForSale ? "sale-selected" : ""} ${locked ? "equipment-locked" : ""} ${recommended ? "secretary-sale-recommended" : ""}">
        <span>${equipmentIconMarkup(item)}</span>
        <div><strong>${escapeHtml(item.name)}${recommended ? ` <i class="secretary-recommend-label">비서 추천</i>` : ""}</strong><small>${EQUIPMENT_RARITIES[item.rarity].name} ${EQUIPMENT_SLOTS[item.slot].name}</small><em>실무 +${item.workBonus} · 협업 +${item.collaborationBonus}</em><small class="equipment-resale-price">예상 판매가 ${resale}만원</small></div>
        <div class="equipment-market-actions">${equipmentLockButton(item.id)}<button class="${selectedForSale ? "red" : locked ? "ink" : "mustard"}" data-sale-select="${item.id}" ${locked ? "disabled" : ""}>${locked ? "선택 불가" : selectedForSale ? "선택 해제" : "판매 선택"}</button></div>
      </article>`;
    }).join("") : `<div class="empty-inventory">판매할 보관 장비가 없습니다.</div>`;

    const tradePanel = selected.length
      ? `<div class="equipment-trade-preview"><small>중고거래 ${selected.length}/3</small><strong>${ready ? `${escapeHtml(base.name)} · ${EQUIPMENT_RARITIES[base.rarity + 1].name}으로 교환` : "동일 부위·동일 등급 장비 3개를 선택하세요."}</strong><span>추가 비용 ${cost}만원 · 받을 모델 선택</span><button class="mustard" id="confirm-trade" ${ready && state.cash >= cost ? "" : "disabled"}>${ready && state.cash < cost ? "현금 부족" : "중고거래 성사"}</button><button class="ink" id="clear-trade">초기화</button></div>`
      : `<div class="equipment-trade-guide"><b>동일 부위·동일 등급 장비 3개</b><span>+ 추가 비용 → 선택 모델의 다음 등급 장비 1개</span><small>일반 50 · 고급 150 · 희귀 450 · 영웅 1200만원</small></div>`;

    const saleTotal = saleIds.map(id => state.equipment.find(item => item.id === id)).filter(Boolean).reduce((sum, item) => sum + FEATURES.equipmentResalePrice(item), 0);
    const salePanel = `<div class="equipment-sale-selection panel"><div><small>선택 장비</small><strong>${saleIds.length}개 · 예상 ${saleTotal}만원</strong></div><button class="mustard" id="sell-selected-equipment" ${saleIds.length ? "" : "disabled"}>선택 장비 판매</button><button class="ink" id="clear-sale-selection" ${saleIds.length ? "" : "disabled"}>선택 해제</button></div>`;
    const marketTabs = `<div class="equipment-market-tabs" role="tablist" aria-label="중고거래 방식"><button class="${marketMode === "upgrade" ? "active" : ""}" data-market-mode="upgrade" role="tab" aria-selected="${marketMode === "upgrade"}">승급 거래</button><button class="${marketMode === "sale" ? "active" : ""}" data-market-mode="sale" role="tab" aria-selected="${marketMode === "sale"}">개별 판매</button></div>`;
    const secretaryEquipControl = state.secretary ? `<div class="secretary-inline-controls panel"><div><small>비서 장비 지원</small><strong>프로젝트 팀 장비를 자동 배치합니다.</strong></div><button class="blue" id="secretary-auto-equip">비서 자동 장착</button></div>` : "";
    const recommendationIds = state.secretary ? secretarySaleRecommendationIds() : [];
    const secretaryMarketControl = state.secretary && marketMode === "sale" ? `<div class="secretary-inline-controls panel"><div><small>비서 중고거래 지원</small><strong>판매 후보 ${recommendationIds.length}개를 검토했습니다.</strong></div><button class="${secretarySaleRecommendationsVisible ? "teal" : "blue"}" id="secretary-market-recommend" aria-pressed="${secretarySaleRecommendationsVisible}">${secretarySaleRecommendationsVisible ? "추천 선택 해제" : "비서 판매 추천"}</button></div>` : "";

    const equipView = `${secretaryEquipControl}<div class="equipment-people">${people}</div>
      <div class="equipment-slots panel">${slots}</div>
      <div class="equipment-inventory-head"><p class="section-label">보관함 · ${state.equipment.length}</p>${sortControl}</div>
      <div class="equipment-inventory">${equipInventory}</div>`;

    const tradeView = `<div class="equipment-market-summary panel"><div><small>장비 중고거래</small><strong>승급 ${state.equipmentTradeCount || 0}건 · 판매 ${state.equipmentSaleCount || 0}개 · 수익 +${state.equipmentTradeRevenue || 0}만원</strong></div><span>잠금 장비 제외</span></div>
      ${marketTabs}
      ${marketMode === "upgrade" ? tradePanel : `${secretaryMarketControl}${salePanel}`}
      <div class="equipment-inventory-head"><p class="section-label">${marketMode === "upgrade" ? "거래할" : "판매할"} 장비 · ${state.equipment.length}</p>${sortControl}</div>
      <div class="equipment-inventory trade-inventory ${marketMode === "sale" ? "sale-inventory" : ""}">${marketMode === "upgrade" ? tradeInventory : saleInventory}</div>`;

    const headerNotice = equipmentTab === "equip"
      ? `${target.name} · 실무 ${stats.work} · 협업 ${stats.collaboration} · ${notice}`
      : `보관 장비 ${state.equipment.length}개 · ${notice}`;
    const secretaryAssist = equipmentTab === "equip"
      ? secretaryAssistMarkup("equipment", state.secretary ? "자동 장착은 잠근 장비를 그대로 두고 프로젝트 팀에 맞춰 정리합니다." : "")
      : secretaryAssistMarkup("market", state.secretary && marketMode === "sale" ? "판매 추천은 후보만 선택합니다. 최종 판매는 대표님이 확인해야 해요." : "");

    app.innerHTML = `${header("장비 관리", headerNotice)}<section class="screen equipment-screen">
      ${tabs}
      <div class="equipment-tab-panel" role="tabpanel">${equipmentTab === "equip" ? equipView : tradeView}</div>
      <button class="ink" id="back-from-equipment">← 사무실</button>
      ${secretaryAssist}
    </section>${saleConfirm}`;

    mountPortraits();
    mountEquipmentIcons();
    mountSecretaryAssist();

    document.querySelectorAll("[data-equipment-tab]").forEach(button => button.addEventListener("click", () => {
      equipmentTab = button.dataset.equipmentTab;
      secretarySaleRecommendationsVisible = false;
      renderEquipment(equipmentTab === "equip" ? "직원과 장착 장비를 관리하세요." : "승급 거래와 개별 판매를 이용하세요.");
    }));
    document.querySelectorAll("[data-market-mode]").forEach(button => button.addEventListener("click", () => {
      marketMode = button.dataset.marketMode;
      secretarySaleRecommendationsVisible = false;
      saleIds = [];
      renderEquipment(marketMode === "upgrade" ? "승급할 장비를 선택하세요." : "판매할 장비와 예상 판매가를 확인하세요.");
    }));
    document.querySelector("[data-equipment-sort]")?.addEventListener("change", event => {
      equipmentSortMode = event.currentTarget.value;
      renderEquipment("장비 정렬 기준을 변경했습니다.");
    });
    document.querySelectorAll("[data-equipment-target]").forEach(button => button.addEventListener("click", () => {
      equipmentTargetId = button.dataset.equipmentTarget;
      renderEquipment("장착 대상을 변경했습니다.");
    }));
    document.querySelectorAll("[data-equip]").forEach(button => button.addEventListener("click", () => equipItem(button.dataset.equip)));
    document.querySelectorAll("[data-unequip]").forEach(button => button.addEventListener("click", () => unequipItem(button.dataset.unequip)));
    document.querySelectorAll("[data-equipment-lock]").forEach(button => button.addEventListener("click", () => toggleEquipmentLock(button.dataset.equipmentLock)));
    document.querySelector("#secretary-auto-equip")?.addEventListener("click", () => secretaryAutoEquipTeam());
    document.querySelectorAll("[data-sale-select]").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.saleSelect;
      if (secretaryEquipmentLocked(id)) return renderEquipment("잠긴 장비는 판매할 수 없습니다.");
      saleIds = saleIds.includes(id) ? saleIds.filter(itemId => itemId !== id) : [...saleIds, id];
      renderEquipment(`${saleIds.length}개 장비를 판매 대상으로 선택했습니다.`);
    }));
    document.querySelector("#sell-selected-equipment")?.addEventListener("click", () => requestEquipmentSale(saleIds));
    document.querySelector("#clear-sale-selection")?.addEventListener("click", () => {
      saleIds = [];
      secretarySaleRecommendationsVisible = false;
      renderEquipment("판매 선택을 해제했습니다.");
    });
    document.querySelector("#secretary-market-recommend")?.addEventListener("click", () => {
      secretarySaleRecommendationsVisible = !secretarySaleRecommendationsVisible;
      saleIds = secretarySaleRecommendationsVisible ? recommendationIds : [];
      queueSecretaryAssist("market", secretarySaleRecommendationsVisible
        ? recommendationIds.length ? `${secretaryCandidate()?.saleLine || "판매 후보를 골랐습니다."} · 예상 총액 ${saleIds.map(id => state.equipment.find(item => item.id === id)).filter(Boolean).reduce((sum, item) => sum + FEATURES.equipmentResalePrice(item), 0)}만원` : "현재 판매를 추천할 장비가 없습니다."
        : "추천 선택을 모두 해제했습니다.", secretarySaleRecommendationsVisible && recommendationIds.length ? "smile" : "neutral");
      renderEquipment("비서의 판매 추천 결과를 확인하세요.");
    });
    document.querySelector("#cancel-equipment-sale")?.addEventListener("click", cancelEquipmentSale);
    document.querySelector("#confirm-equipment-sale")?.addEventListener("click", confirmEquipmentSale);
    document.querySelectorAll("[data-trade]").forEach(button => button.addEventListener("click", () => toggleTrade(button.dataset.trade)));
    document.querySelectorAll("[data-trade-base]").forEach(button => button.addEventListener("change", () => {
      tradeBaseId = button.dataset.tradeBase;
      renderEquipment("받을 모델을 선택했습니다.");
    }));
    document.querySelector("#confirm-trade")?.addEventListener("click", confirmTrade);
    document.querySelector("#clear-trade")?.addEventListener("click", () => {
      tradeIds = [];
      tradeBaseId = null;
      renderEquipment("선택을 초기화했습니다.");
    });
    document.querySelector("#back-from-equipment").addEventListener("click", () => renderOffice());
  };

function toggleTrade(id){
    const item=state.equipment.find(x=>x.id===id);if(!item)return;
    if(secretaryEquipmentLocked(id))return renderEquipment("잠긴 장비는 중고거래에 사용할 수 없습니다.");
    if(tradeIds.includes(id)){tradeIds=tradeIds.filter(x=>x!==id);if(tradeBaseId===id)tradeBaseId=tradeIds[0]||null;return renderEquipment("선택에서 제외했습니다.");}
    const first=state.equipment.find(x=>x.id===tradeIds[0]);if(first&&(first.slot!==item.slot||first.rarity!==item.rarity))return renderEquipment("같은 부위와 등급만 선택할 수 있습니다.");
    if(tradeIds.length>=3)return renderEquipment("3개까지 선택할 수 있습니다.");if(item.rarity>=4)return renderEquipment("전설 장비는 교환할 수 없습니다.");
    tradeIds.push(id);if(!tradeBaseId)tradeBaseId=id;renderEquipment(`${tradeIds.length}/3개 선택했습니다.`);
  }
  function confirmTrade(){
    const selected=tradeIds.map(id=>state.equipment.find(x=>x.id===id)).filter(Boolean),base=selected.find(x=>x.id===tradeBaseId);
    if(selected.length!==3||!base||!selected.every(x=>x.slot===base.slot&&x.rarity===base.rarity))return renderEquipment("동일 부위·동일 등급 장비 3개가 필요합니다.");
    const cost=COSTS[base.rarity];if(state.cash<cost)return renderEquipment(`추가 비용 ${cost}만원이 부족합니다.`);
    state.equipment=state.equipment.filter(x=>!tradeIds.includes(x.id));const rarity=base.rarity+1,bonus=2+rarity*2;
    const upgraded={...base,id:`equipment-${nextId++}`,rarity,workBonus:base.slot==="work"?bonus+1:bonus,collaborationBonus:base.slot==="support"?bonus:Math.max(1,Math.floor(bonus/2))};
    state.equipment.push(upgraded);state.cash-=cost;state.equipmentTradeCount=(state.equipmentTradeCount||0)+1;state.equipmentTradeSpend=(state.equipmentTradeSpend||0)+cost;
    if(!Object.prototype.hasOwnProperty.call(state.financialPeriod,"equipmentTrade"))state.financialPeriod.equipmentTrade=0;recordFinancialAmount("equipmentTrade",cost);
    tradeIds=[];tradeBaseId=null;saveGame();renderEquipment(`${base.name} ${EQUIPMENT_RARITIES[rarity].name} 장비를 확보했습니다.`);
  }
})();
