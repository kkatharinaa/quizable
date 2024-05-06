import { FC } from "react"
import "./QuizSlaveLeaderboard.css"
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";

export const QuizSlaveLeaderboard: FC<QuizSlaveChildrenProps> = ({leaveQuizSession}) => {

    return (
        <div className="quizSlaveLeaderboard">
            <BackgroundGems type={BackgroundGemsType.PrimarySlave2}/>
            <div className="content">
                { /* TODO */ }
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

