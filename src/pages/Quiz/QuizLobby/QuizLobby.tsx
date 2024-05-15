import { FC } from "react"
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

export const QuizLobby: FC<QuizMasterChildrenProps> = ({quizSessionManager, endQuizSession}) => {

    const joinedUsers = (): QuizUser[] => {
        return quizSessionManager.userStats?.map(item => item.user) ?? []
    }

    const playQuiz = () => {
        QuizSessionManager.getInstance().toNextQuestionOrEnd(true)
    }

    return (
        <div className="quizLobby">
            <BackgroundGems type={BackgroundGemsType.Primary}/>
            <div className="content">
                <div>
                    <div className="entryIdContent">
                        <p className="entryIdContentTitle">Game code</p>
                        <p className="entryIdContentGameCode">{quizSessionManager.quizCode}</p>
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
                                    playerName={quizUser.identifier}
                                    playerScore={undefined}>
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
 
