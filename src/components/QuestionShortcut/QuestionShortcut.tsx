import {FC} from "react";
import "./QuestionShortcut.css"
import {Question} from "../../models/Question.ts";

interface QuestionShortcutProps {
    index: number;
    question: Question
    isSelected: boolean
    onSelect: (index: number) => void
}

export const QuestionShortcut: FC<QuestionShortcutProps> = ({ index, question, isSelected, onSelect}) => {

    const handleShortcutClick = () => {
        onSelect(index)
    }

    return (
        <div className={`questionShortcut ${isSelected ? 'questionSelected' : ''}`} onClick={handleShortcutClick}>
            <div className="questionCard">
                <p className="questionText">{question.questionText === "" ? "Question" : question.questionText}</p>
                <p className="questionIndex">{index + 1}</p>
            </div>
        </div>
    )
}