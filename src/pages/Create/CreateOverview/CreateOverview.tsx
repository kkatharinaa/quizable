import {FC, useState} from "react";
import "./CreateOverview.css"
import {Quiz} from "../../../models/Quiz.ts";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCardContainer} from "../../../components/QuizCardContainer/QuizCardContainer.tsx";
import {QuizName} from "../../../models/ConstrainedTypes.ts";

export const CreateOverview: FC = () => {
    // TODO: check if we are logged in and then get all of this user's quizzes from firebase
    // so far we dont have firebase implemented, so just use a fake collection of quizzes for testing purposes
    const originalQuizzes: Quiz[] = [{...Quiz.default, name: QuizName.tryMake("this is a suuuuuuper long quiz name which was also created yesterday")!, createdOn: new Date(new Date().setDate(new Date().getDate() - 1))}, Quiz.default, Quiz.default]

    // TODO: sort quizzes by createdOn date, and display newest at the start or at the end (currently: newest at the end)? or allow reordering?
    const sortByCreatedOn = (a: Quiz, b: Quiz) => {
        if (a.createdOn < b.createdOn) { return -1 }
        if (a.createdOn > b.createdOn) { return 1 }
        return 0
    };
    const sortedQuizzes = originalQuizzes.slice().sort(sortByCreatedOn)

    const [quizzes, setQuizzes] = useState<Quiz[]>(sortedQuizzes);

    // quiz functions
    const handleAddQuiz = () => {
        // TODO: open new quiz settings popup which will create a quiz and update the quizzes state when closed, or when clicked on "edit questions" button
    };
    const handleEditQuiz = (index: number) => {
        const quizToBeEdited = quizzes[index]
        // TODO: open quiz settings popup for that quiz, save quiz and update state when closed
    };
    const handlePlayQuiz = (index: number) => {
        const quizToBePlayed = quizzes[index]
        // TODO: start playing quiz
    };

    // nav functions
    const logOut = () => {
        // TODO: log out, move back to homescreen
    }

    return (
        <div className="createOverview">

            <div className="content">
                <h1>Welcome, User</h1>
                <QuizCardContainer
                    quizzes={quizzes}
                    onEdit={handleEditQuiz}
                    onPlay={handlePlayQuiz}
                    onAdd={handleAddQuiz}
                />
            </div>

            <BottomNavBar
                secondaryButtonText="Logout"
                secondaryButtonIcon={null}
                primaryButtonText=""
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                onSecondaryClick={logOut}
            />
        </div>
    )
}