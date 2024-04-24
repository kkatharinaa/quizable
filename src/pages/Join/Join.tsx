import { FC, useState } from "react";
import { BottomNavBar } from "../../components/BottomNavBar/BottomNavBar";
import { BottomNavBarStyle, BottomNavBarType } from "../../components/BottomNavBar/BottomNavBarExports";
import { ADD_ICON_DARK, ADD_ICON_LIGHT } from "../../assets/Icons";
import { BackgroundGems } from "../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../components/BackgroundGems/BackgroundGemsExports";
import "./Join.css"
import { useNavigate } from "react-router-dom";
import QuizSessionService from "../../services/QuizSessionService";

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

    const validateInputLive = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue: string = e.target.value;

        // update input value
        setInputValue(inputValue);

        // validate the text
        validateText(inputValue);
    }

    const joinQuiz = () => {
        navigate("/quiz/slave/lobby", {state: {quizSessionId: validQuizCode.quizSessionId, userName: inputValue}})
    }

    const validateText = (text: string) => {
        // invalid characters as regex
        const invalidChars = /[`!@#$%^&*()_+-=[\]{};':"\\|,.<>/?~]/;

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

       /*  // check if the string contains any invalid characters
        if(invalidChars.test(text)){
            newValidationState = {
                valid: false, 
                validationText: "Quiz code is invalid, not special characters allowed!"
            }
        }         */

        setValidation(newValidationState)
    }

    return (
        <div className="joinPage">
            <BackgroundGems type={BackgroundGemsType.Primary}></BackgroundGems>
            <div className="contentJoin">
                <div>
                    {validQuizCode.code.length == 0 ? (
                        <div className="inputFieldJoin">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={validateInputLive}
                                placeholder="Enter quiz code"
                            />
                            {!validation.valid &&
                                <p className="inputFieldJoinValidation">{validation.validationText}</p>
                            }
                        </div> 
                    ) : (
                        <div className="inputFieldJoin">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Enter user name"
                            />
                            {!validation.valid &&
                                <p className="inputFieldJoinValidation">{validation.validationText}</p>
                            }
                        </div> 
                    )}
                </div>
            </div>
            
            <BottomNavBar
                secondaryButtonText="Back to home"
                secondaryButtonIcon={ADD_ICON_DARK}
                primaryButtonText={validQuizCode.code.length == 0 ? "Enter code" : "Join quiz"}
                primaryButtonIcon={ADD_ICON_LIGHT}
                type={BottomNavBarType.Default}
                style={BottomNavBarStyle.Long}
                onPrimaryClick={validQuizCode.code.length == 0 ? validateQuizCode : joinQuiz}
                onSecondaryClick={navigateHome}
            />
        </div>
    )
}