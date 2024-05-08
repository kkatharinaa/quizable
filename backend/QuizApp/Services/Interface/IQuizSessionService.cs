using Microsoft.AspNetCore.SignalR;
using QuizApp.Models;

namespace QuizApp.Services.Interface;

public interface IQuizSessionService
{

    public QuizSession? GetQuizSessionByEntryId(string entryId);
    public (QuizSession?, string) GetQuizSessionById(string quizSessionId);
    public bool TryGetQuizSessionUser(string quizSessionId, string identifier, out QuizUser quizUser);
    // This is used to get the user quiz
    public bool TryGetQuizSessionUserStats(string quizSessionId, out List<QuizSessionUserStats> quizUsers);
    public bool TryGetQuizSessionQuestions(string quizSessionId, out List<Question> questions);
    public bool TryGetQuizSessionNextQuestion(string quizSessionId, out Question question);
    public Question GetQuizSessionFirstQuestion(string quizSessionId);
    public Question GetQuizSessionCurrentQuestion(string quizSessionId);
    
    public void AddUserToQuizSession(string quizSessionId, QuizUser quizUser);
    public string AddQuizSession(QuizSession quizSession);
    public void AddQuizSessionQuestions(string quizSessionId, List<Question> questions);
    
    public void SetQuizSessionState(string quizSessionId, string state);
    public void SetQuizSessionCurrentQuestionId(string quizSessionId, string newQuestionId);
    
    public void AddUserAnswers(string quizSessionId, string quizUserId, string questionId, Answer answer);
    public bool IsQuestionAnswerAllUsers(string quizSessionId, string questionId);
    public void DeleteSessionByEntryCode(string entryCode);
}