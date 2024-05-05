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
        if (!quizSessionService.TryGetQuizSessionUser(quizSessionId, quizUser.Identifier, out var _))
        {
            await masterContext.Clients.All.SendAsync($"message:userId1", new QuizMasterMessage{NotifyNewQuizUser = quizUser});
            quizSessionService.AddUserToQuizSession(quizSessionId, quizUser);
        }
    }
    
    public async Task EnterSlaveQuizSessionQuestion(QuizUser quizUser, string quizSessionId)
    {
        bool quizSessionQuestionsOk = quizSessionService.TryGetQuizSessionQuestions(quizSessionId, out var questions);

        if (quizSessionQuestionsOk)
        {
            await Clients.All.SendAsync($"nextquestion:{quizSessionId}/{quizUser.Identifier}", questions);
        }
    }
    
    public async Task EnterSlaveAnswerSelection(QuizUser quizUser, string quizSessionId, string questionId, Answer answer)
    {
        logger.LogInformation("Add answer to the question and calculating score");
        
        quizSessionService.AddUserAnswers(quizSessionId, quizUser.Id, questionId, answer);
        
        if (quizSessionService.IsQuestionAnswerAllUsers(quizSessionId, questionId))
        {
            logger.LogInformation("Question has been answered by all users.");
            
            await masterContext.Clients.All.SendAsync("questionend:userId1");
            quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsers);
            
            foreach(QuizSessionUserStats user in quizUsers)
            {
                await Clients.All.SendAsync($"questionend:{user.User.Identifier}");
            }
        }
        else await masterContext.Clients.All.SendAsync("useranswered:userId1");
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