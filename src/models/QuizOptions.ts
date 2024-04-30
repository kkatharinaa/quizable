export enum ColourScheme {
    Default,
    Professional
}

export class QuizOptions {
    // Properties
    public isLeaderboardBetween: boolean
    public maxQuestionTime: number // if 0, the general time allowed for all questions will be unlimited, unless overridden within individual question settings
    public questionPoints: number // sets the general points received per question but can be overridden within individual question settings
    public questionPointsModifier: number // if 0, no points will be deducted if the user takes longer to answer for every question in the quiz, unless overridden within individual question settings
    public showLiveStats: boolean
    public colourScheme: ColourScheme

    // Constructor
    constructor(isLeaderboardBetween?: boolean, maxQuestionTime?: number, questionPoints?: number, questionPointsModifier?: number, showLiveStats?: boolean, colourScheme?: ColourScheme) {
        this.isLeaderboardBetween = isLeaderboardBetween ?? true
        this.maxQuestionTime = maxQuestionTime ?? 60
        this.questionPoints = questionPoints ?? 100
        this.questionPointsModifier = questionPointsModifier ?? 0
        this.showLiveStats = showLiveStats ?? false
        this.colourScheme = colourScheme ?? ColourScheme.Default
    }

    static isEqual(a: QuizOptions, b: QuizOptions): boolean {
        return a.isLeaderboardBetween === b.isLeaderboardBetween
            && a.maxQuestionTime === b.maxQuestionTime
            && a.questionPoints === b.questionPoints
            && a.questionPointsModifier === b.questionPointsModifier
            && a.showLiveStats === b.showLiveStats
            && a.colourScheme === b.colourScheme
    }
    static isEqualForQuestions(a: QuizOptions, b: QuizOptions): boolean {
        return a.maxQuestionTime === b.maxQuestionTime
            && a.questionPoints === b.questionPoints
            && a.questionPointsModifier === b.questionPointsModifier
            && a.showLiveStats === b.showLiveStats
    }
}