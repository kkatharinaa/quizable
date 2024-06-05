import {FC, useEffect, useState} from "react"
import "./QuizSlaveLeaderboard.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";
import {QuizPlayerCard} from "../../../components/QuizPlayerCard/QuizPlayerCard.tsx";
import {QuizPlayerCardType} from "../../../components/QuizPlayerCard/QuizPlayerCardExports.ts";

export const QuizSlaveLeaderboard: FC<QuizSlaveChildrenProps> = ({leaveQuizSession, quizSessionManagerSlave}) => {

    const [showComponent, setShowComponent] = useState(false);

    const userStat = () => {
        const quizUser = quizSessionManagerSlave.quizUser
        const userStats = quizSessionManagerSlave.userStats

        return userStats?.find(stat => stat.user.id === quizUser?.id)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowComponent(true);
        }, 100); // delay to see if the host will skip the leaderboard or not before rendering this view. this is probably not a nice solution but it prevents me from having to change a lot in the backend
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="quizSlaveLeaderboard">
            <BackgroundGems type={BackgroundGemsType.Primary2}/>
            { showComponent &&
            <div className="content" tabIndex={0}>
                <h1>Your Score</h1>
                {userStat() != null ? (
                    <QuizPlayerCard
                        key={userStat()!.user.id}
                        type={QuizPlayerCardType.MobileScore}
                        quizUser={userStat()!.user}
                        score={userStat()!.score}>
                    </QuizPlayerCard>
                ) : (
                    <p>There was an error displaying your score. Please look for your score on the host's screen.</p>
                )}
            </div>
            }
            { showComponent &&
            <BottomNavBar
                secondaryButtonText="Leave"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={leaveQuizSession}
                style={BottomNavBarStyle.Long}/>
            }
        </div>
    )
}

