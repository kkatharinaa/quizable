import { FC, useEffect } from "react"
import "./QuizLobby.css"
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import QuizUser from "../../../models/QuizUser";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import { QuizPlayerCard } from "../../../components/QuizPlayerCard/QuizPlayerCard";
import { QuizPlayerCardType } from "../../../components/QuizPlayerCard/QuizPlayerCardExports";
import { USER_ICON_LIGHT, PLAY_ICON_LIGHT, POWER_ICON_DARK } from "../../../assets/Icons";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";
import QRCodeHelper from "../../../helper/QRCodeHelper.ts";

export const QuizLobby: FC<QuizMasterChildrenProps> = ({quizSessionManager, endQuizSession}) => {

    const joinedUsers = (): QuizUser[] => {
        return quizSessionManager.userStats?.map(item => item.user) ?? []
    }

    const playQuiz = () => {
        QuizSessionManager.getInstance().toNextQuestionOrEnd(true)
    }

    useEffect(() => {
        QRCodeHelper.generateQRCodeForQuiz("canvasQrCode", quizSessionManager.quizCode!, {width: 240})
    }, [])

    return (
        <div className="quizLobby">
            <BackgroundGems type={BackgroundGemsType.Primary}/>
            <div className="content" tabIndex={0}>
                <div>
                    <div className="entryIdContent">
                        <div >   
                            <p className="entryIdContentTitle">Game Code</p>
                            <p className="entryIdContentGameCode">{quizSessionManager.quizCode}</p>
                        </div>
                        <canvas id="canvasQrCode"></canvas>
                    </div>
                </div>
                {joinedUsers().length >= 1 &&
                    <div className="joinedUserSection">
                        <div className="joinedUsersSectionCount">
                            <img src={USER_ICON_LIGHT.path} alt={USER_ICON_LIGHT.alt}></img>
                            <p>{joinedUsers().length} joined</p>
                        </div>
                        <div className="joinedUserSectionList">
                            {joinedUsers().map((quizUser) => (
                                <QuizPlayerCard
                                    key={quizUser.id}
                                    type={QuizPlayerCardType.DesktopNormal}
                                    quizUser={quizUser}
                                    score={undefined}>
                                </QuizPlayerCard>
                            ))}
                        </div>
                    </div>
                }
            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText="Start Quiz"
                primaryButtonIcon={PLAY_ICON_LIGHT}
                type={BottomNavBarType.Default}
                onPrimaryClick={playQuiz}
                onSecondaryClick={endQuizSession}
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
