import React, {FC, useRef} from "react";
import "./QuestionEditorNav.css"
import {Question} from "../../models/Question.ts";
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {QuestionShortcut} from "../QuestionShortcut/QuestionShortcut.tsx";
import {ADD_ICON_DARK} from "../../assets/Icons.ts";

interface QuestionEditorNavProps {
    questions: Question[]
    currentQuestionIndex: number
    onSelect: (index: number) => void
    onAdd: () => void
    onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void
    questionShortcutsRef: React.MutableRefObject<HTMLDivElement | null>
}

export const QuestionEditorNav: FC<QuestionEditorNavProps> = ({ questions, currentQuestionIndex, onSelect, onAdd, onDragStart, onDragOver, onDragDrop, questionShortcutsRef }) => {

    return (
        <div className="questionEditorNav">
            <ButtonComponent
                text="Add"
                icon={ADD_ICON_DARK}
                type={ButtonType.Medium}
                style={ButtonStyle.Accent}
                onClick={onAdd}
            />
            <div className="questionShortcuts" ref={questionShortcutsRef}>
                {questions.map((item, index) => (
                    <QuestionShortcut
                        key={item.id}
                        index={index}
                        question={item}
                        isSelected={currentQuestionIndex == index}
                        onSelect={onSelect}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragDrop={onDragDrop}
                    />
                ))}
            </div>
        </div>
    )
}