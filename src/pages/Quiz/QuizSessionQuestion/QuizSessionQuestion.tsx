import {FC, useEffect, useState} from "react";
import "./QuizSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT, USER_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {v4 as uuid} from "uuid";
import {Quiz} from "../../../models/Quiz.ts";
import {Timer} from "../../../components/Timer/Timer.tsx";
import {AnswerInputField} from "../../../components/AnswerInputField/AnswerInputField.tsx";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {Answer} from "../../../models/Answer.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {useNavigate} from "react-router-dom";
import {showErrorQuizSessionNotRunning} from "../../ErrorPage/ErrorPageExports.ts";

export const QuizSessionQuestion: FC = () => {
    const navigate = useNavigate();

    const [gameCode, setGameCode] = useState<string>("")
    const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const getAnsweredPlayersCount = (): number | null => {
        if (quizSession == null) return null
        let count = 0
        const userStats = quizSession!.state.usersStats
        for (const index in userStats) {
            const userAnswers = userStats[index].answers
            if (userAnswers.find(userAnswer => userAnswer.questionId == quizSession.state.currentQuestionId)) {
                count += 1
            }
        }
        return count
    }

    const handleEndQuiz = () => {
        // TODO: later also implement being able to go back to the previous question
        const endQuizPopup: PopupProps = {
            title: "Are you sure you want to end this quiz session?",
            message: null,
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                // TODO: navigate to quiz end screen
            },
        }
        showPopup(endQuizPopup)
    }
    const handleSkipQuestion = () => {
        // move on to answer statistics screen
        navigate(`/quiz/result`)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    useEffect(() => {

        // TODO: get current quizsession, current question and game code - rn just use default values to develop the ui
        const currentQuiz =  new Quiz()
        currentQuiz.questions[0] = new Question(uuid(), "What are the most effective strategies for managing stress in high-pressure work environments?"/*"Which colour is the sky?"*/, [new Answer(false, uuid(), "That are the most effective strategies for managing stress in high-pressure work environments."), new Answer(true, uuid(), "Green"), new Answer(false, uuid(), "Yellow"), new Answer(false, uuid(), "Red"), new Answer(false, uuid(), "Pink")])
        const currentSession: QuizSession = {
            id: uuid(),
            quizId: currentQuiz.id,
            state: {
                currentQuestionId: currentQuiz.questions[0].id,
                usersStats: [{
                    user: {
                        id: uuid(),
                        identifier: "player1",
                        deviceId: ""
                    },
                    score: 0,
                    answers: []
                }],
                currentQuizState: "" // TODO: shouldn't this be an enum?
            },
            deviceId: "",
        }
        const gameCode = "123456"
        const currentQuestion = currentQuiz.questions.find(question => question.id == currentSession.state.currentQuestionId)

        // TODO: check if we are the host and if we are currently in an active quiz session (using constant values for now)
        const quizSessionIsRunning = true
        const userIsHost = true // TODO: check here if 1) user is authenticated 2) authenticated user is owner of the quiz that is played rn
        if (!quizSessionIsRunning || !userIsHost) {
            showErrorQuizSessionNotRunning(navigate, userIsHost)
        }

        // if everything is fine, set up our state
        setQuizSession(currentSession)
        setGameCode(gameCode)
        setCurrentQuestion(currentQuestion ?? null)
    }, []);

    return (
        <div className="quizSessionQuestion">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={gameCode}
            />
            <div className="content">
                <h1>{currentQuestion?.questionText ?? ""}</h1>
                { (currentQuestion != null && currentQuestion?.maxQuestionTime != 0) &&
                    <Timer
                        remainingTime={currentQuestion!.maxQuestionTime}
                        isRunning={true}
                        onDone={handleSkipQuestion}
                    />
                }
                <div className="answersGroup">
                    <div className="answersInfo">
                        <img src={USER_ICON_LIGHT.path} alt={USER_ICON_LIGHT.alt}/>
                        <p>{`${getAnsweredPlayersCount() ?? "?"}/${quizSession != null ? quizSession.state.usersStats.length : "?"} answered`}</p>
                    </div>
                    <div className="answersContainer">
                        {currentQuestion?.answers.map((item, index) => (
                            <AnswerInputField
                                key={item.id}
                                value={item.value}
                                type={getAnswerInputFieldTypeForIndex(index)}
                                index={index}
                                onChange={null}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={(currentQuestion?.maxQuestionTime != 0) ? "Skip" : "Next"}
                primaryButtonIcon={SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={handleEndQuiz}
                onPrimaryClick={handleSkipQuestion}
            />

            { (showingPopup && popupProps != null) &&
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
 
