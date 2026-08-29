using System;
using System.Collections.Generic;
using System.Linq;

namespace OfficeRaid.Core
{
    public sealed class OfficeRaidGame
    {
        private readonly int seed;
        private readonly CandidateGenerator candidateGenerator;
        private readonly Random rewardRandom;
        private bool battleRewardClaimed;

        public CompanyState Company { get; private set; }
        public BattleSimulator CurrentBattle { get; private set; }

        public OfficeRaidGame(int seed = 20260829)
        {
            this.seed = seed;
            candidateGenerator = new CandidateGenerator(seed);
            rewardRandom = new Random(seed + 77);
        }

        public void CreateCompany(string companyName)
        {
            Company = new CompanyState
            {
                Name = string.IsNullOrWhiteSpace(companyName) ? "이름 없는 회사" : companyName.Trim(),
                Cash = 1200,
                Reputation = 0,
                CompanyLevel = 1,
                RosterCapacity = 5,
                ProjectTeamSize = 3
            };

            Company.Employees.Add(CreateStarter("서대표", Department.ProjectManagement, "침착한 조율자", 17, 18, 14));
            Company.Employees.Add(CreateStarter("김세일", Department.Sales, "발표 체질", 15, 14, 17));
            Company.Employees.Add(CreateStarter("이코드", Department.Development, "위기 전문가", 19, 12, 16));
        }

        public List<Candidate> GenerateInterviewCandidates(int count = 3)
        {
            var candidates = new List<Candidate>();
            for (var index = 0; index < count; index++)
            {
                candidates.Add(candidateGenerator.Generate());
            }

            return candidates;
        }

        public bool TryHire(Candidate candidate, out string message)
        {
            if (Company == null)
            {
                message = "회사를 먼저 만들어야 합니다.";
                return false;
            }

            if (candidate == null)
            {
                message = "지원자 정보가 없습니다.";
                return false;
            }

            if (Company.Employees.Count >= Company.RosterCapacity)
            {
                message = "현재 사무실의 직원 정원이 가득 찼습니다.";
                return false;
            }

            if (Company.Cash < candidate.SigningCost)
            {
                message = "계약금이 부족합니다.";
                return false;
            }

            Company.Cash -= candidate.SigningCost;
            Company.Employees.Add(candidate.Employee);
            message = $"{candidate.Employee.Name} 님이 입사했습니다.";
            return true;
        }

        public Project CreatePrototypeProject()
        {
            return new Project(
                "폭주하는 앱 출시 프로젝트",
                250,
                5,
                6,
                650,
                12,
                new[]
                {
                    Department.ProjectManagement,
                    Department.Development,
                    Department.Sales
                });
        }

        public BattleSimulator StartPrototypeBattle()
        {
            if (Company == null)
            {
                throw new InvalidOperationException("Create a company before starting a project.");
            }

            var team = Company.Employees.Take(Company.ProjectTeamSize).ToList();
            CurrentBattle = new BattleSimulator(CreatePrototypeProject(), team, seed + Company.Reputation + 1);
            battleRewardClaimed = false;
            return CurrentBattle;
        }

        public Equipment ClaimBattleResult(out string message)
        {
            if (CurrentBattle == null || !CurrentBattle.IsComplete)
            {
                message = "프로젝트가 아직 진행 중입니다.";
                return null;
            }

            if (battleRewardClaimed)
            {
                message = "이미 프로젝트 결과를 반영했습니다.";
                return null;
            }

            battleRewardClaimed = true;
            if (!CurrentBattle.IsSuccess)
            {
                Company.Cash = Math.Max(0, Company.Cash - 100);
                message = "실패 비용 100이 발생했지만 다음 도전 분석 보너스를 얻었습니다.";
                return null;
            }

            Company.Cash += CurrentBattle.Project.RewardCash;
            Company.Reputation += CurrentBattle.Project.RewardReputation;
            var equipment = GenerateEquipment();
            Company.Inventory.Add(equipment);
            message = $"현금 {CurrentBattle.Project.RewardCash}, 평판 {CurrentBattle.Project.RewardReputation}, {equipment.Name} 획득!";
            return equipment;
        }

        private Employee CreateStarter(string name, Department department, string trait, int work, int collaboration, int speed)
        {
            return new Employee
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = name,
                Department = department,
                Rank = EmployeeRank.Experienced,
                Level = 1,
                WorkPower = work,
                Collaboration = collaboration,
                Focus = 15,
                Adaptability = 14,
                Mental = 18,
                Speed = speed,
                MonthlySalary = 220,
                Trait = trait,
                Appearance = new AppearanceProfile()
            };
        }

        private Equipment GenerateEquipment()
        {
            var names = new[] { "집중형 노트북", "정리의 다이어리", "협업 헤드셋", "마감 수호 텀블러" };
            var roll = rewardRandom.Next(100);
            var rarity = roll < 60 ? EquipmentRarity.Common
                : roll < 85 ? EquipmentRarity.Uncommon
                : roll < 96 ? EquipmentRarity.Rare
                : roll < 99 ? EquipmentRarity.Epic
                : EquipmentRarity.Legendary;
            var bonus = 2 + (int)rarity * 2;
            return new Equipment(names[rewardRandom.Next(names.Length)], rarity, bonus, Math.Max(1, bonus / 2));
        }
    }
}
