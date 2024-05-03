export enum ColourScheme {
    Default,
    Professional
}

export interface QuizOptions {
    isLeaderboardBetween: boolean
    maxQuestionTime: number // if 0, the general time allowed for all questions will be unlimited, unless overridden within individual question settings
    questionPoints: number // sets the general points received per question but can be overridden within individual question settings
    questionPointsModifier: number // if 0, no points will be deducted if the user takes longer to answer for every question in the quiz, unless overridden within individual question settings
    showLiveStats: boolean
    colourScheme: ColourScheme
}

export const makeQuizOptions = (isLeaderboardBetween?: boolean, maxQuestionTime?: number, questionPoints?: number, questionPointsModifier?: number, showLiveStats?: boolean, colourScheme?: ColourScheme): QuizOptions => {
    return {
        isLeaderboardBetween: isLeaderboardBetween ?? true,
        maxQuestionTime: maxQuestionTime ?? 60,
        questionPoints: questionPoints ?? 100,
        questionPointsModifier: questionPointsModifier ?? 0,
        showLiveStats: showLiveStats ?? false,
        colourScheme: colourScheme ?? ColourScheme.Default
    }
}

export const quizOptionsAreEqual = (a: QuizOptions, b: QuizOptions): boolean => {
    return a.isLeaderboardBetween === b.isLeaderboardBetween
        && a.maxQuestionTime === b.maxQuestionTime
        && a.questionPoints === b.questionPoints
        && a.questionPointsModifier === b.questionPointsModifier
        && a.showLiveStats === b.showLiveStats
        && a.colourScheme === b.colourScheme
}

export const quizOptionsAreEqualForQuestions = (a: QuizOptions, b: QuizOptions): boolean => {
    return a.maxQuestionTime === b.maxQuestionTime
        && a.questionPoints === b.questionPoints
        && a.questionPointsModifier === b.questionPointsModifier
        && a.showLiveStats === b.showLiveStats
}