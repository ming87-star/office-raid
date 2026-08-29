using System;
using System.Collections.Generic;
using System.Linq;

namespace OfficeRaid.Core
{
    public sealed class BattleSimulator
    {
        private readonly List<Employee> team;
        private readonly Random random;
        private bool requirementsClarified;
        private int momentum;

        public Project Project { get; }
        public int Turn { get; private set; }
        public int RemainingWorkload { get; private set; }
        public bool IsComplete { get; private set; }
        public bool IsSuccess { get; private set; }
        public IReadOnlyList<string> Logs => logs;

        private readonly List<string> logs = new List<string>();

        public BattleSimulator(Project project, IEnumerable<Employee> employees, int seed)
        {
            Project = project ?? throw new ArgumentNullException(nameof(project));
            team = employees?.Take(6).ToList() ?? throw new ArgumentNullException(nameof(employees));
            if (team.Count == 0)
            {
                throw new ArgumentException("A project team needs at least one employee.", nameof(employees));
            }

            random = new Random(seed);
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
            RemainingWorkload -= damage;
            logs.Add($"{employee.Name}의 {skill}: 업무량 -{damage}");
        }
    }
}
