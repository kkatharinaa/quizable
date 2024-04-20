using Microsoft.AspNetCore.SignalR;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

public class MasterHub(ILogger<MasterHub> logger, IQuizSessionService quizSessionService): Hub
{
    
    // Master sends messages and they arrive here
    // get the data and send it back
    public async Task RequestQuizSession(string userId, string quizSessionId)
    {
        (QuizSession? quizSession, string quizEntryId) = quizSessionService.GetQuizSessionById(quizSessionId);

        if (quizSession is not null)
            await Clients.All.SendAsync(userId, quizEntryId, quizSession);
    }
}