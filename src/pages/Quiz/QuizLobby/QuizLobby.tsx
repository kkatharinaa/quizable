import { FC, useEffect } from "react"
import "./QuizLobby.css"
import { useLocation } from "react-router-dom";
import QuizSession from "../../../models/QuizSession";

export const QuizLobby: FC = () => {
    const {state} = useLocation();
    const quizSession: QuizSession = state.quizSession; // Read values passed on state

    useEffect(() => {
        console.log("Quiz session in Quiz Lobby: ", quizSession.id)
    }, [])

    return (
        <div className="page_styling">
            <h1>Quiz Lobby</h1>
        </div>
    )
}
 
