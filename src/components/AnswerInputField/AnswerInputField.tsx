import {ChangeEvent, FC} from "react";
import "./AnswerInputField.css"
import {AnswerInputFieldType} from "./AnswerInputFieldExports.ts";

interface AnswerInputFieldProps {
    value: string
    type: AnswerInputFieldType
    index: number
    onChange: ((newValue: string, index: number) => void) | null
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

    const maxCharacters = 100
    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange != null) {
            onChange(event.target.value, index);
        }
    };

    return (
        <div className="answerInputField">
            <object type="image/svg+xml" data={gemsPath} aria-hidden="true"></object>
            { onChange != null &&
                <p className="characterCount">{`${value.length}/${maxCharacters}`}</p>
            }
            {onChange != null &&
                <textarea
                    onChange={handleInputChange}
                    placeholder="Answer"
                    maxLength={maxCharacters}
                    value={value}
                />
            }
            {onChange == null &&
                <p className="fixedValue">{value}</p>
            }
            <object type="image/svg+xml" data={gemsPath} aria-hidden="true"></object>
        </div>
    )
}