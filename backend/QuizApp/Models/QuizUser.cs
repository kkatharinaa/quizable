namespace QuizApp.Models;

public class QuizUser
{
    private string Id { get; set; }
    private string Identifier { get; set; }
    private string DeviceId { get; set; }

    public QuizUser(string id, string identifier, string deviceId)
    {
        Id = id;
        Identifier = identifier;
        DeviceId = deviceId;
    }
}