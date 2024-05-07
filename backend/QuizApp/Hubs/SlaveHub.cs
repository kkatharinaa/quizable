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
            
            await masterContext.Clients.All.SendAsync($"message:userId1", quizSessionUserStatList.Select(v => v.User));

            if (isQuizSessionUserOk)
            {
                foreach (QuizSessionUserStats quizSessionUserStats in quizSessionUserStatList)
                {
                    await Clients.All.SendAsync($"message:{quizSessionUserStats.User.Identifier}", quizSessionUserStatList.Select(v => v.User));
                }
            }
        }
    }
    
    // Notifies that the slave has answered a question
    public async Task NotifySlaveAnswered(QuizUser quizUser, string quizSessionId, string questionId, Answer answer)
    {
        quizSessionService.AddUserAnswers(quizSessionId, quizUser.Id, questionId, answer);
        
        if (quizSessionService.IsQuestionAnswerAllUsers(quizSessionId, questionId))
        {            
            quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);

            quizSessionService.SetQuizSessionState(quizSessionId, "statistics");
            
            await masterContext.Clients.All.SendAsync(
                "questionend:userId1",
                quizSessionId, 
                quizUsersStatsList);
            
            foreach(QuizSessionUserStats user in quizUsersStatsList)
            {
                await Clients.All.SendAsync(
                    $"questionend:{user.User.Identifier}",
                    quizSessionId, 
                    quizUsersStatsList
                    );
            }
        }
        else await masterContext.Clients.All.SendAsync("answer:userId1");
    }
    
    // Will be unnecessary
    public async Task EnterSlaveQuizSessionQuestion(QuizUser quizUser, string quizSessionId)
    {
        bool quizSessionQuestionsOk = quizSessionService.TryGetQuizSessionQuestions(quizSessionId, out var questions);

        if (quizSessionQuestionsOk)
        {
            await Clients.All.SendAsync($"nextquestion:{quizSessionId}/{quizUser.Identifier}", questions);
        }
    }
}