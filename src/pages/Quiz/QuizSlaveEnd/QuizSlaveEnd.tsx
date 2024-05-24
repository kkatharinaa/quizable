import { FC } from "react"
import "./QuizSlaveEnd.css"
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";

export const QuizSlaveEnd: FC<QuizSlaveChildrenProps> = ({leaveQuizSession}) => {

    return (
        <div className="quizSlaveEnd">
            <BackgroundGems type={BackgroundGemsType.Primary2}/>
            <div className="content">
                <h1>Thank you for playing!</h1>
            </div>
            <BottomNavBar
                secondaryButtonText="To Home"
                secondaryButtonIcon={null}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={leaveQuizSession}
                style={BottomNavBarStyle.Long}/>
        </div>
    )
}

