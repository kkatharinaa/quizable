import { Button } from "react-bootstrap";
import { Quiz } from "../../../models/Quiz";
import QuizRepository from "../../../repositories/QuizRepository";
import './QuizOverview.css'
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import QuizSessionRepository from "../../../repositories/QuizSessionRepository";
import QuizSessionService from "../../../services/QuizSessionService";
import * as SignalR from "@microsoft/signalr";


// ONLY USED for testing!!!!
export const QuizOverview = () => {
    const [quiz, setQuiz] = useState([] as Quiz[])

    const navigator: NavigateFunction = useNavigate();

    const setQuizzesFromFirestore = async () => {
        const quizzes_firestore: Quiz[] = await QuizRepository.getAll()
        setQuiz(quizzes_firestore)      
    }

    const startQuiz = async (quiz: Quiz) => {
        const newQuizSession: QuizSession = await QuizSessionRepository.create(quiz)
        navigator('/quiz/lobby', {state: {quizSession: newQuizSession}})
    }

    const uploadDefaultQuiz = () => {
        const newQuiz: Quiz = new Quiz();
        QuizRepository.add(newQuiz);
        setQuizzesFromFirestore()
    }

    const uploadBackend = () => {
        console.log("Upload to backend")
        QuizSessionService.addSession({id: "someID", quizId: "quizId", deviceId: "deviceId", state: {
            currentQuestionId: "",
            usersStats: [],
            currentQuizState: ""
        }})
    }

    const setupSignalRConnection = () => {
        const port: number = 5296
        const url: string = `http://localhost:${port}`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/master", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        connection.on("userId1", (message) => {
            console.log("Backend Message from: " + message)
        })

        connection.start()
            .then(() => {
                console.log("Sending to the master")
                connection.send("newMessage", "userId1", "Hello World from frontend!")
            })
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        setQuizzesFromFirestore()
        setupSignalRConnection()
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
            <Button className="quizOverviewUploadBackend" onClick={uploadBackend}>Upload backend</Button>
        </div>
    )
}