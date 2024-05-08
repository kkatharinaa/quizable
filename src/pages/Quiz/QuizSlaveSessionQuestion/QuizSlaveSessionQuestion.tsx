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
import {Answer, makeAnswer} from "../../../models/Answer.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {showErrorNotInSession} from "../../ErrorPage/ErrorPageExports.ts";
import {showPopupLeaveSession, showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";
import QuizUser from "../../../models/QuizUser.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerSelection} from "../../../components/AnswerSelection/AnswerSelection.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {AnswerSelectionStyle} from "../../../components/AnswerSelection/AnswerSelectionExports.ts";
import {QuestionSlideInTag} from "../../../components/QuestionSlideInTag/QuestionSlideInTag.tsx";
import * as SignalR from "@microsoft/signalr";

export const QuizSlaveSessionQuestion: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    const [quizUser, setQuizUser] = useState<QuizUser | null>(state.quizUser)
    const [quizSessionId, setQuizSessionId] = useState<string | null>(state.quizSessionId)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(state.question)

    const [selectedAnswerID, setSelectedAnswerID] = useState<string>("");
    const [sessionState, setSessionState] = useState<QuizState>(QuizState.Playing) // reuse this screen for showing which answer was correct, which gets displayed while the master is showing the answer statistics TODO: set/update the quiz state somewhere
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);
    const [connection, setConnection] = useState<SignalR.HubConnection>();

    // TODO: generally: implement behaviour when disconnecting

    const getAnswerStyle = (id: string): AnswerSelectionStyle => {

        if (quizUser == null || quizSessionId == null || currentQuestion == null) {
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

    const handleSelectAnswer = (answer: Answer) => {
        if(selectedAnswerID != "")
            return

        if (quizUser == null || quizSessionId == null || currentQuestion == null) {
            showPopupSomethingWentWrong(showPopup, hidePopup)
            return
        }

        setSelectedAnswerID(answer.id)
        connection?.send("NotifySlaveAnswered", quizUser, quizSessionId, currentQuestion.id, answer);
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
        init()
    }, []);

    const initSignalR = async (quizSessionId: string, quizUserState: QuizUser) => {
        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const userName = quizUserState.identifier;

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/slave", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        // when the game actually starts and you get messages, navigate to the questions
        connection.on(`play:${quizSessionId}/${userName}`, async (_: string, question: Question, quizUser: QuizUser) => {
            setSessionState(QuizState.Playing)
            setCurrentQuestion(question)
            setQuizUser(quizUser)
            setSelectedAnswerID("")
            // TODO: send question to user
        })

        connection.on(`questionend:${userName}`, () => {
            // Show the corect answers
            setSessionState(QuizState.Statistics)
        })

        connection.on(`end:${quizSessionId}/${userName}`, () => {
            navigate("/quiz/end")
        })


        connection.start()
            .then(async () => {
                connection.send("EnterSlaveQuizSessionQuestion", quizUserState, quizSessionId)
            })
            .catch((err) => console.error(err))

        setConnection(connection);
    }

    const init = async () => {
        // if everything is fine, set up our state
        setQuizSessionId(state.quizSessionId)
        setQuizUser(state.quizUser)
        // setCurrentQuestion(currentQuestion ?? null)

        await initSignalR(state.quizSessionId, state.quizUser)
    }

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
                            onClick={() => handleSelectAnswer(item)}
                        
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

