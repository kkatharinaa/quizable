import { FC, useEffect, useState } from "react"
import "./QuizLobby.css"
import {useLocation, useNavigate} from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import * as SignalR from "@microsoft/signalr";
import QuizUser from "../../../models/QuizUser";
import {v4 as uuid} from "uuid"
import { getDeviceId } from "../../../helper/DeviceHelper";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {showErrorQuizSessionNotRunning} from "../../ErrorPage/ErrorPageExports.ts";

import { QuizPlayerCard } from "../../../components/QuizPlayerCard/QuizPlayerCard";
import { QuizPlayerCardType } from "../../../components/QuizPlayerCard/QuizPlayerCardExports";
import { ICON_USER_FILLED, PLAY_ICON_LIGHT, TURN_OFF_DARK } from "../../../assets/Icons";

interface QuizMasterMessage {
    notifyQuizSession?: QuizSession,
    notifyNewQuizUser?: QuizUser
}

export const QuizLobby: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const quizSessionId: QuizSession | null = state ? state.quizSessionId : null; // Read values passed on state

    const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
    const [quizEntryId, setQuizEntryId] = useState<string | null>(null);
    const [joinedQuizUser, setJoinedQuizUser] = useState<QuizUser[]>([])

    const listOfUsers: QuizUser[] = [
        {
            id: uuid(),
            identifier: "user1",
            deviceId: uuid(),
        },
        {
            id: uuid(),
            identifier: "user2",
            deviceId: uuid(),
        },
        {
            id: uuid(),
            identifier: "user3",
            deviceId: uuid(),
        },
        {
            id: uuid(),
            identifier: "user4",
            deviceId: uuid(),
        },
        {
            id: uuid(),
            identifier: "user5",
            deviceId: uuid(),
        },
    ]

    const killQuizSession = () => {

    }

    useEffect(() => {
        console.log("Quiz session in Quiz Lobby: ", quizSessionId)

        const quizSessionIsRunning = quizSessionId != null
        const userIsHost = true // TODO: check here if 1) user is authenticated 2) authenticated user is owner of the quiz that is played rn
        if (!quizSessionIsRunning || !userIsHost) {
            showErrorQuizSessionNotRunning(navigate, userIsHost)
        }

        const starterUserId: string = "userId1"

        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

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
                {joinedQuizUser.length >= 1 && // change this back to joinedQuizUsers
                    <div className="joinedUserSection">
                        <div className="joinedUsersSectionCount">
                            <span><img src={ICON_USER_FILLED.path} alt={ICON_USER_FILLED.alt}></img></span>
                            {listOfUsers.length} joined
                        </div>
                        <div className="joinedUserSectionList">
                            {joinedQuizUser.map((quizUser) => (
                                <QuizPlayerCard
                                    type={QuizPlayerCardType.DesktopScoreDown}
                                    playerName={quizUser.identifier}
                                    playerScore={907}>
                                </QuizPlayerCard>
                            ))}                        
                        </div>
                    </div>
                }
            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={TURN_OFF_DARK}
                primaryButtonText="Start Quiz"
                primaryButtonIcon={PLAY_ICON_LIGHT}
                type={BottomNavBarType.Default}
                onSecondaryClick={killQuizSession} 
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
