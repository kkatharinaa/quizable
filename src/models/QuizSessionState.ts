import QuizSessionUserStats, {quizSessionUserStatsArraysAreEqual} from "./QuizSessionUserStats";

export enum QuizState {
    lobby = "lobby",
    playing = "playing",
    statistics = "statistics",
    leaderboard = "leaderboard",
    podium = "podium",
    endscreen = "endscreen",
}

export const getQuizState = (value: string): QuizState | undefined => {
    return Object.values(QuizState).find((key) => QuizState[key] === value) as QuizState;
}

export default interface QuizSessionState {
    currentQuestionId: string,
    usersStats: QuizSessionUserStats[],
    currentQuizState: string
}

export const quizSessionStatesAreEqual = (a: QuizSessionState, b: QuizSessionState): boolean => {
    return a.currentQuestionId === b.currentQuestionId
        && quizSessionUserStatsArraysAreEqual(a.usersStats, b.usersStats)
        && a.currentQuizState === b.currentQuizState
}