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
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation($"Connection lost: {Context.ConnectionId}");

        var quizUser = quizSessionService.TryGetSlaveConnectionQuizUser(Context.ConnectionId);
        if (quizUser == null)
        {
            logger.LogError("user was not connected to a quiz session. user is null");
            return base.OnDisconnectedAsync(exception);;
        }
        
        var player = (quizUser, Context.ConnectionId);
        var quizSession = quizSessionService.GetSlaveConnectionQuizSession(player);

        if (quizSession == null)
        {
            logger.LogError("user was not connected to a quiz session. session is null");
            return base.OnDisconnectedAsync(exception);;
        }

        LeaveQuizSession(quizUser, quizSession.Id, false);

        return base.OnDisconnectedAsync(exception);
    }

    public string GetConnectionId() => Context.ConnectionId;

    public async Task NotifySlaveEnterQuiz(string connectionId, QuizUser quizUser, string quizSessionId)
    {
        var userExists = quizSessionService.TryGetQuizSessionUser(quizSessionId, quizUser.Identifier, out var _);
        
        (QuizSession? quizSession, _) = quizSessionService.GetQuizSessionById(quizSessionId);
        
        if (quizSession is not null)
        {
            if (!userExists)
            {
                quizSessionService.AddUserToQuizSession(quizSessionId, quizUser);
            }
            quizSessionService.AddQuizSessionSlaveConnection(quizUser, connectionId, quizSessionId);
            
            bool isQuizSessionUserOk =
                quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizSessionUserStatList);
            List<QuizUser> connectedPlayers = quizSessionService.GetConnectedPlayers(quizSession.Id);

            await masterContext.Clients.All.SendAsync($"userchange:{quizSessionId}/quizSessionHost0123456", quizSessionUserStatList, connectedPlayers);

            if (isQuizSessionUserOk && !userExists)
            {
                foreach (QuizSessionUserStats quizSessionUserStats in quizSessionUserStatList)
                {
                    await Clients.All.SendAsync($"userchange:{quizSessionId}/{quizSessionUserStats.User.Identifier}", quizSessionUserStatList);
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
            
            await masterContext.Clients.All.SendAsync(
                $"questionend:{quizSessionId}/quizSessionHost0123456",
                quizUsersStatsList,
                "statistics");
            
            foreach(QuizSessionUserStats user in quizUsersStatsList)
            {
                await Clients.All.SendAsync(
                    $"questionend:{quizSessionId}/{user.User.Identifier}",
                    quizUsersStatsList,
                    "statistics");
            }
        }
        else
        {
            await masterContext.Clients.All.SendAsync($"answer:{quizSessionId}/quizSessionHost0123456", quizUsersStatsList);
            await Clients.All.SendAsync(
                $"answer:{quizSessionId}/{quizUser.Identifier}",
                quizUsersStatsList);
        }
    }
    
    // Request Quiz Session
    public async Task RequestQuizSession(QuizUser quizUser, string quizSessionId)
    {
        (QuizSession? quizSession, string quizEntryId) = quizSessionService.GetQuizSessionById(quizSessionId);

        if (quizSession is not null)
        {
            Question currentQuestion = quizSessionService.GetQuizSessionCurrentQuestion(quizSessionId);
            await Clients.All.SendAsync($"sessionrequest:{quizSessionId}/{quizUser.Identifier}", quizSession, currentQuestion);
        }
        else
        {
            await Clients.All.SendAsync($"nosession:{quizSessionId}/{quizUser.Identifier}");
        }
    }

    public Task LeaveQuizSession(QuizUser quizUser, string quizSessionId, bool leftVoluntarily)
    {
        var (quizSession, _) = quizSessionService.GetQuizSessionById(quizSessionId);

        if (quizSession == null)
        {
            logger.LogError("quiz session does not exist");
            return Task.CompletedTask;
        }
        
        // remove user from quiz session - either fully or only the deviceid so the user wont be connected to it anymore
        if (leftVoluntarily) quizSessionService.RemoveUserFromQuizSession(quizSession.Id, quizUser, quizSession.State.CurrentQuizState != "lobby");
        // remove user connection
        quizSessionService.RemoveQuizSessionSlaveConnection(quizSessionId, (quizUser, Context.ConnectionId));
        //quizSessionService.RemoveQuizSessionSlaveConnectionWithoutConnectionId(quizSession.Id, quizUser);
        
        // Notify everyone that a user left
        List<QuizSessionUserStats> userStatsList = quizSession.State.UsersStats;
        List<QuizUser> connectedPlayers = quizSessionService.GetConnectedPlayers(quizSession.Id);

        masterContext.Clients.All.SendAsync($"userchange:{quizSession.Id}/quizSessionHost0123456", userStatsList, connectedPlayers);
        
        foreach (QuizSessionUserStats quizSessionUserStats in userStatsList)
        {
            Clients.All.SendAsync($"userchange:{quizSession.Id}/{quizSessionUserStats.User.Identifier}", userStatsList);
        }
        
        return Task.CompletedTask;
    }
}