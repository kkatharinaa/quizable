import React, {FC, useEffect, useState} from "react";
import "./CreateEditor.css"
import {Quiz} from "../../../models/Quiz.ts";
import {makeQuestion, Question, questionArraysAreEqual} from "../../../models/Question.ts";
import {RETURN_ICON_DARK, SAVE_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuestionEditor} from "../../../components/QuestionEditor/QuestionEditor.tsx";
import {QuestionEditorNav} from "../../../components/QuestionEditorNav/QuestionEditorNav.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import QuizRepository from "../../../repositories/QuizRepository.ts";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {QuestionSettingsPopup} from "../../../components/QuestionSettingsPopup/QuestionSettingsPopup.tsx";
import {
    ErrorPageLinkedTo,
    showErrorPageNothingToFind,
    showErrorPageSomethingWentWrong
} from "../../ErrorPage/ErrorPageExports.ts";
import {makeAnswer} from "../../../models/Answer.ts";

export const CreateEditor: FC = () => {

    // set up router stuff and getting query parameters
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // TODO: check that we are logged in!! else redirect to home

    //const { quizID } = useParams();
    const quizID = searchParams.get('id');
    if (!quizID) {
        showErrorPageNothingToFind(navigate, ErrorPageLinkedTo.Overview)
    }

    const [originalQuiz, setOriginalQuiz] = useState<Quiz | null>(null) // only needed for saving
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [showingQuestionSettingsPopup, setShowingQuestionSettingsPopup] = useState(false);
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    // get quiz from Firebase using the quizID
    const setQuizFromFirestore = async () => {
        if (quizID == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const quizFromFirestore: Quiz = await QuizRepository.getById(quizID)
        setQuestions(quizFromFirestore.questions)
        setCurrentQuestionIndex(0)
        setOriginalQuiz(quizFromFirestore)
    }

    useEffect(() => {
        setQuizFromFirestore()
    }, []);

    // question functions
    const handleQuestionTitleInputChange = (value: string) => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const updatedQuestions = [...questions]
        // create a copy of the question we want to update, change the value we want to change and reassign it to the state copy (updatedquestions)
        updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            questionText: value
        }
        setQuestions(updatedQuestions)
    };
    const handleQuestionSettingsClick = () => {
        setShowingQuestionSettingsPopup(true)
    };
    const handleQuestionSettingsClose = (updatedQuestion: Question) => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = updatedQuestion
        setQuestions(updatedQuestions);
        setShowingQuestionSettingsPopup(false)
    }
    const handleQuestionDelete = () => {
        if (questions.length == 1) { return } // quiz has to have at least one question

        const deleteConfirmationPopup: PopupProps = {
            title: "Are you sure you want to delete this question?",
            message: "This action cannot be undone.",
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                // delete question
                if (currentQuestionIndex == null) {
                    showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
                    return
                }
                const updatedQuestions = [...questions]
                updatedQuestions.splice(currentQuestionIndex, 1);
                setCurrentQuestionIndex(currentQuestionIndex == 0 ? 0 : currentQuestionIndex-1)
                setQuestions(updatedQuestions)
                setShowingPopup(false)
            },
        }
        showPopup(deleteConfirmationPopup)
    };
    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index)
    }
    const handleQuestionAdd = () => {
        const newQuestion = makeQuestion()
        if (originalQuiz != null) {
            newQuestion.maxQuestionTime = originalQuiz.options.maxQuestionTime
            newQuestion.questionPoints = originalQuiz.options.questionPoints
            newQuestion.questionPointsModifier = originalQuiz.options.questionPointsModifier
            newQuestion.showLiveStats = originalQuiz.options.showLiveStats
        }
        const updatedQuestions = [...questions, newQuestion]
        setQuestions(updatedQuestions)
    }
    const handleQuestionDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };
    const handleQuestionDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const handleQuestionDragDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const updatedQuestions = [...questions];
        const [draggedItem] = updatedQuestions.splice(dragIndex, 1);
        updatedQuestions.splice(dropIndex, 0, draggedItem);

        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        if (dragIndex == currentQuestionIndex) { // we dragged our selected question somewhere else, so the currentQuestionIndex has to be updated to the new index
            setCurrentQuestionIndex(dropIndex)
        } else if (dropIndex < dragIndex) { // we dragged a question which was not the selected question in front of our selected question
            setCurrentQuestionIndex(currentQuestionIndex+1)
        } else if (dropIndex > dragIndex) { // we dragged a question which was not the selected question to a place somewhere behind/after of our selected question
            setCurrentQuestionIndex(currentQuestionIndex-1)
        }
        setQuestions(updatedQuestions);
    };
    /*const handleQuestionDragEnd = () => {
        // Additional cleanup if needed
    };*/

    // answer functions
    const handleAnswerInputChange = (value: string, index: number) => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const updatedQuestions = [...questions]
        updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            answers: updatedQuestions[currentQuestionIndex].answers.map((answer, i) => {
                if (i === index) {
                    // update the value of the answer at the specified index
                    return { ...answer, value };
                }
                return answer;
            })
        };
        setQuestions(updatedQuestions)
    };
    const handleAnswerDelete = (index: number) => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const updatedQuestions = [...questions]
        updatedQuestions[currentQuestionIndex].answers.splice(index, 1);
        setQuestions(updatedQuestions)
    }
    const handleAnswerToggleCorrect = (index: number) => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const updatedQuestions = [...questions]
        // set only the answer at the specified index to true
        updatedQuestions[currentQuestionIndex].answers = updatedQuestions[currentQuestionIndex].answers.map((answer, i) => ({
            ...answer,
            correct: i === index
        }))
        setQuestions(updatedQuestions)
    }
    const handleAnswerAdd = () => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        if (questions[currentQuestionIndex].answers.length == 6) { return } // max 6 answers per question
        const updatedQuestions = [...questions]
        const currentQuestion = updatedQuestions[currentQuestionIndex];
        const newAnswers = [...currentQuestion.answers, makeAnswer()];
        updatedQuestions[currentQuestionIndex] = {...currentQuestion, answers: newAnswers};
        setQuestions(updatedQuestions)
    }
    const handleAnswerDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };
    const handleAnswerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const handleAnswerDragDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        if (currentQuestionIndex == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const updatedQuestions = [...questions];
        const [draggedItem] = updatedQuestions[currentQuestionIndex].answers.splice(dragIndex, 1);
        updatedQuestions[currentQuestionIndex].answers.splice(dropIndex, 0, draggedItem);
        setQuestions(updatedQuestions);
    };
    /*const handleAnswerDragEnd = () => {
        // Additional cleanup if needed
    };*/

    // nav functions
    const saveQuiz = () => {
        if (originalQuiz == null) {
            showErrorPageSomethingWentWrong(navigate, ErrorPageLinkedTo.Overview)
            return
        }
        if (!questionArraysAreEqual(originalQuiz.questions, questions)) {
            const updatedQuiz = {...originalQuiz, questions: questions}
            QuizRepository.add(updatedQuiz)
        }
        navigateToOverview()
    };
    const toOverview = () => {
        // check if sth has been changed, if no simply go back, if yes show a popup
        if (originalQuiz != null && questionArraysAreEqual(originalQuiz.questions, questions)) {
            navigateToOverview()
            return
        }
        const discardChangesPopup: PopupProps = {
            title: "Are you sure you want to discard your changes?",
            message: "This action cannot be undone.",
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                navigateToOverview()
            },
        }
        showPopup(discardChangesPopup)
    }
    const navigateToOverview = () => {
        navigate(`/overview?showingPopupFor=${quizID}`)
    }
    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    return (
        <div className="createEditor">
            <BackgroundGems type={BackgroundGemsType.Grey}/>
            <div className="contentAndMenu">
                { originalQuiz != null &&
                <p className="quizName">{`Quiz / ${originalQuiz.name}`}</p>
                }
                { currentQuestionIndex != null &&
                <QuestionEditor
                    index={currentQuestionIndex}
                    questionTitle={questions[currentQuestionIndex].questionText}
                    answers={questions[currentQuestionIndex].answers}
                    canBeDeleted={questions.length>1}
                    onTitleChange={handleQuestionTitleInputChange}
                    onSettingsClick={handleQuestionSettingsClick}
                    onDelete={handleQuestionDelete}
                    onAnswerChange={handleAnswerInputChange}
                    onAnswerDelete={handleAnswerDelete}
                    onAnswerToggleCorrect={handleAnswerToggleCorrect}
                    onAnswerAdd={handleAnswerAdd}
                    onAnswerDragStart={handleAnswerDragStart}
                    onAnswerDragOver={handleAnswerDragOver}
                    onAnswerDragDrop={handleAnswerDragDrop}
                />}
                { currentQuestionIndex != null &&
                <QuestionEditorNav
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelect={handleQuestionSelect}
                    onAdd={handleQuestionAdd}
                    onDragStart={handleQuestionDragStart}
                    onDragOver={handleQuestionDragOver}
                    onDragDrop={handleQuestionDragDrop}
                />}
            </div>

            <BottomNavBar
                secondaryButtonText="Back"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText="Save Quiz"
                primaryButtonIcon={SAVE_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={toOverview}
                onPrimaryClick={saveQuiz}
            />

            { (showingQuestionSettingsPopup && currentQuestionIndex != null && originalQuiz != null) &&
                <QuestionSettingsPopup
                    selectedQuestion={questions[currentQuestionIndex]}
                    onClose={handleQuestionSettingsClose}
                    quiz={originalQuiz}
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
            />}
        </div>
    )
}