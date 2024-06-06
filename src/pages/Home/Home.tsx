import { FC, useEffect, useState } from "react";
import "./Home.css"
import { ButtonComponent } from "../../components/Button/Button";
import {CREATE_ICON_DARK, ENTER_ICON_LIGHT, INFO_ICON_LIGHT, PLAY_ICON_LIGHT} from "../../assets/Icons";
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
import {QuizSessionManagerSlave} from "../../managers/QuizSessionManagerSlave.tsx";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebase/auth.ts";
import {QuizSessionManager} from "../../managers/QuizSessionManager.tsx";

const env_var = import.meta.env

const Home: FC = () => {
    const navigate = useNavigate();

    const [user, loading, error] = useAuthState(auth); // only required for checking if user is host of quiz
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const checkReconnectionSlave = async () => {
        const quizUser: QuizUser | null = localStorage.getItem("quizUser") ? JSON.parse(localStorage.getItem("quizUser")!) : null;
        const deviceId: string = quizUser?.deviceId ?? await getDeviceId();
        const reconnect: {
            quizUser: QuizUser,
            quizSession: QuizSession
        } | null = await QuizSessionService.checkQuizUserReconnection(deviceId)

        if (reconnect) {
            console.log("Got reconnect")
            setPopupProps({
                title: "Do you want to reconnect?",
                message: `This device was connected as "${reconnect.quizUser.identifier}" in a quiz. Not you? Try opening this page from a different browser or private window.`,
                type: BottomNavBarType.Default,
                onPrimaryClick: () => {
                    QuizSessionManagerSlave.getInstance().killSession()
                    navigate("/quiz/player", {
                        state: {
                            quizSessionId: reconnect.quizSession.id,
                            quizUser: reconnect.quizUser
                        }
                    })
                },
                primaryButtonText: "Reconnect",
                primaryButtonIcon: PLAY_ICON_LIGHT,
                onSecondaryClick: () => {
                    setShowingPopup(false);
                    setPopupProps(null);
                },
                secondaryButtonText: "Cancel",
                secondaryButtonIcon: null
            })
            setShowingPopup(true)
        }
    }

    useEffect(() => {
        checkReconnectionSlave()
    }, [])
    useEffect(() => {
        if (!loading && user) QuizSessionManager.checkReconnectionMaster(user.uid, setPopupProps, setShowingPopup, navigate)
        if (error) console.log(error)
    }, [user, loading, navigate]);

    const navigateJoinQuiz = () => {
        navigate("join")
    }

    const navigateCreateQuiz = () => {
        navigate("login")
    }

    return (
        <div className="home">
            <BackgroundGems type={BackgroundGemsType.Primary}/>
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
                <div className={"linkToInfoPage"} onClick={() => {
                    window.location.href = `https://info.${env_var.VITE_AUTH_DOMAIN}`
                }}>
                    <img src={INFO_ICON_LIGHT.path} alt={INFO_ICON_LIGHT.alt}/>
                    <p>About Us</p>
                </div>
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

