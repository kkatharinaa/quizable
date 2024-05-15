import {FC, useEffect, useState} from "react";
import "./QuizSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT, USER_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {Timer} from "../../../components/Timer/Timer.tsx";
import {AnswerInputField} from "../../../components/AnswerInputField/AnswerInputField.tsx";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {useNavigate} from "react-router-dom";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";
import {showErrorPageSomethingWentWrong} from "../../ErrorPage/ErrorPageExports.ts";
import {QuizSessionManager} from "../../../managers/QuizSessionManager.tsx";

export const QuizSessionQuestion: FC<QuizMasterChildrenProps> = ({quizSessionManager, endQuizSession}) => {
    const navigate = useNavigate();

    const [currentQuestion] = useState<Question | null>(quizSessionManager.currentQuestion);

    const playerCount = (): number => {
        return quizSessionManager.userStats?.filter(userStat => {
            return userStat.answers.some(userAnswer => userAnswer.questionId === quizSessionManager.currentQuestionId);
        }).length ?? 0
    }
    
    const handleSkipQuestion = () => {
        // move on to answer statistics screen
        // TODO: get to work with timer on server?
        QuizSessionManager.getInstance().skipQuestion()
    }

    useEffect(() => {
        if (currentQuestion == null) {
            showErrorPageSomethingWentWrong(navigate)
        }
    }, []);

    return (
        <div className="quizSessionQuestion">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizSessionManager.quizCode}
            />
            <div className="content">
                <h1>{currentQuestion?.questionText ?? ""}</h1>
                { (currentQuestion != null && currentQuestion?.maxQuestionTime != 0) &&
                    <Timer
                        remainingTime={currentQuestion!.maxQuestionTime}
                        isRunning={true}
                        onDone={handleSkipQuestion}
                    />
                }
                <div className="answersGroup">
                    <div className="answersInfo">
                        <img src={USER_ICON_LIGHT.path} alt={USER_ICON_LIGHT.alt}/>
                        <p>{`${playerCount()}/${quizSessionManager.userStats?.length ?? "?"} answered`}</p>
                    </div>
                    <div className="answersContainer">
                        {currentQuestion?.answers.map((item, index) => (
                            <AnswerInputField
                                key={item.id}
                                value={item.value}
                                type={getAnswerInputFieldTypeForIndex(index)}
                                index={index}
                                onChange={null}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <BottomNavBar
                secondaryButtonText="End Quiz"
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={(currentQuestion?.maxQuestionTime != 0) ? "Skip" : "Next"}
                primaryButtonIcon={SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={endQuizSession}
                onPrimaryClick={handleSkipQuestion}
            />
        </div>
    );
}
 
