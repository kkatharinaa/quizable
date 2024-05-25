import {FC} from "react"
import './QuizPlayerCard.css'
import { QuizPlayerCardType } from "./QuizPlayerCardExports"
import { CHEVRONDOWN_ICON_RED, CHEVRONUP_ICON_GREEN } from "../../assets/Icons"
import {getRandomIcon} from "../../helper/PlayerIconHelper.ts";
import QuizUser from "../../models/QuizUser.ts";

export interface QuizPlayerCardProps {
    type?: QuizPlayerCardType,
    quizUser: QuizUser
    score?: number,
}

export const QuizPlayerCard: FC<QuizPlayerCardProps> = (
    {
        type = QuizPlayerCardType.DesktopNormal,
        quizUser,
        score
    }
) => {
    return (
        <div className={`quizPlayerCard ${type}`}>
            <div className="quizPlayerCardIconAndName">
                <img className={`quizPlayerCardIcon_${type.startsWith("desktop") ? 'desktop' : 'mobile'}`} src={getRandomIcon(quizUser)} alt={"player icon"}/>
                <p>{quizUser.identifier}</p>
            </div>
            {score != null &&
                <div className="quizPlayerCardScore">
                    <p
                        className={`quizPlayerCardScoreText`}
                        style={{
                            opacity: type.includes("Score")? 1:0,
                            color: type.includes("Up")? 'var(--correct-button)':type.includes("Down")?'var(--delete-button)':'var(--white)',
                        }}>
                        {score}
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