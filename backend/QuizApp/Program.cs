using Microsoft.Extensions.Logging;
using QuizApp.Controllers;
using QuizApp.Hubs;
using QuizApp.Services;
using QuizApp.Services.Interface;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddLogging(builder => builder.AddConsole());
builder.Services.AddSingleton<IQuizSessionService, QuizSessionService>();
builder.Services.AddSignalR();

DotNetEnv.Env.Load();
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port)) {
    builder.WebHost.UseUrls($"http://*:{port}");
}

ILogger logger = LoggerFactory.Create((lb) => {}).CreateLogger<Program>();

var email_smtp = Environment.GetEnvironmentVariable("EMAIL_SMTP");
var email_port = Environment.GetEnvironmentVariable("EMAIL_PORT");

if(!string.IsNullOrEmpty(email_smtp) || !string.IsNullOrEmpty(email_smtp))
    Console.WriteLine($"Email SMTP and Port are set. SMTP: {email_smtp}, Port: {email_port}");   
else
    Console.WriteLine("Email SMTP and Port are not set. Please set them in the environment variables.");

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();     
}

app.UseAuthorization();

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyOrigin();
    options.AllowAnyMethod();
});

app.MapControllers();

app.MapHub<SlaveHub>("/slave");
app.MapHub<MasterHub>("/master");

app.Run();