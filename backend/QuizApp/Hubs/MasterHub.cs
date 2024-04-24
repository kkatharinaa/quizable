using Microsoft.AspNetCore.SignalR;
using QuizApp.Hubs.Models;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp.Hubs;

public class MasterHub(ILogger<MasterHub> logger, IQuizSessionService quizSessionService): Hub
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
        ILogger<SlaveHub> logger = LoggerFactory.Create((c) => {}).CreateLogger<SlaveHub>();
        
        await Clients.All.SendAsync($"message:{userIdMaster}",masterMessage);
    }
}