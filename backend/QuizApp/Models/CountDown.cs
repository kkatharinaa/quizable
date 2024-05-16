using System.Diagnostics;

namespace QuizApp.Models;

public class CountDown
{
    public Timer timer { get; set; }
    public int remainingSeconds { get; set; }
    public Stopwatch stopwatch { get; set; } // to know how fast players answered
}