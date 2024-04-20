namespace QuizApp.Models;

public class QuizSessionUserStatsAnswer
{
    public string QuestionId { get; set; }
    public string AnswerId { get; set; }
    public int PointsReceived { get; set; }
    public int TimeTaken { get; set; }
}