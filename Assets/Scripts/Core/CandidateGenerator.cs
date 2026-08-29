using System;

namespace OfficeRaid.Core
{
    public sealed class CandidateGenerator
    {
        private static readonly string[] FamilyNames =
        {
            "김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"
        };

        private static readonly string[] GivenNames =
        {
            "서준", "민서", "지우", "도윤", "하린", "예준", "서연", "현우", "유진", "수빈",
            "지훈", "예린", "시우", "채원", "준호", "다은", "태윤", "소연", "건우", "나연"
        };

        private static readonly string[] Traits =
        {
            "분위기 메이커", "완벽주의", "위기 전문가", "아이디어 뱅크", "침착한 조율자",
            "빠른 손", "꼼꼼한 기록가", "발표 체질", "성장형 인재", "개인주의"
        };

        private static readonly Department[] PrototypeDepartments =
        {
            Department.Sales,
            Department.ProjectManagement,
            Department.Development,
            Department.Finance
        };

        private readonly Random random;

        public CandidateGenerator(int seed)
        {
            random = new Random(seed);
        }

        public Candidate Generate()
        {
            var rank = RollRank();
            var department = PrototypeDepartments[random.Next(PrototypeDepartments.Length)];
            var rankBonus = (int)rank * 4;
            var baseStat = 8 + rankBonus;

            var employee = new Employee
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = FamilyNames[random.Next(FamilyNames.Length)] + GivenNames[random.Next(GivenNames.Length)],
                Department = department,
                Rank = rank,
                Level = 1,
                WorkPower = baseStat + random.Next(0, 7),
                Collaboration = baseStat + random.Next(0, 7),
                Focus = baseStat + random.Next(0, 7),
                Adaptability = baseStat + random.Next(0, 7),
                Mental = baseStat + random.Next(2, 9),
                Speed = baseStat + random.Next(0, 7),
                MonthlySalary = 120 + rankBonus * 18 + random.Next(0, 50),
                Trait = Traits[random.Next(Traits.Length)],
                Appearance = GenerateAppearance()
            };

            var signingCost = employee.MonthlySalary + 100 + (int)rank * 100;
            return new Candidate(employee, signingCost);
        }

        private EmployeeRank RollRank()
        {
            var roll = random.Next(100);
            if (roll < 60) return EmployeeRank.Rookie;
            if (roll < 85) return EmployeeRank.Experienced;
            if (roll < 95) return EmployeeRank.Specialist;
            if (roll < 99) return EmployeeRank.Ace;
            return EmployeeRank.Legend;
        }

        private AppearanceProfile GenerateAppearance()
        {
            return new AppearanceProfile
            {
                Face = random.Next(8),
                Skin = random.Next(6),
                Hair = random.Next(16),
                Eyes = random.Next(10),
                Eyebrows = random.Next(8),
                Nose = random.Next(8),
                Mouth = random.Next(10),
                Accessory = random.Next(9),
                Outfit = random.Next(12)
            };
        }
    }
}
