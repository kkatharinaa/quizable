namespace QuizApp.Models;

public class QuizSession
{
    private string Id { get; set; }
    private string QuizId { get; set; }
    private QuizSessionState State { get; set; }
    private string DeviceId { get; set; }

    public QuizSession(string id, string quizId, QuizSessionState state, string deviceId)
    {
        Id = id;
        QuizId = quizId;
        State = state;
        DeviceId = deviceId;
    }

    public override string ToString()
    {
        return $"{{{Id}, {QuizId}, {State}, {DeviceId}}}";
    }
}