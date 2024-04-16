import {FC} from "react";
import "./QuestionEditor.css"
import {AnswerInputFieldContainer} from "../AnswerInputFieldContainer/AnswerInputFieldContainer.tsx";
import {QuestionInputField} from "../QuestionInputField/QuestionInputField.tsx";
import {ButtonComponent} from "../Button/Button.tsx";
import {DELETE_ICON_DARK, SETTINGS_ICON_DARK} from "../../assets/Icons.ts";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {Answer} from "../../models/Answer.ts";

interface QuestionEditorProps {
    index: number
    questionTitle: string
    answers: Answer[]
    canBeDeleted: boolean
    onTitleChange: (newValue: string) => void
    onSettingsClick: (index: number) => void
    onDelete: (index: number) => void
    onAnswerChange: (newValue: string, index: number) => void
    onAnswerDelete: (index: number) => void
    onAnswerToggleCorrect: (index: number) => void
    onAnswerAdd: () => void
}

export const QuestionEditor: FC<QuestionEditorProps> = ({ index, questionTitle, answers, canBeDeleted, onTitleChange, onSettingsClick, onDelete, onAnswerChange, onAnswerDelete, onAnswerToggleCorrect, onAnswerAdd }) => {
    const handleQuestionDelete = () => {
        onDelete(index)
    }
    const handleOpenSettings = () => {
        onSettingsClick(index)
    }

    return (
        <div className="questionEditor">
            <div className="titleAndSettings">
                <div className="buttons"> {/* invisible for layout purposes*/}
                    <ButtonComponent
                        text=""
                        icon={SETTINGS_ICON_DARK}
                        type={ButtonType.Short}
                        style={ButtonStyle.Disabled}
                    />
                    <ButtonComponent
                        text=""
                        icon={SETTINGS_ICON_DARK}
                        type={ButtonType.Short}
                        style={ButtonStyle.Disabled}
                    />
                </div>
                <QuestionInputField
                    value={questionTitle}
                    onChange={onTitleChange}
                />
                <div className="buttons">
                    <ButtonComponent
                        text="Question Settings"
                        icon={SETTINGS_ICON_DARK}
                        type={ButtonType.Short}
                        style={ButtonStyle.Settings}
                        onClick={handleOpenSettings}
                    />
                    <ButtonComponent
                        text="Delete Question"
                        icon={DELETE_ICON_DARK}
                        type={ButtonType.Short}
                        style={canBeDeleted ? ButtonStyle.Delete : ButtonStyle.DisabledDark}
                        onClick={handleQuestionDelete}
                    />
                </div>
            </div>
            <AnswerInputFieldContainer
                answers={answers}
                onChange={onAnswerChange}
                onDelete={onAnswerDelete}
                onToggleCorrect={onAnswerToggleCorrect}
                onAdd={onAnswerAdd}
            />
        </div>
    )
}