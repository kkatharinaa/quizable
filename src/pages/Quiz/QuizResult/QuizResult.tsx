import {FC, useEffect, useState} from "react";
import "./QuizResult.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {StatisticsBar} from "../../../components/StatisticsBar/StatisticsBar.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {showErrorQuizSessionNotRunning} from "../../ErrorPage/ErrorPageExports.ts";
import {useLocation, useNavigate} from "react-router-dom";
import * as SignalR from "@microsoft/signalr";
import QuizSessionUserStats from "../../../models/QuizSessionUserStats.ts";

export const QuizResult: FC = () => {
    const navigate = useNavigate()
    const {state} = useLocation()

    const [gameCode] = useState(state.gameCode)
    const [quizSessionId] = useState<string>(state.quizSessionId)
    const [currentQuestion] = useState<Question>(state.question)
    const [quizUserStats] = useState<QuizSessionUserStats[]>(state.quizUserStats)
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const [connection, setConnection] = useState<SignalR.HubConnection>();

    const getAnswersCountForAnswer = (answerID: string): number => {
        return quizUserStats.reduce((count, userStat) => {
            userStat.answers.forEach(answer => {
                if (answer.questionId === currentQuestion.id && answer.answerId === answerID) {
                    count++;
                }
            });
            return count;
        }, 0)
    }
    const getTotalAnswersCountForQuestion = (): number => {
        return quizUserStats.reduce((count, userStat) => {
            userStat.answers.forEach(answer => {
                if (answer.questionId === currentQuestion.id) {
                    count++;
                }
            });
            return count;
        }, 0)
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
    const handleContinue = () => {
        // TODO: move on to leaderboard, rn it skips the leaderboard and goes directly to the next question
        console.log("Quiz Session ID: " + quizSessionId)
        connection?.send("NotifyPlayQuiz", quizSessionId, false)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    const initSignalR = () => {
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
        
        connection.on(`play:${quizSessionId}`, (_: string, question: Question) => {
            console.log("From result to next question")
            navigate("/quiz/session", {state: {
                    quizSessionId: quizSessionId,
                    question: question,
                    gameCode: gameCode
            }})
        })

        connection.on(`end:${quizSessionId}`, () => {
            console.log("end quiz, we just had the last question")
            navigate("/quiz/end")
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
        <div className="quizResult">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={gameCode}
            />
            <div className="content">
                <div className="statistics">
                    {currentQuestion?.answers.map((item, index) => (
                        <StatisticsBar
                            key={item.id}
                            value={item.value}
                            type={getAnswerInputFieldTypeForIndex(index)}
                            answerCount={getAnswersCountForAnswer(item.id)}
                            totalAnswersCount={getTotalAnswersCountForQuestion()}
                            correct={item.correct}
                        />
                    ))}
                </div>
            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={"Next"}
                primaryButtonIcon={SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={handleEndQuiz}
                onPrimaryClick={handleContinue}
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

