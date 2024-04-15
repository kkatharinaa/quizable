import QuizSessionUserStats from "./QuizSessionUserStats";

export default interface QuizSessionState {
    currentQuestionId: string,
    usersStats: QuizSessionUserStats[],
    currentQuizState: string
}