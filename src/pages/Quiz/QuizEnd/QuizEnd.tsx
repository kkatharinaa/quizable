import {FC} from "react";
import "./QuizEnd.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";

export const QuizEnd: FC<QuizMasterChildrenProps> = ({quizSessionManager, endQuizSession}) => {

    return (
        <div className="quizEnd">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizSessionManager.quizCode}
            />
            <div className="content">
                <h1>Thank you for playing!</h1>
                { /* TODO */}
            </div>

            <BottomNavBar
                secondaryButtonText="To Home"
                secondaryButtonIcon={null}
                primaryButtonText={""}
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={endQuizSession}
            />
        </div>
    );
}

