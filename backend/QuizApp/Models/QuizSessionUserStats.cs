namespace QuizApp.Models;

public class QuizSessionUserStats
{
    public QuizUser User { get; set; }
    public int Score { get; set; }
    public List<QuizSessionUserStatsAnswer> Answers { get; set; }
}