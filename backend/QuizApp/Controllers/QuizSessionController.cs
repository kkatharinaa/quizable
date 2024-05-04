using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizApp.Models;
using QuizApp.Services;
using QuizApp.Services.Interface;

namespace QuizApp.Controllers;

[ApiController]
[Route("/api/session")]
public class QuizSessionController(ILogger<QuizSessionController> logger, IQuizSessionService quizSessionService) : Controller
{

    [HttpGet]
    public IActionResult Get()
    {
        return Ok("");
    }
    
    [HttpPost]
    public IActionResult Set(QuizSession quizSession)
    {
        return Ok(quizSessionService.AddQuizSession(quizSession));
    }
    
    /// <summary>
    /// Returns quizSessionId if the quiz code is valid
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("validate/{code}")]
    public IActionResult ValidateQuizCode(string code)
    {
        QuizSession? quizSession = quizSessionService.GetQuizSessionByEntryId(code);

        if (quizSession is not null)
            return Ok(quizSession.Id);
        
        return NotFound("Code is not valid.");
    }

    [HttpGet]
    [Route("user/{quizSessionId}/{quizUserIdentifier}")]
    public IActionResult GetQuizSessionUser(string quizSessionId, string quizUserIdentifier)
    {
        if (quizSessionId == string.Empty || quizUserIdentifier == string.Empty)
        {
            Response.StatusCode = 400;
            return Content("Bad request. Missing Data");
        }
        
        bool quizSessionUserExists = quizSessionService.TryGetQuizSessionUser(quizSessionId, quizUserIdentifier, out QuizUser quizUser);

        if (quizSessionUserExists)
            return Ok(quizUser);
        
        logger.LogInformation("Quiz user not found!");
        
        return NotFound("Quiz user not found!");
    }
    
    
    [HttpGet]
    [Route("session/{entryId}/")]
    public IActionResult GetSessionByEntryId(string entryId)
    {
        return Ok(quizSessionService.GetQuizSessionByEntryId(entryId));
    }
}