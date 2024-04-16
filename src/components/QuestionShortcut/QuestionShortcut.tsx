import React, {FC} from "react";
import "./QuestionShortcut.css"
import {Question} from "../../models/Question.ts";

interface QuestionShortcutProps {
    index: number;
    question: Question
    isSelected: boolean
    onSelect: (index: number) => void
    onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void
}

export const QuestionShortcut: FC<QuestionShortcutProps> = ({ index, question, isSelected, onSelect, onDragStart, onDragOver, onDragDrop }) => {

    const handleShortcutClick = () => {
        onSelect(index)
    }

    //TODO: indicate that it is able to be dragged?

    return (
        <div className={`questionShortcut ${isSelected ? 'questionSelected' : ''}`}
             onClick={handleShortcutClick}
             draggable
             onDragStart={(e) => onDragStart(e, index)}
             onDragOver={onDragOver}
             onDrop={(e) => onDragDrop(e, index)}
             /*onDragEnd={onDragEnd}*/
        >
            <div className="questionCard">
                <p className="questionText">{question.questionText === "" ? "Question" : question.questionText}</p>
                <p className="questionIndex">{index + 1}</p>
            </div>
        </div>
    )
}