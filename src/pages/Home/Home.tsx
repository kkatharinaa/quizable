import { FC, useEffect, useState } from "react";
import "./Home.css"
import { ButtonComponent } from "../../components/Button/Button";
import {CREATE_ICON_DARK, ENTER_ICON_LIGHT, LEAVE_ICON_DARK, PLAY_ICON_LIGHT} from "../../assets/Icons";
import { ButtonStyle, ButtonType } from "../../components/Button/ButtonExports";
import { BackgroundGems } from "../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../components/BackgroundGems/BackgroundGemsExports";
import { useNavigate } from "react-router-dom";
import { getDeviceId } from "../../helper/DeviceHelper";
import QuizSessionService from "../../services/QuizSessionService";
import { Popup, PopupProps } from "../../components/Popup/Popup";
import QuizUser from "../../models/QuizUser";
import { BottomNavBarType } from "../../components/BottomNavBar/BottomNavBarExports";
import QuizSession from "../../models/QuizSession";

const Home: FC = () => {
    const navigate = useNavigate();

    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const checkReconnection = async () => {
        const deviceId: string = await getDeviceId();
        const reconnect: {quizUser: QuizUser, quizSession: QuizSession} | null = await QuizSessionService.checkQuizUserReconnection(deviceId)

        if (reconnect) {
            console.log("Got reconnect")
            setPopupProps({
                title: "Do you want to reconnect?",
                message: `This device was connected as "${reconnect.quizUser.identifier}" in a quiz`,
                type: BottomNavBarType.Default,
                onPrimaryClick: () => {
                    navigate('/quiz', {state: {quizSessionId: reconnect.quizSession.id, quizId: reconnect.quizUser.id}})
                },
                primaryButtonText: "Reconnect",
                primaryButtonIcon: PLAY_ICON_LIGHT,
                onSecondaryClick: () => {
                    setShowingPopup(false);
                    setPopupProps(null);
            },
            secondaryButtonText: "Cancel",
            secondaryButtonIcon: LEAVE_ICON_DARK
          })
          setShowingPopup(true)
        }
    }

    useEffect(() => {
        checkReconnection()
    }, [])

    const navigateJoinQuiz = () => {
        navigate("join")
    }

    const navigateCreateQuiz = () => {
        navigate("login")
    }

    return (
        <div className="home">
            <BackgroundGems type={window.innerWidth > 480 ? BackgroundGemsType.Primary : BackgroundGemsType.PrimarySlave}/>
            <h1 className="quizableTitle">Quizable</h1>
            <div className="homeButtons">
                <ButtonComponent
                    text="Join Quiz"
                    icon={ENTER_ICON_LIGHT}
                    type={ButtonType.Long}
                    style={ButtonStyle.Primary}
                    onClick={navigateJoinQuiz}
                />
                <ButtonComponent
                    text="Create Quiz"
                    icon={CREATE_ICON_DARK}
                    type={ButtonType.Long}
                    style={ButtonStyle.Secondary}
                    onClick={navigateCreateQuiz}
                />
            </div>

            {(showingPopup && popupProps != null) &&
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
};

export default Home;

