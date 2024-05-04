import {FC} from "react";
import "./AnswerSelection.css"
import {AnswerInputFieldType} from "../AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerSelectionStyle} from "./AnswerSelectionExports.ts";

interface AnswerSelectionProps {
    id: string
    value: string
    type: AnswerInputFieldType
    style: AnswerSelectionStyle
    onClick: (id: string) => void
}

export const AnswerSelection: FC<AnswerSelectionProps> = ({ id, value, type, style, onClick}) => {
    let gemsPath: string;
    switch (type) {
        case AnswerInputFieldType.Diamond:
            gemsPath = "/assets/gems-diamond.svg";
            break;
        case AnswerInputFieldType.Gold:
            gemsPath = "/assets/gems-gold.svg";
            break;
        case AnswerInputFieldType.Quartz:
            gemsPath = "/assets/gems-quartz.svg";
            break;
        case AnswerInputFieldType.Ruby:
            gemsPath = "/assets/gems-ruby.svg";
            break;
        case AnswerInputFieldType.Lapis:
            gemsPath = "/assets/gems-lapis.svg";
            break;
        case AnswerInputFieldType.Amethyst:
            gemsPath = "/assets/gems-amethyst.svg";
            break;
        default:
            return '';
    }

    return (
        <div
            className={`answerSelection ${style}`}
            onClick={() => {onClick(id)}}
        >
            <object type="image/svg+xml" data={gemsPath}></object>
            <p>{value}</p>
            <object type="image/svg+xml" data={gemsPath}></object>
        </div>
    )
}