import {FC, useEffect, useState} from "react";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import {BottomNavBarStyle, BottomNavBarType} from "../../components/BottomNavBar/BottomNavBarExports";
import {BackgroundGems} from "../../components/BackgroundGems/BackgroundGems";
import {BackgroundGemsType} from "../../components/BackgroundGems/BackgroundGemsExports";
import "./Join.css"
import {useNavigate, useSearchParams} from "react-router-dom";
import QuizSessionService from "../../services/QuizSessionService";
import {PLAY_ICON_LIGHT, RETURN_ICON_DARK} from "../../assets/Icons.ts";
import {InputField} from "../../components/InputField/InputField.tsx";
import {InputFieldType} from "../../components/InputField/InputFieldExports.ts";
import {QuizSessionManagerSlave} from "../../managers/QuizSessionManagerSlave.tsx";
import QuizUser from "../../models/QuizUser.ts";
import {getDeviceId} from "../../helper/DeviceHelper.ts";
import {v4 as uuid} from "uuid";
import {Popup, PopupProps} from "../../components/Popup/Popup.tsx";
import QuizSession from "../../models/QuizSession.ts";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebase/auth.ts";
import {QuizSessionManager} from "../../managers/QuizSessionManager.tsx";

interface ValidationState {
    valid: boolean, 
    validationText: string
}

interface ValidQuizCodeState {
    code: string,
    quizSessionId: string
}

export const Join: FC = () => {
    const navigate = useNavigate()
    const [searchParam] = useSearchParams()

    const [ inputValue, setInputValue ] = useState("")
    const [ validation, setValidation ] = useState<ValidationState>({
        valid: true,
        validationText: ""
    });
    const [ validQuizCode, setValidQuizCode ] = useState<ValidQuizCodeState>({
        code: "",
        quizSessionId: ""
    });
    const [user, loading, error] = useAuthState(auth); // only required for checking if user is host of quiz
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
    const [showingPopup, setShowingPopup] = useState(false);

    const navigateHome = () => {
        navigate("/");
    }

    const validateQuizCode = async (quizCode: string) => {
        if(validation.valid){

            // make request to QuizService if code exists
            const quizSessionCodeValid = await QuizSessionService.isQuizCodeValid(quizCode)
            if(quizSessionCodeValid.valid){
                // check if we are already logged in and if yes forward the user to the quiz
                const storedQuizUser: QuizUser | null = localStorage.getItem("quizUser") ? JSON.parse(localStorage.getItem("quizUser")!) : null;
                const deviceId: string = storedQuizUser?.deviceId ?? await getDeviceId();
                const reconnect: {quizUser: QuizUser, quizSession: QuizSession} | null = await QuizSessionService.checkQuizUserReconnection(deviceId)

                if (reconnect) {
                    setPopupProps({
                        title: "You are already in this quiz session.",
                        message: `This device is currently connected as "${reconnect.quizUser.identifier}".`,
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
                        secondaryButtonIcon: null,
                    })
                    setShowingPopup(true)
                } else {
                    setValidQuizCode({
                        code: quizCode,
                        quizSessionId: quizSessionCodeValid.sessionId
                    })
                    setInputValue("")
                }
            } else {
                const newValidationState = {
                    valid: false,
                    validationText: "Quiz code is invalid, no quiz session found."
                }
                setValidation(newValidationState)
            }
        }
    }

    const validateInputLive = (newValue: string) => {
        // update input value
        setInputValue(newValue);

        // validate the text
        validateText(newValue);
    }

    const joinQuiz = async () => {
        const response = await QuizSessionService.checkQuizUserAlreadyExists(validQuizCode.quizSessionId,inputValue);

        if(response.status == 200) {
            const quizUser: QuizUser = {
                id: response.user != undefined ? response.user.id : uuid(),
                identifier: response.user != undefined ? response.user.identifier : inputValue,
                deviceId: await getDeviceId()
            }
            const joinSession = () => {
                QuizSessionManagerSlave.getInstance().killSession()
                navigate("/quiz/player", {state: {quizSessionId: validQuizCode.quizSessionId, quizUser: quizUser}})
            }
            if (response.user != undefined) {
                setPopupProps({
                    title: `Are you trying to rejoin the session as "${response.user.identifier}"?`,
                    message: `If you originally joined as this user and are trying to reconnect, please proceed. If this is your first time joining this session, please choose another username.`,
                    type: BottomNavBarType.Default,
                    onPrimaryClick: () => {
                        joinSession()
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
            } else {
                joinSession()
            }
        }
        else {
            setValidation({
                valid: false,
                validationText: "This username is already taken."
            })
        }
    }

    const validateText = (text: string) => {
        // invalid characters as regex
        const invalidChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

        let newValidationState: ValidationState = {
            valid: true,
            validationText: ""
        }

        // check if the string has at least 7 characters
        if(text.length > 7){
            newValidationState = {
                valid: false,
                validationText: "Quiz code is invalid, code is too long."
            }
        }
         else if(text.length < 7 && text.length > 0){
            newValidationState = {
                valid: false,
                validationText: "Quiz code is invalid, code is too short."
            }
        }
        else if(text.length == 0){
            newValidationState = {
                valid: true,
                validationText: ""
            }
        }

        // check if the string contains any invalid characters
        if(invalidChars.test(text)){
            newValidationState = {
                valid: false, 
                validationText: "Quiz code is invalid, no special characters allowed."
            }
        }

        setValidation(newValidationState)
    }

    const updateInput = (newValue: string) => {
        setInputValue(newValue)
    }

    const checkEntryIdPresent = async () => {
        const entryIdQuery: string | null = searchParam.get("entryid")

        if(entryIdQuery != null) {
            console.log("EntryId found: " + entryIdQuery)
            setInputValue(entryIdQuery)
            await validateQuizCode(entryIdQuery)
        }
    }

    const checkReconnectionMaster = async (hostId: string) => {
        const quizSession: QuizSession | null = await QuizSessionService.checkHostReconnection(hostId)

        if (quizSession != null) {
            setPopupProps({
                title: "You currently cannot join a new quiz session.",
                message: `Your own quiz session is still running. End it first before trying again.`,
                type: BottomNavBarType.Default,
                onPrimaryClick: () => {
                    QuizSessionManager.getInstance().resetManager();
                    navigate('/quiz', {state: {quizSessionId: quizSession.id, quizId: quizSession.quizId}})
                },
                primaryButtonText: "To My Session",
                primaryButtonIcon: PLAY_ICON_LIGHT,
                onSecondaryClick: () => {
                    setShowingPopup(false);
                    setPopupProps(null);
                    navigateHome()
                },
                secondaryButtonText: "To Home",
                secondaryButtonIcon: null
            })
            setShowingPopup(true)
        }
    }

    const checkReconnectionSlave = async () => {
        const quizUser: QuizUser | null = localStorage.getItem("quizUser") ? JSON.parse(localStorage.getItem("quizUser")!) : null;
        const deviceId: string = quizUser?.deviceId ?? await getDeviceId();
        const reconnect: {
            quizUser: QuizUser,
            quizSession: QuizSession
        } | null = await QuizSessionService.checkQuizUserReconnection(deviceId)

        if (reconnect) {
            setPopupProps({
                title: "Do you want to reconnect?",
                message: `This device was connected as "${reconnect.quizUser.identifier}" in a quiz. To join a new quiz, please reconnect and then leave the old one.`,
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
                    navigateHome()
                },
                secondaryButtonText: "To Home",
                secondaryButtonIcon: null
            })
            setShowingPopup(true)
        }
    }

    useEffect(() => {
        const setUp = async () => {
            await checkReconnectionSlave()
            await checkEntryIdPresent()
        }
        setUp()
    }, [])
    useEffect(() => {
        if (!loading && user) checkReconnectionMaster(user.uid)
        if (error) console.log(error)
    }, [user, loading, navigate]);

    return (
        <div className="joinPage">
            <BackgroundGems type={BackgroundGemsType.Primary}></BackgroundGems>
            <div className="contentJoin" tabIndex={0}>
                <div className="inputFieldWithValidationText">
                    <InputField
                        value={inputValue}
                        onChange={validQuizCode.code.length == 0 ? validateInputLive : updateInput}
                        onEnter={validQuizCode.code.length == 0 ? () => validateQuizCode(inputValue) : joinQuiz}
                        type={validQuizCode.code.length == 0 ? InputFieldType.Quizcode : InputFieldType.Username}
                    />
                    {!validation.valid &&
                        <p className="inputFieldJoinValidation">{validation.validationText}</p>
                    }
                </div>
            </div>
            
            <BottomNavBar
                secondaryButtonText="Home"
                secondaryButtonIcon={RETURN_ICON_DARK}
                primaryButtonText={validQuizCode.code.length == 0 ? "Enter Code" : "Join Quiz"}
                primaryButtonIcon={null}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onPrimaryClick={validQuizCode.code.length == 0 ? () => validateQuizCode(inputValue) : joinQuiz}
                onSecondaryClick={navigateHome}
            />

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
    )
}