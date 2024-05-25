import {FC} from "react";
import "./PodiumPlatform.css"
import QuizSessionUserStats from "../../models/QuizSessionUserStats.ts";
import {PodiumPlatformRanking} from "./PodiumPlatformExports.ts";
import {getRandomIcon} from "../../helper/PlayerIconHelper.ts";
import {Question} from "../../models/Question.ts";
import {COIN_ICON_GREEN} from "../../assets/Icons.ts";

interface PodiumPlatformProps {
    userStat: QuizSessionUserStats
    ranking: PodiumPlatformRanking
    questions: Question[]
}

export const PodiumPlatform: FC<PodiumPlatformProps> = ({ userStat, ranking, questions}) => {

    // change image based on ranking
    const rankingIcon1 = (
        <div className={"ranking1"}>
            <img className={"middle"} src={'assets/ranking-1.svg'} alt={''}/>
            <img className={"bottomLeft"} src={'assets/ranking-1-1.svg'} alt={''}/>
            <img className={"bottomRight"} src={'assets/ranking-1-2.svg'} alt={''}/>
            <img className={"top"} src={'assets/ranking-1-3.svg'} alt={''}/>
        </div>
    )
    const rankingIcon2 = (
        <div className={"ranking2"}>
            <img className={"middle"} src={'assets/ranking-2.svg'} alt={''}/>
            <img className={"topLeft"} src={'assets/ranking-2-1.svg'} alt={''}/>
            <img className={"topRight"} src={'assets/ranking-2-2.svg'} alt={''}/>
        </div>
)
    const rankingIcon3 = (
        <img className={"ranking3"} src={'assets/ranking-3.svg'} alt={''}/>
    )

    // get count of correct answers
    const answerLookup: { [key: string]: boolean } = {}
    questions.forEach(question => {
        question.answers.forEach(answer => {
            const key = `${question.id}-${answer.id}`
            answerLookup[key] = answer.correct
        })
    })
    const correctAnswersCount = () => {
        let count = 0
        userStat.answers.forEach(answer => {
            const key = `${answer.questionId}-${answer.answerId}`
            if (answerLookup[key]) {
                count++
            }
        })
        return count
    }

    const isPseudo = (): boolean => {
        return userStat.user.id == ""
    }

    return (
        <div className={"podiumPlatform " + `number${ranking}` + (isPseudo() ? " pseudo" : "")}>
            <img className="icon" src={getRandomIcon(userStat.user)} alt={"player icon"}/>
            <div className="platform">
                <div className="rankAndName">
                    <p>{ranking}</p>
                    {ranking == PodiumPlatformRanking.First ? rankingIcon1 : ranking == PodiumPlatformRanking.Second ? rankingIcon2 : rankingIcon3}
                    <p>{userStat.user.identifier}</p>
                </div>

                <div className="scoreAndAnswersCount">
                    <div className="score">
                        <img src={COIN_ICON_GREEN.path} alt={COIN_ICON_GREEN.path}/>
                        <p>{userStat.score}</p>
                        <img src={COIN_ICON_GREEN.path} alt={COIN_ICON_GREEN.path}/>
                    </div>
                    <p>{`${correctAnswersCount()} out of ${questions.length}`}</p>
                </div>
            </div>
        </div>
    )
}