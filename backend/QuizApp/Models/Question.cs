namespace QuizApp.Models;

public class Question
{
    public string id { get; set; }
    public string questionText { get; set; }
    public List<Answer> answers { get; set; }
    public int maxQuestionTime { get; set; } // if 0, the time allowed for this question will be unlimited
    public int questionPoints { get; set; }
    public int questionPointsModifier { get; set; } // if 0, no points will be deducted if the user takes longer to answer
    public QuestionType questionType { get; set; } 
    public bool showLiveStats { get; set; }

    public override string ToString()
    {
        return $"Text: {questionText}\n";
    }
}