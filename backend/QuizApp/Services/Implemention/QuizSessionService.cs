using System.Collections.Frozen;
using System.Diagnostics.CodeAnalysis;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp.Services;

public class QuizSessionService(ILogger<QuizSessionService> logger): IQuizSessionService
{
    /// <summary>
    /// Quiz Sessions Dictionary. Key is the Entry ID
    /// </summary>
    private static Dictionary<string, QuizSession> QuizSessions { get; set; } = new();
    
    private static Dictionary<string, List<Question>> QuizSessionsQuestions { get; set; } = new();
    
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
        
        logger.LogInformation(randomEntryId);

        return randomEntryId;
    }

    /// <summary>
    /// Add new quiz session questions with quiz session id
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="questions"></param>
    public void AddQuizSessionQuestions(string quizSessionId, List<Question> questions)
    {
        QuizSessionsQuestions.Add(quizSessionId, questions);
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
    /// Delete the quiz session by the entry id
    /// </summary>
    /// <param name="entryCode">Entry code of the session to be deleted</param>
    public void DeleteSessionByEntryCode(string entryCode)
    {
        QuizSessions.Remove(entryCode);
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
    }
    
    /// <summary>
    /// Get quiz users for quiz session and their session
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="quizUsers"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public bool TryGetQuizSessionUserStats(string quizSessionId, out List<QuizSessionUserStats> quizUsers)
    {
        QuizSession? quizSession = QuizSessions
            .Values.ToList()
            .FirstOrDefault(session => session.Id == quizSessionId);

        if (quizSession is not null)
        {
            quizUsers = quizSession.State.UsersStats;
            return true;
        }

        quizUsers = [];
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
    /// Add answers to the current quiz session quiz
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="quizUserId"></param>
    /// <param name="questionId"></param>
    /// <param name="answer"></param>
    public void AddUserAnswers(string quizSessionId, string quizUserId, string questionId, Answer answer)
    {
        QuizSessions = QuizSessions
            .Select(quizSession =>
            {
                if (quizSession.Value.Id == quizSessionId)
                {
                    quizSession.Value.State.UsersStats = quizSession.Value.State.UsersStats.Select(stat =>
                    {
                        if (stat.User.Id == quizUserId)
                        {
                            QuizSessionUserStatsAnswer statsAnswer = new QuizSessionUserStatsAnswer{
                                QuestionId = questionId,
                                AnswerId = answer.id,
                                PointsReceived = answer.correct ? quizSession.Value.Options.QuestionPoints : 0,
                                TimeTaken = 0
                            };
                            stat.Answers.Add(statsAnswer);
                            
                            // Calculate user score
                            stat.Answers.ForEach(answer =>
                            {
                                // TODO: Formula to calculate the real value.
                                stat.Score += answer.PointsReceived;
                            });
                        }
                        return stat;
                    }).ToList();
                }
                return quizSession;
            }).ToDictionary();
    }
    
    /// <summary>
    /// Set the quiz session for the respective quiz
    /// </summary>
    /// <param name="quizSessionId">id of the quiz session to set state</param>
    /// <param name="state">desired state</param>
    /// <exception cref="NotImplementedException"></exception>
    public void SetQuizSessionState(string quizSessionId, string state)
    {
        QuizSessions = QuizSessions
            .Select(session =>
                {
                    if (session.Value.Id == quizSessionId)
                        session.Value.State.CurrentQuizState = state;

                    return session;
                }
            ).ToDictionary();
    }
    
    /// <summary>
    /// Set the new currentQuestionId
    /// </summary>
    /// <param name="quizSessionId">id of the quiz session to set state</param>
    /// <param name="newQuestionId">id of the new current question</param>
    public void SetQuizSessionCurrentQuestionId(string quizSessionId, string newQuestionId)
    {
        QuizSessions = QuizSessions
            .Select(session =>
                {
                    if (session.Value.Id == quizSessionId)
                        session.Value.State.CurrentQuestionId = newQuestionId;

                    return session;
                }
            ).ToDictionary();
    }

    /// <summary>
    /// Get quiz session options
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="questions"></param>
    /// <returns></returns>
    public bool TryGetQuizSessionQuestions(string quizSessionId, out List<Question> questions)
    {
        QuizSession? quizSession = QuizSessions
            .Values.ToList()
            .FirstOrDefault(session => session.Id == quizSessionId);

        bool isQuizSessionQuestions = QuizSessionsQuestions.ContainsKey(quizSessionId);

        if (isQuizSessionQuestions)
        {
            questions = QuizSessionsQuestions[quizSessionId];
            return true;
        }

        questions = [];
        return false;
    }

    /// <summary>
    /// Check if the question has been answered by all users
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="questionId"></param>
    /// <returns></returns>
    public bool IsQuestionAnswerAllUsers(string quizSessionId, string questionId)
    {
        QuizSession? quizSession = QuizSessions
            .Values.ToList()
            .FirstOrDefault(session => session.Id == quizSessionId);

        var isAnswered = true;

        quizSession?.State.UsersStats.ForEach(stat =>
        {
            var isQuestionIdFound = false;
            stat.Answers.ForEach(answer =>
            {
                if (answer.QuestionId == questionId)
                {
                    isQuestionIdFound = true;
                }
            });

            isAnswered = isQuestionIdFound;
        });

        return isAnswered;
    }
    
    /// <summary>
    /// Get the next question in the quiz session
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="question"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public bool TryGetQuizSessionNextQuestion(string quizSessionId,[MaybeNullWhen(false)] out Question question)
    {
        // Get the current quiz question id 
        string currentQuestionId = QuizSessions.FirstOrDefault(
            session => session.Value.Id == quizSessionId
        ).Value.State.CurrentQuestionId;
        
        // Get the index in the array of the current question 
        int index = 0;
        int resultIndex = 0;
        
        QuizSessionsQuestions[quizSessionId].ForEach((question) =>
        {
            if (question.id == currentQuestionId)
            {
                resultIndex = index;
            }

            index++;
        });

        if (resultIndex + 1 >= QuizSessionsQuestions[quizSessionId].Count)
        {
            question = null;
            return false;
        }

        question = QuizSessionsQuestions[quizSessionId][resultIndex + 1];
        return true;
    }

    /// <summary>
    /// Get the first question in the quiz session
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <returns></returns>
    public Question GetQuizSessionFirstQuestion(string quizSessionId)
    {
        // Get the first question
        return QuizSessionsQuestions[quizSessionId][0];
    }
    
    /// <summary>
    /// Get the current question in the quiz session
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <returns></returns>
    public Question GetQuizSessionCurrentQuestion(string quizSessionId)
    {
        // Get the current quiz question id 
        string currentQuestionId = QuizSessions.FirstOrDefault(
            session => session.Value.Id == quizSessionId
        ).Value.State.CurrentQuestionId;
        
        // Get the current question
        return QuizSessionsQuestions[quizSessionId].Find(question => currentQuestionId == question.id)!;
    }
}