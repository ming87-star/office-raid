using System.Linq;
using NUnit.Framework;
using OfficeRaid.Core;

namespace OfficeRaid.Tests
{
    public sealed class OfficeRaidGameTests
    {
        [Test]
        public void CreateCompany_StartsWithThreeEmployees()
        {
            var game = new OfficeRaidGame(1);
            game.CreateCompany("테스트 회사");

            Assert.That(game.Company.Name, Is.EqualTo("테스트 회사"));
            Assert.That(game.Company.Employees.Count, Is.EqualTo(3));
            Assert.That(game.Company.ProjectTeamSize, Is.EqualTo(3));
        }

        [Test]
        public void CandidateGenerator_CreatesValidCombinationalAppearance()
        {
            var generator = new CandidateGenerator(42);
            var candidate = generator.Generate();

            Assert.That(candidate.Employee.Name, Is.Not.Empty);
            Assert.That(candidate.SigningCost, Is.GreaterThan(0));
            Assert.That(candidate.Employee.Appearance.Hair, Is.InRange(0, 15));
            Assert.That(candidate.Employee.Appearance.Eyes, Is.InRange(0, 9));
            Assert.That(candidate.Employee.Appearance.Outfit, Is.InRange(0, 11));
        }

        [Test]
        public void StarterTeam_CompletesPrototypeProjectBeforeDeadline()
        {
            var game = new OfficeRaidGame(7);
            game.CreateCompany("테스트 회사");
            var battle = game.StartPrototypeBattle();

            while (!battle.IsComplete)
            {
                battle.Step();
            }

            Assert.That(battle.IsSuccess, Is.True);
            Assert.That(battle.Turn, Is.LessThanOrEqualTo(battle.Project.DeadlineTurns));
        }

        [Test]
        public void SuccessfulProject_GrantsCurrencyReputationAndEquipment()
        {
            var game = new OfficeRaidGame(11);
            game.CreateCompany("테스트 회사");
            var startingCash = game.Company.Cash;
            var battle = game.StartPrototypeBattle();
            while (!battle.IsComplete) battle.Step();

            var equipment = game.ClaimBattleResult(out var message);

            Assert.That(equipment, Is.Not.Null);
            Assert.That(game.Company.Cash, Is.EqualTo(startingCash + battle.Project.RewardCash));
            Assert.That(game.Company.Reputation, Is.EqualTo(battle.Project.RewardReputation));
            Assert.That(game.Company.Inventory.Single(), Is.SameAs(equipment));
            Assert.That(message, Does.Contain("획득"));
        }
    }
}
