import {FC, useState} from "react";
import "./QuestionSettingsPopup.css"
import {ButtonStyle} from "../Button/ButtonExports.ts";
import {Quiz} from "../../models/Quiz.ts";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";
import {SAVE_ICON_LIGHT} from "../../assets/Icons.ts";
import {SettingsField} from "../SettingsField/SettingsField.tsx";
import {SettingsFieldType} from "../SettingsField/SettingsFieldExports.ts";
import {Question} from "../../models/Question.ts";

export interface QuestionSettingsPopupProps {
    selectedQuestion: Question
    onClose: (updatedQuestion: Question) => void
    quiz: Quiz
}

export const QuestionSettingsPopup: FC<QuestionSettingsPopupProps> = ({ selectedQuestion, onClose, quiz}) => {

    const [question, setQuestion] = useState<Question>(selectedQuestion);

    const handleClose = () => {
        onClose(question)
    }
    const handleRevert = () => {
        setQuestion({...question, maxQuestionTime: quiz.options.maxQuestionTime, questionPoints: quiz.options.questionPoints, questionPointsModifier: quiz.options.questionPointsModifier, showLiveStats: quiz.options.showLiveStats})
    }
    const questionSettingsAreTheSameAsQuizSettings = (): boolean => {
        return (question.maxQuestionTime == quiz.options.maxQuestionTime) &&
            (question.questionPoints == quiz.options.questionPoints) &&
            (question.questionPointsModifier == quiz.options.questionPointsModifier) &&
            (question.showLiveStats == quiz.options.showLiveStats)
    }

    const handleSettingMaxQuestionTimeInputChange = (value?: number) => {
        if (value == undefined) return
        if (value > 999) return // dont allow question times over 999 seconds
        setQuestion({...question, maxQuestionTime: value})
    }
    const handleSettingQuestionPointsInputChange = (value?: number) => {
        if (value == undefined) return
        if (value > 9999) return // dont allow points over 9999
        setQuestion({...question, questionPoints: value})
    }
    const handleSettingQuestionPointsModifierInputChange = (value: number) => {
        setQuestion({...question, questionPointsModifier: value})
    }
    const handleSettingQuestionPointsModifierToggle = () => {
        // currently only a toggle, but could be customised even more
        const newValue = question.questionPointsModifier == 0 ? 1 : 0
        handleSettingQuestionPointsModifierInputChange(newValue)
    }
    const handleSettingLiveStatsToggle = () => {
        setQuestion({...question, showLiveStats: !question.showLiveStats})
    }

    return (
        <div className="popup questionSettingsPopup">
            <div className="popupBackground">
            </div>
            <div className="popupField questionSettingsPopupField">

                <div className="questionSettingsContent">
                    <div className="questionSettingsAll">
                        <SettingsField
                            text="Max time to answer this question"
                            type={SettingsFieldType.NumberInput}
                            currentValue={question.maxQuestionTime}
                            onChange={handleSettingMaxQuestionTimeInputChange}
                            placeholder={"0 sec"}
                            unitText={"sec"}
                            unlimitedAtO={true}
                        />
                        <SettingsField
                            text="Available points for this question"
                            type={SettingsFieldType.NumberInput}
                            currentValue={question.questionPoints}
                            onChange={handleSettingQuestionPointsInputChange}
                            placeholder={"100"}/>
                        <SettingsField
                            text="Earn more points based on reaction speed"
                            type={SettingsFieldType.Toggle}
                            currentValue={question.questionPointsModifier}
                            onChange={handleSettingQuestionPointsModifierToggle}
                            placeholder={null}/>
                        <SettingsField
                            text="Show live answer statistics for this question"
                            type={SettingsFieldType.Toggle}
                            currentValue={question.showLiveStats}
                            onChange={handleSettingLiveStatsToggle}
                            placeholder={null}/>
                    </div>
                    <p className="questionSettingsTitle">{`Overrides the general quiz settings for this specific question.`}</p>
                </div>
                <div className="questionSettingsNav">
                    <BottomNavBar
                        secondaryButtonText={"Reset"}
                        secondaryButtonIcon={null}
                        primaryButtonText={"Close"}
                        primaryButtonIcon={SAVE_ICON_LIGHT}
                        type={BottomNavBarType.Default}
                        style={BottomNavBarStyle.Medium}
                        onSecondaryClick={handleRevert}
                        onPrimaryClick={handleClose}
                        alternativeSecondaryButtonStyle={questionSettingsAreTheSameAsQuizSettings() ? ButtonStyle.Disabled : ButtonStyle.Secondary}
                    />
                </div>
            </div>
        </div>
    )
}