namespace QuizApp.Models;

public class QuizSession
{
    public string Id { get; set; }
    public string QuizId { get; set; }
    public QuizSessionState State { get; set; }
    public string DeviceId { get; set; }
    
    public override string ToString()
    {
        return $"{{{Id}, {QuizId}, {State}, {DeviceId}}}";
    }
}