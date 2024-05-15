import { FC } from "react"
import "./QuizSlaveLobby.css"
import { BottomNavBar } from "../../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../../components/BottomNavBar/BottomNavBarExports";
import { BackgroundGems } from "../../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../../components/BackgroundGems/BackgroundGemsExports";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";

export const QuizSlaveLobby: FC<QuizSlaveChildrenProps> = ({leaveQuizSession}) => {

    return (
        <div className="page_styling">
            <BackgroundGems type={BackgroundGemsType.PrimarySlave2}/>
            <div className="quizSlaveSessionLobbyContent">
                <h1 className="quizSlaveSessionLobbyTitle">Waiting for players...</h1>
                { /* TODO: adjust slave lobby based on figma design */ }
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
 
