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

// 

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port)) {
    builder.WebHost.UseUrls($"http://*:{port}");
}

var email_smtp = Environment.GetEnvironmentVariable("EMAIL_SMTP");
var email_port = Environment.GetEnvironmentVariable("EMAIL_PORT");

if(string.IsNullOrEmpty(email_smtp) || string.IsNullOrEmpty(email_smtp))
{
    DotNetEnv.Env.Load("../../");

    if(string.IsNullOrEmpty(Environment.GetEnvironmentVariable("EMAIL_SMTP"))){
        throw new Exception("Cannot load environment variables. Please check if .env file in root exists.");
    }
}
    

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