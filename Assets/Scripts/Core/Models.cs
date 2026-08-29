using System;
using System.Collections.Generic;

namespace OfficeRaid.Core
{
    [Serializable]
    public sealed class AppearanceProfile
    {
        public int Face;
        public int Skin;
        public int Hair;
        public int Eyes;
        public int Eyebrows;
        public int Nose;
        public int Mouth;
        public int Accessory;
        public int Outfit;

        public string Summary => $"얼굴 {Face + 1} · 머리 {Hair + 1} · 눈 {Eyes + 1} · 의상 {Outfit + 1}";
    }

    [Serializable]
    public sealed class Equipment
    {
        public string Name;
        public EquipmentRarity Rarity;
        public int WorkPowerBonus;
        public int CollaborationBonus;

        public Equipment(string name, EquipmentRarity rarity, int workPowerBonus, int collaborationBonus)
        {
            Name = name;
            Rarity = rarity;
            WorkPowerBonus = workPowerBonus;
            CollaborationBonus = collaborationBonus;
        }
    }

    [Serializable]
    public sealed class Employee
    {
        public string Id;
        public string Name;
        public Department Department;
        public EmployeeRank Rank;
        public int Level;
        public int Experience;
        public int WorkPower;
        public int Collaboration;
        public int Focus;
        public int Adaptability;
        public int Mental;
        public int Speed;
        public int MonthlySalary;
        public string Trait;
        public AppearanceProfile Appearance;
        public readonly List<Equipment> Equipment = new List<Equipment>();

        public int EffectiveWorkPower
        {
            get
            {
                var bonus = 0;
                foreach (var item in Equipment)
                {
                    bonus += item.WorkPowerBonus;
                }

                return WorkPower + bonus;
            }
        }

        public int EffectiveCollaboration
        {
            get
            {
                var bonus = 0;
                foreach (var item in Equipment)
                {
                    bonus += item.CollaborationBonus;
                }

                return Collaboration + bonus;
            }
        }
    }

    [Serializable]
    public sealed class Candidate
    {
        public Employee Employee;
        public int SigningCost;

        public Candidate(Employee employee, int signingCost)
        {
            Employee = employee;
            SigningCost = signingCost;
        }
    }

    [Serializable]
    public sealed class Project
    {
        public string Name;
        public int MaxWorkload;
        public int Complexity;
        public int DeadlineTurns;
        public int RewardCash;
        public int RewardReputation;
        public Department[] RecommendedDepartments;

        public Project(
            string name,
            int maxWorkload,
            int complexity,
            int deadlineTurns,
            int rewardCash,
            int rewardReputation,
            Department[] recommendedDepartments)
        {
            Name = name;
            MaxWorkload = maxWorkload;
            Complexity = complexity;
            DeadlineTurns = deadlineTurns;
            RewardCash = rewardCash;
            RewardReputation = rewardReputation;
            RecommendedDepartments = recommendedDepartments;
        }
    }

    public sealed class CompanyState
    {
        public string Name;
        public int Cash;
        public int Reputation;
        public int CompanyLevel;
        public int RosterCapacity;
        public int ProjectTeamSize;
        public readonly List<Employee> Employees = new List<Employee>();
        public readonly List<string> SelectedProjectTeamIds = new List<string>();
        public readonly List<Equipment> Inventory = new List<Equipment>();
    }
}
