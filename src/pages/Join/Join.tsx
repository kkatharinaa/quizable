import {FC, useState} from "react";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import {BottomNavBarStyle, BottomNavBarType} from "../../components/BottomNavBar/BottomNavBarExports";
import {BackgroundGems} from "../../components/BackgroundGems/BackgroundGems";
import {BackgroundGemsType} from "../../components/BackgroundGems/BackgroundGemsExports";
import "./Join.css"
import {useNavigate} from "react-router-dom";
import QuizSessionService from "../../services/QuizSessionService";
import {RETURN_ICON_DARK} from "../../assets/Icons.ts";
import {InputField} from "../../components/InputField/InputField.tsx";
import {InputFieldType} from "../../components/InputField/InputFieldExports.ts";
import {QuizSessionManagerSlave} from "../../managers/QuizSessionManagerSlave.tsx";

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

    const [ inputValue, setInputValue ] = useState("")
    const [ validation, setValidation ] = useState<ValidationState>({
        valid: true,
        validationText: ""
    });
    const [ validQuizCode, setValidQuizCode ] = useState<ValidQuizCodeState>({
        code: "",
        quizSessionId: ""
    });

    const navigateHome = () => {
        navigate("/");
    }

    const validateQuizCode = async () => {
        if(validation.valid){

            // make request to QuizService if code exists
            // if it does not return an empty string
            const quizSessionCodeValid = await QuizSessionService.isQuizCodeValid(inputValue)
            if(quizSessionCodeValid.valid){
                setValidQuizCode({
                    code: inputValue,
                    quizSessionId: quizSessionCodeValid.sessionId
                })
                setInputValue("")
            }
        }
        // if the quiz code is valid, navigate to a new page with the routing parameters
        // other page with create the websocket connection
    }

    const validateInputLive = (newValue: string) => {
        // update input value
        setInputValue(newValue);

        // validate the text
        validateText(newValue);
    }

    const joinQuiz = async () => {
        const userExists: boolean = await QuizSessionService.checkQuizUserAlreadyExists(validQuizCode.quizSessionId,inputValue);

        if(!userExists) {
            QuizSessionManagerSlave.getInstance().killSession()
            navigate("/quiz/player", {state: {quizSessionId: validQuizCode.quizSessionId, userName: inputValue}})
        }
        else {
            setValidation({
                valid: false,
                validationText: "Username is already given!"
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
                validationText: "Quiz code is invalid, no special characters allowed!"
            }
        }

        setValidation(newValidationState)
    }

    const updateInput = (newValue: string) => {
        setInputValue(newValue)
    }

    return (
        <div className="joinPage">
            <BackgroundGems type={BackgroundGemsType.PrimarySlave}></BackgroundGems>
            <div className="contentJoin">
                <div className="inputFieldWithValidationText">
                    <InputField
                        value={inputValue}
                        onChange={validQuizCode.code.length == 0 ? validateInputLive : updateInput}
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
                onPrimaryClick={validQuizCode.code.length == 0 ? validateQuizCode : joinQuiz}
                onSecondaryClick={navigateHome}
            />
        </div>
    )
}