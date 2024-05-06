import {FC} from "react";
import "./QuizEnd.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";

export const QuizEnd: FC<QuizMasterChildrenProps> = ({quizCode, endQuizSession}) => {

    return (
        <div className="quizEnd">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizCode}
            />
            <div className="content">
                { /* TODO */ }
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

