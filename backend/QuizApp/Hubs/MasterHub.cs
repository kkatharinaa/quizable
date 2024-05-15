using Microsoft.AspNetCore.SignalR;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

public class MasterHub(ILogger<MasterHub> logger, IQuizSessionService quizSessionService, IHubContext<SlaveHub> slaveContext): Hub
{
    // Master sends messages and they arrive here
    // get the data and send it back
    public async Task RequestQuizSession(QuizUser quizUser, string quizSessionId)
    {
        (QuizSession? quizSession, string quizEntryId) = quizSessionService.GetQuizSessionById(quizSessionId);
        
        // TODO: change it so backend knows who the quiz user is of our quizsession, meaning we don't always have to manually send "userId1" -> required for auth stuff

        if (quizSession is not null)
        {
            await Clients.All.SendAsync(quizUser.Identifier, quizEntryId, quizSession);
        }
    }
    
    // Message from Client (Master Frontend) to Notify every quiz session participant to start the quiz
    // Master and slave will receive a message from the backend when exactly to start
    public async Task NotifyPlayQuiz(string quizSessionId, bool justStarted)
    {
        // Set the state of the quiz session
        quizSessionService.SetQuizSessionState(quizSessionId, "playing");
        
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsers);

        if (isQuizSessionUser)
        {
            bool hasQuestions = quizSessionService.TryGetQuizSessionQuestions(quizSessionId, out var questions);

            if (hasQuestions)
            {
                bool isNextQuestion = quizSessionService.TryGetQuizSessionNextQuestion(quizSessionId, out var nextQuestion);
                
                if (justStarted)
                {
                    nextQuestion = quizSessionService.GetQuizSessionFirstQuestion(quizSessionId);
                }
                
                if (isNextQuestion || justStarted)
                {
                    // update the current question id
                    quizSessionService.SetQuizSessionCurrentQuestionId(quizSessionId, nextQuestion.id);

                    await NotifyStateChange(quizSessionId);
                }
                else
                {
                    // no next question, end the quiz.
                    quizSessionService.SetQuizSessionState(quizSessionId, "podium");
                    
                    await NotifyStateChange(quizSessionId);
                }
            }
            else logger.LogError("Could not find questions for this quiz session!");
        }
    }

    // Notifies every participant that the question has been skipped and we should move on to the next question after scoreboard
    // TODO: Change Diagram to add quiz user name too
    public async Task NotifyQuestionSkip(string quizSessionId)
    {
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);

        if (isQuizSessionUser)
        {
            quizSessionService.SetQuizSessionState(quizSessionId, "statistics");
            
            // use tasks to notify all in parallel and at the same time
            List<Task> tasks = new();
            
            tasks.Add(
            Task.Run(
                    () => Clients.All.SendAsync(
                    $"questionend:userId1",
                    quizUsersStatsList,
                    "statistics")
                )
            );
            
            foreach (QuizSessionUserStats quizSessionUserStats in quizUsersStatsList)
            {
                tasks.Add(Task.Run(() =>
                    slaveContext.Clients.All.SendAsync(
                        $"questionend:{quizSessionUserStats.User.Identifier}",
                            quizUsersStatsList,
                            "statistics")
                    ));
                
            }

            await Task.WhenAll(tasks.ToList());
        }
    }
    
    // Notify everyone of the quiz session state, and can set a new state first if necessary
    public async Task NotifyStateChange(string quizSessionId, string? newState = null)
    {
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);

        if (isQuizSessionUser)
        {
            if (newState != null) quizSessionService.SetQuizSessionState(quizSessionId, newState);
            string state = quizSessionService.GetQuizSessionState(quizSessionId);
            Question currentQuestion = quizSessionService.GetQuizSessionCurrentQuestion(quizSessionId);
            
            // use tasks to notify all in parallel and at the same time
            List<Task> tasks = new();
            
            tasks.Add(
                Task.Run(
                    () => Clients.All.SendAsync(
                        $"statechange:userId1",
                        state,
                        currentQuestion.id)
                )
            );
            
            foreach (QuizSessionUserStats quizSessionUserStats in quizUsersStatsList)
            {
                tasks.Add(Task.Run(() =>
                    slaveContext.Clients.All.SendAsync(
                        $"statechange:{quizSessionUserStats.User.Identifier}",
                        state,
                        currentQuestion)
                ));
                
            }

            await Task.WhenAll(tasks.ToList());
        }
    }

    // Kills the quiz session
    public async Task NotifyKillQuiz(string quizSessionId, bool sendPdf)
    {
        (QuizSession? quizSession, string entry) = quizSessionService.GetQuizSessionById(quizSessionId);

        if (quizSession is not null)
        {
            quizSessionService.DeleteSessionByEntryCode(entry);
        }
    }
}