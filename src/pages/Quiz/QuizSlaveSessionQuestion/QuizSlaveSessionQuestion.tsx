import {FC, useEffect, useState} from "react";
import "./QuizSlaveSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {v4 as uuid} from "uuid";
import {makeQuiz} from "../../../models/Quiz.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {makeQuestion, Question} from "../../../models/Question.ts";
import {makeAnswer} from "../../../models/Answer.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {useNavigate} from "react-router-dom";
import {showErrorNotInSession} from "../../ErrorPage/ErrorPageExports.ts";
import {showPopupLeaveSession, showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";
import QuizUser from "../../../models/QuizUser.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerSelection} from "../../../components/AnswerSelection/AnswerSelection.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {AnswerSelectionStyle} from "../../../components/AnswerSelection/AnswerSelectionExports.ts";
import {QuestionSlideInTag} from "../../../components/QuestionSlideInTag/QuestionSlideInTag.tsx";

export const QuizSlaveSessionQuestion: FC = () => {
    const navigate = useNavigate();

    const [player, setPlayer] = useState<QuizUser | null>(null)
    const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [selectedAnswerID, setSelectedAnswerID] = useState<string>("")
    const [sessionState, setSessionState] = useState<QuizState>(QuizState.Playing) // reuse this screen for showing which answer was correct, which gets displayed while the master is showing the answer statistics TODO: set/update the quiz state somewhere
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    // TODO: generally: implement behaviour when disconnecting

    const getAnswerStyle = (id: string): AnswerSelectionStyle => {
        if (player == null || quizSession == null || currentQuestion == null) {
            showPopupSomethingWentWrong(showPopup, hidePopup)
            return AnswerSelectionStyle.Disabled
        }

        const answer = currentQuestion.answers.find(answer => answer.id == id)
        if (answer == undefined) {
            showPopupSomethingWentWrong(showPopup, hidePopup)
            return AnswerSelectionStyle.Disabled
        }

        if (sessionState == QuizState.Statistics) {
            if (answer.correct) return AnswerSelectionStyle.Correct
            if (!answer.correct && answer.id == selectedAnswerID) return AnswerSelectionStyle.Wrong
            return AnswerSelectionStyle.Unselected
        }
        // else should be QuizState.Playing
        if (answer.id == selectedAnswerID) return AnswerSelectionStyle.Selected
        if (selectedAnswerID == "") return AnswerSelectionStyle.Disabled
        return AnswerSelectionStyle.Unselected
    }

    const handleSelectAnswer = (id: string) => {
        if (player == null || quizSession == null || currentQuestion == null) {
            showPopupSomethingWentWrong(showPopup, hidePopup)
            return
        }
        // TODO: update answer stats in quizsession
        setSelectedAnswerID(id)
    }

    const handleLeaveSession = () => {
        const leaveSession = () => {} // TODO: leave session
        showPopupLeaveSession(showPopup, hidePopup, navigate, leaveSession)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }
    const hidePopup = () => {
        setShowingPopup(false)
    }

    useEffect(() => {

        // TODO: get player, current quizsession and current question - rn just use default values to develop the ui
        const player: QuizUser = {
            id: uuid(),
            identifier: "player1",
            deviceId: ""
        }
        const currentQuiz =  makeQuiz()
        currentQuiz.questions[0] = makeQuestion(uuid(), "What are the most effective strategies for managing stress in high-pressure work environments?"/*"Which colour is the sky?"*/, [makeAnswer(false, "That are the most effective strategies for managing stress in high-pressure work environments."), makeAnswer(true, "Green"), makeAnswer(false, "Yellow"), makeAnswer(false, "Red"), makeAnswer(false, "Pink")])
        const currentSession: QuizSession = {
            id: uuid(),
            quizId: currentQuiz.id,
            state: {
                currentQuestionId: currentQuiz.questions[0].id,
                usersStats: [{
                    user: player,
                    score: 0,
                    answers: []
                }],
                currentQuizState: "" // TODO: shouldn't this be an enum?
            },
            deviceId: "",
        }
        const currentQuestion = currentQuiz.questions.find(question => question.id == currentSession.state.currentQuestionId)

        const playerIsPartOfSession = currentSession.state.usersStats.find(userStat => userStat.user.id = player.id)
        if (playerIsPartOfSession == undefined) {
            showErrorNotInSession(navigate)
        }

        // if everything is fine, set up our state
        setQuizSession(currentSession)
        setPlayer(player)
        setCurrentQuestion(currentQuestion ?? null)
    }, []);

    return (
        <div className="quizSlaveSessionQuestion">
            <BackgroundGems
                type={BackgroundGemsType.PrimarySlave2}
            />
            { currentQuestion != null &&
                <QuestionSlideInTag
                    questionText={currentQuestion.questionText}
                    maxQuestionTime={currentQuestion.maxQuestionTime}
                />
            }
            <div className="content">
                <div className="answersContainer">
                    {currentQuestion?.answers.map((item, index) => (
                        <AnswerSelection
                            key={item.id}
                            id={item.id}
                            value={item.value}
                            type={getAnswerInputFieldTypeForIndex(index)}
                            style={getAnswerStyle(item.id)}
                            onClick={handleSelectAnswer}
                        />
                    ))}
                </div>
            </div>

            <BottomNavBar
                secondaryButtonText="Leave"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText={""}
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={handleLeaveSession}
            />

            {(showingPopup && popupProps != null) &&
                <Popup
                    title={popupProps.title}
                    message={popupProps.message}
                    secondaryButtonText={popupProps.secondaryButtonText}
                    secondaryButtonIcon={popupProps.secondaryButtonIcon}
                    primaryButtonText={popupProps.primaryButtonText}
                    primaryButtonIcon={popupProps.primaryButtonIcon}
                    type={popupProps.type}
                    onSecondaryClick={popupProps.onSecondaryClick}
                    onPrimaryClick={popupProps.onPrimaryClick}
                />
            }
        </div>
    );
}

