import {FC, useEffect, useState} from "react"
import "./QuizMaster.css"
import {useLocation, useNavigate} from "react-router-dom";
import {
    ErrorPageLinkedTo, showErrorPageNothingToFind,
    showErrorPageSomethingWentWrong,
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
import {QuizSessionManager, QuizSessionManagerInterface} from "../../../managers/QuizSessionManager.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, logInWithEmailLink} from "../../../firebase/auth.ts";
import {LoadingPage} from "../../Loading/Loading.tsx";

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
    const [user, loading, error] = useAuthState(auth);
    const [isSetUp, setIsSetUp] = useState(false);
    
    const setQuizFromFirestore = async (quizID: string) => {
        if (quizID == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        if (user?.uid != null) await QuizRepository.getById(user!.uid!, quizID)
        else showPopupSomethingWentWrong(showPopup, hidePopup)
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
        // redirect if the screen is too narrow
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                navigate('/')
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // make sure we have all necessary info passed to the route
        if (quizSessionId == null || quizId == null) {
            console.log("no quiz id or quiz session")
            showErrorPageNothingToFind(navigate)
            return
        }

        const handleQuizSessionManagerChange = () => {
            setQuizSessionManager(QuizSessionManager.getInstanceAsInterface());
        };
        QuizSessionManager.getInstance().subscribe(handleQuizSessionManagerChange);

        // get quiz from firebase and setup connection
        const setUp = async () => {
            await logInWithEmailLink(window.location.href, showPrompt, () => {
                navigate("/login")
            })
            const quiz = await setQuizFromFirestore(quizId)
            if (quiz == null) {
                console.log("no quiz id or quiz session")
                showErrorPageSomethingWentWrong(navigate)
                return
            }
            const host = quiz.quizUser
            setIsSetUp(true)

            await QuizSessionManager.getInstance().setUp(quizSessionId, host, quiz)
        }

        setUp()

        return () => {
            QuizSessionManager.getInstance().unsubscribe(handleQuizSessionManagerChange);
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    useEffect(() => {
        if (!user && isSetUp && !showingPopup) navigate("/login");
        if (error) console.log(error)
    }, [user, loading, navigate]);

    // prompt for auth
    const showPrompt = (title: string, url: string, onSubmitSuccess: (email: string, url: string, onError: () => void) => Promise<void>, onError: () => void) => {
        const promptPopup: PopupProps = {
            title: title,
            message: null,
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Submit",
            primaryButtonIcon: null,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
                onError()
            },
            onPrimaryClick: (inputValue: string) => {
                onSubmitSuccess(inputValue, url, onError).then(() => {
                    setShowingPopup(false)
                })
            },
            isPrompt: true,
        }
        showPopup(promptPopup)
    }

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
}

