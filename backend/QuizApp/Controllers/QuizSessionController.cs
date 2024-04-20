using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizApp.Models;

namespace QuizApp.Controllers;

[ApiController]
[Route("/api/session")]
public class QuizSessionController(ILogger<QuizSessionController> logger) : Controller
{

    [HttpGet]
    public IActionResult Get()
    {
        return Ok("");
    }
    
    [HttpPost]
    public IActionResult Set(QuizSession quizSession)
    {
        logger.LogInformation(quizSession.ToString());
        return Ok("");
    }
    
}