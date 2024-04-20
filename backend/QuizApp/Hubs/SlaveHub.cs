using Microsoft.AspNetCore.SignalR;
using QuizApp.Services;

namespace QuizApp.Hubs;

public class SlaveHub(ILogger<SlaveHub> logger, QuizSessionService quizSessionService) : Hub
{
    public async Task NewMessage(long userId, string message)
    {
       // await Clients.All.SendAsync();
       logger.LogInformation($"New slave message from {userId}: {message}");
    }
}