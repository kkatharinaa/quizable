using System.Collections.Frozen;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp.Services;

public class QuizSessionService(ILogger<QuizSessionService> logger): IQuizSessionService
{
    /// <summary>
    /// Quiz Sessions Dictionary. Key is the Entry ID
    /// </summary>
    private static Dictionary<string, QuizSession> QuizSessions { get; set; } = new();
    
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
    

    /// <summary>
    /// Add new quiz user to the session
    /// </summary>
    /// <param name="quizSessionId">Quiz session id to add</param>
    /// <param name="quizUser"></param>
    public void AddUserToQuizSession(string quizSessionId, QuizUser quizUser)
    {
        QuizSessions = QuizSessions
            .Select(quizSession =>
            {
                if (quizSession.Value.Id.Equals(quizSessionId))
                {
                    // check if user does not already exist inside the quiz
                    bool quizUserExists = quizSession.Value.State.UsersStats
                        .Any(u => u.User.Identifier == quizUser.Identifier);

                    // if it does not exist, add it
                    if (!quizUserExists)
                    {
                        var newQuizSessionState = new QuizSessionUserStats
                        {
                            User = quizUser,
                            Score = 0,
                            Answers = []
                        };

                        quizSession.Value.State.UsersStats.Add(newQuizSessionState);
                    }
                }
                return quizSession;
            }).ToDictionary();
    }
    
    /// <summary>
    /// Tries to get a quiz user for the give identifier and session id.
    /// </summary>
    /// <param name="quizSessionId">Quiz Session ID</param>
    /// <param name="identifier">The name of the quiz user.</param>
    /// <param name="quizUser">Out</param>
    public bool TryGetQuizSessionUser(string quizSessionId, string identifier, out QuizUser quizUser)
    {
        QuizSession? quizUserStats = QuizSessions
            .Values.ToList()
            .FirstOrDefault(session => session.Id == quizSessionId);

        if (quizUserStats is not null)
        {

            QuizSessionUserStats? quizSessionUserStats = quizUserStats.State.UsersStats
                .FirstOrDefault(s => s.User.Identifier.Equals(identifier));
            
            logger.LogInformation(quizUserStats.State.UsersStats.Count.ToString());

            if (quizSessionUserStats is not null)
            {
                logger.LogInformation(quizSessionUserStats.User.ToString());

                quizUser = quizSessionUserStats.User;
                return true;
            }
           
            quizUser = null;
            return false;
        }
        quizUser = null;
        return false;

        //
        // if (quizUserStats is not null)
        // {
        //     logger.LogInformation("Found it: " + quizUserStats.User.Identifier);
        //     quizUser = quizUserStats.User;
        //     return true;
        // }

        
        quizUser = null;
        return false;
    }

    /// <summary>
    /// Get the user stats from the quiz user ID
    /// </summary>
    /// <param name="quizUserId">The quiz user Id</param>
    public QuizSessionUserStats? GetQuizSessionUserStats(string quizUserId)
    {
        return QuizSessions
            .Select(session => 
                session.Value.State.UsersStats.FirstOrDefault(userStats => userStats.User.Id == quizUserId))
            .FirstOrDefault();
    }
    
    /// <summary>
    /// 
    /// </summary>
    /// <param name="quizUserId">Quiz User ID to set the quiz user score</param>
    /// <param name="newScore">new score</param>
    public void UpdateUserScore(string quizUserId, int newScore)
    {
        QuizSessions = QuizSessions
            .Select(session =>
                {
                    session.Value.State.UsersStats = session.Value.State.UsersStats.Select(stats =>
                    {
                        if (stats.User.Id == quizUserId)
                            stats.Score = newScore;
                        
                        return stats;
                    }).ToList();
                    
                    return session;
                }
            ).ToDictionary();
    }

    /// <summary>
    /// Add Users Answers
    /// </summary>
    /// <param name="quizUserId">The Id of the Quiz user</param>
    /// <param name="answer">The answer to add</param>
    public void AddUserAnswers(string quizUserId, QuizSessionUserStatsAnswer answer)
    {
        QuizSessions = QuizSessions
            .Select(session =>
                {
                    session.Value.State.UsersStats = session.Value.State.UsersStats.Select(stat =>
                    {
                        if (stat.User.Id == quizUserId)
                            stat.Answers.Add(answer);
                        return stat;
                    }).ToList();

                    return session;
                }
            ).ToDictionary();
    }

    /*
    public List<QuizSessionUserStats> GetLeaderboard(string quizSessionId)
    {
        return QuizSessions
            .Where(session => session.Value.Id.Equals(quizSessionId))
            .Select(quizSession =>
            {
                if (quizSession.Value.Id.Equals(quizSessionId))
                {
                    return quizSession.Value.State.UsersStats.OrderBy(s => s.Score);
                }
            }).ToList();
    }
    */
}