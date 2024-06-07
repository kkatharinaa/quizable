import {FC} from "react";
import "./StatisticsBar.css"
import {TICK_ICON_LIGHT} from "../../assets/Icons.ts";
import {AnswerInputFieldType} from "../AnswerInputField/AnswerInputFieldExports.ts";

interface StatisticsBarProps {
    value: string
    type: AnswerInputFieldType
    answerCount: number
    totalAnswersCount: number
    correct: boolean
}

export const StatisticsBar: FC<StatisticsBarProps> = ({ value, type, answerCount, totalAnswersCount, correct}) => {
    let className: string = "diamond";
    switch (type) {
        case AnswerInputFieldType.Diamond:
            break;
        case AnswerInputFieldType.Gold:
            className = "gold";
            break;
        case AnswerInputFieldType.Quartz:
            className = "quartz";
            break;
        case AnswerInputFieldType.Ruby:
            className = "ruby";
            break;
        case AnswerInputFieldType.Lapis:
            className = "lapis";
            break;
        case AnswerInputFieldType.Amethyst:
            className = "amethyst";
            break;
    }
    const gemsPath: string = `/assets/gems-${className}.svg`;

    const height = (answerCount / totalAnswersCount) * 275 // set max height of bar here

    return (
        <div className={`statisticsBar ${correct ? "correct" : ""}`}>
            <div className="countAndCorrect">
                <p>{answerCount}</p>
                { correct &&
                    <img src={TICK_ICON_LIGHT.path} alt={TICK_ICON_LIGHT.alt}/>
                }
            </div>
            <div className={`bar ${className}`} style={{ height: `${height}px` }}>
            </div>
            <div className="answerValue">
                <object type="image/svg+xml" data={gemsPath} aria-hidden="true"></object>
                <p>{value}</p>
                <object type="image/svg+xml" data={gemsPath} aria-hidden="true"></object>
            </div>
        </div>
    )
}