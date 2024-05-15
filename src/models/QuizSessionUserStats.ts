import QuizSessionUserStatsAnswer, {quizSessionUserStatsAnswerArraysAreEqual} from "./QuizSessionUserStatsAnswer";
import QuizUser, {quizUsersAreEqual} from "./QuizUser";

export default interface QuizSessionUserStats {
    user: QuizUser
    score: number
    answers: QuizSessionUserStatsAnswer[]
}

export const quizSessionUserStatsAreEqual = (a: QuizSessionUserStats, b: QuizSessionUserStats): boolean => {
    return quizUsersAreEqual(a.user, b.user)
        && a.score === b.score
        && quizSessionUserStatsAnswerArraysAreEqual(a.answers, b.answers)
}

export const quizSessionUserStatsArraysAreEqual = (a: QuizSessionUserStats[], b: QuizSessionUserStats[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!quizSessionUserStatsAreEqual(a[i],b[i])) return false;
    }
    return true;
}