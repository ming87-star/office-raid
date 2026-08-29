namespace OfficeRaid.Core
{
    public enum Department
    {
        Sales,
        ProjectManagement,
        Development,
        Finance,
        Design,
        Marketing,
        HumanResources,
        Legal,
        QualityAssurance,
        InformationTechnology
    }

    public enum EmployeeRank
    {
        Rookie,
        Experienced,
        Specialist,
        Ace,
        Legend
    }

    public enum EquipmentRarity
    {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary
    }

    public enum EquipmentSlot
    {
        WorkTool,
        SupportTool,
        PersonalItem
    }

    public enum ProjectEventType
    {
        None,
        RequirementChange,
        EmergencyMeeting,
        BudgetCut,
        ClientApproval
    }
}
