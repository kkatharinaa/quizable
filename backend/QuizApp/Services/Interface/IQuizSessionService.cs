using QuizApp.Models;

namespace QuizApp.Services.Interface;

public interface IQuizSessionService
{
    public QuizSession? GetQuizSessionByEntryId(string entryId);
    public (QuizSession?, string) GetQuizSessionById(string quizSessionId);
    public bool TryGetQuizSessionUser(string quizSessionId, string identifier, out QuizUser quizUser);
    public bool TryGetQuizSessionUserByDeviceId(string deviceId, out QuizUser quizUser, out QuizSession quizSession);
    public bool TryGetQuizSessionUserStats(string quizSessionId, out List<QuizSessionUserStats> quizUsers);
    public bool TryGetQuizSessionQuestions(string quizSessionId, out List<Question> questions);
    public bool TryGetQuizSessionNextQuestion(string quizSessionId, out Question question);
    public bool TryGetQuizSessionCountdown(string quizSessionId, out CountDown countDown);
    public Question GetQuizSessionFirstQuestion(string quizSessionId);
    public Question GetQuizSessionCurrentQuestion(string quizSessionId);
    public string GetQuizSessionState(string quizSessionId);
    
    public void AddUserToQuizSession(string quizSessionId, QuizUser quizUser);
    public void RemoveUserFromQuizSession(string quizSessionId, QuizUser quizUser);
    public string AddQuizSession(QuizSession quizSession);
    public void AddQuizSessionQuestions(string quizSessionId, List<Question> questions);
    public void AddQuizSessionCountdown(string quizSessionId, CountDown countDown);
    
    public void SetQuizSessionState(string quizSessionId, string state);
    public void SetQuizSessionCurrentQuestionId(string quizSessionId, string newQuestionId);
    public void SetQuizSessionCountdownRemainingSeconds(string quizSessionId, int remainingSeconds);
    
    public void AddUserAnswers(string quizSessionId, string quizUserId, string questionId, Answer answer);
    public bool IsQuestionAnswerAllUsers(string quizSessionId, string questionId);
    public void DeleteSessionByEntryCode(string entryCode);
    public void DeleteSessionExtrasBySessionId(string quizSessionId);
    public void DeleteQuizSessionCountdown(string quizSessionId);

    public void AddQuizSessionSlaveConnection(QuizUser quizUser, string connectionId);
    public QuizSession GetSlaveConnectionQuizSession(string connectionId);
    public QuizSessionUserStats? GetSlaveConnectionUser(string connectionId);
    public void RemoveQuizSessionSlaveConnection(string connectionId);
}