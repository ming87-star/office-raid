using System.Collections.Generic;
using System.Linq;
using OfficeRaid.Core;
using UnityEngine;

namespace OfficeRaid.Runtime
{
    public sealed class OfficeRaidPrototypeBehaviour : MonoBehaviour
    {
        private enum View
        {
            CompanySetup,
            Office,
            Interview,
            Battle
        }

        private const float ReferenceWidth = 1280f;
        private const float ReferenceHeight = 720f;

        private OfficeRaidGame game;
        private View currentScreen = View.CompanySetup;
        private string companyName = "오피스 레이드 주식회사";
        private string notice = "회사 이름을 정하고 작은 회사를 시작하세요.";
        private List<Candidate> candidates = new List<Candidate>();
        private Vector2 logScroll;
        private float battleTimer;
        private bool resultClaimed;
        private Font koreanFont;
        private GUIStyle titleStyle;
        private GUIStyle headingStyle;
        private GUIStyle bodyStyle;
        private GUIStyle cardStyle;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (FindFirstObjectByType<OfficeRaidPrototypeBehaviour>() != null)
            {
                return;
            }

            var root = new GameObject("OfficeRaidPrototype");
            DontDestroyOnLoad(root);
            root.AddComponent<OfficeRaidPrototypeBehaviour>();
        }

        private void Awake()
        {
            game = new OfficeRaidGame();
            koreanFont = Font.CreateDynamicFontFromOSFont(
                new[] { "Malgun Gothic", "Noto Sans CJK KR", "Apple SD Gothic Neo", "sans-serif", "Arial" },
                24);
        }

        private void Update()
        {
            if (currentScreen != View.Battle || game.CurrentBattle == null || game.CurrentBattle.IsComplete)
            {
                return;
            }

            battleTimer += Time.deltaTime;
            if (battleTimer < 0.85f)
            {
                return;
            }

            battleTimer = 0f;
            game.CurrentBattle.Step();
            logScroll.y = 100000f;
        }

        private void OnGUI()
        {
            var scale = Mathf.Min(Screen.width / ReferenceWidth, Screen.height / ReferenceHeight);
            var offsetX = (Screen.width - ReferenceWidth * scale) * 0.5f;
            var offsetY = (Screen.height - ReferenceHeight * scale) * 0.5f;
            GUI.matrix = Matrix4x4.TRS(new Vector3(offsetX, offsetY, 0f), Quaternion.identity, Vector3.one * scale);

            EnsureStyles();
            DrawBackground();

            GUILayout.BeginArea(new Rect(40f, 28f, 1200f, 664f));
            DrawHeader();

            switch (currentScreen)
            {
                case View.CompanySetup:
                    DrawCompanySetup();
                    break;
                case View.Office:
                    DrawOffice();
                    break;
                case View.Interview:
                    DrawInterview();
                    break;
                case View.Battle:
                    DrawBattle();
                    break;
            }

            GUILayout.EndArea();
        }

        private void EnsureStyles()
        {
            if (titleStyle != null)
            {
                return;
            }

            GUI.skin.font = koreanFont;
            GUI.skin.button.fontSize = 20;
            GUI.skin.button.padding = new RectOffset(18, 18, 12, 12);
            GUI.skin.textField.fontSize = 22;
            GUI.skin.textField.padding = new RectOffset(12, 12, 10, 10);

            titleStyle = new GUIStyle(GUI.skin.label)
            {
                font = koreanFont,
                fontSize = 38,
                fontStyle = FontStyle.Bold,
                normal = { textColor = new Color(0.05f, 0.12f, 0.2f) }
            };
            headingStyle = new GUIStyle(GUI.skin.label)
            {
                font = koreanFont,
                fontSize = 26,
                fontStyle = FontStyle.Bold,
                normal = { textColor = new Color(0.05f, 0.22f, 0.28f) }
            };
            bodyStyle = new GUIStyle(GUI.skin.label)
            {
                font = koreanFont,
                fontSize = 19,
                wordWrap = true,
                normal = { textColor = new Color(0.12f, 0.16f, 0.2f) }
            };
            cardStyle = new GUIStyle(GUI.skin.box)
            {
                font = koreanFont,
                fontSize = 18,
                alignment = TextAnchor.UpperLeft,
                padding = new RectOffset(18, 18, 14, 14),
                normal = { textColor = new Color(0.12f, 0.16f, 0.2f) }
            };
        }

        private static void DrawBackground()
        {
            var previous = GUI.color;
            GUI.color = new Color(0.94f, 0.92f, 0.84f);
            GUI.DrawTexture(new Rect(0f, 0f, ReferenceWidth, ReferenceHeight), Texture2D.whiteTexture);
            GUI.color = previous;
        }

        private void DrawHeader()
        {
            GUILayout.BeginHorizontal();
            GUILayout.Label("OFFICE RAID", titleStyle, GUILayout.Width(310f));
            GUILayout.FlexibleSpace();
            if (game.Company != null)
            {
                GUILayout.Label($"{game.Company.Name}  |  현금 {game.Company.Cash}  |  평판 {game.Company.Reputation}", bodyStyle);
            }
            GUILayout.EndHorizontal();
            DrawRule();
        }

        private void DrawCompanySetup()
        {
            GUILayout.Space(80f);
            GUILayout.BeginHorizontal();
            GUILayout.FlexibleSpace();
            GUILayout.BeginVertical(cardStyle, GUILayout.Width(620f), GUILayout.Height(310f));
            GUILayout.Label("작은 회사의 첫날", headingStyle);
            GUILayout.Space(18f);
            GUILayout.Label("회사 이름", bodyStyle);
            companyName = GUILayout.TextField(companyName, 24);
            GUILayout.Space(24f);
            GUILayout.Label("대표와 두 명의 동료로 시작합니다. 프로젝트를 완료해 더 큰 회사를 만드세요.", bodyStyle);
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("회사 설립"))
            {
                game.CreateCompany(companyName);
                notice = "첫 프로젝트를 수주할 준비가 됐습니다.";
                currentScreen = View.Office;
            }
            GUILayout.EndVertical();
            GUILayout.FlexibleSpace();
            GUILayout.EndHorizontal();
        }

        private void DrawOffice()
        {
            GUILayout.Space(18f);
            GUILayout.Label("작은 사무실", headingStyle);
            GUILayout.Label(notice, bodyStyle);
            GUILayout.Space(12f);

            GUILayout.BeginHorizontal();
            GUILayout.BeginVertical(cardStyle, GUILayout.Width(720f), GUILayout.Height(430f));
            GUILayout.Label($"직원 {game.Company.Employees.Count}/{game.Company.RosterCapacity} · 프로젝트 참가 {game.Company.ProjectTeamSize}명", headingStyle);
            GUILayout.Space(8f);
            foreach (var employee in game.Company.Employees)
            {
                GUILayout.Label(
                    $"{employee.Name}  |  {DepartmentName(employee.Department)}  |  실무 {employee.EffectiveWorkPower}  협업 {employee.EffectiveCollaboration}  속도 {employee.Speed}  |  {employee.Trait}",
                    bodyStyle);
            }

            GUILayout.FlexibleSpace();
            if (game.Company.Inventory.Count > 0)
            {
                GUILayout.Label("보유 장비", headingStyle);
                foreach (var item in game.Company.Inventory)
                {
                    GUILayout.Label($"[{item.Rarity}] {item.Name} · 실무 +{item.WorkPowerBonus}", bodyStyle);
                }
            }
            GUILayout.EndVertical();

            GUILayout.Space(18f);
            GUILayout.BeginVertical(cardStyle, GUILayout.ExpandWidth(true), GUILayout.Height(430f));
            GUILayout.Label("오늘의 업무", headingStyle);
            GUILayout.Space(16f);
            if (GUILayout.Button("면접 진행"))
            {
                candidates = game.GenerateInterviewCandidates();
                notice = "지원자의 능력, 숙련도, 연봉 조건을 비교하세요.";
                currentScreen = View.Interview;
            }

            GUILayout.Space(10f);
            if (GUILayout.Button("프로젝트 돌입"))
            {
                game.StartPrototypeBattle();
                resultClaimed = false;
                battleTimer = 0f;
                notice = "업무 능력을 연계해 마감시계의 핵심을 공략합니다.";
                currentScreen = View.Battle;
            }

            GUILayout.Space(18f);
            GUILayout.Label("프로젝트: 폭주하는 앱 출시", bodyStyle);
            GUILayout.Label("추천 부서: PM · 개발 · 영업", bodyStyle);
            GUILayout.Label("보상: 현금 650 · 평판 12 · 장비 1개", bodyStyle);
            GUILayout.EndVertical();
            GUILayout.EndHorizontal();
        }

        private void DrawInterview()
        {
            GUILayout.Space(16f);
            GUILayout.BeginHorizontal();
            GUILayout.Label("면접실", headingStyle);
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("사무실로", GUILayout.Width(150f)))
            {
                currentScreen = View.Office;
            }
            GUILayout.EndHorizontal();
            GUILayout.Label(notice, bodyStyle);
            GUILayout.Space(10f);

            GUILayout.BeginHorizontal();
            for (var index = 0; index < candidates.Count; index++)
            {
                var candidate = candidates[index];
                GUILayout.BeginVertical(cardStyle, GUILayout.Width(380f), GUILayout.Height(430f));
                GUILayout.Label(candidate.Employee.Name, headingStyle);
                GUILayout.Label($"{DepartmentName(candidate.Employee.Department)} · {RankName(candidate.Employee.Rank)}", bodyStyle);
                GUILayout.Space(10f);
                GUILayout.Label($"실무 {candidate.Employee.WorkPower}   협업 {candidate.Employee.Collaboration}", bodyStyle);
                GUILayout.Label($"집중 {candidate.Employee.Focus}   대응 {candidate.Employee.Adaptability}", bodyStyle);
                GUILayout.Label($"멘탈 {candidate.Employee.Mental}   속도 {candidate.Employee.Speed}", bodyStyle);
                GUILayout.Space(10f);
                GUILayout.Label($"성격: {candidate.Employee.Trait}", bodyStyle);
                GUILayout.Label($"외형 조합: {candidate.Employee.Appearance.Summary}", bodyStyle);
                GUILayout.Label($"월급 {candidate.Employee.MonthlySalary} · 계약금 {candidate.SigningCost}", bodyStyle);
                GUILayout.FlexibleSpace();
                GUI.enabled = !game.Company.Employees.Any(item => item.Id == candidate.Employee.Id);
                if (GUILayout.Button("채용"))
                {
                    game.TryHire(candidate, out notice);
                }
                GUI.enabled = true;
                GUILayout.EndVertical();
                if (index < candidates.Count - 1) GUILayout.Space(18f);
            }
            GUILayout.EndHorizontal();
        }

        private void DrawBattle()
        {
            var battle = game.CurrentBattle;
            GUILayout.Space(12f);
            GUILayout.BeginHorizontal();
            GUILayout.Label(battle.Project.Name, headingStyle);
            GUILayout.FlexibleSpace();
            GUILayout.Label($"마감 {battle.Turn}/{battle.Project.DeadlineTurns}일", bodyStyle);
            GUILayout.EndHorizontal();

            var ratio = battle.RemainingWorkload / (float)battle.Project.MaxWorkload;
            var barRect = GUILayoutUtility.GetRect(1180f, 38f);
            GUI.Box(barRect, string.Empty);
            var previous = GUI.color;
            GUI.color = new Color(0.85f, 0.18f, 0.12f);
            GUI.DrawTexture(new Rect(barRect.x + 3f, barRect.y + 3f, (barRect.width - 6f) * ratio, barRect.height - 6f), Texture2D.whiteTexture);
            GUI.color = previous;
            GUI.Label(barRect, $"남은 업무량 {battle.RemainingWorkload}/{battle.Project.MaxWorkload}", new GUIStyle(bodyStyle) { alignment = TextAnchor.MiddleCenter, normal = { textColor = Color.white } });

            GUILayout.Space(12f);
            GUILayout.BeginHorizontal();
            GUILayout.BeginVertical(cardStyle, GUILayout.Width(450f), GUILayout.Height(440f));
            GUILayout.Label("프로젝트 팀", headingStyle);
            foreach (var employee in game.Company.Employees.Take(game.Company.ProjectTeamSize))
            {
                GUILayout.Label($"{employee.Name} · {DepartmentName(employee.Department)}", bodyStyle);
                GUILayout.Label($"  {BattleSkill(employee.Department)}", bodyStyle);
            }
            GUILayout.Space(18f);
            GUILayout.Label("업무 연계", headingStyle);
            GUILayout.Label("요구사항 정리 → 일정 통합 → 집중 개발", bodyStyle);
            GUILayout.FlexibleSpace();
            if (battle.IsComplete)
            {
                if (!resultClaimed)
                {
                    game.ClaimBattleResult(out notice);
                    resultClaimed = true;
                }

                GUILayout.Label(notice, bodyStyle);
                if (GUILayout.Button("사무실로 복귀"))
                {
                    currentScreen = View.Office;
                }
            }
            GUILayout.EndVertical();

            GUILayout.Space(18f);
            GUILayout.BeginVertical(cardStyle, GUILayout.ExpandWidth(true), GUILayout.Height(440f));
            GUILayout.Label("프로젝트 진행 기록", headingStyle);
            logScroll = GUILayout.BeginScrollView(logScroll);
            foreach (var entry in battle.Logs)
            {
                GUILayout.Label(entry, bodyStyle);
            }
            GUILayout.EndScrollView();
            GUILayout.EndVertical();
            GUILayout.EndHorizontal();
        }

        private static void DrawRule()
        {
            var rect = GUILayoutUtility.GetRect(1f, 2f, GUILayout.ExpandWidth(true));
            var previous = GUI.color;
            GUI.color = new Color(0.08f, 0.2f, 0.25f, 0.35f);
            GUI.DrawTexture(rect, Texture2D.whiteTexture);
            GUI.color = previous;
        }

        private static string DepartmentName(Department department)
        {
            switch (department)
            {
                case Department.Sales: return "영업";
                case Department.ProjectManagement: return "기획/PM";
                case Department.Development: return "개발/R&D";
                case Department.Finance: return "회계/재무";
                case Department.Design: return "디자인";
                case Department.Marketing: return "마케팅";
                case Department.HumanResources: return "인사";
                case Department.Legal: return "법무";
                case Department.QualityAssurance: return "품질관리";
                case Department.InformationTechnology: return "운영/IT";
                default: return department.ToString();
            }
        }

        private static string RankName(EmployeeRank rank)
        {
            switch (rank)
            {
                case EmployeeRank.Rookie: return "신입";
                case EmployeeRank.Experienced: return "경력자";
                case EmployeeRank.Specialist: return "전문가";
                case EmployeeRank.Ace: return "에이스";
                case EmployeeRank.Legend: return "업계 전설";
                default: return rank.ToString();
            }
        }

        private static string BattleSkill(Department department)
        {
            switch (department)
            {
                case Department.Sales: return "프레젠테이션으로 요구사항 방어막 파괴";
                case Department.ProjectManagement: return "간트차트 방어막과 협업 경로 생성";
                case Department.Development: return "코드와 완료 표시로 핵심 업무 공격";
                case Department.Finance: return "예산 손실 차단과 비용 최적화";
                default: return "부서 전문 업무 수행";
            }
        }
    }
}
