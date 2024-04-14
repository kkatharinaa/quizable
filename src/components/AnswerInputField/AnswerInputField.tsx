import {ChangeEvent, FC} from "react";
import "./AnswerInputField.css"
import {AnswerInputFieldType} from "./AnswerInputFieldExports.ts";

interface AnswerInputFieldProps {
    value: string
    type: AnswerInputFieldType
    index: number
    onChange: (newValue: string, index: number) => void
}

export const AnswerInputField: FC<AnswerInputFieldProps> = ({ value, type, index, onChange}) => {
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

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, index);
    };

    return (
        <div className="answerInputField">
            <object type="image/svg+xml" data={gemsPath}></object>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="Answer"
            />
            <object type="image/svg+xml" data={gemsPath}></object>
        </div>
    )
}