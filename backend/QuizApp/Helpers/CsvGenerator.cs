using System.Text;
using QuizApp.Models;

namespace QuizApp.Helpers;

public class CsvGenerator
{
    // Generate the CSV file for the report of a quiz session.
    public string GenerateCsvForUserStats(List<Question> questions, List<QuizSessionUserStats> stats)
    {
        // Prepare the stats to be in order of ranking/leaderboard
        var statsCopy = stats.ToList();
        statsCopy.Sort((a, b) =>
        {
            // Compare by score
            int scoreComparison = b.Score.CompareTo(a.Score);
            if (scoreComparison != 0)
            {
                return scoreComparison;
            }

            // If scores are equal, compare by user nickname alphabetically
            return string.Compare(a.User.Identifier, b.User.Identifier, StringComparison.Ordinal);
        });
        
        var csvBuilder = new StringBuilder();
        // Add headers
        csvBuilder.AppendLine("Ranking,Player,Final Score,Question Index,Question,Selected Answer,Points Received,Time Taken");

        // Add data rows
        for (var i = 0; i < statsCopy.Count; i++)
        {
            QuizSessionUserStats stat = statsCopy[i];

            for (var j = 0; j < stat.Answers.Count; j++)
            {
                QuizSessionUserStatsAnswer userStatsAnswer = stat.Answers[j];

                var rankingIndex = statsCopy.FindIndex(userStat => userStat.Score == stat.Score);
                Question? currentQuestion = questions.Find(question => question.id == userStatsAnswer.QuestionId);
                var currentQuestionIndex = questions.FindIndex(question => question.id == userStatsAnswer.QuestionId);
                Answer? selectedAnswer = currentQuestion?.answers.Find(answer => answer.id == userStatsAnswer.AnswerId);
                
                var ranking = (j == 0) ? (rankingIndex+1).ToString() : ""; // only show the ranking at the first line of this user's stats
                var nickname = (j == 0) ? EscapeCsvField(stat.User.Identifier) : ""; // only show the nickname at the first line of this user's stats
                var score = (j == 0) ? EscapeCsvField(stat.Score.ToString()) : ""; // only show the score at the first line of this user's stats
                var questionIndex = EscapeCsvField((currentQuestionIndex+1).ToString());
                var question = EscapeCsvField(currentQuestion?.questionText ?? userStatsAnswer.QuestionId);
                var answer = EscapeCsvField(selectedAnswer?.value ?? userStatsAnswer.AnswerId);
                var pointsReceived = EscapeCsvField(userStatsAnswer.PointsReceived.ToString());
                var timeTaken = EscapeCsvField(userStatsAnswer.TimeTaken.ToString());

                csvBuilder.AppendLine($"{ranking},{nickname},{score},{questionIndex},{question},{answer},{pointsReceived},{timeTaken}");
            }
        }

        return csvBuilder.ToString();
    }

    private string EscapeCsvField(string field)
    {
        if (!field.Contains(",") && !field.Contains("\"") && !field.Contains("\n") && !field.Contains("\r"))
            return field;
        
        field = field.Replace("\"", "\"\"");
        field = $"\"{field}\"";
        return field;
    }
}