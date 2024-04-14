import {FC} from "react";
import "./AnswerInputFieldWithActions.css"
import {AnswerInputFieldType} from "../AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerInputField} from "../AnswerInputField/AnswerInputField.tsx";
import {DELETE_ICON_DARK, TICK_ICON_DARK} from "../../assets/Icons.ts";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";

interface AnswerInputFieldWithActionsProps {
    value: string
    type: AnswerInputFieldType
    correct: boolean
    index: number
    canBeDeleted: boolean
    onChange: (newValue: string, index: number) => void
    onDelete: (index: number) => void
    onToggleCorrect: (index: number) => void
}

export const AnswerInputFieldWithActions: FC<AnswerInputFieldWithActionsProps> = ({ value, type, correct, index, canBeDeleted, onChange, onDelete, onToggleCorrect}) => {

    const handleDelete = () => {
        onDelete(index)
    }

    const handleToggleCorrect = () => {
        onToggleCorrect(index)
    }

    return (
        <div className="answerInputFieldWithActions">
            <AnswerInputField
                value={value}
                type={type}
                index={index}
                onChange={onChange}
            />
            <div className="buttons">
                <ButtonComponent
                    text="Delete Answer"
                    icon={DELETE_ICON_DARK}
                    type={ButtonType.Short}
                    style={canBeDeleted ? ButtonStyle.Delete : ButtonStyle.DisabledDark}
                    onClick={handleDelete}
                />
                <ButtonComponent
                    text="Correct Answer"
                    icon={TICK_ICON_DARK}
                    type={ButtonType.Medium}
                    style={correct ? ButtonStyle.Correct : ButtonStyle.Disabled}
                    onClick={handleToggleCorrect}
                />
            </div>
        </div>
    )
}