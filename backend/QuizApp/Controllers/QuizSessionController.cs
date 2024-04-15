using Microsoft.AspNetCore.Mvc;

namespace QuizApp.Controllers;

[ApiController]
[Route("/api/session")]
public class QuizSessionController : Controller
{
    [HttpGet]  
    public IActionResult Get()
    {
        return Ok("");
    }
    
    [HttpPost]  
    public IActionResult Set()
    {
        return Ok("");
    }
    
}