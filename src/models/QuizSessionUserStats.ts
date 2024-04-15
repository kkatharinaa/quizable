import QuizSessionUserStatsAnswer from "./QuizSessionUserStatsAnswer";
import QuizUser from "./QuizUser";

export default interface QuizSessionUserStats {
    user: QuizUser
    score: number
    answers: QuizSessionUserStatsAnswer[]
}