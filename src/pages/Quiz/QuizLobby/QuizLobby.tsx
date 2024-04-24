import { FC, useEffect, useState } from "react"
import "./QuizLobby.css"
import { useLocation } from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import * as SignalR from "@microsoft/signalr";
import QuizUser from "../../../models/QuizUser";
import {v4 as uuid} from "uuid"
import { getDeviceId } from "../../../helper/DeviceHelper";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";


interface QuizMasterMessage {
    notifyQuizSession?: QuizSession,
    notifyNewQuizUser?: QuizUser
}

export const QuizLobby: FC = () => {
    const {state} = useLocation();
    const quizSessionId: QuizSession = state.quizSessionId; // Read values passed on state    

    const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
    const [quizEntryId, setQuizEntryId] = useState<string | null>(null);
    const [joinedQuizUser, setJoinedQuizUser] = useState<QuizUser[]>([])

    const killQuizSession = () => {

    }

    useEffect(() => {
        console.log("Quiz session in Quiz Lobby: ", quizSessionId)

        const starterUserId: string = "userId1"

        // start websocket connection
        const port: number = 5296
        // const url: string = `http://localhost:${port}`
        const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/master", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        connection.on(starterUserId, (quizEntryId: string, message: QuizSession) => {
            // Get the entry id
            // and quizSession back
            console.log("Backend Message from: " + quizEntryId)

            setQuizEntryId(quizEntryId);
            setQuizSession(message)
        })

        connection.on(`message:${starterUserId}`, (masterMessage: QuizMasterMessage) => {
            // Get the entry id
            // and quizSession backs
            console.log(masterMessage.notifyNewQuizUser)
            joinedQuizUser.push(masterMessage.notifyNewQuizUser ?? {id: "", identifier: "", deviceId: ""})
            setJoinedQuizUser([...joinedQuizUser]);
        })

        connection.start()
            .then(async () => {
                const quizUser: QuizUser = {
                    id: uuid(),
                    identifier: starterUserId,
                    deviceId: await getDeviceId()
                }
                connection.send("requestQuizSession", quizUser, quizSessionId)
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <div className="page_styling">
            <BackgroundGems type={BackgroundGemsType.Primary}/>
            <div className="lobbyContent">
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
                {joinedQuizUser.length >= 1 &&
                    <div className="joinedUserSection">
                        <h4>{joinedQuizUser.length} joined</h4>
                        {joinedQuizUser.map((quizUser) => (
                            <div className="joinedUserSectionCards" key={quizUser.deviceId+":"+quizUser.identifier}>
                                <p>{quizUser.identifier}</p>
                            </div>
                        ))}                        
                    </div>
                }
            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={null}
                primaryButtonText="Start Quiz"
                primaryButtonIcon={null}
                type={BottomNavBarType.Default}
                onSecondaryClick={killQuizSession} 
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
