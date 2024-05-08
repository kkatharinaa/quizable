import { FC, useEffect, useState } from "react"
import "./QuizSlaveLobby.css"
import {useLocation, useNavigate} from "react-router-dom";
import QuizSession from "../../../models/QuizSession";
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import * as SignalR from "@microsoft/signalr";
import { getDeviceId } from "../../../helper/DeviceHelper";
import { v4 as uuid } from "uuid"
import QuizUser from "../../../models/QuizUser";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {ICON_USER_FILLED, RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {showErrorPageNothingToFind} from "../../ErrorPage/ErrorPageExports.ts";
import {showPopupLeaveSession} from "../../../components/Popup/PopupExports.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";
import { Question } from "../../../models/Question.ts";
import { QuizPlayerCard } from "../../../components/QuizPlayerCard/QuizPlayerCard.tsx";
import { QuizPlayerCardType } from "../../../components/QuizPlayerCard/QuizPlayerCardExports.ts";

interface QuizMasterMessage {
    notifyQuizSession?: QuizSession,
    notifyNewQuizUser?: QuizUser
}


export const QuizSlaveLobby: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    const quizSessionId: string | null = state ? state.quizSessionId : null; //  Read values passed on state
    const userName: string = state ? state.userName : ""; // Read values passed on state
    const [joinedQuizUser, setJoinedQuizUser] = useState<QuizUser[]>([])

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const killQuizSession = () => {
        const leaveSession = () => {} // TODO: leave session
        showPopupLeaveSession(showPopup, hidePopup, navigate, leaveSession)
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }
    const hidePopup = () => {
        setShowingPopup(false)
    }

    useEffect(() => {
        init()
    }, [])
    
    const init = async () => {
        if (quizSessionId == null || userName == "") {
            showErrorPageNothingToFind(navigate)
        }

        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const quizUser: QuizUser = {
            id: uuid(),
            identifier: userName,
            deviceId: await getDeviceId()
        }

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/slave", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        console.log(`play:${quizSessionId}/${userName}`)

        // when the game actually starts and you get messages, navigate to the questions
        connection.on(`start:${quizSessionId}/${userName}`, (_: string, question: Question, quizUser: QuizUser) => {
            navigate("/quiz/slave/session", {state: {
                quizSessionId: quizSessionId, 
                quizUser: quizUser,
                question: question
            }})
        })

        connection.on(`message:${userName}`, (quizUsers: QuizUser[]) => {
            // Get the entry id
            // and quizSession backs
            setJoinedQuizUser(quizUsers);
        })

        connection.start()
            .then(async () => {
                console.log("Quiz user new: " + quizUser)
                connection.send("NotifySlaveEnterQuiz", quizUser, quizSessionId)
            })
            .catch((err) => console.error(err))

        // TODO: check if player is part of quiz session, if not show error
        /*if () {
            showErrorNotInSession(navigate)
        }*/
    }

    // TODO: adjust slave lobby based on figma design

    return (
        <div className="page_styling">
            <BackgroundGems type={BackgroundGemsType.PrimarySlave2}/>
            <div className="quizSlaveSessionLobbyContent">
                <h1 className="quizSlaveSessionLobbyTitle">Waiting for players...</h1>
                {joinedQuizUser.length >= 1 && // change this back to joinedQuizUsers
                    <div className="joinedUserSection">
                        <div className="joinedUsersSectionCount">
                            <span><img src={ICON_USER_FILLED.path} alt={ICON_USER_FILLED.alt}></img></span>
                            {joinedQuizUser.length} joined
                        </div>
                        <div className="joinedUserSectionList">
                            {joinedQuizUser.map((quizUser) => (
                                <QuizPlayerCard
                                    key={quizUser.id}
                                    type={QuizPlayerCardType.MobileNormal}
                                    playerName={quizUser.identifier}>
                                </QuizPlayerCard>
                            ))}                        
                        </div>
                    </div>
                }
            </div>

            <BottomNavBar
                secondaryButtonText="Leave"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={killQuizSession} 
                style={BottomNavBarStyle.Long}/>

            {(showingPopup && popupProps != null) &&
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
                />
            }
        </div>
    )
}
 
