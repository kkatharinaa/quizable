import {ColourScheme} from "./Enums.ts";

// TODO: move somewhere else? / adjust so it fits everyone's needs
export class QuizOptions {
    // Properties
    public isLeaderboardBetween: boolean
    public hasPointsForTime: boolean
    public hasRestrictedTime: boolean
    public showLiveStats: boolean
    public colourScheme: ColourScheme

    static default: QuizOptions = new QuizOptions(true, false, false, false, ColourScheme.Default)

    // Constructor
    constructor(isLeaderboardBetween: boolean, hasPointsForTime: boolean, hasRestrictedTime: boolean, showLiveStats: boolean, colourScheme: ColourScheme) {
        this.isLeaderboardBetween = isLeaderboardBetween
        this.hasPointsForTime = hasPointsForTime
        this.hasRestrictedTime = hasRestrictedTime
        this.showLiveStats = showLiveStats
        this.colourScheme = colourScheme
    }
}