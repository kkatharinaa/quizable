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
    index: number
    selectedQuiz: Quiz
    onSave: (index: number, updatedQuiz: Quiz) => number
    onClose: () => void
    onEditQuestions: (index: number) => void
}

export const QuizSettingsPopup: FC<QuizSettingsPopupProps> = ({ index, selectedQuiz, onSave, onClose, onEditQuestions}) => {

    const [quiz, setQuiz] = useState<Quiz>(selectedQuiz);
    const [quizName, setQuizName] = useState(selectedQuiz.name.value)

    const handleClose = () => {
        if (handleSave() != null) onClose()
    }
    const handleEditQuestions = () => {
        const newIndex = handleSave()
        if (newIndex != null) onEditQuestions(newIndex)
    }
    const handleSave = () => {
        // try constraining the name before saving
        const name = QuizName.tryMake(quizName)
        if (name == null) {
            // TODO: show error
            return null
        }
        const updatedQuiz = {...quiz, name: name}
        //setQuiz(updatedQuiz)
        return onSave(index, updatedQuiz)
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