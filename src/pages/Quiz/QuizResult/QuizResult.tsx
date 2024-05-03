import {FC, useState} from "react";
import "./QuizResult.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {POWER_ICON_DARK, SKIP_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import QuizSession from "../../../models/QuizSession.ts";
import {v4 as uuid} from "uuid";
import {Quiz} from "../../../models/Quiz.ts";
import {getAnswerInputFieldTypeForIndex} from "../../../components/AnswerInputField/AnswerInputFieldExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {Question} from "../../../models/Question.ts";
import {Answer} from "../../../models/Answer.ts";
import {StatisticsBar} from "../../../components/StatisticsBar/StatisticsBar.tsx";
import {Popup, PopupProps} from "../../../components/Popup/Popup.tsx";

export const QuizResult: FC = () => {

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
                score: 100,
                answers: [{
                    questionId: currentQuiz.questions[0].id,
                    answerId: currentQuiz.questions[0].answers[1].id,
                    pointsReceived: 100,
                    timeTaken: 5
                }]
            },{
                user: {
                    id: uuid(),
                    identifier: "player2",
                    deviceId: ""
                },
                score: 0,
                answers: [{
                    questionId: currentQuiz.questions[0].id,
                    answerId: currentQuiz.questions[0].answers[0].id,
                    pointsReceived: 0,
                    timeTaken: 3
                }]
            }],
            currentQuizState: "" // TODO: shouldn't this be an enum?
        },
        deviceId: "",
    }
    const gameCode = "123456"
    const [quizSession, setQuizSession] = useState<QuizSession>(currentSession)
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const getCurrentQuestion = () => {
        const currentQuestion = currentQuiz.questions.find(question => question.id == quizSession.state.currentQuestionId)
        if (currentQuestion == undefined) throw new Error("Could not find current question") // TODO: display error
        return currentQuestion
    }
    const getAnswersCountForAnswer = (answerID: string): number => {
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
        return quizSession.state.usersStats.reduce((count, userStat) => {
            userStat.answers.forEach(answer => {
                if (answer.questionId === quizSession.state.currentQuestionId) {
                    count++;
                }
            });
            return count;
        }, 0)
    }

    const handleEndQuiz = () => {
        // TODO: later also implement being able to go back to the previous question
        const endQuizPopup: PopupProps = {
            title: "Are you sure you want to end this quiz session?",
            message: null,
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: null,
            primaryButtonText: "Yes, I Am Sure",
            primaryButtonIcon: null,
            type: BottomNavBarType.Default,
            onSecondaryClick: () => {
                setShowingPopup(false)
            },
            onPrimaryClick: () => {
                // TODO: navigate to quiz end screen
            },
        }
        showPopup(endQuizPopup)
    }
    const handleContinue = () => {
        // TODO: move on to leaderboard, rn it skips the leaderboard and goes directly to the next question
    }

    const showPopup = (popup: PopupProps) => {
        setPopupProps(popup)
        setShowingPopup(true)
    }

    return (
        <div className="quizResult">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={gameCode}
            />
            <div className="content">
                <div className="statistics">
                    {getCurrentQuestion().answers.map((item, index) => (
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
                onSecondaryClick={handleEndQuiz}
                onPrimaryClick={handleContinue}
            />

            { (showingPopup && popupProps != null) &&
                <Popup
                    title={popupProps.title}
                    message={popupProps.message}
                    secondaryButtonText={popupProps.secondaryButtonText}
                    secondaryButtonIcon={popupProps.secondaryButtonIcon}
                    primaryButtonText={popupProps.primaryButtonText}
                    primaryButtonIcon={popupProps.primaryButtonIcon}
                    type={popupProps.type}
                    onSecondaryClick={popupProps.onSecondaryClick}
                    onPrimaryClick={popupProps.onPrimaryClick}
                />
            }
        </div>
    );
}

