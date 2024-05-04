using Microsoft.AspNetCore.SignalR;
using QuizApp.Hubs.Models;
using QuizApp.Models;
using QuizApp.Services;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

public class SlaveHub(ILogger<SlaveHub> logger, IQuizSessionService quizSessionService, IHubContext<MasterHub> masterContext) : Hub
{
    
    public async Task NewMessage(long userId, string message)
    {
       // await Clients.All.SendAsync();
    }

    public async Task EnterSlaveQuizSession(QuizUser quizUser, string quizSessionId)
    {
        logger.LogInformation($"New slave message from {quizUser.Identifier}");
        await masterContext.Clients.All.SendAsync($"message:userId1", new QuizMasterMessage{NotifyNewQuizUser = quizUser});
        quizSessionService.AddUserToQuizSession(quizSessionId, quizUser);
    }

    public async Task NotifyAllSlavesNewUser(List<string> userNames, QuizUser quizUser)
    {
        ILogger<SlaveHub> logger = LoggerFactory.Create((c) => {}).CreateLogger<SlaveHub>();

        foreach(string userName in userNames)
        {
            await Clients.All.SendAsync(userName,quizUser);
        }
    }
}