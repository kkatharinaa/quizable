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
import {getDeviceId} from "../../../helper/DeviceHelper.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {LEAVE_ICON_DARK} from "../../../assets/Icons.ts";
import {ErrorPageLinkedTo, showErrorPageSomethingWentWrong} from "../../ErrorPage/ErrorPageExports.ts";
import {quizOptionsAreEqual} from "../../../models/QuizOptions.ts";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";
import {auth, logInWithEmailLink, logOutUser} from "../../../firebase/auth.ts";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loading } from "../../Loading/Loading.tsx";
import {showPopupSomethingWentWrong} from "../../../components/Popup/PopupExports.ts";

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
                navigate('/')
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const setUp = async () => {
            await logInWithEmailLink(window.location.href, showPrompt, () => {
                navigate("/login")
            })
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
        if (!user && isSetUp && !showingPopup) navigate("/login");
        if (user && isSetUp && !showingPopup) {
            navigate("/overview");
            setQuizzesFromFirestore(user.uid)
        }
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
                hidePopup()
                onError()
            },
            onPrimaryClick: (inputValue: string) => {
                onSubmitSuccess(inputValue, url, onError).then(() => {
                    hidePopup()
                })
            },
            isPrompt: true,
        }
        showPopup(promptPopup)
    }

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
    const handleEditQuiz = (id: string) => {
        const quizToBeEdited = findQuizByID(id)
        if (quizToBeEdited == undefined) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        setQuizSettingsPopupProps([quizToBeEdited, false])
        setShowingQuizSettingsPopup(true)
    };
    const handlePlayQuiz = async (id: string) => {
        const quizToBePlayed: Quiz | undefined = findQuizByID(id)
        if (quizToBePlayed == undefined) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }

        // create a new quiz session
        const quizSessionPlay: QuizSession = {
            id: uuid(),
            quizId: quizToBePlayed!.id, 
            deviceId: await getDeviceId(),
            state: {
                currentQuestionId: quizToBePlayed!.questions[0].id,
                usersStats: [ /**keep it empty at the beginning */],
                currentQuizState: "lobby"
            },
        };

        QuizSessionManager.getInstance().killSession()

        // send the quiz session to the backend
        await QuizSessionService.addSession(quizSessionPlay)

        // send the quiz data to the backend too
        await QuizSessionService.addQuestionsToSession(quizSessionPlay.id,quizToBePlayed.questions);

        // navigate to the lobby page
        navigate('/quiz', {state: {quizSessionId: quizSessionPlay.id, quizId: quizToBePlayed!.id}})
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
    const handleDeleteQuiz = (id: string) => {
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
    };

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