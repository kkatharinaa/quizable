
// TODO: move somewhere else? / adjust so it fits everyone's needs
export class QuizOptions {
    // Properties
    public isLeaderboardBetween: boolean
    public hasPointsForTime: boolean
    public hasRestrictedTime: boolean
    public showLiveStats: boolean

    static default: QuizOptions = new QuizOptions(true, false, false, false)

    // Constructor
    constructor(isLeaderboardBetween: boolean, hasPointsForTime: boolean, hasRestrictedTime: boolean, showLiveStats: boolean) {
        this.isLeaderboardBetween = isLeaderboardBetween
        this.hasPointsForTime = hasPointsForTime
        this.hasRestrictedTime = hasRestrictedTime
        this.showLiveStats = showLiveStats
    }
}