import {FC} from "react";
import "./QuizPodium.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";

export const QuizPodium: FC<QuizMasterChildrenProps> = ({endQuizSession, quizSessionManager}) => {

    const handleContinue = () => {
        // move on to endscreen on which the user can download the report, for this the quizstate needs to be set to endscreen
        QuizSessionManager.getInstance().changeState(QuizState.endscreen)
    }

    return (
        <div className="quizPodium">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizSessionManager.quizCode}
            />
            <div className="content">
                { /* TODO */ }
            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={"Next"}
                primaryButtonIcon={SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={endQuizSession}
                onPrimaryClick={handleContinue}
            />
        </div>
    );
}

