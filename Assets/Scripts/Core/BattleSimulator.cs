using System;
using System.Collections.Generic;
using System.Linq;

namespace OfficeRaid.Core
{
    public sealed class BattleSimulator
    {
        private readonly List<Employee> team;
        private readonly Random random;
        private readonly int eventChancePercent;
        private bool requirementsClarified;
        private int momentum;
        private int efficiencyPercent = 100;
        private int flatDamageModifier;
        private int deadlineBonus;
        private int automationDamage;
        private int automationTurns;
        private bool thresholdSeventyGranted;
        private bool thresholdFortyGranted;

        public Project Project { get; }
        public int Turn { get; private set; }
        public int RemainingWorkload { get; private set; }
        public bool IsComplete { get; private set; }
        public bool IsSuccess { get; private set; }
        public ProjectEventType LastEvent { get; private set; }
        public string ActiveStatusName { get; private set; } = string.Empty;
        public int ActiveStatusTurns { get; private set; }
        public int DirectiveGauge { get; private set; }
        public bool AwaitingDirective { get; private set; }
        public string DirectiveReason { get; private set; } = string.Empty;
        public int EffectiveDeadlineTurns => Project.DeadlineTurns + deadlineBonus;
        public IReadOnlyList<string> Logs => logs;

        private readonly List<string> logs = new List<string>();

        public BattleSimulator(Project project, IEnumerable<Employee> employees, int seed, int eventChancePercent = 36)
        {
            Project = project ?? throw new ArgumentNullException(nameof(project));
            team = employees?.Take(6).ToList() ?? throw new ArgumentNullException(nameof(employees));
            if (team.Count == 0)
            {
                throw new ArgumentException("A project team needs at least one employee.", nameof(employees));
            }

            if (eventChancePercent < 0 || eventChancePercent > 100)
            {
                throw new ArgumentOutOfRangeException(nameof(eventChancePercent));
            }

            random = new Random(seed);
            this.eventChancePercent = eventChancePercent;
            RemainingWorkload = project.MaxWorkload;
            DirectiveGauge = 50;
            logs.Add($"{project.Name} 프로젝트에 돌입했습니다.");
        }

        public void Step()
        {
            if (IsComplete || AwaitingDirective)
            {
                return;
            }

            Turn++;
            logs.Add($"--- {Turn}일차 / 마감 {EffectiveDeadlineTurns}일 ---");
            AdvanceStatus();
            ResolveAutomation();
            if (RemainingWorkload <= 0)
            {
                RemainingWorkload = 0;
                IsComplete = true;
                IsSuccess = true;
                logs.Add("프로젝트 완료! 자동화가 남은 업무를 해결했습니다.");
                return;
            }
            ResolveProjectEvent();

            foreach (var employee in team.OrderByDescending(item => item.Speed))
            {
                if (RemainingWorkload <= 0)
                {
                    break;
                }

                ResolveAction(employee);
            }

            if (RemainingWorkload <= 0)
            {
                RemainingWorkload = 0;
                IsComplete = true;
                IsSuccess = true;
                logs.Add("프로젝트 완료! 마감 전에 모든 업무를 해결했습니다.");
                return;
            }

            AddDirectiveGauge(team.Count * 10, "팀의 업무 흐름이 모였습니다.");
            AddWorkloadThresholdGauge();
            OpenDirectiveIfReady();

            if (Turn >= EffectiveDeadlineTurns && !AwaitingDirective)
            {
                IsComplete = true;
                IsSuccess = false;
                logs.Add("마감 초과! 프로젝트 분석 자료를 확보하고 철수합니다.");
            }
        }

        public bool ExecuteDirective(IReadOnlyDictionary<string, DirectiveSkillId> selections, out string message)
        {
            if (!AwaitingDirective || IsComplete)
            {
                message = "지금은 긴급 지시 단계가 아닙니다.";
                return false;
            }

            if (selections == null || team.Any(employee => !selections.ContainsKey(employee.Id)))
            {
                message = "모든 참가자의 스킬을 하나씩 선택하세요.";
                return false;
            }

            foreach (var employee in team)
            {
                var definition = DirectiveSkillCatalog.Find(selections[employee.Id]);
                if (definition == null || !DirectiveSkillCatalog.For(employee.Department).Any(skill => skill.Id == definition.Id))
                {
                    message = employee.Name + " 님이 사용할 수 없는 스킬입니다.";
                    return false;
                }
            }

            AwaitingDirective = false;
            DirectiveGauge = 0;
            DirectiveReason = string.Empty;
            var total = 0;
            var clearedStatus = false;
            var boosted = selections.Values.Contains(DirectiveSkillId.EmergencyCommand) || selections.Values.Contains(DirectiveSkillId.BudgetApproval);

            foreach (var employee in team)
            {
                switch (selections[employee.Id])
                {
                    case DirectiveSkillId.RequirementBrief:
                        requirementsClarified = true;
                        total += 8 + employee.EffectiveCollaboration / 2;
                        break;
                    case DirectiveSkillId.ClientPersuasion:
                        clearedStatus |= ClearNegativeStatus();
                        total += 6 + employee.EffectiveCollaboration / 2;
                        break;
                    case DirectiveSkillId.ContractClose:
                        total += 15 + employee.EffectiveWorkPower + (requirementsClarified ? 10 : 0);
                        break;
                    case DirectiveSkillId.ScheduleShift:
                        deadlineBonus = Math.Min(2, deadlineBonus + 1);
                        total += 6 + employee.EffectiveCollaboration / 3;
                        break;
                    case DirectiveSkillId.WorkAllocation:
                        momentum += 8;
                        total += 8 + employee.EffectiveCollaboration;
                        break;
                    case DirectiveSkillId.EmergencyCommand:
                        total += 8 + team.Count * 3;
                        break;
                    case DirectiveSkillId.FocusDevelopment:
                        total += 16 + employee.EffectiveWorkPower + (requirementsClarified ? 8 : 0);
                        break;
                    case DirectiveSkillId.AutomationDeploy:
                        automationDamage = 8 + employee.EffectiveWorkPower / 2;
                        automationTurns = 2;
                        total += 8;
                        break;
                    case DirectiveSkillId.NightShift:
                        total += 24 + employee.EffectiveWorkPower;
                        break;
                    case DirectiveSkillId.BudgetApproval:
                        total += 6 + employee.Adaptability / 2;
                        break;
                    case DirectiveSkillId.CostDefense:
                        clearedStatus |= ClearNegativeStatus();
                        total += 7 + employee.EffectiveCollaboration / 2;
                        break;
                    case DirectiveSkillId.EmergencyApproval:
                        deadlineBonus = Math.Min(2, deadlineBonus + 1);
                        total += 12 + employee.Adaptability;
                        break;
                }
            }

            var combo = string.Empty;
            if (selections.Values.Contains(DirectiveSkillId.RequirementBrief) && selections.Values.Contains(DirectiveSkillId.FocusDevelopment))
            {
                total += 18;
                combo = "명확한 목표";
            }
            else if (selections.Values.Contains(DirectiveSkillId.WorkAllocation) && selections.Values.Contains(DirectiveSkillId.AutomationDeploy))
            {
                total += 14;
                automationTurns++;
                combo = "완벽한 업무 흐름";
            }

            if (boosted) total = (int)Math.Round(total * 1.2f);
            total = Math.Max(1, total);
            RemainingWorkload = Math.Max(0, RemainingWorkload - total);
            AddWorkloadThresholdGauge();
            message = $"PERFECT WORKFLOW · 업무량 {total} 처리";
            if (!string.IsNullOrEmpty(combo)) message += " · " + combo + " 연계";
            if (clearedStatus) message += " · 불리한 상태 제거";
            logs.Add("[긴급 지시] " + message);

            if (RemainingWorkload == 0)
            {
                IsComplete = true;
                IsSuccess = true;
                logs.Add("프로젝트 완료! 긴급 지시로 마지막 업무를 해결했습니다.");
            }
            else if (Turn >= EffectiveDeadlineTurns)
            {
                IsComplete = true;
                IsSuccess = false;
                logs.Add("마감 직전 긴급 지시로도 업무를 끝내지 못했습니다.");
            }
            return true;
        }

        private void ResolveAction(Employee employee)
        {
            var variation = random.Next(0, 5);
            var damage = employee.EffectiveWorkPower + employee.Focus / 3 + variation;
            damage -= Math.Max(0, Project.Complexity - employee.Adaptability / 5);

            var skill = "업무 처리";
            switch (employee.Department)
            {
                case Department.Sales:
                    requirementsClarified = true;
                    damage += 4;
                    skill = "요구사항 정리";
                    break;
                case Department.ProjectManagement:
                    momentum += Math.Max(2, employee.EffectiveCollaboration / 5);
                    damage += momentum;
                    skill = "일정 통합";
                    break;
                case Department.Development:
                    damage += momentum;
                    if (requirementsClarified) damage += 6;
                    skill = "집중 개발";
                    break;
                case Department.Finance:
                    damage += Math.Max(2, employee.Adaptability / 4);
                    skill = "예산 최적화";
                    break;
                case Department.Design:
                    damage += 5;
                    skill = "완성도 개선";
                    break;
                case Department.Marketing:
                    momentum += 3;
                    skill = "성과 확산";
                    break;
                case Department.HumanResources:
                    momentum += Math.Max(2, employee.Mental / 6);
                    skill = "팀 사기 회복";
                    break;
                case Department.Legal:
                    damage += employee.Adaptability / 3;
                    skill = "위험 조항 제거";
                    break;
                case Department.QualityAssurance:
                    requirementsClarified = true;
                    damage += 3;
                    skill = "결함 분석";
                    break;
                case Department.InformationTechnology:
                    damage += employee.Speed / 3;
                    skill = "업무 자동화";
                    break;
            }

            if (Project.RecommendedDepartments.Contains(employee.Department))
            {
                damage += 4;
            }

            damage = Math.Max(1, damage);
            damage = Math.Max(1, damage * efficiencyPercent / 100 + flatDamageModifier);
            RemainingWorkload -= damage;
            var status = string.IsNullOrEmpty(ActiveStatusName) ? string.Empty : $" · {ActiveStatusName}";
            logs.Add($"{employee.Name}의 {skill}: 업무량 -{damage}{status}");
        }

        private void AdvanceStatus()
        {
            LastEvent = ProjectEventType.None;
            if (ActiveStatusTurns <= 0)
            {
                return;
            }

            ActiveStatusTurns--;
            if (ActiveStatusTurns > 0)
            {
                return;
            }

            ActiveStatusName = string.Empty;
            efficiencyPercent = 100;
            flatDamageModifier = 0;
        }

        private void ResolveProjectEvent()
        {
            if (Turn <= 1 || ActiveStatusTurns > 0 || random.Next(100) >= eventChancePercent)
            {
                return;
            }

            LastEvent = (ProjectEventType)(random.Next(4) + 1);
            switch (LastEvent)
            {
                case ProjectEventType.RequirementChange:
                    var addedWorkload = 8 + random.Next(5);
                    RemainingWorkload = Math.Min(Project.MaxWorkload + 30, RemainingWorkload + addedWorkload);
                    requirementsClarified = false;
                    SetStatus("재작업", 1, 90, 0);
                    logs.Add($"[돌발] 요구사항 변경! 업무량 +{addedWorkload}, 영업의 요구사항 정리가 초기화됩니다.");
                    AddDirectiveGauge(20, "요구사항 변경에 대응해야 합니다.");
                    break;
                case ProjectEventType.EmergencyMeeting:
                    SetStatus("긴급회의", 1, 75, 0);
                    logs.Add("[돌발] 긴급회의 소집! 오늘 팀의 업무 효율이 25% 감소합니다.");
                    AddDirectiveGauge(20, "긴급회의 대응이 필요합니다.");
                    break;
                case ProjectEventType.BudgetCut:
                    SetStatus("예산 압박", 2, 100, -3);
                    logs.Add("[돌발] 예산 삭감! 2일 동안 모든 업무 처리량이 3 감소합니다.");
                    AddDirectiveGauge(20, "예산 삭감에 대응해야 합니다.");
                    break;
                case ProjectEventType.ClientApproval:
                    momentum += 4;
                    SetStatus("합의 완료", 2, 100, 4);
                    logs.Add("[호재] 고객의 빠른 승인! 2일 동안 모든 업무 처리량이 4 증가합니다.");
                    AddDirectiveGauge(12, "고객 승인을 활용할 기회입니다.");
                    break;
            }
        }

        private void ResolveAutomation()
        {
            if (automationTurns <= 0 || RemainingWorkload <= 0) return;
            RemainingWorkload = Math.Max(0, RemainingWorkload - automationDamage);
            automationTurns--;
            logs.Add($"[자동화] 배포 파이프라인이 업무량 {automationDamage}을 처리했습니다.");
        }

        private void AddWorkloadThresholdGauge()
        {
            var ratio = RemainingWorkload / (float)Project.MaxWorkload;
            if (!thresholdSeventyGranted && ratio <= 0.70f)
            {
                thresholdSeventyGranted = true;
                AddDirectiveGauge(30, "프로젝트의 첫 약점이 노출됐습니다.");
            }
            if (!thresholdFortyGranted && ratio <= 0.40f)
            {
                thresholdFortyGranted = true;
                AddDirectiveGauge(30, "프로젝트의 핵심 약점이 노출됐습니다.");
            }
        }

        private void AddDirectiveGauge(int amount, string reason)
        {
            DirectiveGauge = Math.Min(100, DirectiveGauge + amount);
            if (DirectiveGauge >= 100) DirectiveReason = reason;
        }

        private void OpenDirectiveIfReady()
        {
            if (DirectiveGauge < 100 || IsComplete) return;
            AwaitingDirective = true;
            if (string.IsNullOrEmpty(DirectiveReason)) DirectiveReason = "긴급 지시를 내릴 수 있습니다.";
            logs.Add("[일시 정지] " + DirectiveReason);
        }

        private bool ClearNegativeStatus()
        {
            if (string.IsNullOrEmpty(ActiveStatusName) || ActiveStatusName == "합의 완료") return false;
            ActiveStatusName = string.Empty;
            ActiveStatusTurns = 0;
            efficiencyPercent = 100;
            flatDamageModifier = 0;
            return true;
        }

        private void SetStatus(string name, int turns, int efficiency, int flatModifier)
        {
            ActiveStatusName = name;
            ActiveStatusTurns = turns;
            efficiencyPercent = efficiency;
            flatDamageModifier = flatModifier;
        }
    }
}
