using System.Diagnostics;
using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.AspNetCore.SignalR;
using QuizApp.Models;
using QuizApp.Services.Interface;
using QuizApp.Helpers;

namespace QuizApp.Hubs;

public class MasterHub(ILogger<MasterHub> logger, IQuizSessionService quizSessionService, IHubContext<SlaveHub> slaveContext): Hub
{
    private static IHubCallerClients ClientsCopy { get; set; } // to access the clients within the timer callback
    public override Task OnConnectedAsync()
    {
        ClientsCopy ??= Clients;
        return base.OnConnectedAsync();
    }
    
    // Master sends messages and they arrive here
    // get the data and send it back
    public async Task RequestQuizSession(QuizUser quizUser, string quizSessionId)
    {
        (QuizSession? quizSession, string quizEntryId) = quizSessionService.GetQuizSessionById(quizSessionId);
        
        // TODO: change it so backend knows who the quiz user is of our quizsession, meaning we don't always have to manually send "userId1" -> required for auth stuff

        if (quizSession is not null)
        {
            await Clients.All.SendAsync(quizUser.Identifier, quizEntryId, quizSession);
        }
    }
    
    // Message from Client (Master Frontend) to Notify every quiz session participant to start the quiz
    // Master and slave will receive a message from the backend when exactly to start
    public async Task NotifyPlayQuiz(string quizSessionId, bool justStarted)
    {
        // Set the state of the quiz session
        quizSessionService.SetQuizSessionState(quizSessionId, "playing");
        
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsers);

        if (isQuizSessionUser)
        {
            bool hasQuestions = quizSessionService.TryGetQuizSessionQuestions(quizSessionId, out var questions);

            if (hasQuestions)
            {
                bool isNextQuestion = quizSessionService.TryGetQuizSessionNextQuestion(quizSessionId, out var nextQuestion);
                
                if (justStarted)
                {
                    nextQuestion = quizSessionService.GetQuizSessionFirstQuestion(quizSessionId);
                }
                
                if (isNextQuestion || justStarted)
                {
                    // update the current question id
                    quizSessionService.SetQuizSessionCurrentQuestionId(quizSessionId, nextQuestion.id);

                    await NotifyStateChange(quizSessionId);
                    
                    // start timer
                    await StartNewCountdown(quizSessionId, nextQuestion.maxQuestionTime);
                }
                else
                {
                    // no next question, end the quiz.
                    quizSessionService.SetQuizSessionState(quizSessionId, "podium");
                    
                    await NotifyStateChange(quizSessionId);
                }
            }
            else logger.LogError("Could not find questions for this quiz session!");
        }
    }

    // Notifies every participant that the question has been skipped and we should move on to the next question after scoreboard
    public async Task NotifyQuestionSkip(string quizSessionId)
    {
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);

        if (isQuizSessionUser)
        {
            quizSessionService.SetQuizSessionState(quizSessionId, "statistics");
            
            // use tasks to notify all in parallel and at the same time
            List<Task> tasks = new();
            
            tasks.Add(
            Task.Run(
                    () => ClientsCopy.All.SendAsync(
                    $"questionend:userId1",
                    quizUsersStatsList,
                    "statistics")
                )
            );
            
            foreach (QuizSessionUserStats quizSessionUserStats in quizUsersStatsList)
            {
                tasks.Add(Task.Run(() =>
                    slaveContext.Clients.All.SendAsync(
                        $"questionend:{quizSessionUserStats.User.Identifier}",
                            quizUsersStatsList,
                            "statistics")
                    ));
                
            }

            await Task.WhenAll(tasks.ToList());
        }
    }
    
    // Notify everyone of the quiz session state, and can set a new state first if necessary
    public async Task NotifyStateChange(string quizSessionId, string? newState = null)
    {
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);

        if (isQuizSessionUser)
        {
            if (newState != null) quizSessionService.SetQuizSessionState(quizSessionId, newState);
            string state = quizSessionService.GetQuizSessionState(quizSessionId);
            Question currentQuestion = quizSessionService.GetQuizSessionCurrentQuestion(quizSessionId);
            
            // use tasks to notify all in parallel and at the same time
            List<Task> tasks = new();
            
            tasks.Add(
                Task.Run(
                    () => Clients.All.SendAsync(
                        $"statechange:userId1",
                        state,
                        currentQuestion.id)
                )
            );
            
            foreach (QuizSessionUserStats quizSessionUserStats in quizUsersStatsList)
            {
                tasks.Add(Task.Run(() =>
                    slaveContext.Clients.All.SendAsync(
                        $"statechange:{quizSessionUserStats.User.Identifier}",
                        state,
                        currentQuestion)
                ));
                
            }

            await Task.WhenAll(tasks.ToList());
        }
    }

    // Kills the quiz session
    public async Task NotifyKillQuiz(string quizSessionId)
    {
        (QuizSession? quizSession, string entry) = quizSessionService.GetQuizSessionById(quizSessionId);

        if (quizSession is not null)
        {
            quizSessionService.DeleteSessionExtrasBySessionId(quizSessionId);
            quizSessionService.DeleteSessionByEntryCode(entry);
        }
    }
    
    // Sends the report as a CSV file to the user's email address
    public async Task SendReportToEmail(string quizSessionId, string emailAddress, string quizTitle)
    {
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);
        bool hasQuestions = quizSessionService.TryGetQuizSessionQuestions(quizSessionId, out var questions);

        if (isQuizSessionUser && hasQuestions)
        {
            // generate csv
            var csvGenerator = new CsvGenerator();
            var csvContent = csvGenerator.GenerateCsvForUserStats(questions, quizUsersStatsList);
            
            // prepare quizTitle for filename
            char[] invalidFileNameChars = Path.GetInvalidFileNameChars();
            var validQuizTitle = new string(quizTitle.Where(character => !invalidFileNameChars.Contains(character)).ToArray());
            validQuizTitle = validQuizTitle.Replace(" ", "-");

            // prepare attachment
            var csvBytes = Encoding.UTF8.GetBytes(csvContent);
            var attachment = new Attachment(new MemoryStream(csvBytes), $"Report_{validQuizTitle}.csv", "text/csv");
            
            Console.WriteLine(csvContent);

            await SendEmailAsync(emailAddress, "Quiz Report", "Attached please find the requested quiz report. Thank you for using Quizable!", attachment);
            
            // wait for a bit until the email can be sent again
            await Task.Delay(TimeSpan.FromMinutes(2));
            await Clients.All.SendAsync("canResendReport:userId1");
        }
    }

    private async Task SendEmailAsync(string email, string subject, string body, Attachment attachment)
    {
        // read secrets
        var smtp = Environment.GetEnvironmentVariable("EMAIL_SMTP");
        var port = Environment.GetEnvironmentVariable("EMAIL_PORT");
        var address = Environment.GetEnvironmentVariable("EMAIL_ADDRESS");
        var password = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");

        if (smtp == null || port == null || address == null || password == null)
        {
            logger.LogError("Could not send email. One of the following was not specified at backend/QuizApp/.env: EMAIL_SMTP, EMAIL_PORT, EMAIL_ADDRESS, EMAIL_PASSWORD");
            return;
        }
        
        var message = new MailMessage();
        message.From = new MailAddress(address);
        message.To.Add(new MailAddress(email));
        message.Subject = subject;
        message.Body = body;
        message.Attachments.Add(attachment);
        
        using (var smtpClient = new SmtpClient(smtp))
        {
            smtpClient.Port = int.Parse(port);
            smtpClient.Credentials = new NetworkCredential(address, password);
            smtpClient.EnableSsl = true; // Enable SSL for secure transmission

            await smtpClient.SendMailAsync(message);
        }
    }

    private async Task StartNewCountdown(string quizSessionId, int seconds)
    {
        // setup callback function
        async void TimerCallback(object? state)
        {
            var countDownExists = quizSessionService.TryGetQuizSessionCountdown(quizSessionId, out var countDownInService);

            if (countDownExists)
            {
                var remainingSeconds = countDownInService.remainingSeconds;
                if (remainingSeconds > 1)
                {
                    remainingSeconds--;
                    quizSessionService.SetQuizSessionCountdownRemainingSeconds(quizSessionId, remainingSeconds);
                    await NotifyTimerChange(quizSessionId, remainingSeconds);
                }
                else
                {
                    // notify that question has ended because the time has run out
                    await NotifyQuestionSkip(quizSessionId);
                }
            }
        }
        
        Timer timer = new Timer(TimerCallback, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
        CountDown countDown = new CountDown();
        countDown.remainingSeconds = seconds+1;
        countDown.timer = timer;
        countDown.stopwatch = Stopwatch.StartNew();
        
        quizSessionService.AddQuizSessionCountdown(quizSessionId, countDown);
    }
    
    // notify everyone of the timer changes -> this will be passed as a callback function when starting a new timer
    private async Task NotifyTimerChange(string quizSessionId, int remainingSeconds)
    {
        bool isQuizSessionUser = quizSessionService.TryGetQuizSessionUserStats(quizSessionId, out var quizUsersStatsList);

        if (isQuizSessionUser)
        { 
            // use tasks to notify all in parallel and at the same time
            List<Task> tasks = new();
            
            tasks.Add(
                Task.Run(
                    () => ClientsCopy.All.SendAsync(
                        $"timerchange:userId1",
                        remainingSeconds)
                )
            );
            
            foreach (QuizSessionUserStats quizSessionUserStats in quizUsersStatsList)
            {
                tasks.Add(Task.Run(() =>
                    slaveContext.Clients.All.SendAsync(
                        $"timerchange:{quizSessionUserStats.User.Identifier}",
                        remainingSeconds)
                ));
                
            }

            await Task.WhenAll(tasks.ToList());
        }
    }
}