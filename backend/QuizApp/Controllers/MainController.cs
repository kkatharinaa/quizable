using Microsoft.AspNetCore.Mvc;

namespace QuizApp.Controllers;

[ApiController]
[Route("/api/main")]
public class MainController : Controller
{
    [HttpGet]  
    [Route("helloWorld")]
    public IActionResult GetHelloWorld()
    {
        return Ok("Hello jyttkjgkjf");
    }
}