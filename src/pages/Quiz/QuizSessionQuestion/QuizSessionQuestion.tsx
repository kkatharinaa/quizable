import {FC, useEffect, useState} from "react";
import "./QuizSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT, USER_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {Timer} from "../../../components/Timer/Timer.tsx";
import {AnswerInputField} from "../../../components/AnswerInputField/AnswerInputField.tsx";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {showErrorQuizSessionNotRunning} from "../../ErrorPage/ErrorPageExports.ts";
import * as SignalR from "@microsoft/signalr";
import QuizSessionUserStats from "../../../models/QuizSessionUserStats.ts";

export const QuizSessionQuestion: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    const [gameCode] = useState<string>(state.gameCode)
    const [currentQuestion] = useState<Question>(state.question);
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);
    const [playerCount, setPlayerCount] = useState(0);
    const [connection, setConnection] = useState<SignalR.HubConnection | null>(null);

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
        console.log("skip question")
        // TODO: get to work with timer
        connection?.send("NotifyQuestionSkip", state.quizSessionId)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    const initSignalR = () => {
        const starterUserId: string = "userId1"

        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/master", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();
        
        connection.on(`questionend:${starterUserId}`, (quizSessionId: string, quizUserStats: QuizSessionUserStats[], currentQuestion: Question) => {
            console.log("Question end")
            navigate(`/quiz/result`, {state: {quizSessionId: quizSessionId, quizUserStats: quizUserStats, gameCode: gameCode, question: currentQuestion}})
        })

        connection.on(`answer:${starterUserId}`, (quizUserStats: QuizSessionUserStats[]) => {
            setPlayerCount(
                quizUserStats
                    .map(stats => stats.answers)
                    .filter(answers => 
                        answers.some(answer => answer.questionId == currentQuestion?.id)
                    ).length)
        })

        connection.start()
        setConnection(connection)
    }

    useEffect(() => {
        // TODO: check if we are the host and if we are currently in an active quiz session (using constant values for now)
        const quizSessionIsRunning = true
        const userIsHost = true // TODO: check here if 1) user is authenticated 2) authenticated user is owner of the quiz that is played rn
        if (!quizSessionIsRunning || !userIsHost) {
            showErrorQuizSessionNotRunning(navigate, userIsHost)
        }

        initSignalR();
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
                        <p>{`${playerCount} answered`}</p>
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
 
