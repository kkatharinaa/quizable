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
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {showErrorPageNothingToFind} from "../../ErrorPage/ErrorPageExports.ts";
import {showPopupLeaveSession} from "../../../components/Popup/PopupExports.ts";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";


export const QuizSlaveLobby: FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const quizSessionId: string | null = state ? state.quizSessionId : null; //  Read values passed on state
    const userName: string = state ? state.userName : ""; // Read values passed on state

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
        if (quizSessionId == null || userName == "") {
            showErrorPageNothingToFind(navigate)
        }

        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/slave", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
              })
            .build();

        console.log(`play:${quizSessionId}/${userName}`)
        connection.on(`play:${quizSessionId}/${userName}`, () => {
            navigate("/quiz/session", {state: {quizSessionId: quizSessionId, username: userName}})
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

        // TODO: check if player is part of quiz session, if not show error
        /*if () {
            showErrorNotInSession(navigate)
        }*/
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
 
