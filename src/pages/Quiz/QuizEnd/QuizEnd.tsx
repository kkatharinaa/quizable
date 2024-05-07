import {FC} from "react";
import "./QuizEnd.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {useNavigate} from "react-router-dom";

export const QuizEnd: FC = () => {
    const navigate = useNavigate()

    // TODO: make pretty, will be in refactoring branch

    const endQuizSession = () => {
        // TODO: kill quiz session
        navigate('/')
    }

    return (
        <div className="quizEnd">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <div className="content">
                <h1>Thank you for playing!</h1>
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

