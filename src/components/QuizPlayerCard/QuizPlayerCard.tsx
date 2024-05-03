import {FC} from "react"
import './QuizPlayerCard.css'
import { QuizPlayerCardProps, QuizPlayerCardType } from "./QuizPlayerCardExports"
import { CHEVRON_DOWN, CHEVRON_UP } from "../../assets/Icons"


export const QuizPlayerCard: FC<QuizPlayerCardProps> = (
    {
        type = QuizPlayerCardType.DesktopScoreUp, 
        playerName,
        playerScore
    }
) => {
    return (
        <div className={`quizPlayerCard ${type}`}>
            <div className={`quizPlayerCardIcon_${type.startsWith("desktop") ? 'desktop' : 'mobile'}`}></div>
            <p>{playerName}</p>
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
                                src={(type.includes("Up")?CHEVRON_UP:CHEVRON_DOWN).path} 
                                alt={(type.includes("Up")?CHEVRON_UP:CHEVRON_DOWN).alt}>
                            </img>
                        }
                    </div>
                </div>
            }
        </div>
    )
}