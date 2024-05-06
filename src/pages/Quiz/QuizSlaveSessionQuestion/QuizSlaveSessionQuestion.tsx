import {FC, useState} from "react";
import "./QuizSlaveSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {RETURN_ICON_DARK} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {Answer} from "../../../models/Answer.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerSelection} from "../../../components/AnswerSelection/AnswerSelection.tsx";
import {QuizState} from "../../../models/QuizSessionState.ts";
import {AnswerSelectionStyle} from "../../../components/AnswerSelection/AnswerSelectionExports.ts";
import {QuestionSlideInTag} from "../../../components/QuestionSlideInTag/QuestionSlideInTag.tsx";
import {QuizSlaveChildrenProps} from "../QuizSlave/QuizSlave.tsx";

export const QuizSlaveSessionQuestion: FC<QuizSlaveChildrenProps> = ({connection, quizUser, leaveQuizSession, quizSession, showPopupSthWentWrong, quiz}) => {

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(quiz.questions.find(question => question.id == quizSession.state.currentQuestionId) ?? null)
    const [selectedAnswerID, setSelectedAnswerID] = useState<string>("");

    // TODO: generally: implement behaviour when disconnecting

    const getAnswerStyle = (id: string): AnswerSelectionStyle => {

        if (currentQuestion == null) {
            showPopupSthWentWrong()
            return AnswerSelectionStyle.Disabled
        }

        const answer = currentQuestion.answers.find(answer => answer.id == id)
        if (answer == undefined) {
            showPopupSthWentWrong()
            return AnswerSelectionStyle.Disabled
        }

        if (quizSession.state.currentQuizState == QuizState.Statistics) {
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

        if (currentQuestion == null) {
            showPopupSthWentWrong()
            return
        }

        setSelectedAnswerID(answer.id)
        connection?.send("EnterSlaveAnswerSelection", quizUser, quizSession.id, currentQuestion.id, answer);
        // TODO: when all slaves have answered, set the quizstate in the backend to statistics
    }

    /* TODO: Sebi pls check if these things are still needed, I don't think so because the quizstate will be handled by the master and the quizslave screen just receives and displays based on the available info, but you have to check it pls
    const initSignalR = async (quizSessionIdState: string, quizUserState: QuizUser) => {

        // when the game actually starts and you get messages, navigate to the questions
        connection.on(`nextquestion:${quizSessionIdState}/${userName}`, async (nextQuestion) => {
            setSessionState(QuizState.Playing)
            setCurrentQuestion(nextQuestion[0])
            // TODO: send question to user
        })

        connection.on(`questionend:${userName}`, () => {
            // Show the corect answers
            setSelectedAnswerID("")
            setSessionState(QuizState.Statistics)
        })

        connection.start()
            .then(async () => {
                connection.send("EnterSlaveQuizSessionQuestion", quizUserState, quizSessionIdState)
            })
            .catch((err) => console.error(err))
    }
    */

    return (
        <div className="quizSlaveSessionQuestion">
            <BackgroundGems
                type={BackgroundGemsType.PrimarySlave2}
            />
            { currentQuestion != null &&
                <QuestionSlideInTag
                    questionText={currentQuestion.questionText}
                    maxQuestionTime={currentQuestion.maxQuestionTime}
                />
            }
            <div className="content">
                <div className="answersContainer">
                    {currentQuestion?.answers.map((item, index) => (
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

