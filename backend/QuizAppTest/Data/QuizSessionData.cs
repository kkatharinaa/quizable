using Microsoft.VisualStudio.TestPlatform.CrossPlatEngine.Helpers;
using QuizApp.Models;

namespace QuizApp.Data;

public class QuizSessionData
{
    public static QuizSession GetDefaultSession() => new QuizSession
    {
        Id = Guid.NewGuid().ToString(),
        DeviceId = Guid.NewGuid().ToString(),
        QuizId = "",
        State = new()
        {
            CurrentQuestionId = "",
            CurrentQuizState = "",
            UsersStats = new List<QuizSessionUserStats>()
        }
    };

    public static QuizUser GetDefaultQuizUser(string? name = "User1") => new QuizUser
    {
        Id = Guid.NewGuid().ToString(),
        DeviceId = Guid.NewGuid().ToString(),
        Identifier = name
    };

    public static List<QuizSessionUserStatsAnswer> GetDefaultAnswers() => 
    [
        new QuizSessionUserStatsAnswer
        {
            AnswerId = Guid.NewGuid().ToString(),
            QuestionId = Guid.NewGuid().ToString(),
            PointsReceived = new Random().Next(100),
            TimeTaken = new Random().Next(15),
        },
        new QuizSessionUserStatsAnswer
        {
            AnswerId = Guid.NewGuid().ToString(),
            QuestionId = Guid.NewGuid().ToString(),
            PointsReceived = new Random().Next(100),
            TimeTaken = new Random().Next(15),
        },
        new QuizSessionUserStatsAnswer
        {
            AnswerId = Guid.NewGuid().ToString(),
            QuestionId = Guid.NewGuid().ToString(),
            PointsReceived = new Random().Next(100),
            TimeTaken = new Random().Next(15),
        }
    ];

    public static QuizSessionUserStatsAnswer GetDefaultAnswer(int? points = null, int? timeTaken = null) => new ()
    {
        AnswerId = Guid.NewGuid().ToString(),
        QuestionId = Guid.NewGuid().ToString(),
        PointsReceived = points ?? new Random().Next(100),
        TimeTaken = timeTaken ?? new Random().Next(15),
    };

    public static QuizSession GetDefaultSessionWithUser(QuizUser? quizUser = null, List<QuizSessionUserStatsAnswer>? quizAnswers = null) => new ()
    {
        Id = Guid.NewGuid().ToString(),
        DeviceId = Guid.NewGuid().ToString(),
        QuizId = "",
        State = new()
        {
            CurrentQuestionId = "",
            CurrentQuizState = "",
            UsersStats =
            [
                new()
                {
                    User = quizUser ?? GetDefaultQuizUser(),
                    Score = 0,
                    Answers = quizAnswers ?? GetDefaultAnswers()
                }
            ]
        }
    };
}