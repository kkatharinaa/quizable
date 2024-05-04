using Microsoft.AspNetCore.SignalR;
using QuizApp.Hubs.Models;
using QuizApp.Models;
using QuizApp.Services;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

/**
 * Messages back to frontend:
 *
 * method is split by semicolon:
 *
 * first value is a the action (message, play, nextquestion, endquestion)
 * second value is the username registered with the quiz (so {quizSessionId}/{username})
 */

public class SlaveHub(ILogger<SlaveHub> logger, IQuizSessionService quizSessionService, IHubContext<MasterHub> masterContext) : Hub
{
    public async Task NewMessage(long userId, string message)
    {
       // await Clients.All.SendAsync();
    }

    public async Task EnterSlaveQuizSession(QuizUser quizUser, string quizSessionId)
    {
        logger.LogInformation($"New slave message from {quizUser.Identifier}");

        if (!quizSessionService.TryGetQuizSessionUser(quizSessionId, quizUser.Identifier, out var _))
        {
            await masterContext.Clients.All.SendAsync($"message:userId1", new QuizMasterMessage{NotifyNewQuizUser = quizUser});
            quizSessionService.AddUserToQuizSession(quizSessionId, quizUser);
        }
    }
    
    public async Task NotifyAllSlavesNewUser(List<string> userNames, QuizUser quizUser)
    {

        foreach(string userName in userNames)
        {
            await Clients.All.SendAsync(userName,quizUser);
        }
    }
    
    public async Task NotifyAllSlavesQuizStart(List<string> userNames, QuizUser quizUser)
    {
        foreach(string userName in userNames)
        {
            await Clients.All.SendAsync($"play:{userName}");
        }
    }
    
}