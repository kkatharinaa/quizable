import { FC, useEffect, useState } from "react"
import "./QuizLobby.css"
import { useLocation } from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import * as SignalR from "@microsoft/signalr";


export const QuizLobby: FC = () => {
    const {state} = useLocation();
    const quizSessionId: QuizSession = state.quizSessionId; // Read values passed on state    

    const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
    const [quizEntryId, setQuizEntryId] = useState<string | null>(null);

    const killQuizSession = () => {

    }

    useEffect(() => {
        console.log("Quiz session in Quiz Lobby: ", quizSessionId)

        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/master", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        connection.on("userId1", (quizEntryId: string, message: QuizSession) => {
            // Get the entry id
            // and quizSession back
            console.log("Backend Message from: " + quizEntryId)

            setQuizEntryId(quizEntryId);
            setQuizSession(message)
        })

        connection.start()
            .then(() => {
                connection.send("requestQuizSession", "userId1", quizSessionId)
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <div className="page_styling">
            <div className="content">
                {(quizSession != null && quizEntryId != null) && 
                    <div>
                        <div className="entryIdContent">
                            <p className="entryIdContentTitle">Game code</p>
                            <p className="entryIdContentGameCode">{quizEntryId}</p>
                        </div>
                        <div className="quizUserLobby">
                            
                        </div>
                    </div>
                }
            </div>

            

            <BottomNavBar
                secondaryButtonText="Logout"
                secondaryButtonIcon={null}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={killQuizSession} 
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
