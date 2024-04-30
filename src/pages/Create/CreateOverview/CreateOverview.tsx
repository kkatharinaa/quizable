import {FC, useEffect, useState} from "react";
import "./CreateOverview.css"
import {useLocation, useNavigate} from 'react-router-dom';
import {Quiz} from "../../../models/Quiz.ts";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCardContainer} from "../../../components/QuizCardContainer/QuizCardContainer.tsx";
import {QuizSettingsPopup} from "../../../components/QuizSettingsPopup/QuizSettingsPopup.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import QuizRepository from "../../../repositories/QuizRepository.ts";
import QuizSessionService from "../../../services/QuizSessionService.ts";
import {v4 as uuid} from "uuid";
import { getDeviceId } from "../../../helper/DeviceHelper.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {QuizOptions} from "../../../models/QuizOptions.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {LEAVE_ICON_DARK} from "../../../assets/Icons.ts";
import {ErrorPageLinkedTo, showErrorPageSomethingWentWrong} from "../../ErrorPage/ErrorPageExports.ts";

export const CreateOverview: FC = () => {
    // set up router stuff and getting query parameters
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // setup states and other stuff
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [quizSettingsPopupProps, setQuizSettingsPopupProps] = useState<[Quiz, boolean] | null>(null);
    const [showingQuizSettingsPopup, setShowingQuizSettingsPopup] = useState(false);
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    // TODO: check if we are logged in!! else redirect to home

    // get all of this user's quizzes from firebase TODO: only get it from the logged in user!
    const setQuizzesFromFirestore = async () => {
        const quizzesFromFirestore: Quiz[] = await QuizRepository.getAll()

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
        const showingPopupForID = searchParams.get('showingPopupFor');
        if (showingPopupForID == null) return
        const showingPopupForQuiz = quizzes.find(quiz => quiz.id === showingPopupForID)
        if (showingPopupForQuiz == null) return
        setQuizSettingsPopupProps([showingPopupForQuiz, false])
        setShowingQuizSettingsPopup(true)
    }

    useEffect(() => {
        setQuizzesFromFirestore()
    }, []);
    useEffect(() => {
        showPopupForQuery()
    }, [quizzes]);

    // quiz functions
    const findQuizByID = (id: string): Quiz | undefined => {
        return quizzes.find(quiz => quiz.id === id)
    }
    const handleAddQuiz = () => {
        // open new quiz settings popup which will create a quiz and update the quizzes state when closed, or when clicked on "edit questions" button
        const newQuiz = new Quiz()
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
                currentQuizState: "start"
            },
            options: quizToBePlayed!.options
        };

        // send the quiz session to the backend
        await QuizSessionService.addSession(quizSessionPlay)

        // navigate to the lobby page
        navigate('/quiz/lobby', {state: {quizSessionId: quizSessionPlay.id}})
    };

    //quiz settings popup functions
    const handleEditQuizSave = async (id: string, updatedQuiz: Quiz): Promise<void> => {
        const previousQuiz = findQuizByID(id)

        // if the quiz does not exist yet, we likely just created it and we have to add it
        if (previousQuiz == undefined) {
            setQuizzes([updatedQuiz, ...quizzes])
            await QuizRepository.add(updatedQuiz)
            return
        }

        // else update the quiz if it existed before and its title or settings were changed
        if (previousQuiz.name != updatedQuiz.name || !QuizOptions.isEqual(previousQuiz.options, updatedQuiz.options)) {
            const updatedQuizzes = [...quizzes]
            const index = updatedQuizzes.indexOf(previousQuiz)
            if (index < 0) {
                showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            }
            updatedQuizzes[index] = updatedQuiz
            setQuizzes(updatedQuizzes)
            await QuizRepository.add(updatedQuiz)
        }
    }
    const handleEditQuizClose = () => {
        setQuizSettingsPopupProps(null)
        setShowingQuizSettingsPopup(false)
        if (searchParams.get('showingPopupFor')) navigate('/overview') // hack to remove the search parameter so the popup does not keep reappearing if the user refreshes the page
        setQuizzesFromFirestore() // reload quizzes
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
                // delete quiz from firebase and quizzes state
                QuizRepository.delete(id).then(() => {
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
                // TODO: log out from firebase auth
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
                />
            }
        </div>
    )
}