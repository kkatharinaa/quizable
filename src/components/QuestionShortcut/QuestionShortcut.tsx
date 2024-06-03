import React, {FC} from "react";
import "./QuestionShortcut.css"
import {Question} from "../../models/Question.ts";
import {ThreeDots} from "../ThreeDots/ThreeDots.tsx";
import {ThreeDotsStyle} from "../ThreeDots/ThreeDotsExports.ts";

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

    return (
        <div className={`questionShortcut ${isSelected ? 'questionSelected' : ''}`}
             onClick={handleShortcutClick}
             draggable
             onDragStart={(e) => onDragStart(e, index)}
             onDragOver={onDragOver}
             onDrop={(e) => onDragDrop(e, index)}
             /*onDragEnd={onDragEnd}*/
        >
            <ThreeDots style={isSelected ? ThreeDotsStyle.PrimaryColour : ThreeDotsStyle.PrimaryShadow}/>
            
            <div className="questionCard">
                <p className="questionText" tabIndex={0}>{question.questionText === "" ? "Question" : question.questionText}</p>
                <p className="questionIndex">{index + 1}</p>
            </div>
        </div>
    )
}