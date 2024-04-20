namespace QuizApp.Models;

public class QuizSessionState
{
    public string CurrentQuestionId { get; set; }
    public List<QuizSessionUserStats> UsersStats { get; set; }
    public string CurrentQuizState { get; set; }
}