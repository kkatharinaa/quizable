import QuizSessionUserStats from "./QuizSessionUserStats";

export enum QuizState {
    Playing,
    Statistics,
    Leaderboard,
    Podium,
    EndScreen
}

export default interface QuizSessionState {
    currentQuestionId: string,
    usersStats: QuizSessionUserStats[],
    currentQuizState: string
}