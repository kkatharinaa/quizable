using Microsoft.Extensions.Logging;
using NUnit.Framework;
using QuizApp.Data;
using QuizApp.Services;
using QuizApp.Models;
using QuizApp.Services.Interface;

namespace QuizApp
{
    [TestFixture]
    public class QuizSessionServiceTest
    {
        private QuizSessionService _quizSessionService;

        [SetUp]
        public void Setup()
        {
            var logger = LoggerFactory.Create(c => { }).CreateLogger<QuizSessionService>();
            _quizSessionService = new QuizSessionService(logger);
        }

        [Test]
        public void Assert_Return_Seven_Digit_Code()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();

            // Act
            string result = _quizSessionService.AddQuizSession(quizSession);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Length.EqualTo(7));
            Assert.That(_quizSessionService.GetQuizSessionByEntryId(result), Is.Not.Null);
            Assert.That(_quizSessionService.GetQuizSessionByEntryId(result), Is.EqualTo(quizSession));
        }

        [Test]
        public void Assert_Update_Quiz_Session_User_Add()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();
            var quizUser = QuizSessionData.GetDefaultQuizUser();

            // Act
            _quizSessionService.AddQuizSession(quizSession);
            _quizSessionService.AddUserToQuizSession(quizSession.Id, quizUser);

            // Assert
            Assert.That(quizUser.Id, Is.Not.Null);
            Assert.That(_quizSessionService.GetQuizSessionUserStats(quizUser.Id), Is.Not.Null);
            Assert.That(_quizSessionService.GetQuizSessionUserStats(quizUser.Id)?.User,
                Is.Not.Null.And.EqualTo(quizUser));
        }

        [Test]
        public void Assert_Update_Quiz_Session_User_Score()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();
            var quizUser = QuizSessionData.GetDefaultQuizUser();
            int newScore = 100;

            // Act
            _quizSessionService.AddQuizSession(quizSession);
            _quizSessionService.AddUserToQuizSession(quizSession.Id, quizUser);
            _quizSessionService.UpdateUserScore(quizUser.Id, 100);

            // Assert
            Assert.That(_quizSessionService.GetQuizSessionUserStats(quizUser.Id), Is.Not.Null);
            Assert.That(_quizSessionService.GetQuizSessionUserStats(quizUser.Id)?.Score,
                Is.Not.Null.And.EqualTo(newScore));
        }

        [Test]
        public void Assert_Add_Quiz_Session_User_Answer()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();
            var quizUser1 = QuizSessionData.GetDefaultQuizUser();
            var quizUser2 = QuizSessionData.GetDefaultQuizUser();

            var quizUserAnswer1 = QuizSessionData.GetDefaultAnswer(100, 7);
            var quizUserAnswer2 = QuizSessionData.GetDefaultAnswer(100, 5);

            // Act
            _quizSessionService.AddQuizSession(quizSession);
            _quizSessionService.AddUserToQuizSession(quizSession.Id, quizUser1);
            _quizSessionService.AddUserToQuizSession(quizSession.Id, quizUser2);
            // _quizSessionService.AddUserAnswers(quizSession.Id, quizUser1.Id, quizUserAnswer1);
            // _quizSessionService.AddUserAnswers(quizSession.Id, quizUser2.Id, quizUserAnswer2);

            // TODO: Calculate the points given and create leaderboard

            // Assert
            // Assert.That(_quizSessionService.GetLeaderboard(quizSession.Id), Is.Not.Empty);
            // Assert.That(_quizSessionService.GetLeaderboard(quizSession.Id), Has.Count.EqualTo(2));
        }

        [Test]
        public void Assert_No_Duplicate_Usernames()
        {
            // Arrange
            var quizSession = QuizSessionData.GetDefaultSession();
            var quizUser1 = QuizSessionData.GetDefaultQuizUser();
            var quizUser2 = QuizSessionData.GetDefaultQuizUser();

            // Act 
            _quizSessionService.AddQuizSession(quizSession);
            _quizSessionService.AddUserToQuizSession(quizSession.Id, quizUser1);
        
            // Assert 
            Assert.That(_quizSessionService.TryGetQuizSessionUser(quizSession.Id,quizUser1.Identifier, out var _quizUser), Is.EqualTo(true));
            Assert.That(_quizSessionService.TryGetQuizSessionUser(quizSession.Id,quizUser2.Identifier, out var _), Is.EqualTo(false));

            //Assert.That(_quizUser, Is.Not.Null);
            //Assert.That(_quizUser, Is.EqualTo(quizUser1));
        }
    }
}
