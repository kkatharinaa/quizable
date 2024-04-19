import {ColourScheme} from "./Enums.ts";

export class QuizOptions {
    // Properties
    public isLeaderboardBetween: boolean
    public maxQuestionTime: number // if 0, the general time allowed for all questions will be unlimited, unless overridden within individual question settings
    public questionPoints: number // sets the general points received per question but can be overridden within individual question settings
    public questionPointsModifier: number // if 0, no points will be deducted if the user takes longer to answer for every question in the quiz, unless overridden within individual question settings
    public showLiveStats: boolean
    public colourScheme: ColourScheme

    static default: QuizOptions = new QuizOptions(true, 60, 100, 0, false, ColourScheme.Default)

    // Constructor
    constructor(isLeaderboardBetween: boolean, maxQuestionTime: number, questionPoints: number, questionPointsModifier: number, showLiveStats: boolean, colourScheme: ColourScheme) {
        this.isLeaderboardBetween = isLeaderboardBetween
        this.maxQuestionTime = maxQuestionTime
        this.questionPoints = questionPoints
        this.questionPointsModifier = questionPointsModifier
        this.showLiveStats = showLiveStats
        this.colourScheme = colourScheme
    }

    public isEqual(other: QuizOptions): boolean {
        return this.isLeaderboardBetween === other.isLeaderboardBetween
            && this.maxQuestionTime === other.maxQuestionTime
            && this.questionPoints === other.questionPoints
            && this.questionPointsModifier === other.questionPointsModifier
            && this.showLiveStats === other.showLiveStats
            && this.colourScheme === other.colourScheme
    }
}