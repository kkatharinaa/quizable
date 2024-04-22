using Microsoft.AspNetCore.SignalR;
using QuizApp.Services;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

public class SlaveHub(ILogger<SlaveHub> logger, IQuizSessionService quizSessionService) : Hub
{
    public async Task NewMessage(long userId, string message)
    {
       // await Clients.All.SendAsync();
    }

    public async Task EnterSlaveQuizSession(string userName, string quizSessionId)
    {
        logger.LogInformation($"New slave message from {userName}");
    }
}