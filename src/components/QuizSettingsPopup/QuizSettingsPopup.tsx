import {FC, useState} from "react";
import "./QuizSettingsPopup.css"
import {ButtonStyle} from "../Button/ButtonExports.ts";
import {Quiz} from "../../models/Quiz.ts";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";
import {QuizName} from "../../models/ConstrainedTypes.ts";
import {InputField} from "../InputField/InputField.tsx";
import {InputFieldType} from "../InputField/InputFieldExports.ts";
import {QuizOptions} from "../../models/QuizOptions.ts";
import {ColourScheme} from "../../models/QuizOptions.ts";
import {SAVE_ICON_DARK, SAVE_ICON_DISABLED, SAVE_ICON_LIGHT} from "../../assets/Icons.ts";
import {formattedDate} from "../../helper/DateFormatter.ts";
import {SettingsField} from "../SettingsField/SettingsField.tsx";
import {SettingsFieldType} from "../SettingsField/SettingsFieldExports.ts";
import {Question} from "../../models/Question.ts";

export interface QuizSettingsPopupProps {
    selectedQuiz: Quiz
    onSave: (id: string, updatedQuiz: Quiz, revertedOverrides: boolean) => void
    onClose: () => void
    onEditQuestions: (id: string) => void
    revertAllOverridesPreselected: boolean
}

export const QuizSettingsPopup: FC<QuizSettingsPopupProps> = ({ selectedQuiz, onSave, onClose, onEditQuestions, revertAllOverridesPreselected}) => {

    const [quizOptions, setQuizOptions] = useState<QuizOptions>(selectedQuiz.options);
    const [quizName, setQuizName] = useState(selectedQuiz.name)
    const [revertAllOverrides, setRevertAllOverrides] = useState(revertAllOverridesPreselected)

    const handleClose = () => {
        if (handleSave()) onClose()
    }
    const handleEditQuestions = () => {
        if (handleSave()) onEditQuestions(selectedQuiz.id)
    }
    const handleSave = () => {
        // try constraining the name before saving
        const name = QuizName.tryMake(quizName)
        if (name == null) {
            // TODO: show error
            return false
        }
        const updatedQuestions = handleRevertOverrides()
        const updatedQuiz = {...selectedQuiz, name: name.value, options: quizOptions, questions: updatedQuestions}
        //setQuiz(updatedQuiz)
        onSave(selectedQuiz.id, updatedQuiz, revertAllOverrides)
        return true
    }
    const handleRevertOverrides = (): Question[] => {
        if (!revertAllOverrides) return selectedQuiz.questions
        const updatedQuestions = [... selectedQuiz.questions]
        updatedQuestions.forEach((question) => {
            question.maxQuestionTime = quizOptions.maxQuestionTime
            question.questionPoints = quizOptions.questionPoints
            question.questionPointsModifier = quizOptions.questionPointsModifier
            question.showLiveStats = quizOptions.showLiveStats
        })
        return updatedQuestions
    }

    const handleQuizNameInputChange = (value: string) => {
        setQuizName(value)
    };

    const handleSettingLeaderboardToggle = () => {
        setQuizOptions({...quizOptions, isLeaderboardBetween: !quizOptions.isLeaderboardBetween})
    }
    const handleSettingMaxQuestionTimeInputChange = (value?: number) => {
        if (value == undefined) return
        if (value > 999) return // dont allow question times over 999 seconds
        setQuizOptions({...quizOptions, maxQuestionTime: value})
    }
    const handleSettingQuestionPointsInputChange = (value?: number) => {
        if (value == undefined) return
        if (value > 9999) return // dont allow points over 9999
        setQuizOptions({...quizOptions, questionPoints: value})
    }
    const handleSettingQuestionPointsModifierInputChange = (value: number) => {
        setQuizOptions({...quizOptions, questionPointsModifier: value})
    }
    const handleSettingQuestionPointsModifierToggle = () => {
        // currently only a toggle, but could be customised even more
        const newValue = quizOptions.questionPointsModifier == 0 ? 1 : 0
        handleSettingQuestionPointsModifierInputChange(newValue)
    }
    const handleSettingLiveStatsToggle = () => {
        setQuizOptions({...quizOptions, showLiveStats: !quizOptions.showLiveStats})
    }
    const handleColourSchemeInputChange = (value: number) => {
        if (!Object.values(ColourScheme).includes(value)) return // TODO: show error
        setQuizOptions({...quizOptions, colourScheme: value})
    }
    const handleColourSchemeToggle = () => {
        // currently only a toggle, because we only have 2 colour schemes, but could be customised even more
        const newValue = quizOptions.colourScheme == 0 ? 1 : 0
        handleColourSchemeInputChange(newValue)
    }
    const handleRevertAllOverridesToggle = () => {
        setRevertAllOverrides(!revertAllOverrides)
    }

    return (
        <div className="popup quizSettingsPopup">
            <div className="popupBackground">
            </div>
            <div className="popupField quizSettingsPopupField">

                <div className="quizSettingsContent">
                    <div className="quizTitleAndText">
                        <InputField
                            value={quizName}
                            onChange={handleQuizNameInputChange}
                            type={InputFieldType.Quizname}
                        />
                        <div className="quizText">
                            <p>{`Total: ${selectedQuiz.questions.length} Question${selectedQuiz.questions.length != 1 ? "s" : ""}`}</p>
                            <p>{`Created on: ${formattedDate(selectedQuiz.createdOn)}`}</p>
                        </div>
                    </div>
                    <div className="quizSettingsAll">
                        <SettingsField
                            text="Show leaderboard while playing the quiz"
                            type={SettingsFieldType.Toggle}
                            currentValue={quizOptions.isLeaderboardBetween}
                            onChange={handleSettingLeaderboardToggle}
                            placeholder={null}/>
                        <SettingsField
                            text="Max time to answer per question"
                            type={SettingsFieldType.NumberInput}
                            currentValue={quizOptions.maxQuestionTime}
                            onChange={handleSettingMaxQuestionTimeInputChange}
                            placeholder={"0 sec"}
                            unitText={"sec"}
                            unlimitedAtO={true}
                        />
                        <SettingsField
                            text="Available points per question"
                            type={SettingsFieldType.NumberInput}
                            currentValue={quizOptions.questionPoints}
                            onChange={handleSettingQuestionPointsInputChange}
                            placeholder={"100"}/>
                        <SettingsField
                            text="Earn more points based on reaction speed"
                            type={SettingsFieldType.Toggle}
                            currentValue={quizOptions.questionPointsModifier}
                            onChange={handleSettingQuestionPointsModifierToggle}
                            placeholder={null}/>
                        <SettingsField
                            text="Show live answer statistics"
                            type={SettingsFieldType.Toggle}
                            currentValue={quizOptions.showLiveStats}
                            onChange={handleSettingLiveStatsToggle}
                            placeholder={null}/>
                        <SettingsField
                            text="Use enterprise/research theme"
                            type={SettingsFieldType.Toggle}
                            currentValue={quizOptions.colourScheme}
                            onChange={handleColourSchemeToggle}
                            placeholder={null}/>
                        <SettingsField
                            text="Revert all individual question setting overrides"
                            type={SettingsFieldType.Toggle}
                            currentValue={revertAllOverrides}
                            onChange={handleRevertAllOverridesToggle}
                            placeholder={null}/>
                    </div>
                </div>
                <div className="quizSettingsNav">
                    <BottomNavBar
                        secondaryButtonText={"Close"}
                        secondaryButtonIcon={quizName == "" ? SAVE_ICON_DISABLED : SAVE_ICON_DARK}
                        primaryButtonText={"Edit Questions"}
                        primaryButtonIcon={quizName == "" ? SAVE_ICON_DISABLED : SAVE_ICON_LIGHT}
                        type={BottomNavBarType.Default}
                        style={BottomNavBarStyle.Medium}
                        onSecondaryClick={handleClose}
                        onPrimaryClick={handleEditQuestions}
                        alternativeSecondaryButtonStyle={quizName == "" ? ButtonStyle.Disabled : undefined}
                        alternativePrimaryButtonStyle={quizName == "" ? ButtonStyle.Disabled : ButtonStyle.Settings}
                    />
                </div>
            </div>
        </div>
    )
}