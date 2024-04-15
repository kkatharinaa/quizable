import { Button } from "react-bootstrap";
import { Quiz } from "../../../models/Quiz";
import QuizService from "../../../services/QuizService";
import './QuizOverview.css'
import { useEffect, useState } from "react";
import QuizSessionService from "../../../services/QuizSessionService";
import { NavigateFunction, useNavigate } from "react-router-dom";
import QuizSession from "../../../models/QuizSession";


export const QuizOverview = () => {
    const [quiz, setQuiz] = useState([] as Quiz[])

    const navigator: NavigateFunction = useNavigate();

    const setQuizzesFromFirestore = async () => {
        const quizzes_firestore: Quiz[] = await QuizService.getAll()
        setQuiz(quizzes_firestore)      
    }

    const startQuiz = async (quiz: Quiz) => {
        const newQuizSession: QuizSession = await QuizSessionService.create(quiz)
        navigator('/quiz/lobby', {state: {quizSession: newQuizSession}})
    }

    const uploadDefaultQuiz = () => {
        const newQuiz: Quiz = Quiz.default;
        QuizService.add(newQuiz);
        setQuizzesFromFirestore()
    }

    useEffect(() => {
        setQuizzesFromFirestore()
    }, [])

    return (
        <div className="page_styling">
            <h1>Quiz Overview</h1>
            {quiz.map((quiz: Quiz) => (
                <div key={quiz.id + "_key"} className="quizOverviewListItem">
                    <div className="quizOverviewListItemCard">
                        <h3>{quiz.name.value}</h3>
                    </div>
                    <div className="quizOverviewListItemActions">
                        <Button disabled={true}>Edit Quiz</Button>
                        <Button onClick={() => startQuiz(quiz)}>Play Quiz</Button>
                    </div>
                </div>
            ))}
        
            <Button className="quizOverviewUploadDefault" onClick={uploadDefaultQuiz}>Upload default quiz</Button>
        </div>
    )
}