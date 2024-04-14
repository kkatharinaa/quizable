import {FC, useState} from "react";
import "./CreateEditor.css"
import {Quiz} from "../../../models/Quiz.ts";
import {QuizName} from "../../../models/ConstrainedTypes.ts";
import {QuizOptions} from "../../../models/QuizOptions.ts";
import {AuthenticatedUser} from "../../../models/AuthenticatedUser.ts";
import {Question} from "../../../models/Question.ts";
import {ButtonComponent} from "../../../components/Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../../../components/Button/ButtonExports.ts";
import {SAVE_ICON_LIGHT} from "../../../assets/Icons.ts";
import { getAnswerInputFieldTypeForIndex } from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import { AnswerInputFieldWithActions } from "../../../components/AnswerInputFieldWithActions/AnswerInputFieldWithActions.tsx";

interface CreateEditorProps {
    quizID: string;
}

export const CreateEditor: FC<CreateEditorProps> = ({quizID}) => {
    // TODO: get quiz from Firebase using the quizID - rn I assume that before we reach the quizeditor screen, there will be the quiz detail popup, in which i first choose my quiz's title and settings, and it already gets saved like that with no questions to firebase. only if i click on a button there it will take me to this editor
    // so far we dont have firebase implemented, so just use a fake quiz
    const originalQuiz: Quiz = new Quiz(quizID, QuizName.tryMake("Untitled Quiz")!, [], QuizOptions.default, AuthenticatedUser.default, new Date(), null)

    //const [quiz, setQuiz] = useState<Quiz>(originalQuiz);
    const [questions, setQuestions] = useState<Question[]>(originalQuiz.questions);
    const [answerValues, setAnswerValues] = useState([""]);
    const [correctIndex, setCorrectIndex] = useState(0);

    const handleAnswerInputChange = (value: string, index: number) => {
        const updatedAnswers = [...answerValues]
        updatedAnswers[index] = value
        setAnswerValues(updatedAnswers)
    };
    const handleAnswerDelete = (index: number) => {
        const updatedAnswers = [...answerValues]
        updatedAnswers.splice(index, 1);
        setAnswerValues(updatedAnswers)
    }
    const handleAnswerToggleCorrect = (index: number) => {
        setCorrectIndex(index)
    }

    // functions
    const saveQuiz = () => {
        // TODO: turn answers and questions into actual answers and questions
        // TODO: save changed questions to firebase
    };

    return (
        <div className="page_styling vertical">

            <ButtonComponent
                text="Save Quiz"
                icon={SAVE_ICON_LIGHT}
                type={ButtonType.Long}
                style={ButtonStyle.Primary}
                onClick={saveQuiz}
            />
            {answerValues.map((item, index) => (
                <AnswerInputFieldWithActions
                    key={index}
                    value={item}
                    type={getAnswerInputFieldTypeForIndex(index)}
                    correct={(correctIndex == index)}
                    index={index}
                    canBeDeleted={(answerValues.length>2)}
                    onChange={handleAnswerInputChange}
                    onDelete={handleAnswerDelete}
                    onToggleCorrect={handleAnswerToggleCorrect}
                />
            ))}
        </div>
    )
}