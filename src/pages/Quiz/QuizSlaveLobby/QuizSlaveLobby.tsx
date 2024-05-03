import { FC, useEffect } from "react"
import "./QuizSlaveLobby.css"
import { useLocation } from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import * as SignalR from "@microsoft/signalr";
import { getDeviceId } from "../../../helper/DeviceHelper";
import { v4 as uuid } from "uuid"
import QuizUser from "../../../models/QuizUser";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";


export const QuizSlaveLobby: FC = () => {
    const {state} = useLocation();
    const quizSessionId: QuizSession = state.quizSessionId; // Read values passed on state  
    const userName: string = state.userName; // Read values passed on state      

    const killQuizSession = () => {
        
    }

    useEffect(() => {
        console.log("Quiz session in Quiz Lobby: ", quizSessionId)

        // start websocket connection
        const port: number = 5296
        // const url: string = `http://localhost:${port}`
        const url: string = `https://quizapp-rueasghvla-nw.a.run.app`


        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/slave", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        connection.on(userName, () => {
            // Get the entry id
            // and quizSession back

            //setQuizEntryId(quizEntryId);
            //setQuizSession(message)
        })

        connection.start()
            .then(async () => {
                const quizUser: QuizUser = {
                    id: uuid(),
                    identifier: userName,
                    deviceId: await getDeviceId()
                }

                console.log("Quiz user new: " + quizUser)
                connection.send("EnterSlaveQuizSession", quizUser, quizSessionId)
            })
            .catch((err) => console.error(err))
    }, [])

    // TODO: adjust slave lobby based on figma design

    return (
        <div className="page_styling">
            <BackgroundGems type={BackgroundGemsType.PrimarySlave2}/>
            <div className="quizSlaveSessionLobbyContent">
                <h1 className="quizSlaveSessionLobbyTitle">Waiting for players...</h1>
            </div>
            <BottomNavBar
                secondaryButtonText="Leave"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={killQuizSession} 
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
