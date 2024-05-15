export default interface QuizSessionUserStatsAnswer{
    questionId: string,
    answerId: string,
    pointsReceived: number,
    timeTaken: number,
}

export const quizSessionUserStatsAnswersAreEqual = (a: QuizSessionUserStatsAnswer, b: QuizSessionUserStatsAnswer): boolean => {
    return a.questionId === b.questionId
        && a.answerId === b.answerId
        && a.pointsReceived === b.pointsReceived
        && a.timeTaken === b.timeTaken
}

export const quizSessionUserStatsAnswerArraysAreEqual = (a: QuizSessionUserStatsAnswer[], b: QuizSessionUserStatsAnswer[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!quizSessionUserStatsAnswersAreEqual(a[i],b[i])) return false;
    }
    return true;
}