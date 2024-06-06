import {FC} from "react";
import "./QuizPodium.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_DISABLED, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import QuizSessionUserStats from "../../../models/QuizSessionUserStats.ts";
import {PodiumPlatform} from "../../../components/PodiumPlatform/PodiumPlatform.tsx";
import {ButtonStyle} from "../../../components/Button/ButtonExports.ts";

export const QuizPodium: FC<QuizMasterChildrenProps> = ({endQuizSession, quizSessionManager, buttonClickDisabled}) => {

    const handleContinue = () => {
        // move on to endscreen on which the user can download the report, for this the quizstate needs to be set to endscreen
        QuizSessionManager.getInstance().changeState(QuizState.endscreen)
    }

    const topThree = (): {
        userStat: QuizSessionUserStats,
        rank: number
    }[] => {
        const sortedUsers = quizSessionManager.userStatsOrderedByScore
        let topPlayers: { userStat: QuizSessionUserStats, rank: number }[] = [];

        if (sortedUsers == null) {
            handleContinue()
            return topPlayers
        }

        // first get the top three players
        let rank = 1;
        let previousScore = sortedUsers[0]?.score;
        for (let i = 0; i < sortedUsers.length; i++) {
            if (i > 0 && sortedUsers[i].score < previousScore) rank = i + 1
            topPlayers.push({
                userStat: sortedUsers[i],
                rank: rank
            })
            previousScore = sortedUsers[i].score
            if (rank > 2) break
        }

        // if there are less than 3 players, add pseudo players
        while (topPlayers.length < 3) {
            topPlayers.push({ userStat: {
                    user: {
                        id: "",
                        identifier: "",
                        deviceId: ""
                    },
                    score: 0,
                    answers: []
                }, rank: topPlayers.length+1 });
        }

        // then sort the array so that we get the appropriate podium order
        type RankCount = { [key: number]: number }
        const rankCount: RankCount = topPlayers.reduce<RankCount>((accumulator, player) => {
            accumulator[player.rank] = (accumulator[player.rank] || 0) + 1
            return accumulator
        }, {})
        const uniqueRanks = Object.keys(rankCount).map(Number) // turns sth like { 1: 1, 2: 1, 3: 1 } into [1,2,3]

        if (uniqueRanks.length == 3) {
            // if there are three unique ranks (1,2,3), we want [second, first, third]
            const firstPlace = topPlayers.find(player => player.rank === uniqueRanks[0])
            const secondPlace = topPlayers.find(player => player.rank === uniqueRanks[1])
            const thirdPlace = topPlayers.find(player => player.rank === uniqueRanks[2])
            if (firstPlace != undefined && secondPlace != undefined && thirdPlace != undefined) topPlayers = [secondPlace, firstPlace, thirdPlace]
        } else if (uniqueRanks.length == 2) {
            // if there are two unique ranks...
            if (rankCount[uniqueRanks[0]] == 2) {
                // if there are two first places, we want [first, third, first]
                const firstPlaces = topPlayers.filter(player => player.rank === uniqueRanks[0])
                const secondPlace = topPlayers.find(player => player.rank === uniqueRanks[1])
                if (firstPlaces.length == 2 && secondPlace != undefined) topPlayers = [firstPlaces[0], secondPlace, firstPlaces[1]]
            } else {
                // if there are two second places, we want [second, first, second]
                const firstPlace = topPlayers.find(player => player.rank === uniqueRanks[0])
                const secondPlaces = topPlayers.filter(player => player.rank === uniqueRanks[1])
                if (secondPlaces.length == 2 && firstPlace != undefined) topPlayers = [secondPlaces[0], firstPlace, secondPlaces[1]]
            }
        }

        return topPlayers
    }

    return (
        <div className="quizPodium">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizSessionManager.quizCode}
            />
            <div className="content" tabIndex={0}>
                <h1>Podium</h1>
                <div className="podiumGroup">
                    {topThree().map((player) => (
                        <PodiumPlatform
                            key={player.userStat.user.id}
                            userStat={player.userStat}
                            ranking={player.rank}
                            questions={quizSessionManager.quiz?.questions ?? []}
                        />
                    ))}
                </div>
            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={"Next"}
                primaryButtonIcon={buttonClickDisabled ? SKIP_ICON_DISABLED : SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={endQuizSession}
                onPrimaryClick={buttonClickDisabled ? undefined : handleContinue}
                alternativePrimaryButtonStyle={buttonClickDisabled ? ButtonStyle.Disabled : undefined}
            />
        </div>
    );
}

