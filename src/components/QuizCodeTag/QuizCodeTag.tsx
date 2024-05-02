import {FC} from "react";
import "./QuizCodeTag.css"

export interface QuizCodeTagProps {
    code: string
}

export const QuizCodeTag: FC<QuizCodeTagProps> = ({ code }) => {

    return (
        <div className="quizCodeTag">
            <p className="code">{code}</p>
        </div>
    );
}

