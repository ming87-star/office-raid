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

        public Project Project { get; }
        public int Turn { get; private set; }
        public int RemainingWorkload { get; private set; }
        public bool IsComplete { get; private set; }
        public bool IsSuccess { get; private set; }
        public ProjectEventType LastEvent { get; private set; }
        public string ActiveStatusName { get; private set; } = string.Empty;
        public int ActiveStatusTurns { get; private set; }
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
            logs.Add($"{project.Name} 프로젝트에 돌입했습니다.");
        }

        public void Step()
        {
            if (IsComplete)
            {
                return;
            }

            Turn++;
            logs.Add($"--- {Turn}일차 / 마감 {Project.DeadlineTurns}일 ---");
            AdvanceStatus();
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

            if (Turn >= Project.DeadlineTurns)
            {
                IsComplete = true;
                IsSuccess = false;
                logs.Add("마감 초과! 프로젝트 분석 자료를 확보하고 철수합니다.");
            }
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
                    break;
                case ProjectEventType.EmergencyMeeting:
                    SetStatus("긴급회의", 1, 75, 0);
                    logs.Add("[돌발] 긴급회의 소집! 오늘 팀의 업무 효율이 25% 감소합니다.");
                    break;
                case ProjectEventType.BudgetCut:
                    SetStatus("예산 압박", 2, 100, -3);
                    logs.Add("[돌발] 예산 삭감! 2일 동안 모든 업무 처리량이 3 감소합니다.");
                    break;
                case ProjectEventType.ClientApproval:
                    momentum += 4;
                    SetStatus("합의 완료", 2, 100, 4);
                    logs.Add("[호재] 고객의 빠른 승인! 2일 동안 모든 업무 처리량이 4 증가합니다.");
                    break;
            }
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
