namespace QuizApp.Models;

public class QuizSessionState
{
    private string CurrentQuestionId { get; set; }
    private List<QuizSessionUserStats> UsersStats { get; set; }
    private string CurrentQuizState { get; set; }

    public QuizSessionState(string currentQuestionId, List<QuizSessionUserStats> usersStats, string currentQuizState)
    {
        CurrentQuestionId = currentQuestionId;
        UsersStats = usersStats;
        CurrentQuizState = currentQuizState;
    }
}