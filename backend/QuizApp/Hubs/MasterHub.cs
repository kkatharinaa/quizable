using Microsoft.AspNetCore.SignalR;
using QuizApp.Hubs.Models;
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
    
    public async Task NotifyMasterNewUser(string userIdMaster, QuizMasterMessage masterMessage)
    {
        await Clients.All.SendAsync($"message:{userIdMaster}",masterMessage);
    }
    
    public async Task NotifyPlayQuizSession(string quizSessionId)
    {
        // Set the state of the quiz session
        quizSessionService.SetQuizSessionState(quizSessionId, "play");
        
        // Notify slaves
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsers);

        if (isQuizSessionUser)
        {
            foreach(QuizSessionUserStats quizSessionUserStats in quizUsers)
            {
                await slaveContext.Clients.All.SendAsync($"play:{quizSessionId}/{quizSessionUserStats.User.Identifier}");
            }
        }
    }
    
}