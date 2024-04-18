import React, {FC} from "react";
import "./AnswerInputFieldWithActions.css"
import {AnswerInputFieldType} from "../AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerInputField} from "../AnswerInputField/AnswerInputField.tsx";
import {DELETE_ICON_DARK, DELETE_ICON_DISABLED, TICK_ICON_DARK} from "../../assets/Icons.ts";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";
import {ThreeDotsStyle} from "../ThreeDots/ThreeDotsExports.ts";
import {ThreeDots} from "../ThreeDots/ThreeDots.tsx";

interface AnswerInputFieldWithActionsProps {
    value: string
    type: AnswerInputFieldType
    correct: boolean
    index: number
    canBeDeleted: boolean
    onChange: (newValue: string, index: number) => void
    onDelete: (index: number) => void
    onToggleCorrect: (index: number) => void
    onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void
}

export const AnswerInputFieldWithActions: FC<AnswerInputFieldWithActionsProps> = ({ value, type, correct, index, canBeDeleted, onChange, onDelete, onToggleCorrect, onDragStart, onDragOver, onDragDrop }) => {

    const handleDelete = () => {
        if (canBeDeleted) onDelete(index)
    }

    const handleToggleCorrect = () => {
        onToggleCorrect(index)
    }

    return (
        <div className="answerInputFieldWithActions"
             draggable
             onDragStart={(e) => onDragStart(e, index)}
             onDragOver={onDragOver}
             onDrop={(e) => onDragDrop(e, index)}
            /*onDragEnd={onDragEnd}*/
        >
            <ThreeDots style={ThreeDotsStyle.TextfieldText}/>
            <AnswerInputField
                value={value}
                type={type}
                index={index}
                onChange={onChange}
            />
            <div className="buttons">
                <ButtonComponent
                    text="Delete Answer"
                    icon={canBeDeleted ? DELETE_ICON_DARK : DELETE_ICON_DISABLED}
                    type={ButtonType.Short}
                    style={canBeDeleted ? ButtonStyle.Delete : ButtonStyle.Disabled}
                    onClick={handleDelete}
                />
                <ButtonComponent
                    text={correct ? "Correct Answer" : "Correct Answer?"}
                    icon={correct ? TICK_ICON_DARK : null}
                    type={ButtonType.Medium}
                    style={correct ? ButtonStyle.Correct : ButtonStyle.Disabled}
                    onClick={handleToggleCorrect}
                />
            </div>
        </div>
    )
}