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

                // use tasks to notify all in parallel and at the same time
                List<Task> tasks = new ();
                
                if (justStarted)
                {
                    nextQuestion = quizSessionService.GetQuizSessionFirstQuestion(quizSessionId);
                }
                
                if (isNextQuestion || justStarted)
                {
                    // update the current question id
                    quizSessionService.SetQuizSessionCurrentQuestionId(quizSessionId, nextQuestion.id);

                    string message = justStarted ? "start" : "play";
                    
                    // Get the next question
                    tasks.Add(Task.Run(() => Clients.All.SendAsync($"{message}:{quizSessionId}", quizSessionId, nextQuestion)));
            
                    foreach(QuizSessionUserStats quizSessionUserStats in quizUsers)
                    {
                        tasks.Add(Task.Run(() =>
                            slaveContext.Clients.All.SendAsync(
                                $"{message}:{quizSessionId}/{quizSessionUserStats.User.Identifier}",quizSessionId, nextQuestion, quizSessionUserStats.User)));
                    }

                    await Task.WhenAll(tasks.ToList());
                }
                else
                {
                    // no next question, end the quiz.
                    quizSessionService.SetQuizSessionState(quizSessionId, "end");
                    
                    // send end message back to the master and the slave
                    tasks.Add(Task.Run(() => Clients.All.SendAsync($"end:{quizSessionId}")));
            
                    foreach(QuizSessionUserStats quizSessionUserStats in quizUsers)
                    {
                        tasks.Add(Task.Run(() =>
                            slaveContext.Clients.All.SendAsync(
                                $"end:{quizSessionId}/{quizSessionUserStats.User.Identifier}")));
                    }
                    
                    await Task.WhenAll(tasks.ToList());
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

            Question currentQuestion = quizSessionService.GetQuizSessionCurrentQuestion(quizSessionId);
            
            // use tasks to notify all in parallel and at the same time
            List<Task> tasks = new();
            
            tasks.Add(
            Task.Run(
                    () => Clients.All.SendAsync(
                    $"questionend:userId1", 
                    quizSessionId, 
                    quizUsersStatsList,
                    currentQuestion)
                )
            );
            
            foreach (QuizSessionUserStats quizSessionUserStats in quizUsersStatsList)
            {
                tasks.Add(Task.Run(() =>
                    slaveContext.Clients.All.SendAsync(
                        $"questionend:{quizSessionUserStats.User.Identifier}",
                            quizSessionId, 
                            quizUsersStatsList)
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