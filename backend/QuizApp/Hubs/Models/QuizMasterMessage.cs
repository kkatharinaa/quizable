using QuizApp.Models;

namespace QuizApp.Hubs.Models;

public class QuizMasterMessage
{
    public QuizSession? NotifyQuizSession { get; set; }
    public QuizUser? NotifyNewQuizUser { get; set; }
}