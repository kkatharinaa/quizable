import QuizSessionUserStats from "./QuizSessionUserStats";

export enum QuizState {
    Lobby = "lobby",
    Playing = "playing",
    Statistics = "statistics",
    Leaderboard = "leaderboard",
    Podium = "podium",
    EndScreen = "endscreen",
}

export default interface QuizSessionState {
    currentQuestionId: string,
    usersStats: QuizSessionUserStats[],
    currentQuizState: string
}