import {FC, useEffect} from "react";
import "./QuizLeaderboard.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";
import {QuizPlayerCard} from "../../../components/QuizPlayerCard/QuizPlayerCard.tsx";
import {QuizPlayerCardType} from "../../../components/QuizPlayerCard/QuizPlayerCardExports.ts";
import QuizSessionUserStats from "../../../models/QuizSessionUserStats.ts";

enum LeaderboardChange {
    MovedUp,
    Stayed,
    MovedDown
}

export const QuizLeaderboard: FC<QuizMasterChildrenProps> = ({endQuizSession, quizSessionManager}) => {

    const handleContinue = () => {
        // move on to next question, for this the currentQuestionId of the quizsession has to be set to the id of the next question in the questionsarray of the quiz, and the quizstate has to be set to playing
        // however if this is the last question in the questionsarray of the quiz, instead move on to the podium screen by setting the quizstate to podium
        QuizSessionManager.getInstance().toNextQuestionOrEnd(false)
    }

    const getLeaderboardChange = (userStat: QuizSessionUserStats): LeaderboardChange => {
        if (quizSessionManager.currentQuestionIsFirstQuestion) return LeaderboardChange.Stayed

        const currentPosition = quizSessionManager.userStatsOrderedByScore?.findIndex(stats => stats.user.id === userStat.user.id)
        const previousPosition = quizSessionManager.userStatsOrderedByScoreWithoutCurrentQuestion?.findIndex(stats => stats.user.id === userStat.user.id)

        if (currentPosition == undefined || previousPosition == undefined) return LeaderboardChange.Stayed

        if (currentPosition < previousPosition) return LeaderboardChange.MovedUp
        if (currentPosition > previousPosition) return LeaderboardChange.MovedDown

        return LeaderboardChange.Stayed
    }

    const getQuizPlayerCardType = (userStat: QuizSessionUserStats): QuizPlayerCardType => {
        const leaderboardChange = getLeaderboardChange(userStat)

        switch (leaderboardChange) {
            case LeaderboardChange.MovedUp:
                return QuizPlayerCardType.DesktopScoreUp
            case LeaderboardChange.MovedDown:
                return QuizPlayerCardType.DesktopScoreDown
            case LeaderboardChange.Stayed:
                return QuizPlayerCardType.DesktopScore
        }
    }

    const showLeaderboard = () => {
        return quizSessionManager.quiz?.options.isLeaderboardBetween ||
            quizSessionManager.quiz?.questions[quizSessionManager.quiz?.questions.length-1].id == quizSessionManager.quizSession?.state.currentQuestionId
    }

    useEffect(() => {
        // skip this page if the quizoption says so and we are not on the very last question
        if (!showLeaderboard()) {
            handleContinue()
            return
        }
    }, []);

    return (
        <div className="quizLeaderboard">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizSessionManager.quizCode}
            />
            { showLeaderboard() &&
            <div className="content">
                <h1>Leaderboard</h1>
                <div className="usersList">
                    {quizSessionManager.userStats?.map((userStat) => (
                        <QuizPlayerCard
                            key={userStat.user.id}
                            type={getQuizPlayerCardType(userStat)}
                            playerName={userStat.user.identifier}
                            playerScore={userStat.score}>
                        </QuizPlayerCard>
                    ))}
                </div>
            </div>
            }

            { showLeaderboard() &&
            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={"Next"}
                primaryButtonIcon={SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={endQuizSession}
                onPrimaryClick={handleContinue}
            />
            }
        </div>
    );
}

