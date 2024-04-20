using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp.Services;

public class QuizSessionService(ILogger<QuizSessionService> logger): IQuizSessionService
{
    private Dictionary<string, QuizSession> QuizSessions = new();
    
    /// <summary>
    /// Add new quiz session
    /// </summary>
    /// <param name="quizSession"></param>
    /// <returns></returns>
    public string AddQuizSession(QuizSession quizSession)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();

        string randomEntryId = new string(Enumerable.Repeat(chars, 7)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        
        QuizSessions.Add(randomEntryId, quizSession);

        return randomEntryId;
    }

    /// <summary>
    /// Get Quiz Session by the Id
    /// </summary>
    /// <param name="entryId"></param>
    /// <returns></returns>
    public QuizSession? GetQuizSessionByEntryId(string entryId)
    {
        QuizSessions.TryGetValue(entryId, out QuizSession? quizSession);
        return quizSession;
    }

    /// <summary>
    /// Get quiz session by the quiz session id in the dictionary
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <returns></returns>
    public (QuizSession?, string) GetQuizSessionById(string quizSessionId)
    {
        KeyValuePair<string, QuizSession?> quizSessionEntryId = QuizSessions.FirstOrDefault(kvP => kvP.Value.Id == quizSessionId, new ("", null));
        return (quizSessionEntryId.Value, quizSessionEntryId.Key);
    }
}