import {FC, useEffect, useState} from "react";
import "./CreateOverview.css"
import {useLocation, useNavigate} from 'react-router-dom';
import {makeQuiz, Quiz} from "../../../models/Quiz.ts";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCardContainer} from "../../../components/QuizCardContainer/QuizCardContainer.tsx";
import {QuizSettingsPopup} from "../../../components/QuizSettingsPopup/QuizSettingsPopup.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import QuizRepository from "../../../repositories/QuizRepository.ts";
import QuizSessionService from "../../../services/QuizSessionService.ts";
import {v4 as uuid} from "uuid";
import QuizSession from "../../../models/QuizSession.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {LEAVE_ICON_DARK, PLAY_ICON_LIGHT} from "../../../assets/Icons.ts";
import {
    ErrorPageLinkedTo,
    showErrorPageScreenNotSupported,
    showErrorPageSomethingWentWrong
} from "../../ErrorPage/ErrorPageExports.ts";
import {quizOptionsAreEqual} from "../../../models/QuizOptions.ts";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";
import {auth, logInWithEmailLink, logOutUser} from "../../../firebase/auth.ts";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loading } from "../../Loading/Loading.tsx";
import {showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";
import QuizUser from "../../../models/QuizUser.ts";
import {getDeviceId} from "../../../helper/DeviceHelper.ts";
import {QuizSessionManagerSlave} from "../../../managers/QuizSessionManagerSlave.tsx";

export const CreateOverview: FC = () => {
    // set up router stuff and getting query parameters
    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const showingPopupForID: string | null = state ? state.showingPopupFor : null;

    // setup states and other stuff
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [quizSettingsPopupProps, setQuizSettingsPopupProps] = useState<[Quiz, boolean] | null>(null);
    const [showingQuizSettingsPopup, setShowingQuizSettingsPopup] = useState(false);
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [isSetUp, setIsSetUp] = useState(false);
    
    // get all of a user's quizzes from firebase
    const setQuizzesFromFirestore = async (userId: string) => {
        const quizzesFromFirestore: Quiz[] = await QuizRepository.getAll(userId)
        
        // sort quizzes by createdOn date, and display newest at the start
        const sortByCreatedOn = (a: Quiz, b: Quiz) => {
            if (a.createdOn < b.createdOn) { return 1 }
            if (a.createdOn > b.createdOn) { return -1 }
            return 0
        };
        const sortedQuizzes = quizzesFromFirestore.slice().sort(sortByCreatedOn)
        setQuizzes(sortedQuizzes)
    }
    
    // if we just came back from somewhere and we still want to see the quiz settings, do so based on the query parameter
    const showPopupForQuery = () => {
        if (showingPopupForID == null) return
        const showingPopupForQuiz = quizzes.find(quiz => quiz.id === showingPopupForID)
        if (showingPopupForQuiz == null) return
        setQuizSettingsPopupProps([showingPopupForQuiz, false])
        setShowingQuizSettingsPopup(true)
    }
    
    useEffect(() => {
        // redirect if the screen is too narrow
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                showErrorPageScreenNotSupported(navigate)
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const setUp = async () => {
            await logInWithEmailLink(window.location.href, () => {
                navigate("/login")
            }, showPopup, hidePopup)
            if (user) await setQuizzesFromFirestore(user.uid)
            setIsSetUp(true)
        }
        setUp()

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        showPopupForQuery()
    }, [quizzes]);
    useEffect(() => {
        if (!loading && !user && isSetUp && !showingPopup) navigate("/login");
        if (user && isSetUp && !showingPopup) {
            navigate("/overview");
            setQuizzesFromFirestore(user.uid)
                .then(() => {
                    QuizSessionManager.checkReconnectionMaster(user.uid, setPopupProps, setShowingPopup, navigate)
                })
        }
        if (error) console.log(error)
    }, [user, loading, navigate]);

    // quiz functions
    const findQuizByID = (id: string): Quiz | undefined => {
        return quizzes.find(quiz => quiz.id === id)
    }
    const handleAddQuiz = async () => {
        // open new quiz settings popup which will create a quiz and update the quizzes state when closed, or when clicked on "edit questions" button
        if (user?.uid == null) {
            showPopupSomethingWentWrong(showPopup, hidePopup)
            return
        }
        const authUser = await QuizRepository.getUser(user.uid)
        const newQuiz = makeQuiz(authUser)
        setQuizSettingsPopupProps([newQuiz, true])
        setShowingQuizSettingsPopup(true)
    };
    const handleEditQuiz = async (id: string) => {
        const editQuiz = () => {
            const quizToBeEdited = findQuizByID(id)
            if (quizToBeEdited == undefined) {
                showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
                return
            }
            setQuizSettingsPopupProps([quizToBeEdited, false])
            setShowingQuizSettingsPopup(true)
        }

        // prevent user from editing quiz which is currently running
        await editOrDeleteIfNotRunning(id, "edit", editQuiz)
    };
    const handlePlayQuiz = async (id: string) => {
        const playQuiz = async () => {
            const quizToBePlayed: Quiz | undefined = findQuizByID(id)
            if (quizToBePlayed == undefined || user == undefined) {
                showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
                return
            }

            // create a new quiz session
            const quizSessionPlay: QuizSession = {
                id: uuid(),
                quizId: quizToBePlayed!.id,
                hostId: user?.uid,
                state: {
                    currentQuestionId: quizToBePlayed!.questions[0].id,
                    usersStats: [ /**keep it empty at the beginning */],
                    currentQuizState: "lobby"
                },
            };

            QuizSessionManager.getInstance().resetManager()

            // send the quiz session to the backend
            await QuizSessionService.addSession(quizSessionPlay)

            // send the quiz data to the backend too
            await QuizSessionService.addQuestionsToSession(quizSessionPlay.id,quizToBePlayed.questions);

            // navigate to the lobby page
            navigate('/quiz', {state: {quizSessionId: quizSessionPlay.id, quizId: quizToBePlayed!.id}})
        }

        // check that user is not a player in quiz already
        const quizUser: QuizUser | null = localStorage.getItem("quizUser") ? JSON.parse(localStorage.getItem("quizUser")!) : null;
        const deviceId: string = quizUser?.deviceId ?? await getDeviceId();
        const reconnect: {
            quizUser: QuizUser,
            quizSession: QuizSession
        } | null = await QuizSessionService.checkQuizUserReconnection(deviceId)

        if (reconnect) {
            setPopupProps({
                title: "You are already connected to a quiz as a player.",
                message: `This device is currently connected as "${reconnect.quizUser.identifier}" in a quiz. To start your own quiz session, please leave the other quiz first.`,
                type: BottomNavBarType.Default,
                onPrimaryClick: () => {
                    QuizSessionManagerSlave.getInstance().killSession()
                    navigate("/quiz/player", {
                        state: {
                            quizSessionId: reconnect.quizSession.id,
                            quizUser: reconnect.quizUser
                        }
                    })
                },
                primaryButtonText: "Reconnect As Player",
                primaryButtonIcon: PLAY_ICON_LIGHT,
                onSecondaryClick: () => {
                    setShowingPopup(false);
                    setPopupProps(null);
                },
                secondaryButtonText: "Cancel",
                secondaryButtonIcon: null
            })
            setShowingPopup(true)
            return
        }

        // warn user if another session is already running, or else just start a new session
        if (user == undefined) return await playQuiz()
        const quizSession: QuizSession | null = await QuizSessionService.checkHostReconnection(user.uid)
        if (quizSession == null) return await playQuiz()

        setPopupProps({
            title: "You still have another quiz session running.",
            message: "Do you want to proceed with starting a new quiz session? This will end the session which is still running.",
            type: BottomNavBarType.Default,
            onPrimaryClick: () => {
                playQuiz()
            },
            primaryButtonText: "Start New Session",
            primaryButtonIcon: PLAY_ICON_LIGHT,
            onSecondaryClick: () => {
                setShowingPopup(false);
                setPopupProps(null);
            },
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null
        })
        setShowingPopup(true)
    };

    //quiz settings popup functions
    const handleEditQuizSave = async (id: string, updatedQuiz: Quiz): Promise<void> => {
        const previousQuiz = findQuizByID(id)

        // if the quiz does not exist yet, we likely just created it and we have to add it
        if (previousQuiz == undefined) {
            setQuizzes([updatedQuiz, ...quizzes])
            if (user?.uid != null) await QuizRepository.add(user.uid, updatedQuiz)
            else showPopupSomethingWentWrong(showPopup, hidePopup)
            return
        }

        // else update the quiz if it existed before and its title or settings were changed
        if (previousQuiz.name != updatedQuiz.name || !quizOptionsAreEqual(previousQuiz.options, updatedQuiz.options)) {
            const updatedQuizzes = [...quizzes]
            const index = updatedQuizzes.indexOf(previousQuiz)
            if (index < 0) {
                showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            }
            updatedQuizzes[index] = updatedQuiz
            setQuizzes(updatedQuizzes)
            if (user?.uid != null) await QuizRepository.add(user.uid, updatedQuiz)
            else showPopupSomethingWentWrong(showPopup, hidePopup)
        }
    }
    const handleEditQuizClose = () => {
        setQuizSettingsPopupProps(null)
        setShowingQuizSettingsPopup(false)
        if (showingPopupForID != null) navigate('/overview') // hack to remove the search parameter so the popup does not keep reappearing if the user refreshes the page
        
        if (user?.uid != null) setQuizzesFromFirestore(user.uid) // reload quizzes
        else showPopupSomethingWentWrong(showPopup, hidePopup)

    };
    const handleEditQuizEditQuestions = (id: string) => {
        navigateToEditor(id)
    };
    const handleDeleteQuiz = async (id: string) => {
        const deleteQuiz = () => {
            // popup for confirmation
            const deletePopup: PopupProps = {
                title: "Are you sure you want to delete this quiz?",
                message: "This action cannot be undone.",
                secondaryButtonText: "Cancel",
                secondaryButtonIcon: null,
                primaryButtonText: "Yes, I Am Sure",
                primaryButtonIcon: null,
                type: BottomNavBarType.Default,
                onSecondaryClick: () => {
                    hidePopup()
                },
                onPrimaryClick: () => {
                    if (user?.uid == null) {
                        showPopupSomethingWentWrong(showPopup, () => setShowingPopup(false))
                        return
                    }
                    // delete quiz from firebase and quizzes state
                    QuizRepository.delete(user!.uid, id).then(() => {
                        if (showingQuizSettingsPopup) handleEditQuizClose()
                        const updatedQuizzes = [...quizzes]
                        const index = updatedQuizzes.findIndex(quiz => quiz.id == id)
                        updatedQuizzes.splice(index, 1);
                        setQuizzes(updatedQuizzes)
                        hidePopup()
                    })
                },
            }
            showPopup(deletePopup)
        }

        // prevent user from deleting quiz which is currently running
        await editOrDeleteIfNotRunning(id, "delete", deleteQuiz)
    };
    const editOrDeleteIfNotRunning = async (id: string, action: string, editOrDelete: () => void) => {
        // prevent user from editing or deleting quiz which is currently running
        if (user == undefined) return editOrDelete()
        const quizSession: QuizSession | null = await QuizSessionService.checkHostReconnection(user.uid)
        if (quizSession == null || quizSession.quizId != id) return editOrDelete()

        setPopupProps({
            title: `You cannot ${action} this quiz right now.`,
            message: `This quiz is currently being played. Please end the quiz session first in order to ${action} the quiz.`,
            type: BottomNavBarType.Default,
            onPrimaryClick: () => {
                QuizSessionManager.getInstance().resetManager();
                navigate('/quiz', {state: {quizSessionId: quizSession.id, quizId: quizSession.quizId}})
            },
            primaryButtonText: "To Quiz Session",
            primaryButtonIcon: PLAY_ICON_LIGHT,
            onSecondaryClick: () => {
                setShowingPopup(false);
                setPopupProps(null);
            },
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null
        })
        setShowingPopup(true)
    }

    // nav functions
    const navigateToEditor = (id: string) => {
        navigate(`/overview/editor?id=${id}`)
    }
    const logOut = () => {
        const logOutPopup: PopupProps = {
            title: "Are you sure you want to log out?",
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
                logOutUser();
                navigate(`/`)
            },
        }
        showPopup(logOutPopup)
    }
    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }
    const hidePopup = () => {
        setShowingPopup(false)
    }

    return (
        <div className="createOverview">
            <BackgroundGems type={BackgroundGemsType.Primary}/>

            {(loading || !isSetUp) ? (
                <Loading/>
            ) : (
                <div className="content">
                    <h1>Welcome, User</h1>
                    <QuizCardContainer
                        quizzes={quizzes}
                        onEdit={handleEditQuiz}
                        onPlay={handlePlayQuiz}
                        onAdd={handleAddQuiz}
                        onDelete={handleDeleteQuiz}
                    />
                </div>
            )}

            <BottomNavBar
                secondaryButtonText="Logout"
                secondaryButtonIcon={LEAVE_ICON_DARK}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={logOut}
            />

            { (showingQuizSettingsPopup && quizSettingsPopupProps != null) &&
                <QuizSettingsPopup
                    selectedQuiz={quizSettingsPopupProps[0]}
                    onSave={handleEditQuizSave}
                    onClose={handleEditQuizClose}
                    onEditQuestions={handleEditQuizEditQuestions}
                    showPopup={showPopup}
                    hidePopup={hidePopup}
                    newlyAdded={quizSettingsPopupProps[1]}
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
                    isPrompt={popupProps.isPrompt}
                />
            }
        </div>
    )
}