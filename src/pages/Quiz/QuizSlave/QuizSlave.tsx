import { FC, useEffect, useState } from "react"
import "./QuizSlave.css"
import {useLocation, useNavigate} from "react-router-dom";
import * as SignalR from "@microsoft/signalr";
import { getDeviceId } from "../../../helper/DeviceHelper";
import { v4 as uuid } from "uuid"
import QuizUser from "../../../models/QuizUser";
import {showErrorPageNothingToFind} from "../../ErrorPage/ErrorPageExports.ts";
import {showPopupLeaveSession, showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {Quiz} from "../../../models/Quiz.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {QuizSlaveLobby} from "../QuizSlaveLobby/QuizSlaveLobby.tsx";
import {QuizSlaveSessionQuestion} from "../QuizSlaveSessionQuestion/QuizSlaveSessionQuestion.tsx";
import {QuizSlaveLeaderboard} from "../QuizSlaveLeaderboard/QuizSlaveLeaderboard.tsx";
import {QuizSlaveEnd} from "../QuizSlaveEnd/QuizSlaveEnd.tsx";

export interface QuizSlaveChildrenProps {
    connection: SignalR.HubConnection
    quizSession: QuizSession
    quiz: Quiz
    quizUser: QuizUser
    leaveQuizSession: () => void
    showPopupSthWentWrong: () => void
}

export const QuizSlave: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const quizSessionId: string | null = state ? state.quizSessionId : null;
    const userName: string = state ? state.userName : "";

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
    const [connection, setConnection] = useState<SignalR.HubConnection>();
    const [quizUser, setQuizUser] = useState<QuizUser | null>(null);

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const initSignalR = async (quizUser: QuizUser): Promise<SignalR.HubConnection> => {

        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/slave", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
            })
            .build();

        console.log(`play:${quizSessionId}/${userName}`)

        // when the game actually starts and you get messages, navigate to the questions
        connection.on(`play:${quizSessionId}/${userName}`, async () => {
            console.log(JSON.stringify(quizUser))
            // TODO: receive updated quizstate here ("playing") to know which component to render -> not sure if this should be handled here or in QuizSlaveLobby
        })

        // TODO: receive the quizsession from the backend so it can be saved as a state
        // TODO: somehow get access to the quiz on firebase so the questions can be displayed... will be solved by singleton? --> only access to the currentquestion should be enough (full object with answers, not just id because slave has no access to firebase)

        connection.start()
            .then(async () => {
                console.log("Quiz user new: " + quizUser)
                connection.send("EnterSlaveQuizSession", quizUser, quizSessionId)
            })
            .catch((err) => console.error(err))

        return connection
    }

    const statesAreNotNull = (): boolean => {
        return quiz != null &&
            quizSession != null &&
            connection != null &&
            quizUser != null
    }

    const handleLeaveQuizSession = () => {
        const leaveSession = () => {} // TODO: leave session on server
        showPopupLeaveSession(showPopup, hidePopup, navigate, leaveSession)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }
    const hidePopup = () => {
        setShowingPopup(false)
    }
    const showPopupSthWentWrong = () => {
        showPopupSomethingWentWrong(showPopup, hidePopup)
    }

    useEffect(() => {
        if (quizSessionId == null || userName == "") {
            showErrorPageNothingToFind(navigate)
            return
        }

        const setUp = async () => {
            const user: QuizUser = {
                id: uuid(),
                identifier: userName,
                deviceId: await getDeviceId()
            }
            setQuizUser(user)

            const connection = await initSignalR(user)
            setConnection(connection)
        }

        setUp()
    }, [])

    return (
        <div className="quizSlave">
            { (quizSession?.state?.currentQuizState == QuizState.Lobby && statesAreNotNull()) &&
                <QuizSlaveLobby
                    connection={connection!}
                    quizSession={quizSession!}
                    quiz={quiz!}
                    quizUser={quizUser!}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { ((quizSession?.state?.currentQuizState == QuizState.Playing || quizSession?.state?.currentQuizState == QuizState.Statistics) && statesAreNotNull()) &&
                <QuizSlaveSessionQuestion
                    connection={connection!}
                    quizSession={quizSession!}
                    quiz={quiz!}
                    quizUser={quizUser!}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { ((quizSession?.state?.currentQuizState == QuizState.Leaderboard || quizSession?.state?.currentQuizState == QuizState.Podium) && statesAreNotNull()) &&
                <QuizSlaveLeaderboard
                    connection={connection!}
                    quizSession={quizSession!}
                    quiz={quiz!}
                    quizUser={quizUser!}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { (quizSession?.state?.currentQuizState == QuizState.EndScreen && statesAreNotNull()) &&
                <QuizSlaveEnd
                    connection={connection!}
                    quizSession={quizSession!}
                    quiz={quiz!}
                    quizUser={quizUser!}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }

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
    )
}

