import {FC, useState} from "react";
import "./QuizSettingsPopup.css"
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {isQuiz, Quiz, quizzesAreEqual} from "../../models/Quiz.ts";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";
import {InputField} from "../InputField/InputField.tsx";
import {InputFieldType} from "../InputField/InputFieldExports.ts";
import {
    ColourScheme,
    QuizOptions,
    quizOptionsAreEqual,
    quizOptionsAreEqualForQuestions
} from "../../models/QuizOptions.ts";
import {SAVE_ICON_LIGHT} from "../../assets/Icons.ts";
import {formattedDate} from "../../helper/DateFormatter.ts";
import {SettingsField} from "../SettingsField/SettingsField.tsx";
import {SettingsFieldType} from "../SettingsField/SettingsFieldExports.ts";
import {Question} from "../../models/Question.ts";
import {PopupProps} from "../Popup/Popup.tsx";
import {showPopupInfoOnly, showPopupSomethingWentWrong} from "../Popup/PopupExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";

export interface QuizSettingsPopupProps {
    selectedQuiz: Quiz
    onSave: (id: string, updatedQuiz: Quiz) => Promise<void>
    onClose: () => void
    onEditQuestions: (id: string) => void
    showPopup: (popup: PopupProps) => void
    hidePopup: () => void
    newlyAdded: boolean
}

export const QuizSettingsPopup: FC<QuizSettingsPopupProps> = ({ selectedQuiz, onSave, onClose, onEditQuestions, showPopup, hidePopup, newlyAdded }) => {

    const [quiz, setQuiz] = useState<Quiz>(selectedQuiz) // only needed for importing a quiz from json
    const [quizOptions, setQuizOptions] = useState<QuizOptions>(selectedQuiz.options);
    const [quizName, setQuizName] = useState(selectedQuiz.name)

    const handleClose = () => {
        if (quizName == "") {
            const popup: PopupProps = {
                title: "Are you sure you want to discard your changes?",
                message: "You did not give your quiz a name which is why it cannot be saved.",
                secondaryButtonText: "Keep Editing",
                secondaryButtonIcon: null,
                primaryButtonText: "Discard Changes",
                primaryButtonIcon: null,
                type: BottomNavBarType.Default,
                onSecondaryClick: () => {
                    hidePopup()
                },
                onPrimaryClick: () => {
                    onClose()
                    hidePopup()
                },
            }
            showPopup(popup)
        } else {
            showSaveConfirmationPopup(newlyAdded ? "Not saving will result in this quiz being discarded." : null, () => {
                // close settings popup without saving
                onClose()
            }, () => {
                // close settings popup WITH saving
                handleSave().then(() => {
                    onClose()
                })
            })
        }
    }
    const handleEditQuestions = () => {
        if (newlyAdded) {
            const popup: PopupProps = {
                title: "Your quiz has been created.",
                message: "You will now be taken to the questions editor.",
                secondaryButtonText: "",
                secondaryButtonIcon: null,
                primaryButtonText: "Continue",
                primaryButtonIcon: null,
                type: BottomNavBarType.PrimaryOnly,
                onPrimaryClick: () => {
                    handleSave().then(() => {
                        onEditQuestions(quiz.id)
                    })
                },
            }
            showPopup(popup)
        } else {
            showSaveConfirmationPopup("When clicking on either one of the buttons below, you will be taken to the questions editor.", () => {
                // proceed without saving
                onEditQuestions(quiz.id)
            }, () => {
                // proceed WITH saving
                handleSave().then(() => {
                    onEditQuestions(quiz.id)
                })
            })
        }
    }
    const handleSave = async (): Promise<void> => {
        const updatedQuestions = handleRevertOverrides()
        const updatedQuiz = {...quiz, name: quizName, options: quizOptions, questions: updatedQuestions}
        return await onSave(quiz.id, updatedQuiz)
    }
    const handleRevertOverrides = (): Question[] => {
        const updatedQuestions = [... quiz.questions]
        if (quizOptionsAreEqualForQuestions(quizOptions, quiz.options)) {
            return updatedQuestions
        }
        updatedQuestions.forEach((question) => {
            question.maxQuestionTime = quizOptions.maxQuestionTime
            question.questionPoints = quizOptions.questionPoints
            question.questionPointsModifier = quizOptions.questionPointsModifier
            question.showLiveStats = quizOptions.showLiveStats
        })
        return updatedQuestions
    }
    const showSaveConfirmationPopup = (extraMessage: string | null, onSecondaryClick: () => void, onPrimaryClick: () => void) => {
        // check if sth has been changed, if yes show this popup, else just perform the primaryClick
        if (quizName == selectedQuiz.name && quizOptionsAreEqual(quizOptions, selectedQuiz.options) && quizzesAreEqual(quiz, selectedQuiz)) {
            onPrimaryClick()
            hidePopup()
            return
        }
        const popup: PopupProps = {
            title: "Do you want to save your changes?",
            message: (quizOptionsAreEqualForQuestions(quizOptions, selectedQuiz.options) ? extraMessage : (extraMessage != null ? extraMessage + " " : "") + "When saving, your new quiz settings will be applied to all the questions in this quiz."),
            secondaryButtonText: "Discard Changes",
            secondaryButtonIcon: null,
            primaryButtonText: "Save Changes",
            primaryButtonIcon: SAVE_ICON_LIGHT,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                onSecondaryClick()
                hidePopup()
            },
            onPrimaryClick: () => {
                onPrimaryClick()
                hidePopup()
            },
        }
        showPopup(popup)
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
        if (!Object.values(ColourScheme).includes(value)) {
            showPopupSomethingWentWrong(showPopup, hidePopup)
        }
        setQuizOptions({...quizOptions, colourScheme: value})
    }
    const handleColourSchemeToggle = () => {
        // currently only a toggle, because we only have 2 colour schemes, but could be customised even more
        const newValue = quizOptions.colourScheme == 0 ? 1 : 0
        handleColourSchemeInputChange(newValue)
    }

    // import and export quiz
    const handleImportQuiz = () => {
        const popup: PopupProps = {
            title: "Are you sure you want to import a quiz?",
            message: "The current quiz will be overridden.",
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                hidePopup()
            },
            onPrimaryClick: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = handleFileChange;
                input.click();
                hidePopup()
            }
        }
        showPopup(popup)
    }
    const handleExportQuiz = () => {
        // export quiz as if the newest changes have already been saved
        const updatedQuestions = handleRevertOverrides()
        const updatedQuiz = {...quiz, name: quizName, options: quizOptions, questions: updatedQuestions}
        // also make sure we do not export the quiz user or the id of the quiz to keep some privacy
        const { quizUser, id, ...updatedQuizForExport } = updatedQuiz;

        const json = JSON.stringify(updatedQuizForExport, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Quiz-Export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const text = await file.text();
            try {
                const json = JSON.parse(text);

                // add the missing quiz user, replace the id as to not cause any firestore issues and update the createdOn value
                json.quizUser = selectedQuiz.quizUser
                json.id = selectedQuiz.id
                json.createdOn = selectedQuiz.createdOn

                const quizFromJson = json as Quiz;
                if (!isQuiz(quizFromJson)) {
                    showPopupInfoOnly(showPopup, hidePopup, "File is not valid.")
                    return
                }
                setQuiz(quizFromJson)
                setQuizOptions(quizFromJson.options)
                setQuizName(quizFromJson.name)
            } catch (error) {
                showPopupInfoOnly(showPopup, hidePopup, "File is not valid.")
            }
        }
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
                            <p>{`Total: ${quiz.questions.length} Question${quiz.questions.length != 1 ? "s" : ""}`}</p>
                            <p>{`Created on: ${formattedDate(quiz.createdOn)}`}</p>
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
                        {/*<SettingsField
                            text="Show live answer statistics"
                            type={SettingsFieldType.Toggle}
                            currentValue={quizOptions.showLiveStats}
                            onChange={handleSettingLiveStatsToggle}
                            placeholder={null}/>*/}
                        {/*<SettingsField
                            text="Use enterprise/research theme"
                            type={SettingsFieldType.Toggle}
                            currentValue={quizOptions.colourScheme}
                            onChange={handleColourSchemeToggle}
                            placeholder={null}/>*/}
                        <div className="exportImport">
                            <ButtonComponent
                                text={"Import Quiz"}
                                icon={null}
                                type={ButtonType.Medium}
                                style={ButtonStyle.Secondary}
                                onClick={handleImportQuiz}
                            />
                            <ButtonComponent
                                text={"Export Quiz"}
                                icon={null}
                                type={ButtonType.Medium}
                                style={ButtonStyle.Secondary}
                                onClick={handleExportQuiz}
                            />
                        </div>
                    </div>
                </div>
                <div className="quizSettingsNav">
                    <BottomNavBar
                        secondaryButtonText={"Close"}
                        secondaryButtonIcon={null}
                        primaryButtonText={"Edit Questions"}
                        primaryButtonIcon={null}
                        type={BottomNavBarType.Default}
                        style={BottomNavBarStyle.Medium}
                        onSecondaryClick={handleClose}
                        onPrimaryClick={quizName == "" ? undefined : handleEditQuestions}
                        alternativePrimaryButtonStyle={quizName == "" ? ButtonStyle.Disabled : ButtonStyle.Settings}
                    />
                </div>
            </div>
        </div>
    )
}