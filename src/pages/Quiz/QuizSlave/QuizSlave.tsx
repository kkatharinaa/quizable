import { FC, useEffect, useState } from "react"
import "./QuizSlave.css"
import {useLocation, useNavigate} from "react-router-dom";
import { getDeviceId } from "../../../helper/DeviceHelper";
import { v4 as uuid } from "uuid"
import QuizUser from "../../../models/QuizUser";
import {showErrorPageNothingToFind} from "../../ErrorPage/ErrorPageExports.ts";
import {showPopupLeaveSession, showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {QuizSlaveLobby} from "../QuizSlaveLobby/QuizSlaveLobby.tsx";
import {QuizSlaveSessionQuestion} from "../QuizSlaveSessionQuestion/QuizSlaveSessionQuestion.tsx";
import {QuizSlaveLeaderboard} from "../QuizSlaveLeaderboard/QuizSlaveLeaderboard.tsx";
import {QuizSlaveEnd} from "../QuizSlaveEnd/QuizSlaveEnd.tsx";
import {QuizSessionManagerSlave, QuizSessionManagerSlaveInterface} from "../../../managers/QuizSessionManagerSlave.tsx";
import {LoadingPage} from "../../Loading/Loading.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";

export interface QuizSlaveChildrenProps {
    quizSessionManagerSlave: QuizSessionManagerSlaveInterface
    leaveQuizSession: () => void
    showPopupSthWentWrong: () => void
}

export const QuizSlave: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const quizSessionId: string | null = state ? state.quizSessionId : null;
    const userName: string = state ? state.userName : "";

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
        if (quizSessionId == null || userName == "") {
            showErrorPageNothingToFind(navigate)
            return
        }

        const handleQuizSessionManagerSlaveChange = () => {
            setQuizSessionManagerSlave(QuizSessionManagerSlave.getInstanceAsInterface());
        };
        QuizSessionManagerSlave.getInstance().subscribe(handleQuizSessionManagerSlaveChange);

        const setUp = async () => {
            const user: QuizUser = {
                id: uuid(),
                identifier: userName,
                deviceId: await getDeviceId()
            }

            await QuizSessionManagerSlave.getInstance().setUp(quizSessionId, user)
        }

        setUp()

        return () => {
            QuizSessionManagerSlave.getInstance().unsubscribe(handleQuizSessionManagerSlaveChange);
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

