import {FC, useEffect, useState} from "react"
import "./QuizMaster.css"
import {useLocation, useNavigate} from "react-router-dom";
import {
    ErrorPageLinkedTo, showErrorPageNothingToFind,
    showErrorPageSomethingWentWrong,
} from "../../ErrorPage/ErrorPageExports.ts";
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
import {showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";
import {QuizSessionManager, QuizSessionManagerInterface} from "../../../managers/QuizSessionManager.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/auth.ts";

export interface QuizMasterChildrenProps {
    quizSessionManager: QuizSessionManagerInterface
    endQuizSession: () => void
}

export const QuizMaster: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const quizSessionId: string | null = state ? state.quizSessionId : null;
    const quizId: string | null = state ? state.quizId : null;

    const [quizSessionManager, setQuizSessionManager] = useState(QuizSessionManager.getInstanceAsInterface());

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    // checking login state
    const [user, loading, error] = useAuthState(auth);
    useEffect(() => {
        if(loading) {
            // TODO: add loading screen
            return;
        }
        if (user) navigate("/overview");
        else navigate("/login");
    }, [user, loading, navigate]);
    
    const setQuizFromFirestore = async (quizID: string) => {
        if (quizID == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        return await QuizRepository.getById(quizID)
    }

    const handleEndQuizSession = () => {
        // TODO: later also implement being able to go back to the previous question
        // navigate to quiz end screen, where user can still download a report before the session gets killed on the server - for this the quizstate needs to be set to endscreen
        // OR if the user is already on the quiz end screen (quizstate is already set to end screen), kill the quiz session and take the user back to home -> no popup in this case
        if (QuizSessionManager.getInstance().quizState == QuizState.endscreen) {
            QuizSessionManager.getInstance().killSession()
            navigate('/')
            return;
        }

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
                if (QuizSessionManager.getInstance().quizSession == null) {
                    showPopupSomethingWentWrong(showPopup, hidePopup)
                    return
                }
                QuizSessionManager.getInstance().changeState(QuizState.endscreen)
                hidePopup()
            },
        }
        showPopup(endQuizPopup)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }
    const hidePopup = () => {
        setShowingPopup(false)
    }

    useEffect(() => {
        // make sure we have all necessary info passed to the route
        if (quizSessionId == null || quizId == null) {
            showErrorPageNothingToFind(navigate)
            return
        }

        // get authenticated user
        const host: AuthenticatedUser = defaultAuthenticatedUser // TODO: replace with authentication

        const handleQuizSessionManagerChange = () => {
            setQuizSessionManager(QuizSessionManager.getInstanceAsInterface());
        };
        QuizSessionManager.getInstance().subscribe(handleQuizSessionManagerChange);

        // get quiz from firebase and setup connection
        const setUp = async () => {
            const quiz = await setQuizFromFirestore(quizId)
            if (quiz == null) {
                showErrorPageSomethingWentWrong(navigate)
                return
            }

            await QuizSessionManager.getInstance().setUp(quizSessionId, host, quiz)
        }

        setUp()

        return () => {
            QuizSessionManager.getInstance().unsubscribe(handleQuizSessionManagerChange);
        };
    }, [])

    return (
        <div className="quizMaster">
            { (quizSessionManager.quizState === QuizState.lobby && quizSessionManager.sessionExists) &&
                <QuizLobby
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSessionManager.quizState === QuizState.playing && quizSessionManager.sessionExists) &&
                <QuizSessionQuestion
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSessionManager.quizState === QuizState.statistics && quizSessionManager.sessionExists) &&
                <QuizResult
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSessionManager.quizState === QuizState.leaderboard && quizSessionManager.sessionExists) &&
                <QuizLeaderboard
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSessionManager.quizState === QuizState.podium && quizSessionManager.sessionExists) &&
                <QuizPodium
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                />
            }
            { (quizSessionManager.quizState === QuizState.endscreen && quizSessionManager.sessionExists) &&
                <QuizEnd
                    quizSessionManager={quizSessionManager}
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

