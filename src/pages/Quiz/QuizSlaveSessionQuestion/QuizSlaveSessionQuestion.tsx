import {FC, useEffect, useState} from "react";
import "./QuizSlaveSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Answer} from "../../../models/Answer.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerSelection} from "../../../components/AnswerSelection/AnswerSelection.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {AnswerSelectionStyle} from "../../../components/AnswerSelection/AnswerSelectionExports.ts";
import {QuestionSlideInTag} from "../../../components/QuestionSlideInTag/QuestionSlideInTag.tsx";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";
import {QuizSessionManagerSlave} from "../../../managers/QuizSessionManagerSlave.tsx";

export const QuizSlaveSessionQuestion: FC<QuizSlaveChildrenProps> = ({leaveQuizSession, showPopupSthWentWrong, quizSessionManagerSlave}) => {

    const [selectedAnswerID, setSelectedAnswerID] = useState<string>("");
    const [remainingTime, setRemainingTime] = useState(quizSessionManagerSlave.remainingTime)

    const getAnswerStyle = (id: string): AnswerSelectionStyle => {

        const answer = quizSessionManagerSlave.currentQuestion?.answers.find(answer => answer.id == id)
        if (answer == undefined) {
            showPopupSthWentWrong()
            return AnswerSelectionStyle.Disabled
        }

        if (quizSessionManagerSlave.quizState == QuizState.statistics) {
            if (remainingTime != 0) { setRemainingTime(0) }
            if (answer.correct) return AnswerSelectionStyle.Correct
            if (!answer.correct && answer.id == selectedAnswerID) return AnswerSelectionStyle.Wrong
            return AnswerSelectionStyle.Unselected
        }
        // else should be QuizState.Playing
        if (answer.id == selectedAnswerID) return AnswerSelectionStyle.Selected
        if (selectedAnswerID == "") return AnswerSelectionStyle.Disabled
        return AnswerSelectionStyle.Unselected
    }

    const handleSelectAnswer = (answer: Answer) => {
        if(selectedAnswerID != "")
            return

        setSelectedAnswerID(answer.id)
        QuizSessionManagerSlave.getInstance().selectAnswer(answer)
    }

    useEffect(() => {
        setRemainingTime(quizSessionManagerSlave.remainingTime);
    }, [quizSessionManagerSlave.remainingTime]);

    useEffect(() => {
        const selectedAnswer = quizSessionManagerSlave.userStats?.find(stats => stats.user.identifier == quizSessionManagerSlave.quizUser?.identifier)?.answers.find(answer => answer.questionId == quizSessionManagerSlave.currentQuestionId)?.answerId
        if (selectedAnswer != null) setSelectedAnswerID(selectedAnswer)
    }, [quizSessionManagerSlave.userStats]);

    return (
        <div className="quizSlaveSessionQuestion">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuestionSlideInTag
                questionText={quizSessionManagerSlave.currentQuestion?.questionText ?? "[Error: Could not display question.]"}
                remainingTime={remainingTime}
            />
            <div className="content">
                <div className="answersContainer">
                    {quizSessionManagerSlave.currentQuestion?.answers.map((item, index) => (
                        <AnswerSelection
                            key={item.id}
                            id={item.id}
                            value={item.value}
                            type={getAnswerInputFieldTypeForIndex(index)}
                            style={getAnswerStyle(item.id)}
                            onClick={() => handleSelectAnswer(item)}
                        
                        />
                    ))}
                </div>
            </div>

            <BottomNavBar
                secondaryButtonText="Leave"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText={""}
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={leaveQuizSession}
            />
        </div>
    );
}

