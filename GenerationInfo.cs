namespace Kingdom650.Web;

public static class GenerationInfo
{
    public const int CurrentGeneration = 6;
    public const int NextGeneration = 7;
    public const int TruegoldLevel = 8;

    public static readonly DateOnly FoundingDate = new(2025, 7, 17);
    public static readonly DateOnly TargetDate = new(2026, 10, 12);

    private static DateOnly Today => DateOnly.FromDateTime(DateTime.Now);

    public static int ElapsedDays => Today.DayNumber - FoundingDate.DayNumber;
    public static int DaysRemaining => TargetDate.DayNumber - Today.DayNumber;

    public static string DaysRemainingLabel => DaysRemaining switch
    {
        > 0 => $"あと{DaysRemaining}日",
        0 => "本日解放!",
        _ => "解放済み",
    };
}
