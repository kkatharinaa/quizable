import { FC, useEffect, useState } from "react"
import "./QuizSlave.css"
import {useLocation, useNavigate} from "react-router-dom";
import { getDeviceId } from "../../../helper/DeviceHelper";
import QuizUser from "../../../models/QuizUser";
import {
    showErrorPageNothingToFind,
    showErrorQuizSession
} from "../../ErrorPage/ErrorPageExports.ts";
import {
    showPopupLeaveSession,
    showPopupSomethingWentWrong
} from "../../../components/Popup/PopupExports.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {QuizSlaveLobby} from "../QuizSlaveLobby/QuizSlaveLobby.tsx";
import {QuizSlaveSessionQuestion} from "../QuizSlaveSessionQuestion/QuizSlaveSessionQuestion.tsx";
import {QuizSlaveLeaderboard} from "../QuizSlaveLeaderboard/QuizSlaveLeaderboard.tsx";
import {QuizSlaveEnd} from "../QuizSlaveEnd/QuizSlaveEnd.tsx";
import {QuizSessionManagerSlave, QuizSessionManagerSlaveInterface} from "../../../managers/QuizSessionManagerSlave.tsx";
import QuizSession from "../../../models/QuizSession.ts";
import QuizSessionService from "../../../services/QuizSessionService.ts";
import {LoadingPage} from "../../Loading/Loading.tsx";

export interface QuizSlaveChildrenProps {
    quizSessionManagerSlave: QuizSessionManagerSlaveInterface
    leaveQuizSession: () => void
    showPopupSthWentWrong: () => void
}

export const QuizSlave: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const quizSessionId: string | null = state ? state.quizSessionId : localStorage.getItem("quizSessionId");
    const quizUser: QuizUser | null = state ? state.quizUser : localStorage.getItem("quizUser") ? JSON.parse(localStorage.getItem("quizUser")!) : null;

    const [quizSessionManagerSlave, setQuizSessionManagerSlave] = useState(QuizSessionManagerSlave.getInstanceAsInterface());

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const handleLeaveQuizSession = () => {
        if (QuizSessionManagerSlave.getInstance().quizState == QuizState.endscreen) {
            QuizSessionManagerSlave.getInstance().killSession()
            navigate('/')
            return;
        }
        showPopupLeaveSession(showPopup, hidePopup, navigate, () => { QuizSessionManagerSlave.getInstance().killSession() })
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
        const reconnect = async () => {
            const deviceId: string = await getDeviceId();
            const reconnect: {quizUser: QuizUser, quizSession: QuizSession} | null = await QuizSessionService.checkQuizUserReconnection(deviceId)

            if (reconnect) {
                navigate("/quiz/player", {state: {quizSessionId: reconnect.quizSession.id, userName: reconnect.quizUser}})
                return
            }
        }

        const handleQuizSessionManagerSlaveChange = () => {
            if (QuizSessionManagerSlave.getInstanceAsInterface().errorGettingSession) {
                QuizSessionManagerSlave.getInstance().errorGettingSession = false
                showErrorQuizSession(navigate, false)
                return
            }
            setQuizSessionManagerSlave(QuizSessionManagerSlave.getInstanceAsInterface());
        };

        /*const handleConnectionChange = () => {
            if (navigator.onLine) {
                console.log("connected")
                window.location.reload()
            } else {
                console.log("disconnected")
                showPopupNoConnection(showPopup, hidePopup)
            }
        };
        window.addEventListener('online', handleConnectionChange);*/

        const setUp = async () => {
            if (quizSessionId == null || quizUser == null) {
                await reconnect()
                showErrorPageNothingToFind(navigate)
                return
            }

            QuizSessionManagerSlave.getInstance().subscribe(handleQuizSessionManagerSlaveChange);

            await QuizSessionManagerSlave.getInstance().setUp(quizSessionId, quizUser)
        }

        setUp()

        return () => {
            QuizSessionManagerSlave.getInstance().unsubscribe(handleQuizSessionManagerSlaveChange);
            //window.removeEventListener('online', handleConnectionChange);
        };
    }, [])

    return (
        <div className="quizSlave">
            { (quizSessionManagerSlave.quizState == QuizState.lobby && quizSessionManagerSlave.sessionExists) &&
                <QuizSlaveLobby
                    quizSessionManagerSlave={quizSessionManagerSlave}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { ((quizSessionManagerSlave.quizState == QuizState.playing || quizSessionManagerSlave.quizState == QuizState.statistics) && quizSessionManagerSlave.sessionExists && quizSessionManagerSlave.currentQuestion != null) &&
                <QuizSlaveSessionQuestion
                    quizSessionManagerSlave={quizSessionManagerSlave}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { ((quizSessionManagerSlave.quizState == QuizState.leaderboard || quizSessionManagerSlave.quizState == QuizState.podium) && quizSessionManagerSlave.sessionExists) &&
                <QuizSlaveLeaderboard
                    quizSessionManagerSlave={quizSessionManagerSlave}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { (quizSessionManagerSlave.quizState == QuizState.endscreen && quizSessionManagerSlave.sessionExists) &&
                <QuizSlaveEnd
                    quizSessionManagerSlave={quizSessionManagerSlave}
                    leaveQuizSession={handleLeaveQuizSession}
                    showPopupSthWentWrong={showPopupSthWentWrong}
                />
            }
            { (quizSessionManagerSlave.quizState == null || !quizSessionManagerSlave.sessionExists) &&
                <LoadingPage hasBottomNavBar={false}/>
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

