namespace Kingdom650.Web;

public static class AllianceMobilizationInfo
{
    private static readonly DateOnly AnchorStart = new(2026, 8, 31);
    private const int WindowDays = 6;
    private const int CycleDays = 28;

    private static DateOnly Today => DateOnly.FromDateTime(DateTime.Now);

    public static (DateOnly Start, DateOnly End) CurrentWindow()
    {
        var start = AnchorStart;
        while (start.AddDays(WindowDays - 1) < Today)
        {
            start = start.AddDays(CycleDays);
        }
        return (start, start.AddDays(WindowDays - 1));
    }

    public static bool IsOngoing
    {
        get
        {
            var (start, end) = CurrentWindow();
            return Today >= start && Today <= end;
        }
    }

    public static (DateOnly Start, DateOnly End) NextWindow
    {
        get
        {
            var (start, end) = CurrentWindow();
            return IsOngoing ? (start.AddDays(CycleDays), end.AddDays(CycleDays)) : (start, end);
        }
    }

    public static List<(DateOnly Start, DateOnly End, string Label)> ScheduleRows(int count = 7)
    {
        var rows = new List<(DateOnly, DateOnly, string)>();
        var (start, end) = CurrentWindow();
        var ongoing = IsOngoing;
        for (var i = 0; i < count; i++)
        {
            var label = i == 0
                ? (ongoing ? "🔥 開催中" : "次回(予想)")
                : (i == 1 && ongoing ? "次回(予想)" : "");
            rows.Add((start, end, label));
            start = start.AddDays(CycleDays);
            end = end.AddDays(CycleDays);
        }
        return rows;
    }

    public static List<(DateOnly MobStart, DateOnly MobEnd, DateOnly KvkApprox)> UpcomingCycles(int count)
    {
        var result = new List<(DateOnly, DateOnly, DateOnly)>();
        var (start, end) = NextWindow;
        for (var i = 0; i < count; i++)
        {
            result.Add((start, end, end.AddDays(7)));
            start = start.AddDays(CycleDays);
            end = end.AddDays(CycleDays);
        }
        return result;
    }

    public static string FormatRange(DateOnly start, DateOnly end) =>
        start.Month == end.Month
            ? $"{start.Month}/{start.Day}〜{end.Day}"
            : $"{start.Month}/{start.Day}〜{end.Month}/{end.Day}";

    public static string FormatRangeLong(DateOnly start, DateOnly end) =>
        start.Month == end.Month
            ? $"{start.Month}月{start.Day}日〜{end.Day}日"
            : $"{start.Month}月{start.Day}日〜{end.Month}月{end.Day}日";
}
