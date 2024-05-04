using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using QuizApp.Controllers;
using QuizApp.Data;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp
{
    public class QuizSessionControllerTest
    {
        private Mock<IQuizSessionService> _quizSessionService;
        private QuizSessionController _quizSessionController;
        private ILogger<QuizSessionController> _logger;

        [SetUp]
        public void Setup()
        {
            _quizSessionService = new Mock<IQuizSessionService>();
            _logger = LoggerFactory.Create(x => {}).CreateLogger<QuizSessionController>();
            _quizSessionController = new QuizSessionController(_logger, _quizSessionService.Object);
        }
        
        [Test]
        public void Assert_QuizSessionAdd()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();

            _quizSessionService
                .Setup(x => x.AddQuizSession(It.IsAny<QuizSession>()))
                .Returns(It.IsAny<string>());

            // Act
            IActionResult validateQuizCodeControllerResult = _quizSessionController.Set(quizSession);

            // Assert
            Assert.That(validateQuizCodeControllerResult, Is.Not.Null);
            Assert.That((validateQuizCodeControllerResult as OkObjectResult)?.StatusCode, Is.EqualTo(200));
            _quizSessionService.Verify(service => service.AddQuizSession(It.IsAny<QuizSession>()), Times.Once);
        }

        [Test]
        public void Assert_Validate_Entry_Id()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();
            _quizSessionService
                .Setup(x => x.GetQuizSessionByEntryId(It.IsAny<string>()))
                .Returns(quizSession);

            // Act
            var entryId = _quizSessionService.Object.AddQuizSession(quizSession);
            IActionResult validateQuizCodeControllerResult = _quizSessionController.ValidateQuizCode(entryId);

            // Assert
            Assert.That(validateQuizCodeControllerResult, Is.Not.Null);
            Assert.That((validateQuizCodeControllerResult as OkObjectResult)?.StatusCode, Is.EqualTo(200));
            _quizSessionService.Verify(service => service.GetQuizSessionByEntryId(It.IsAny<string>()), Times.Once);
        }
    }
}