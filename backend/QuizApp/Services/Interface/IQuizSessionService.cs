using Microsoft.AspNetCore.SignalR;
using QuizApp.Models;

namespace QuizApp.Services.Interface;

public interface IQuizSessionService
{
    public string AddQuizSession(QuizSession quizSession);
    public QuizSession? GetQuizSessionByEntryId(string entryId);
    public (QuizSession?, string) GetQuizSessionById(string quizSessionId);
    public void AddUserToQuizSession(string quizSessionId, QuizUser quizUser);
    public bool TryGetQuizSessionUser(string quizSessionId, string identifier, out QuizUser quizUser);
}