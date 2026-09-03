(function installProjectReport() {
  const RULES = window.OfficeRaidProjectReportRules;
  if (!RULES) throw new Error("project-report-rules.js must load before project-report.js");
  const renderBattleBase = renderBattle;

  function reportRewardMarkup() {
    const rewards = battle.rewards || (battle.reward ? [battle.reward] : []);
    const equipment = rewards.length
      ? `<div class="project-report-equipment">${rewards.map(equipmentRewardCard).join("")}</div>`
      : `<p class="project-report-no-drop">이번에는 장비가 나오지 않았습니다. <span>${escapeHtml(battle.dropNotice || "")}</span></p>`;
    return `<section class="project-report-card project-report-rewards">
      <div class="project-report-section-title"><div><small>REWARDS</small><h3>프로젝트 보상</h3></div><span>자동 지급 완료</span></div>
      <div class="project-report-reward-grid"><span><small>현금</small><b>+${battle.project.cash}만원</b></span><span><small>평판</small><b>+${battle.project.reputation}</b></span></div>
      ${equipment}
    </section>`;
  }

  function reportNoticesMarkup() {
    const notices = [
      battle.recruitmentNotice,
      battle.payrollNotice,
      battle.financialNotice,
      battle.laborInspectionNotice,
      battle.turnoverNotice
    ].filter(Boolean);
    return notices.length ? `<div class="project-report-notices">${notices.map(notice => `<p>${escapeHtml(notice)}</p>`).join("")}</div>` : "";
  }

  function projectReportNextLabel() {
    if (state.pendingActivityMiniGames.length) return "보고서 확인 · 중간 활동으로";
    if (state.pendingActivityReports.length) return "보고서 확인 · 활동 결과로";
    if (state.pendingFinancialReport) return "보고서 확인 · 분기 결산으로";
    if (state.pendingLaborInspection) return "보고서 확인 · 근로감독 대응으로";
    if (state.pendingTurnover) return "보고서 확인 · 이직 면담으로";
    if (state.pendingBusinessTripOffer) return "보고서 확인 · 출장 요청으로";
    if (battle.result !== "success") return "보고서 확인 · 사무실로";
    if (battle.tutorialUnlock) return "보고서 확인 · 면접 확인";
    return "보고서 확인 · 사무실로";
  }

  function renderProjectResultReport() {
    currentView = "project-report";
    clearBattleTimer();
    const team = orderedBattleTeam();
    const success = battle.result === "success";
    const rows = RULES.contributionRows(team, battle.memberStats);
    const round = RULES.reportRound(battle.action, team.length, battle.deadline);
    const affinityCount = team.filter(member => hasProjectAffinity(member, battle.project)).length;
    const grade = RULES.reportGrade({
      success,
      round,
      deadline: battle.deadline,
      affinityCount,
      teamSize: team.length,
      negativeEvents: battle.negativeEvents,
      comboCount: battle.comboCount
    });
    const completed = Math.min(battle.max, Math.max(0, battle.max - battle.workload));
    const progress = Math.round(completed / Math.max(1, battle.max) * 100);
    const memberRows = rows.map(row => `<article class="project-report-member ${row.mvp ? "is-mvp" : ""}">
      <span class="project-report-avatar"><canvas width="24" height="24" data-portrait="${row.member.id}" data-portrait-crop="face" aria-hidden="true"></canvas></span>
      <div><strong>${escapeHtml(row.member.name)}</strong><small>${escapeHtml(DEPARTMENTS[row.member.department]?.short || "담당")} · 일반 행동 ${row.actions}회 · 긴급 지시 ${row.directives}회</small></div>
      <span class="project-report-contribution"><i><em style="width:${Math.max(4, row.percent)}%"></em></i><b>${row.percent}%</b></span>
      ${row.mvp ? "<mark>MVP</mark>" : ""}
    </article>`).join("");
    const failureAdvice = RULES.failureAdvice({
      progress,
      affinityCount,
      teamSize: team.length,
      negativeEvents: battle.negativeEvents
    });
    const analysis = success
      ? `<p class="project-report-evaluation"><small>대표 평가</small><strong>${escapeHtml(grade.description)}</strong><span>${battle.comboCount ? `긴급 지시 연계 ${battle.comboCount}회를 완성했습니다.` : "다음에는 긴급 지시 연계로 S등급을 노릴 수 있습니다."}</span></p>`
      : `<section class="project-report-card project-report-failure-analysis"><div class="project-report-section-title"><div><small>FAILURE ANALYSIS</small><h3>다음 도전 제안</h3></div><span>진행률 ${progress}%</span></div><p>${escapeHtml(failureAdvice)}</p></section>`;
    const unlock = battle.tutorialUnlock ? `<div class="project-report-unlock"><small>NEW FEATURE</small><strong>면접 기능 해금</strong><span>새로운 직원을 채용해 다음 팀을 구성할 수 있습니다.</span></div>` : "";

    app.innerHTML = `${header("프로젝트 결과 보고서", `${battle.project.name} · ${success ? "완료 보고" : "실패 분석"}`)}
      <section class="screen project-report-screen ${success ? "success" : "failure"} ${battle.project.boss ? "boss-report" : ""}">
        <div class="project-report-kicker"><span>PROJECT RESULT REPORT</span><b>보고서 #${String(Math.max(1, state.projectClears + (success ? 0 : 1))).padStart(3, "0")}</b></div>
        <article class="project-report-clear">
          <div><small>${success ? battle.project.boss ? "보스 프로젝트 성공" : "프로젝트 성공" : "마감 초과"}</small><h2>${escapeHtml(battle.project.name)}</h2><p>${success ? "마감 전에 업무를 완료하고 프로젝트 보상을 확보했습니다." : `업무 ${completed}/${battle.max}까지 처리했지만 마감을 넘겼습니다.`}</p></div>
          <strong class="project-report-grade grade-${grade.tone}" aria-label="프로젝트 등급 ${grade.label}">${grade.label}</strong>
        </article>
        <div class="project-report-summary">
          <span><small>업무 처리</small><b>${completed} / ${battle.max}</b></span>
          <span><small>${success ? "완료 시점" : "종료 시점"}</small><b>${round} / ${battle.deadline}턴</b></span>
          <span><small>팀 상성</small><b>${affinityCount} / ${team.length}</b></span>
        </div>
        <section class="project-report-card project-report-team">
          <div class="project-report-section-title"><div><small>TEAM PERFORMANCE</small><h3>참여 직원 기여도</h3></div><span>실제 참여 ${team.length}명</span></div>
          <div class="project-report-member-list">${memberRows}</div>
          ${analysis}
        </section>
        ${success ? reportRewardMarkup() : ""}
        ${unlock}
        ${success ? reportNoticesMarkup() : ""}
        <button class="mustard project-report-close" id="close-project-report">${projectReportNextLabel()}</button>
      </section>`;
    mountPortraits();
    mountEquipmentIcons();
    document.querySelector("#close-project-report").addEventListener("click", requestBattleLeave);
  }

  renderBattle = function renderBattleWithProjectReport() {
    if (battle?.result && !battle.skillFx) return renderProjectResultReport();
    return renderBattleBase();
  };

  window.OfficeRaidProjectReport = Object.freeze({ render: renderProjectResultReport });
})();
