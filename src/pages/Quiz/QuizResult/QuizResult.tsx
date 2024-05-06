import {FC, useState} from "react";
import "./QuizResult.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {StatisticsBar} from "../../../components/StatisticsBar/StatisticsBar.tsx";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";

export const QuizResult: FC<QuizMasterChildrenProps> = ({quizCode, quizSession, quiz, endQuizSession}) => {

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(quiz.questions.find(question => question.id == quizSession.state.currentQuestionId) ?? null)

    const getAnswersCountForAnswer = (answerID: string): number => {
        if (quizSession == null) return 0
        return quizSession.state.usersStats.reduce((count, userStat) => {
            userStat.answers.forEach(answer => {
                if (answer.questionId === quizSession.state.currentQuestionId && answer.answerId === answerID) {
                    count++;
                }
            });
            return count;
        }, 0)
    }
    const getTotalAnswersCountForQuestion = (): number => {
        if (quizSession == null) return 0
        return quizSession.state.usersStats.reduce((count, userStat) => {
            userStat.answers.forEach(answer => {
                if (answer.questionId === quizSession.state.currentQuestionId) {
                    count++;
                }
            });
            return count;
        }, 0)
    }

    const handleContinue = () => {
        // TODO: move on to leaderboard, for this the quizstate needs to be set to leaderboard
    }

    return (
        <div className="quizResult">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizCode}
            />
            <div className="content">
                <div className="statistics">
                    {currentQuestion?.answers.map((item, index) => (
                        <StatisticsBar
                            key={item.id}
                            value={item.value}
                            type={getAnswerInputFieldTypeForIndex(index)}
                            answerCount={getAnswersCountForAnswer(item.id)}
                            totalAnswersCount={getTotalAnswersCountForQuestion()}
                            correct={item.correct}
                        />
                    ))}
                </div>
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

