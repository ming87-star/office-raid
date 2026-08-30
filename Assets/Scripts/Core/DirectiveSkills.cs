using System;
using System.Collections.Generic;

namespace OfficeRaid.Core
{
    [Serializable]
    public sealed class DirectiveSkillDefinition
    {
        public DirectiveSkillId Id;
        public Department Department;
        public string Name;
        public string Description;
        public string VisualCue;

        public DirectiveSkillDefinition(DirectiveSkillId id, Department department, string name, string description, string visualCue)
        {
            Id = id;
            Department = department;
            Name = name;
            Description = description;
            VisualCue = visualCue;
        }
    }

    public static class DirectiveSkillCatalog
    {
        private static readonly IReadOnlyList<DirectiveSkillDefinition> Sales = new[]
        {
            Skill(DirectiveSkillId.RequirementBrief, Department.Sales, "요구사항 정리", "프로젝트 약점 노출 · 연계 피해 증가", "승인 도장"),
            Skill(DirectiveSkillId.ClientPersuasion, Department.Sales, "고객 설득", "불리한 상태 제거 · 안정적인 업무 처리", "프레젠테이션"),
            Skill(DirectiveSkillId.ContractClose, Department.Sales, "계약 확정", "약점이 노출됐을 때 매우 강한 마무리", "계약서 폭발")
        };

        private static readonly IReadOnlyList<DirectiveSkillDefinition> ProjectManagement = new[]
        {
            Skill(DirectiveSkillId.ScheduleShift, Department.ProjectManagement, "일정 재배치", "마감 +1일 · 최대 2회", "거대 캘린더"),
            Skill(DirectiveSkillId.WorkAllocation, Department.ProjectManagement, "업무 분담", "팀 모멘텀과 연계 피해 증가", "업무 연결선"),
            Skill(DirectiveSkillId.EmergencyCommand, Department.ProjectManagement, "전사 긴급 지시", "이번 지시의 모든 효과 20% 증가", "지휘 방송")
        };

        private static readonly IReadOnlyList<DirectiveSkillDefinition> Development = new[]
        {
            Skill(DirectiveSkillId.FocusDevelopment, Department.Development, "집중 개발", "핵심에 강한 즉시 업무 처리", "코드 폭포"),
            Skill(DirectiveSkillId.AutomationDeploy, Department.Development, "자동화 배포", "즉시 처리 + 2일 동안 추가 처리", "자동화 드론"),
            Skill(DirectiveSkillId.NightShift, Department.Development, "밤샘 해결", "가장 강력한 단일 업무 처리", "오류창 파쇄")
        };

        private static readonly IReadOnlyList<DirectiveSkillDefinition> Finance = new[]
        {
            Skill(DirectiveSkillId.BudgetApproval, Department.Finance, "추가 예산 승인", "이번 지시의 모든 효과 20% 증가", "황금 결재"),
            Skill(DirectiveSkillId.CostDefense, Department.Finance, "비용 방어", "불리한 상태 제거 · 손실 차단", "예산 장벽"),
            Skill(DirectiveSkillId.EmergencyApproval, Department.Finance, "긴급 결재", "마감 +1일과 즉시 업무 처리", "결재 도장")
        };

        public static IReadOnlyList<DirectiveSkillDefinition> For(Department department)
        {
            switch (department)
            {
                case Department.Sales: return Sales;
                case Department.ProjectManagement: return ProjectManagement;
                case Department.Development: return Development;
                case Department.Finance: return Finance;
                case Department.Design:
                case Department.Marketing:
                    return Sales;
                case Department.HumanResources:
                case Department.Legal:
                    return Finance;
                case Department.QualityAssurance:
                case Department.InformationTechnology:
                    return Development;
                default: return ProjectManagement;
            }
        }

        public static DirectiveSkillDefinition Find(DirectiveSkillId id)
        {
            foreach (var list in new[] { Sales, ProjectManagement, Development, Finance })
                foreach (var skill in list)
                    if (skill.Id == id) return skill;
            return null;
        }

        private static DirectiveSkillDefinition Skill(DirectiveSkillId id, Department department, string name, string description, string visualCue)
        {
            return new DirectiveSkillDefinition(id, department, name, description, visualCue);
        }
    }
}
