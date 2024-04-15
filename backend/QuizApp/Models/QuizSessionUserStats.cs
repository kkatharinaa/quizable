namespace QuizApp.Models;

public class QuizSessionUserStats
{
    private QuizUser User { get; set; }
    private int Score { get; set; }
    private List<QuizSessionUserStatsAnswer> Answers { get; set; }

    public QuizSessionUserStats(QuizUser user, int score, List<QuizSessionUserStatsAnswer> answers)
    {
        User = user;
        Score = score;
        Answers = answers;
    }
}