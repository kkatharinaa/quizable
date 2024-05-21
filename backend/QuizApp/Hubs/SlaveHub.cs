using Microsoft.AspNetCore.SignalR;
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

    public async Task NotifySlaveEnterQuiz(QuizUser quizUser, string quizSessionId)
    {
        if (!quizSessionService.TryGetQuizSessionUser(quizSessionId, quizUser.Identifier, out var _))
        {
            quizSessionService.AddUserToQuizSession(quizSessionId, quizUser);
            
            bool isQuizSessionUserOk =
                quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizSessionUserStatList);
            
            await masterContext.Clients.All.SendAsync($"userjoined:userId1", quizSessionUserStatList);

            if (isQuizSessionUserOk)
            {
                foreach (QuizSessionUserStats quizSessionUserStats in quizSessionUserStatList)
                {
                    await Clients.All.SendAsync($"userjoined:{quizSessionUserStats.User.Identifier}", quizSessionUserStatList);
                }
            }

            await RequestQuizSession(quizUser, quizSessionId);
        }
    }
    
    // Notifies that the slave has answered a question
    public async Task NotifySlaveAnswered(QuizUser quizUser, string quizSessionId, string questionId, Answer answer)
    {
        quizSessionService.AddUserAnswers(quizSessionId, quizUser.Id, questionId, answer);
        
        quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);
        
        if (quizSessionService.IsQuestionAnswerAllUsers(quizSessionId, questionId))
        {            
            quizSessionService.SetQuizSessionState(quizSessionId, "statistics");
            
            // TODO: issue that if there are 2 players and the one who joined first answers first, it will already end the question even though the other person has not answered yet
            
            await masterContext.Clients.All.SendAsync(
                "questionend:userId1",
                quizUsersStatsList,
                "statistics");
            
            foreach(QuizSessionUserStats user in quizUsersStatsList)
            {
                await Clients.All.SendAsync(
                    $"questionend:{user.User.Identifier}",
                    quizUsersStatsList,
                    "statistics");
            }
        }
        else await masterContext.Clients.All.SendAsync("answer:userId1", quizUsersStatsList);
    }
    
    // Request Quiz Session
    public async Task RequestQuizSession(QuizUser quizUser, string quizSessionId)
    {
        (QuizSession? quizSession, string quizEntryId) = quizSessionService.GetQuizSessionById(quizSessionId);

        if (quizSession is not null)
        {
            await Clients.All.SendAsync(quizUser.Identifier, quizSession);
        }
    }
}