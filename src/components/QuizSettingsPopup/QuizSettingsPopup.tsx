import {FC, useState} from "react";
import "./QuizSettingsPopup.css"
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {Quiz} from "../../models/Quiz.ts";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";
import {QuizName} from "../../models/ConstrainedTypes.ts";
import {InputField} from "../InputField/InputField.tsx";
import {InputFieldType} from "../InputField/InputFieldExports.ts";

export interface QuizSettingsPopupProps {
    selectedQuiz: Quiz
    onSave: (id: string, updatedQuiz: Quiz) => void
    onClose: () => void
    onEditQuestions: (id: string) => void
}

export const QuizSettingsPopup: FC<QuizSettingsPopupProps> = ({ selectedQuiz, onSave, onClose, onEditQuestions}) => {

    const [quiz, setQuiz] = useState<Quiz>(selectedQuiz);
    const [quizName, setQuizName] = useState(selectedQuiz.name.value)

    const handleClose = () => {
        if (handleSave()) onClose()
    }
    const handleEditQuestions = () => {
        if (handleSave()) onEditQuestions(quiz.id)
    }
    const handleSave = () => {
        // try constraining the name before saving
        const name = QuizName.tryMake(quizName)
        if (name == null) {
            // TODO: show error
            return false
        }
        const updatedQuiz = {...quiz, name: name}
        //setQuiz(updatedQuiz)
        onSave(quiz.id, updatedQuiz)
        return true
    }
    const handleQuizNameInputChange = (value: string) => {
        setQuizName(value)
    };

    // TODO: adjust design + css based on figma and add missing functionality

    return (
        <div className="popup quizSettingsPopup">
            <div className="popupBackground">
            </div>
            <div className="popupField quizSettingsPopupField">

                <div className="quizSettings">
                    <InputField
                        value={quizName}
                        onChange={handleQuizNameInputChange}
                        type={InputFieldType.Quizname}
                    />
                    <ButtonComponent
                        text={"Edit Questions"}
                        icon={null}
                        type={ButtonType.Long}
                        style={ButtonStyle.Settings}
                        onClick={handleEditQuestions}
                    />
                </div>
                <div className="quizSettingsNav">
                    <BottomNavBar
                        secondaryButtonText={"Save and Close"}
                        secondaryButtonIcon={null}
                        primaryButtonText={""}
                        primaryButtonIcon={null}
                        type={BottomNavBarType.SecondaryOnly}
                        onSecondaryClick={handleClose}
                    />
                </div>
            </div>
        </div>
    )
}