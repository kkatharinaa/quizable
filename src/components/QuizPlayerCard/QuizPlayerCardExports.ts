export interface QuizPlayerCardProps {
    type?: QuizPlayerCardType,
    playerName: string
    playerScore?: number, 
}

export enum QuizPlayerCardType{
    DesktopNormal = "desktopNormal",
    MobileNormal = "mobileNormal",
    DesktopScore = "desktopScore",
    MobileScore = "mobileScore", 
    DesktopScoreUp = "desktopScoreUp",
    DesktopScoreDown = "desktopScoreDown"
}