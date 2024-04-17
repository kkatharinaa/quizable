import React, {FC, useState} from "react";
import "./CreateEditor.css"
import {Quiz} from "../../../models/Quiz.ts";
import {QuizName} from "../../../models/ConstrainedTypes.ts";
import {QuizOptions} from "../../../models/QuizOptions.ts";
import {AuthenticatedUser} from "../../../models/AuthenticatedUser.ts";
import {Question} from "../../../models/Question.ts";
import {SAVE_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuestionEditor} from "../../../components/QuestionEditor/QuestionEditor.tsx";
import {Answer} from "../../../models/Answer.ts";
import {QuestionEditorNav} from "../../../components/QuestionEditorNav/QuestionEditorNav.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import {PopupType} from "../../../components/Popup/PopupExports.ts";

interface CreateEditorProps {
    quizID: string;
}

export const CreateEditor: FC<CreateEditorProps> = ({quizID}) => {
    // TODO: get quiz from Firebase using the quizID - rn I assume that before we reach the quizeditor screen, there will be the quiz detail popup, in which i first choose my quiz's title and settings, and it already gets saved like that with no questions to firebase. only if i click on a button there it will take me to this editor
    // so far we dont have firebase implemented, so just use a fake quiz
    const originalQuiz: Quiz = new Quiz(quizID, QuizName.tryMake("Untitled Quiz")!, [Question.empty], QuizOptions.default, AuthenticatedUser.default, new Date(), null)

    const initialPopup: PopupProps = {
        title: "",
        message: null,
        secondaryButtonText: "",
        secondaryButtonIcon: null,
        primaryButtonText: "",
        primaryButtonIcon: null,
        type: PopupType.Default
    }

    //const [quiz, setQuiz] = useState<Quiz>(originalQuiz);
    const [questions, setQuestions] = useState<Question[]>(originalQuiz.questions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [popupProps, setPopupProps] = useState(initialPopup);
    const [showingPopup, setShowingPopup] = useState(false);

    // question functions
    const handleQuestionTitleInputChange = (value: string) => {
        const updatedQuestions = [...questions]
        // create a copy of the question we want to update, change the value we want to change and reassign it to the state copy (updatedquestions)
        updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            questionText: value
        }
        setQuestions(updatedQuestions)
    };
    const handleQuestionSettingsClick = () => {
        // TODO: open settings editor popup for current question
    };
    const handleQuestionDelete = () => {
        if (questions.length == 1) { return } // quiz has to have at least one question

        // TODO: adjust popup based on design
        const deleteConfirmationPopup: PopupProps = {
            title: "Are you sure you want to delete this question?",
            message: "This action cannot be undone.",
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: PopupType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                // delete question
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
        const updatedQuestions = [...questions, Question.empty]
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
        const updatedQuestions = [...questions]
        updatedQuestions[currentQuestionIndex].answers.splice(index, 1);
        setQuestions(updatedQuestions)
    }
    const handleAnswerToggleCorrect = (index: number) => {
        const updatedQuestions = [...questions]
        // set only the answer at the specified index to true
        updatedQuestions[currentQuestionIndex].answers = updatedQuestions[currentQuestionIndex].answers.map((answer, i) => ({
            ...answer,
            correct: i === index
        }))
        setQuestions(updatedQuestions)
    }
    const handleAnswerAdd = () => {
        if (questions[currentQuestionIndex].answers.length == 6) { return } // max 6 answers per question
        const updatedQuestions = [...questions]
        const currentQuestion = updatedQuestions[currentQuestionIndex];
        const newAnswers = [...currentQuestion.answers, Answer.empty];
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
        // TODO: turn answers and questions into actual answers and questions
        // TODO: save changed questions to firebase
        // TODO: then go back to previous screen
    };
    const toOverview = () => {
        // TODO: adjust based on design
        const discardChangesPopup: PopupProps = {
            title: "Are you sure you want to discard your changes?",
            message: "This action cannot be undone.",
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: PopupType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                // TODO: go back to previous screen without saving changes
            },
        }
        showPopup(discardChangesPopup)
    }
    const showPopup = (updatedPopup: PopupProps) => {
        setPopupProps(updatedPopup)
        setShowingPopup(true)
    }

    return (
        <div className="createEditor">

            <div className="contentAndMenu">
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
                />
                <QuestionEditorNav
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelect={handleQuestionSelect}
                    onAdd={handleQuestionAdd}
                    onDragStart={handleQuestionDragStart}
                    onDragOver={handleQuestionDragOver}
                    onDragDrop={handleQuestionDragDrop}
                />
            </div>

            <BottomNavBar
                secondaryButtonText="To Overview"
                secondaryButtonIcon={null}
                primaryButtonText="Save Quiz"
                primaryButtonIcon={SAVE_ICON_LIGHT}
                type={BottomNavBarType.Default}
                onSecondaryClick={toOverview}
                onPrimaryClick={saveQuiz}
            />

            { showingPopup &&
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