namespace QuizApp.Models;

public enum ColourScheme {
    Default,
    Professional
} 

public class QuizOptions
{
    public bool IsLeaderboardBetween;
    
    /// <summary>
    ///  if 0, the general time allowed for all questions will be unlimited, unless overridden within individual question settings
    /// </summary>
    public int MaxQuestionTime;
    
    /// <summary>
    /// sets the general points received per question but can be overridden within individual question settings
    /// </summary>
    public int QuestionPoints;
    
    /// <summary>
    /// if 0, no points will be deducted if the user takes longer to answer for every question in the quiz, unless overridden within individual question settings
    /// </summary>
    public int QuestionPointsModifier; 
    
    public bool ShowLiveStats;
    
    public ColourScheme ColourScheme;
}