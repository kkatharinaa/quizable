import React, {FC} from "react";
import "./AnswerInputFieldContainer.css"
import {getAnswerInputFieldTypeForIndex} from "../AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerInputFieldWithActions} from "../AnswerInputFieldWithActions/AnswerInputFieldWithActions.tsx";
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {Answer} from "../../models/Answer.ts";
import {ADD_ICON_DARK} from "../../assets/Icons.ts";

interface AnswerInputFieldContainerProps {
    answers: Answer[]
    onChange: (newValue: string, index: number) => void
    onDelete: (index: number) => void
    onToggleCorrect: (index: number) => void
    onAdd: () => void
    onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void
}

export const AnswerInputFieldContainer: FC<AnswerInputFieldContainerProps> = ({ answers, onChange, onDelete, onToggleCorrect, onAdd, onDragStart, onDragOver, onDragDrop }) => {

    return (
        <div className="answerInputFieldContainer">
            {answers.map((item, index) => (
                <AnswerInputFieldWithActions
                    key={item.id}
                    value={item.value}
                    type={getAnswerInputFieldTypeForIndex(index)}
                    correct={item.correct}
                    index={index}
                    canBeDeleted={(answers.length>2)}
                    onChange={onChange}
                    onDelete={onDelete}
                    onToggleCorrect={onToggleCorrect}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragDrop={onDragDrop}
                />
            ))}

            { answers.length < 6 &&
            <div className="filler">
                <ButtonComponent
                    text={"Add One More Answer"}
                    icon={ADD_ICON_DARK}
                    type={ButtonType.Medium}
                    style={ButtonStyle.Accent}
                    onClick={onAdd}
                />
            </div>
            }
            { (answers.length % 2 == 0 && answers.length < 6) &&
                <div className="filler"></div>
            } {/* empty div for layout purposes*/}
        </div>
    )
}