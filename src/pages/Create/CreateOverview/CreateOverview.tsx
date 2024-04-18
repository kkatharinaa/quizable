import {FC, useState} from "react";
import "./CreateOverview.css"
import {useLocation, useNavigate} from 'react-router-dom';
import {Quiz} from "../../../models/Quiz.ts";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCardContainer} from "../../../components/QuizCardContainer/QuizCardContainer.tsx";
import {QuizName} from "../../../models/ConstrainedTypes.ts";
import {QuizSettingsPopup} from "../../../components/QuizSettingsPopup/QuizSettingsPopup.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {PopupType} from "../../../components/Popup/PopupExports.ts";

export const CreateOverview: FC = () => {
    // set up router stuff and getting query parameters
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // TODO: check if we are logged in!! else redirect to home

    // TODO: get all of this user's quizzes from firebase
    // so far we dont have firebase implemented, so just use a fake collection of quizzes for testing purposes
    const originalQuizzes: Quiz[] = [{...Quiz.default, id: "3", name: QuizName.tryMake("this is a suuuuuuper long quiz name which was also created yesterday")!, createdOn: new Date(new Date().setDate(new Date().getDate() - 1))}, {...Quiz.default, id: "1"}, {...Quiz.default, id: "2"}]

    // TODO: sort quizzes by createdOn date, and display newest at the start or at the end (currently: newest at the end)? or allow reordering?
    const sortByCreatedOn = (a: Quiz, b: Quiz) => {
        if (a.createdOn < b.createdOn) { return -1 }
        if (a.createdOn > b.createdOn) { return 1 }
        return 0
    };
    const sortedQuizzes = originalQuizzes.slice().sort(sortByCreatedOn)

    // if we just came back from somewhere and we still want to see the quiz settings, do so based on the query parameter
    const showingPopupForID = searchParams.get('showingPopupFor');
    let initialQuizSettingsPopupProps: [index: number, quiz: Quiz] | null = null
    let initalShowingQuizSettingsPopup = false
    if (showingPopupForID) {
        const showingPopupForQuiz = sortedQuizzes.find(quiz => quiz.id === showingPopupForID)
        if (showingPopupForQuiz) {
            const index = sortedQuizzes.indexOf(showingPopupForQuiz)
            if (index >= 0) {
                initialQuizSettingsPopupProps = [index, showingPopupForQuiz]
                initalShowingQuizSettingsPopup = true
            }
        }
    }

    // setup states and other stuff
    const [quizzes, setQuizzes] = useState<Quiz[]>(sortedQuizzes);
    const [quizSettingsPopupProps, setQuizSettingsPopupProps] = useState<[index: number, quiz: Quiz] | null>(initialQuizSettingsPopupProps);
    const [showingQuizSettingsPopup, setShowingQuizSettingsPopup] = useState(initalShowingQuizSettingsPopup);
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    // quiz functions
    const handleAddQuiz = () => {
        // open new quiz settings popup which will create a quiz and update the quizzes state when closed, or when clicked on "edit questions" button
        setQuizSettingsPopupProps([-1, Quiz.default])
        setShowingQuizSettingsPopup(true)
    };
    const handleEditQuiz = (index: number) => {
        const quizToBeEdited = quizzes[index]
        setQuizSettingsPopupProps([index, quizToBeEdited])
        setShowingQuizSettingsPopup(true)
    };
    const handlePlayQuiz = (index: number) => {
        const quizToBePlayed = quizzes[index]
        // TODO: start playing quiz
    };

    //quiz settings popup functions
    const handleEditQuizSave = (index: number, updatedQuiz: Quiz) => {
        // create quiz in firebase if it didn't exist before
        if (index == -1) {
            // TODO: save quiz to firebase and update the quiz's id with the id from firebase
            setQuizzes([...quizzes, updatedQuiz])
            return quizzes.length-1 // TODO: wait for the set state to finish!!! also if we change for the newest quiz to be at the top, this has to be 0 and before that all quizzes need to be resorted
        }

        // else update the quiz if it existed before and it was changed
        const previousQuiz = quizzes[index]
        // if the title or any settings changed, save the changes
        if (previousQuiz.name != updatedQuiz.name || !previousQuiz.options.isEqual(updatedQuiz.options)) {
            const updatedQuizzes = [...quizzes]
            updatedQuizzes[index] = updatedQuiz
            setQuizzes(updatedQuizzes)
            // TODO: save changes to firebase
            return index
        }
    }
    const handleEditQuizClose = () => {
        setQuizSettingsPopupProps(null)
        setShowingQuizSettingsPopup(false)
        if (showingPopupForID) navigate('/overview') // hack to remove the search parameter so the popup does not keep reappearing if the user refreshes the page
    };
    const handleEditQuizEditQuestions = (index: number) => {
        navigateToEditor(quizzes[index].id)
    };
    const handleQuizDelete = () => {
        // TODO: delete quiz from firebase and from quizzes state
        // TODO: close popup if popup was open
        // TODO: implement in UI
    };

    // nav functions
    const navigateToEditor = (id: string) => {
        navigate(`/overview/editor?id=${id}`)
    }
    const logOut = () => {
        // TODO: adjust based on design
        const logOutPopup: PopupProps = {
            title: "Are you sure you want to log out?",
            message: null,
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: PopupType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                // TODO: log out, move back to homescreen
            },
        }
        showPopup(logOutPopup)
    }
    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    return (
        <div className="createOverview">

            <div className="content">
                <h1>Welcome, User</h1>
                <QuizCardContainer
                    quizzes={quizzes}
                    onEdit={handleEditQuiz}
                    onPlay={handlePlayQuiz}
                    onAdd={handleAddQuiz}
                />
            </div>

            <BottomNavBar
                secondaryButtonText="Logout"
                secondaryButtonIcon={null}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={logOut}
            />

            { (showingQuizSettingsPopup && quizSettingsPopupProps != null) &&
                <QuizSettingsPopup
                    index={quizSettingsPopupProps[0]}
                    selectedQuiz={quizSettingsPopupProps[1]}
                    onSave={handleEditQuizSave}
                    onClose={handleEditQuizClose}
                    onEditQuestions={handleEditQuizEditQuestions}
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