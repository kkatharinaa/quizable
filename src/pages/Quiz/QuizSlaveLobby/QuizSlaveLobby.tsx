import { FC } from "react"
import "./QuizSlaveLobby.css"
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {RETURN_ICON_DARK, USER_ICON_LIGHT} from "../../../assets/Icons.ts";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";
import {QuizPlayerCard} from "../../../components/QuizPlayerCard/QuizPlayerCard.tsx";
import {QuizPlayerCardType} from "../../../components/QuizPlayerCard/QuizPlayerCardExports.ts";
import QuizUser from "../../../models/QuizUser.ts";

export const QuizSlaveLobby: FC<QuizSlaveChildrenProps> = ({quizSessionManagerSlave, leaveQuizSession}) => {

    const joinedUsers = (): QuizUser[] => {
        return quizSessionManagerSlave.userStats?.map(item => item.user) ?? []
    }

    return (
        <div className="quizSlaveLobby">
            <BackgroundGems type={BackgroundGemsType.Primary2}/>
            <div className="content">
                <h1>Waiting...</h1>
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
                                    type={QuizPlayerCardType.MobileNormal}
                                    quizUser={quizUser}
                                    score={undefined}>
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
                onSecondaryClick={leaveQuizSession}
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}
 
