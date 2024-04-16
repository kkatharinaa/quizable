import {FC, useState} from "react";
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

interface CreateEditorProps {
    quizID: string;
}

export const CreateEditor: FC<CreateEditorProps> = ({quizID}) => {
    // TODO: get quiz from Firebase using the quizID - rn I assume that before we reach the quizeditor screen, there will be the quiz detail popup, in which i first choose my quiz's title and settings, and it already gets saved like that with no questions to firebase. only if i click on a button there it will take me to this editor
    // so far we dont have firebase implemented, so just use a fake quiz
    const originalQuiz: Quiz = new Quiz(quizID, QuizName.tryMake("Untitled Quiz")!, [Question.empty], QuizOptions.default, AuthenticatedUser.default, new Date(), null)

    //const [quiz, setQuiz] = useState<Quiz>(originalQuiz);
    const [questions, setQuestions] = useState<Question[]>(originalQuiz.questions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
        // TODO: show popup asking for confirmation?
        const updatedQuestions = [...questions]
        updatedQuestions.splice(currentQuestionIndex, 1);
        setCurrentQuestionIndex(currentQuestionIndex == 0 ? 0 : currentQuestionIndex-1)
        setQuestions(updatedQuestions)
    };
    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index)
    }
    const handleQuestionAdd = () => {
        const updatedQuestions = [...questions, Question.empty]
        setQuestions(updatedQuestions)
    }
    // TODO: add reordering of questions

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
        const updatedQuestions = [...questions]
        const currentQuestion = updatedQuestions[currentQuestionIndex];
        const newAnswers = [...currentQuestion.answers, Answer.empty];
        updatedQuestions[currentQuestionIndex] = {...currentQuestion, answers: newAnswers};
        setQuestions(updatedQuestions)
    }

    // nav functions
    const saveQuiz = () => {
        // TODO: turn answers and questions into actual answers and questions
        // TODO: save changed questions to firebase
    };
    const toOverview = () => {
        // TODO: first show a popup asking for confirmation (discard changes?), if yes go back to the previous screen which has the quiz popup
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
                />
                <QuestionEditorNav
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelect={handleQuestionSelect}
                    onAdd={handleQuestionAdd}
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
        </div>
    )
}