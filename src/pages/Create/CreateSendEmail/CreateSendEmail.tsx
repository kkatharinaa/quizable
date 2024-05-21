import {FC, useEffect, useState} from "react"
import "./CreateSendEmail.css"
import {useNavigate} from "react-router-dom";
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {RETURN_ICON_DARK, SEND_ICON_DISABLED, SEND_ICON_LIGHT} from "../../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {InputField} from "../../../components/InputField/InputField.tsx";
import {InputFieldType} from "../../../components/InputField/InputFieldExports.ts";
import {ButtonStyle} from "../../../components/Button/ButtonExports.ts";

// Auth stuff
import {auth, sendEmailLink} from "../../../firebase/auth.ts";
import {useAuthState} from "react-firebase-hooks/auth";
import {Loading} from "../../Loading/Loading.tsx";

export const CreateSendEmail: FC = () => {
    const navigate = useNavigate()

    const [ inputValue, setInputValue ] = useState("")
    const [ infoText, setInfoText ] = useState("")
    const [ canSend, setCanSend ] = useState(true)
    const [ sentEmail, setSentEmail ] = useState(false)
    const [ isSetUp, setIsSetUp ] = useState(false)
    const [user, loading, error] = useAuthState(auth);
    
    const updateInput = (newValue: string) => {
        setInputValue(newValue)
    }

    const navigateHome = () => {
        navigate("/");
    }

    const canSendEmail = ():boolean => {
        // just generally check if there is something written in the input field that could in some way be an email address, firebase auth will do the proper checking
        return canSend && inputValue.length >= 3 && inputValue.includes('@')
    }

    const handleSendEmail = () => {
        if (!canSendEmail()) return
        setCanSend(false)
        setSentEmail(true)

        // send email to user which will provide the user with an authenticated link - it seems firebase handles the email validation by itself, meaning I will setInfoText based on if the auth promise is fulfilled or if an error is thrown
        sendEmailLink(inputValue, () => {
            setInfoText("We have just sent you an email! Please follow the instructions within the email to login. The email may take a few minutes to arrive.")
        }, () => {
            setInfoText("Something went wrong. Please check that the email address you entered is valid or try again later.")
        })
            .then(() => {
                setCanSend(true)
            })
    }

    useEffect(() => {
        // redirect if the screen is too narrow
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                navigate('/')
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (user) navigate("/overview");
        setInfoText("If this is your first time, your account will be created immediately. Else we will send you an email to sign in.")
        setIsSetUp(true)
        if (error) console.log(error)
    }, [user, loading, navigate]);

    return (
        <div className="login">
            <BackgroundGems type={BackgroundGemsType.Primary}></BackgroundGems>

            { (loading || !isSetUp) ? (
                <Loading/>
            ) : (
                <div className="content">
                    <div className="inputFieldWithInfoText">
                        <p className="infoText">{"Logging in is as simple as possible - just put in your email!"}</p>
                        <InputField
                            value={inputValue}
                            onChange={updateInput}
                            onEnter={handleSendEmail}
                            type={InputFieldType.Email}
                        />
                        {infoText != "" &&
                            <p className="infoText">{infoText}</p>
                        }
                    </div>
                </div>
            )}
            { (!loading && isSetUp) &&
                <BottomNavBar
                    secondaryButtonText="Home"
                    secondaryButtonIcon={RETURN_ICON_DARK}
                    primaryButtonText={sentEmail ? "Resend Link" : "Send Link"}
                    primaryButtonIcon={!canSendEmail() ? SEND_ICON_DISABLED : SEND_ICON_LIGHT}
                    type={BottomNavBarType.Default}
                    style={BottomNavBarStyle.Long}
                    onPrimaryClick={handleSendEmail}
                    onSecondaryClick={navigateHome}
                    alternativePrimaryButtonStyle={!canSendEmail() ? ButtonStyle.Disabled : undefined}
                />
            }
        </div>
    )
}