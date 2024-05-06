import { FC, useEffect, useState } from "react"
import "./QuizLobby.css"
import QuizSession from "../../../models/QuizSession";
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import QuizUser from "../../../models/QuizUser";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import { QuizPlayerCard } from "../../../components/QuizPlayerCard/QuizPlayerCard";
import { QuizPlayerCardType } from "../../../components/QuizPlayerCard/QuizPlayerCardExports";
import { ICON_USER_FILLED, PLAY_ICON_LIGHT, TURN_OFF_DARK } from "../../../assets/Icons";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";

interface QuizMasterMessage {
    notifyQuizSession?: QuizSession,
    notifyNewQuizUser?: QuizUser
}

export const QuizLobby: FC<QuizMasterChildrenProps> = ({connection, quizCode, quizSession, authenticatedUser, endQuizSession}) => {

    const [joinedQuizUser, setJoinedQuizUser] = useState<QuizUser[]>(quizSession.state.usersStats.map(item => item.user))

    const playQuiz = () => {
        console.log("Play quiz...")
        connection?.send("NotifyPlayQuizSession", quizSession?.id) // TODO: this should change the quizstate to playing, set the joinedquizusers in the overall quizsession (already implemented i believe) and set the currentquestionid (already implemented?) so that the quizmaster component can adjust its ui
    }

    useEffect(() => {
        connection.on(`message:${authenticatedUser.id}`, (masterMessage: QuizMasterMessage) => {
            console.log(masterMessage.notifyNewQuizUser)
            joinedQuizUser.push(masterMessage.notifyNewQuizUser ?? {id: "", identifier: "", deviceId: ""})
            setJoinedQuizUser([...joinedQuizUser]);
        })
    }, []);

    return (
        <div className="page_styling">
            <BackgroundGems type={BackgroundGemsType.Primary}/>
            <div className="lobbyContent">
                <div>
                    <div className="entryIdContent">
                        <p className="entryIdContentTitle">Game code</p>
                        <p className="entryIdContentGameCode">{quizCode}</p>
                    </div>
                    <div className="quizUserLobby">

                    </div>
                </div>
                {joinedQuizUser.length >= 1 && // change this back to joinedQuizUsers
                    <div className="joinedUserSection">
                        <div className="joinedUsersSectionCount">
                            <span><img src={ICON_USER_FILLED.path} alt={ICON_USER_FILLED.alt}></img></span>
                            {joinedQuizUser.length} joined
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
                onPrimaryClick={playQuiz}
                onSecondaryClick={endQuizSession}
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
