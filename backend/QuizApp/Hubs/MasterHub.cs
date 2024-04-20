using Microsoft.AspNetCore.SignalR;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

public class MasterHub: Hub
{
    public ILogger logger;

    public MasterHub(ILogger<MasterHub> logger, IQuizSessionService quizSessionService)
    {
        this.logger = logger;
    }
    
    public async Task newMessage(string userId, string message)
    {
        // await Clients.All.SendAsync();
        logger.LogInformation($"New master message from {userId}: {message}");
        await Clients.All.SendAsync(userId, $"Welcome to the quiz, {userId}!");
    }
}