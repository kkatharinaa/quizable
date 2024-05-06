import {FC, useEffect} from "react";
import "./QuizLeaderboard.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";

export const QuizLeaderboard: FC<QuizMasterChildrenProps> = ({quizCode, endQuizSession, quiz, quizSession}) => {

    const handleContinue = () => {
        // TODO: move on to next question, for this the currentQuestionId of the quizsession has to be set to the id of the next question in the questionsarray of the quiz, and the quizstate has to be set to playing
        // TODO: however if this is the last question in the questionsarray of the quiz, instead move on to the podium screen by setting the quizstate to podium
    }

    useEffect(() => {
        // skip this page if the quizoption says so and we are not on the very last question
        if (!quiz.options.isLeaderboardBetween && quiz.questions[quiz.questions.length-1].id != quizSession.state.currentQuestionId) {
            handleContinue()
            return
        }
    }, []);

    return (
        <div className="quizLeaderboard">
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

