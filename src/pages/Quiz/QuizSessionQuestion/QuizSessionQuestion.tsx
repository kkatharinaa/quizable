import {FC, useState} from "react";
import "./QuizSessionQuestion.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT, USER_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {v4 as uuid} from "uuid";
import {Quiz} from "../../../models/Quiz.ts";
import {Timer} from "../../../components/Timer/Timer.tsx";
import {AnswerInputField} from "../../../components/AnswerInputField/AnswerInputField.tsx";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {Answer} from "../../../models/Answer.ts";

export const QuizSessionQuestion: FC = () => {

    // TODO: get current quizsession, current quiz and game code - rn just use default values to develop the ui
    const currentQuiz =  new Quiz()
    currentQuiz.questions[0] = new Question(uuid(), "What are the most effective strategies for managing stress in high-pressure work environments?"/*"Which colour is the sky?"*/, [new Answer(false, uuid(), "That are the most effective strategies for managing stress in high-pressure work environments."), new Answer(true, uuid(), "Green"), new Answer(false, uuid(), "Yellow")])
    const currentSession: QuizSession = {
        id: uuid(),
        quizId: currentQuiz.id,
        state: {
            currentQuestionId: currentQuiz.questions[0].id,
            usersStats: [{
                user: {
                    id: uuid(),
                    identifier: "player1",
                    deviceId: ""
                },
                score: 0,
                answers: []
            }],
            currentQuizState: "" // TODO: shouldn't this be an enum?
        },
        deviceId: "",
    }
    const gameCode = "123456"
    const [quizSession, setQuizSession] = useState<QuizSession>(currentSession)

    const getCurrentQuestion = () => {
        const currentQuestion = currentQuiz.questions.find(question => question.id == quizSession.state.currentQuestionId)
        if (currentQuestion == undefined) throw new Error("Could not find current question") // TODO: display error
        return currentQuestion
    }
    const getAnsweredPlayersCount = () => {
        let count = 0
        const userStats = quizSession!.state.usersStats
        for (const index in userStats) {
            const userAnswers = userStats[index].answers
            if (userAnswers.find(userAnswer => userAnswer.questionId == quizSession.state.currentQuestionId)) {
                count += 1
            }
        }
        return count
    }

    const handleEndQuiz = () => {
        // TODO: end quiz session
    }
    const handleSkipQuestion = () => {
        // TODO: move on to answer statistics screen
    }

    return (
        <div className="quizSessionQuestion">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={gameCode}
            />
            <div className="content">
                <h1>{getCurrentQuestion().questionText}</h1>
                { getCurrentQuestion().maxQuestionTime != 0 &&
                    <Timer
                        remainingTime={getCurrentQuestion().maxQuestionTime}
                        isRunning={true}
                        onDone={handleSkipQuestion}
                    />
                }
                <div className="answersGroup">
                    <div className="answersInfo">
                        <img src={USER_ICON_LIGHT.path} alt={USER_ICON_LIGHT.alt}/>
                        <p>{`${getAnsweredPlayersCount()}/${quizSession.state.usersStats.length} answered`}</p>
                    </div>
                    <div className="answersContainer">
                        {getCurrentQuestion().answers.map((item, index) => (
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
                secondaryButtonText="End Quiz" // TODO: implement going back to the previous question
                secondaryButtonIcon={POWER_ICON_DARK}
                primaryButtonText={getCurrentQuestion().maxQuestionTime != 0 ? "Skip" : "Next"}
                primaryButtonIcon={SKIP_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={handleEndQuiz}
                onPrimaryClick={handleSkipQuestion}
            />
        </div>
    );
}
 