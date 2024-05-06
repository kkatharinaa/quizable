import {FC, useEffect, useState} from "react"
import "./QuizMaster.css"
import {useLocation, useNavigate} from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import * as SignalR from "@microsoft/signalr";
import QuizUser from "../../../models/QuizUser";
import {v4 as uuid} from "uuid"
import {getDeviceId} from "../../../helper/DeviceHelper";
import {
    ErrorPageLinkedTo, showErrorPageNothingToFind,
    showErrorPageSomethingWentWrong,
} from "../../ErrorPage/ErrorPageExports.ts";
import {Quiz} from "../../../models/Quiz.ts";
import QuizRepository from "../../../repositories/QuizRepository.ts";
import {AuthenticatedUser, defaultAuthenticatedUser} from "../../../models/AuthenticatedUser.ts";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {QuizLobby} from "../QuizLobby/QuizLobby.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizSessionQuestion} from "../QuizSessionQuestion/QuizSessionQuestion.tsx";
import {QuizResult} from "../QuizResult/QuizResult.tsx";
import {QuizLeaderboard} from "../QuizLeaderboard/QuizLeaderboard.tsx";
import {QuizPodium} from "../QuizPodium/QuizPodium.tsx";
import {QuizEnd} from "../QuizEnd/QuizEnd.tsx";

export interface QuizMasterChildrenProps {
    connection: SignalR.HubConnection
    quizCode: string
    quizSession: QuizSession
    quiz: Quiz
    authenticatedUser: AuthenticatedUser
    endQuizSession: () => void
}

export const QuizMaster: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const quizSessionId: string | null = state ? state.quizSessionId : null;
    const quizId: string | null = state ? state.quizId : null;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
    const [quizCode, setQuizCode] = useState<string | null>(null);
    const [connection, setConnection] = useState<SignalR.HubConnection>();
    const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const initSignalR = async (hostUserId: string): Promise<SignalR.HubConnection> => {
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

        connection.on(hostUserId, (quizEntryId: string, message: QuizSession) => {
            // Get the entry id
            // and quizSession back
            console.log("Backend Message from: " + quizEntryId)

            setQuizCode(quizEntryId);
            setQuizSession(message)
        })

        connection.start()
            .then(async () => {
                const quizUser: QuizUser = {
                    id: uuid(),
                    identifier: hostUserId,
                    deviceId: await getDeviceId()
                }
                connection.send("requestQuizSession", quizUser, quizSessionId)
            })
            .catch((err) => console.error(err))

        return connection
    }

    const setQuizFromFirestore = async (quizID: string) => {
        if (quizID == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        return await QuizRepository.getById(quizID)
    }

    const checkUserIsHost = async () => {
        if (authUser == null || quiz == null || quizSession == null) {
            showErrorPageSomethingWentWrong(navigate)
            return
        }
        const deviceId = await getDeviceId()
        if (authUser.id != quiz.quizUser.id || deviceId != quizSession.deviceId) {
            showErrorPageNothingToFind(navigate)
        }
    }

    const statesAreNotNull = (): boolean => {
        return quiz != null &&
            quizSession != null &&
            quizCode != null &&
            connection != null &&
            authUser != null
    }

    const handleEndQuizSession = () => {
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
                // TODO: navigate to quiz end screen, where user can still download a report before the session gets killed on the server - for this the quizstate needs to be set to endscreen
                // TODO: if the user is already on the quiz end screen (quizstate is already set to end screen), kill the quiz session and take the user back to home
            },
        }
        showPopup(endQuizPopup)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    useEffect(() => {
        console.log("Quiz session in Quiz Lobby: ", quizSessionId)

        // make sure we have all necessary info passed to the route
        if (quizSessionId == null || quizId == null) {
            showErrorPageNothingToFind(navigate)
            return
        }

        // get authenticated user
        const host: AuthenticatedUser = defaultAuthenticatedUser // TODO: replace with authentication
        setAuthUser(host)

        // get quiz from firebase and setup connection
        const setUp = async () => {
            const quiz = await setQuizFromFirestore(quizId)
            if (quiz == null) {
                showErrorPageSomethingWentWrong(navigate)
                return
            }
            setQuiz(quiz);

            const connection = await initSignalR(host.id)
            setConnection(connection);

            // prevent users from illegally opening this route and accessing a session that is not running, not theirs, etc... TODO: check because not working
            //checkUserIsHost()
        }

        setUp()
    }, [])

    return (
        <div className="quizMaster">
            { (quizSession?.state?.currentQuizState === QuizState.Lobby && statesAreNotNull()) &&
                <QuizLobby
                    connection={connection!}
                    quizCode={quizCode!}
                    quiz={quiz!}
                    quizSession={quizSession!}
                    authenticatedUser={authUser!}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSession?.state?.currentQuizState === QuizState.Playing && statesAreNotNull()) &&
                <QuizSessionQuestion
                    connection={connection!}
                    quizCode={quizCode!}
                    quiz={quiz!}
                    quizSession={quizSession!}
                    authenticatedUser={authUser!}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSession?.state?.currentQuizState === QuizState.Statistics && statesAreNotNull()) &&
                <QuizResult
                    connection={connection!}
                    quizCode={quizCode!}
                    quiz={quiz!}
                    quizSession={quizSession!}
                    authenticatedUser={authUser!}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSession?.state?.currentQuizState === QuizState.Leaderboard && statesAreNotNull()) &&
                <QuizLeaderboard
                    connection={connection!}
                    quizCode={quizCode!}
                    quiz={quiz!}
                    quizSession={quizSession!}
                    authenticatedUser={authUser!}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSession?.state?.currentQuizState === QuizState.Podium && statesAreNotNull()) &&
                <QuizPodium
                    connection={connection!}
                    quizCode={quizCode!}
                    quiz={quiz!}
                    quizSession={quizSession!}
                    authenticatedUser={authUser!}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSession?.state?.currentQuizState === QuizState.EndScreen && statesAreNotNull()) &&
                <QuizEnd
                    connection={connection!}
                    quizCode={quizCode!}
                    quiz={quiz!}
                    quizSession={quizSession!}
                    authenticatedUser={authUser!}
                    endQuizSession={handleEndQuizSession}
                />
            }

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
    )
}

