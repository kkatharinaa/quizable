import {FC, useEffect, useState} from "react"
import "./QuizMaster.css"
import {useLocation, useNavigate} from "react-router-dom";
import {
    ErrorPageLinkedTo,
    showErrorPageNothingToFind,
    showErrorPageSomethingWentWrong
} from "../../ErrorPage/ErrorPageExports.ts";
import QuizRepository from "../../../repositories/QuizRepository.ts";
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
import {
    QuizSessionManager,
    QuizSessionManagerInterface,
    QuizSessionStatus
} from "../../../managers/QuizSessionManager.tsx";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, logInWithEmailLink} from "../../../firebase/auth.ts";
import {LoadingPage} from "../../Loading/Loading.tsx";
import QuizSession from "../../../models/QuizSession.ts";
import QuizSessionService from "../../../services/QuizSessionService.ts";
import {handleResize} from "../../../helper/ResizeHelper.ts";
import {ErrorPage} from "../../ErrorPage/ErrorPage.tsx";

export interface QuizMasterChildrenProps {
    quizSessionManager: QuizSessionManagerInterface
    endQuizSession: () => void
    buttonClickDisabled: boolean
    disableButtonShortly: () => void
}

export const QuizMaster: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const quizSessionId: string | null = state ? state.quizSessionId : localStorage.getItem('quizSessionId');
    const quizId: string | null = state ? state.quizId : localStorage.getItem('quizId');

    const [quizSessionManager, setQuizSessionManager] = useState(QuizSessionManager.getInstanceAsInterface());

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [isSetUp, setIsSetUp] = useState(false);
    const [screenIsUnsupported, setScreenIsUnsupported] = useState(false)
    const [errorGettingSession, setErrorGettingSession] = useState(false)
    const [buttonClickDisabled, setButtonClickDisabled] = useState(false);

    const setQuizFromFirestore = async (quizID: string) => {
        if (quizID == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        if (user?.uid != null) return await QuizRepository.getById(user!.uid!, quizID)

        showPopupSomethingWentWrong(showPopup, hidePopup)
        return
    }

    const handleEndQuizSession = () => {
        // TODO: later also implement being able to go back to the previous question
        // navigate to quiz end screen, where user can still download a report before the session gets killed on the server - for this the quizstate needs to be set to endscreen
        // OR if the user is already on the quiz end screen (quizstate is already set to end screen), kill the quiz session and take the user back to home -> no popup in this case
        if (QuizSessionManager.getInstance().quizState == QuizState.endscreen) {
            QuizSessionManager.getInstance().killSession()
            navigate('/overview')
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
                hidePopup()
            },
            onPrimaryClick: () => {
                if (QuizSessionManager.getInstance().quizSession == null) {
                    showPopupSomethingWentWrong(showPopup, hidePopup)
                    return
                }
                QuizSessionManager.getInstance().changeState(QuizState.endscreen)
                hidePopup()
            },
        };
        showPopup(endQuizPopup);
    }
    const disableButtonShortly = () => {
        setButtonClickDisabled(true)
        setTimeout(() => {
            setButtonClickDisabled(false);
        }, 1000)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }
    const hidePopup = () => {
        setShowingPopup(false)
    }

    // check login status, get quiz from firebase and setup connection to server
    const setUp = async () => {
        // make sure we have all necessary info passed to the route
        if (quizSessionId == null || quizId == null) {
            console.log("no quiz id or quiz session")
            showErrorPageNothingToFind(navigate)
            return
        }

        // check that the info we have passed to the route is actually related to a running quiz session that we are hosting and fix if necessary
        if (user) {
            const quizSession: QuizSession | null = await QuizSessionService.checkHostReconnection(user.uid)
            if (quizSession == null) {
                console.log("no quiz session")
                showErrorPageNothingToFind(navigate)
                return
            }
            if (quizSessionId != quizSession.id || quizId != quizSession.quizId) {
                QuizSessionManager.getInstance().resetManager();
                navigate('/quiz', {state: {quizSessionId: quizSession.id, quizId: quizSession.quizId}})
                return
            }
        }

        await logInWithEmailLink(window.location.href, () => {
            navigate("/login")
        }, showPopup, hidePopup)
        const quiz = await setQuizFromFirestore(quizId)
        if (quiz == undefined) {
            console.log("no quiz found in firebase")
            showErrorPageSomethingWentWrong(navigate)
            return
        }
        const host = quiz.quizUser
        setIsSetUp(true)

        await QuizSessionManager.getInstance().setUp(quizSessionId, host, quiz)
    }

    useEffect(() => {
        const resize = () => {
            handleResize(setScreenIsUnsupported)
        }
        resize()
        window.addEventListener('resize', resize);

        const handleQuizSessionManagerChange = () => {
            if (QuizSessionManager.getInstanceAsInterface().errorGettingSession != QuizSessionStatus.Ok) {
                if (QuizSessionManager.getInstanceAsInterface().errorGettingSession == QuizSessionStatus.NoSession) {
                    showErrorPageNothingToFind(navigate, ErrorPageLinkedTo.Overview)
                } else if (QuizSessionManager.getInstanceAsInterface().errorGettingSession != QuizSessionStatus.ConnectionClosed) {
                    setErrorGettingSession(true)
                }
                QuizSessionManager.getInstance().errorGettingSession = QuizSessionStatus.Ok
                return
            }
            setQuizSessionManager(QuizSessionManager.getInstanceAsInterface());
        };
        QuizSessionManager.getInstance().subscribe(handleQuizSessionManagerChange);

        if (!loading && user) setUp()

        return () => {
            QuizSessionManager.getInstance().unsubscribe(handleQuizSessionManagerChange);
            window.removeEventListener('resize', resize);
        };
    }, [])

    useEffect(() => {
        if (!loading && !isSetUp && user) setUp()
        if (!loading && !user && isSetUp && !showingPopup) navigate("/login");
        if (error) console.log(error)
    }, [user, loading, navigate]);

    return (
        (screenIsUnsupported) ? (
            <ErrorPage
                message={"The screen you tried to view is not supported for your screen width."}
            />
        ) : (errorGettingSession) ? (
            <ErrorPage
                message={"There was an error connecting to the server and getting the quiz session."}
                linkTo={ErrorPageLinkedTo.Overview}
                buttonText={"Try Again"}
                onButtonClick={() => {
                    window.location.reload()
                }}
            />
        ) : (
        <div className="quizMaster">
            { (quizSessionManager.quizState === QuizState.lobby && quizSessionManager.sessionExists) &&
                <QuizLobby
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                    buttonClickDisabled={buttonClickDisabled}
                    disableButtonShortly={disableButtonShortly}
                />
            }
            { (quizSessionManager.quizState === QuizState.playing && quizSessionManager.sessionExists) &&
                <QuizSessionQuestion
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                    buttonClickDisabled={buttonClickDisabled}
                    disableButtonShortly={disableButtonShortly}
                />
            }
            { (quizSessionManager.quizState === QuizState.statistics && quizSessionManager.sessionExists) &&
                <QuizResult
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                    buttonClickDisabled={buttonClickDisabled}
                    disableButtonShortly={disableButtonShortly}
                />
            }
            { (quizSessionManager.quizState === QuizState.leaderboard && quizSessionManager.sessionExists) &&
                <QuizLeaderboard
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                    buttonClickDisabled={buttonClickDisabled}
                    disableButtonShortly={disableButtonShortly}
                />
            }
            { (quizSessionManager.quizState === QuizState.podium && quizSessionManager.sessionExists) &&
                <QuizPodium
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                    buttonClickDisabled={buttonClickDisabled}
                    disableButtonShortly={disableButtonShortly}
                />
            }
            { (quizSessionManager.quizState === QuizState.endscreen && quizSessionManager.sessionExists) &&
                <QuizEnd
                    quizSessionManager={quizSessionManager}
                    endQuizSession={handleEndQuizSession}
                    buttonClickDisabled={buttonClickDisabled}
                    disableButtonShortly={disableButtonShortly}
                />
            }
            { (loading || quizSessionManager.quizState == null || !quizSessionManager.sessionExists) &&
                <LoadingPage hasBottomNavBar={false}/>
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
    )
}

