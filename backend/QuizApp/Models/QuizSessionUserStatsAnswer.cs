namespace QuizApp.Models;

public class QuizSessionUserStatsAnswer
{
    private string QuestionId { get; set; }
    private string AnswerId { get; set; }
    private int PointsReceived { get; set; }
    private int TimeTaken { get; set; }

    public QuizSessionUserStatsAnswer(string questionId, string answerId, int pointsReceived, int timeTaken)
    {
        QuestionId = questionId;
        AnswerId = answerId;
        PointsReceived = pointsReceived;
        TimeTaken = timeTaken;
    }
}