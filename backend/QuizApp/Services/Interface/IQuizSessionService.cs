using Microsoft.AspNetCore.SignalR;
using QuizApp.Models;

namespace QuizApp.Services.Interface;

public interface IQuizSessionService
{
    public string AddQuizSession(QuizSession quizSession);
    public QuizSession? GetQuizSessionByEntryId(string entryId);
    public (QuizSession?, string) GetQuizSessionById(string quizSessionId);
}