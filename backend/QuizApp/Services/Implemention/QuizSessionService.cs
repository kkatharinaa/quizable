using System.Collections.Concurrent;
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
    
    // key: quizUserDeviceId, value: connectionId
    private static Dictionary<string, string> QuizSessionConnections { get; set; } = new();
    private static Dictionary<string, CountDown> QuizSessionsCountdowns { get; set; } = new();
    
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
    /// Add a timer for a specific quizSessionId
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="countDown"></param>
    public void AddQuizSessionCountdown(string quizSessionId, CountDown countDown)
    {
        QuizSessionsCountdowns[quizSessionId] = countDown;
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
    /// Delete the quiz session extras (all stuff around the session which is saved on the server to give more info on the session, like the related quiz questions and the timer...) by the session's id
    /// </summary>
    /// <param name="quizSessionId">Id of the session that we want to delete the extra info for</param>
    public void DeleteSessionExtrasBySessionId(string quizSessionId)
    {
        QuizSessionsQuestions.Remove(quizSessionId);
        QuizSessionsCountdowns.Remove(quizSessionId);
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

    public void RemoveUserFromQuizSession(string quizSessionId, QuizUser quizUser)
    {
        QuizSessions = QuizSessions.Select(quizSession =>
        {
            if (quizSession.Value.Id.Equals(quizSessionId))
            {
                // check if user does not already exist inside the quiz
                bool quizUserExists = quizSession.Value.State.UsersStats
                    .Any(u => u.User.Identifier == quizUser.Identifier);
                
                // if it does not exist, add it
                if (quizUserExists)
                {
                    QuizSessionUserStats? userStats = GetQuizSessionUserStats(quizUser.Id);
                    quizSession.Value.State.UsersStats.Remove(userStats!);
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
    /// Tries to get a countdown for the given session id.
    /// </summary>
    /// <param name="quizSessionId">Quiz Session ID</param>
    /// <param name="countDown">Out</param>
    public bool TryGetQuizSessionCountdown(string quizSessionId, out CountDown countDown)
    {
        if (QuizSessionsCountdowns.ContainsKey(quizSessionId))
        {
            countDown = QuizSessionsCountdowns[quizSessionId];
            return true;
        }
        countDown = null;
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
                    Question currentQuestion = this.GetQuizSessionCurrentQuestion(quizSessionId);
                    
                    quizSession.Value.State.UsersStats = quizSession.Value.State.UsersStats.Select(stat =>
                    {
                        if (stat.User.Id == quizUserId)
                        {
                            var countDownExists = TryGetQuizSessionCountdown(quizSessionId, out var countDown);
                            
                            QuizSessionUserStatsAnswer statsAnswer = new QuizSessionUserStatsAnswer{
                                QuestionId = questionId,
                                AnswerId = answer.id,
                                PointsReceived = answer.correct ? currentQuestion.questionPoints : 0,
                                TimeTaken = countDownExists ? (int)countDown.stopwatch.ElapsedMilliseconds : 0,
                            };
                            stat.Answers.Add(statsAnswer);
                            
                            // Calculate user score
                            stat.Score = 0;
                            stat.Answers.ForEach(answer =>
                            {
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
    /// Update the pointsreceived based on the reaction time (should be called after the question has ended and everyone has answered)
    /// If the questionPointsModifier is set to 0, will not change anything
    /// </summary>
    /// <param name="quizSessionId"></param>
    /// <param name="questionId"></param>
    private void CalculatePoints(string quizSessionId)
    {
        QuizSessions = QuizSessions
            .Select(quizSession =>
            {
                if (quizSession.Value.Id == quizSessionId)
                {
                    Question currentQuestion = this.GetQuizSessionCurrentQuestion(quizSessionId);
                    var maxPoints = currentQuestion.questionPoints;
                    
                    // only update the points if our settings say so or if we have a high enough max points value so that the points can be distributed among players...
                    if (currentQuestion.questionPointsModifier == 1 && maxPoints > 1)
                    {
                        const double minPointsRatio = 0.5; // If you get it right but are slow, you should at least get half of the points
                        var minPoints = (int)Math.Round(maxPoints * minPointsRatio);
                        
                        var allAnswersForQuestion = quizSession.Value.State.UsersStats
                            .SelectMany(stats => stats.Answers, (stats, answer) => new { stats, answer })
                            .Where(x => x.answer.QuestionId == currentQuestion.id)
                            .ToList();
                        
                        // get the fastest and slowest time in ms
                        var fastestTime = allAnswersForQuestion.Min(x => x.answer.TimeTaken);
                        var slowestTime = allAnswersForQuestion.Max(x => x.answer.TimeTaken);

                        foreach (var userStat in quizSession.Value.State.UsersStats)
                        {
                            var userStatAnswer = userStat.Answers.FirstOrDefault(userStatAnswer => userStatAnswer.QuestionId == currentQuestion.id);

                            // only change correct answers, the wrong answers can stay at 0
                            if (userStatAnswer != null && userStatAnswer.PointsReceived != 0)
                            {
                                var normalizedTime = (double)(userStatAnswer.TimeTaken - fastestTime) / (slowestTime - fastestTime);
                                var points = (int)Math.Round(maxPoints - (normalizedTime * (maxPoints - minPoints)));

                                userStatAnswer.PointsReceived = points;
                                
                                // recalculate user score
                                userStat.Score = 0;
                                userStat.Answers.ForEach(answer =>
                                {
                                    userStat.Score += answer.PointsReceived;
                                });
                            }
                        }
                    }
                }
                return quizSession;
            }).ToDictionary();
    }
    
    /// <summary>
    /// Set the quiz session state for the respective quiz
    /// </summary>
    /// <param name="quizSessionId">id of the quiz session to set state</param>
    /// <param name="state">desired state</param>
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

        if (state == "statistics")
        {
            CalculatePoints(quizSessionId);
            DeleteQuizSessionCountdown(quizSessionId);
        }
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
    /// Update the remaining seconds of a quiz session's countdown
    /// </summary>
    /// <param name="quizSessionId">id of the quiz session</param>
    /// <param name="remainingSeconds">the new value to set as the remaining seconds</param>
    public void SetQuizSessionCountdownRemainingSeconds(string quizSessionId, int remainingSeconds)
    {
        if (QuizSessionsCountdowns.ContainsKey(quizSessionId))
        {
            QuizSessionsCountdowns[quizSessionId].remainingSeconds = remainingSeconds;
        }
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

        if (quizSession == null)
        {
            return false;
        }

        // check if all users have answered the current question
        return quizSession.State.UsersStats.All(stat =>
            stat.Answers.Any(answer => answer.QuestionId == questionId));
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
    
    /// <summary>
    /// Get the quiz session state for the respective quiz
    /// </summary>
    /// <param name="quizSessionId">id of the quiz session to get state from</param>
    public string GetQuizSessionState(string quizSessionId)
    {
        string state = "";
        
        QuizSessions = QuizSessions
            .Select(session =>
                {
                    if (session.Value.Id == quizSessionId)
                        state = session.Value.State.CurrentQuizState;
                    
                    return session;
                }
            ).ToDictionary();
        
        return state;
    }
    
    public void AddQuizSessionSlaveConnection(QuizUser quizUser, string connectionId) => QuizSessionConnections.Add(quizUser.DeviceId, connectionId);

    public QuizSessionUserStats? GetSlaveConnectionUser(string connectionId)
    {   
        var deviceId = QuizSessionConnections[connectionId];

        return QuizSessions
            .SelectMany(kVp => kVp.Value.State.UsersStats)
            .FirstOrDefault(userStats => userStats.User.DeviceId == deviceId);
    }

    public QuizSession GetSlaveConnectionQuizSession(string connectionId)
    {
        var deviceId = QuizSessionConnections[connectionId];
        var quizSessionContainingQuizUser = 
            QuizSessions.FirstOrDefault(kVp => 
                kVp.Value.State.UsersStats.Any(val => val.User.DeviceId == deviceId)).Value;

        return quizSessionContainingQuizUser;
    }

    public void RemoveQuizSessionSlaveConnection(string connectionId)
    {
        var key = QuizSessionConnections.FirstOrDefault(kVp => kVp.Value == connectionId).Key;
        QuizSessionConnections.Remove(key ?? "");
    }

    /// <summary>
    /// Removes a quiz session's countdown
    /// </summary>
    /// <param name="quizSessionId"></param>
    public void DeleteQuizSessionCountdown(string quizSessionId)
    {
        if (QuizSessionsCountdowns.ContainsKey(quizSessionId))
        {
            QuizSessionsCountdowns[quizSessionId].stopwatch.Stop();
            QuizSessionsCountdowns[quizSessionId].timer.Dispose();
            QuizSessionsCountdowns.Remove(quizSessionId);
        }
    }
}