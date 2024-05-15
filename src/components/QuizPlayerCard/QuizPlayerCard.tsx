import {FC} from "react"
import './QuizPlayerCard.css'
import { QuizPlayerCardProps, QuizPlayerCardType } from "./QuizPlayerCardExports"
import { CHEVRONDOWN_ICON_RED, CHEVRONUP_ICON_GREEN } from "../../assets/Icons"


export const QuizPlayerCard: FC<QuizPlayerCardProps> = (
    {
        type = QuizPlayerCardType.DesktopNormal,
        playerName,
        playerScore
    }
) => {
    return (
        <div className={`quizPlayerCard ${type}`}>
            <div className="quizPlayerCardIconAndName">
                <div className={`quizPlayerCardIcon_${type.startsWith("desktop") ? 'desktop' : 'mobile'}`}></div>
                <p>{playerName}</p>
            </div>
            {playerScore != null &&
                <div className="quizPlayerCardScore">
                    <p
                        className={`quizPlayerCardScoreText`}
                        style={{
                            opacity: type.includes("Score")? 1:0,
                            color: type.includes("Up")? 'var(--correct-button)':type.includes("Down")?'var(--delete-button)':'var(--white)',
                        }}>
                        {playerScore}
                    </p>
                    <div className={`quizPlayerCardScoreArrow`}>
                        {(type.includes("Up") || type.includes("Down")) && 
                            <img 
                                src={(type.includes("Up")?CHEVRONUP_ICON_GREEN:CHEVRONDOWN_ICON_RED).path}
                                alt={(type.includes("Up")?CHEVRONUP_ICON_GREEN:CHEVRONDOWN_ICON_RED).alt}>
                            </img>
                        }
                    </div>
                </div>
            }
        </div>
    )
}