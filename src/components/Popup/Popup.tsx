import {FC, useState} from "react";
import "./Popup.css"
import {Icon} from "../../assets/Icons.ts";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";
import {InputField} from "../InputField/InputField.tsx";
import {InputFieldType} from "../InputField/InputFieldExports.ts";

export interface PopupProps {
    title: string
    message: string | null
    secondaryButtonText: string
    secondaryButtonIcon: Icon | null
    primaryButtonText: string
    primaryButtonIcon: Icon | null
    type: BottomNavBarType
    onSecondaryClick?: () => void
    onPrimaryClick?: (() => void) | ((inputValue: string) => void)
    isPrompt?: boolean
}

export const Popup: FC<PopupProps> = ({ title, message, secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, onSecondaryClick, onPrimaryClick, isPrompt}) => {

    const [inputValue, setInputValue] = useState("")

    const handleInputValueChange = (newValue: string) => {
        setInputValue(newValue)
    }

    const handlePrimaryClick = () => {
        if (onPrimaryClick == undefined) return

        if (onPrimaryClick.length == 1) {
            onPrimaryClick(inputValue)
        } else {
            (onPrimaryClick as () => void)()
        }
    }

    return (
        <div className="popup">
            <div className="popupBackground">
            </div>
            <div className="popupField">
                <div className="popupTitleAndMessage">
                    <h2 className="popupTitle">{title}</h2>
                    {message != null && <p className="popupMessage">{message}</p>}
                </div>
                { isPrompt == true &&
                    <InputField
                        value={inputValue}
                        onChange={handleInputValueChange}
                        onEnter={handlePrimaryClick}
                        type={InputFieldType.Email}/>
                }
                <BottomNavBar
                    secondaryButtonText={secondaryButtonText}
                    secondaryButtonIcon={secondaryButtonIcon}
                    primaryButtonText={primaryButtonText}
                    primaryButtonIcon={primaryButtonIcon}
                    type={type}
                    style={BottomNavBarStyle.Medium}
                    onSecondaryClick={onSecondaryClick}
                    onPrimaryClick={handlePrimaryClick}
                />
            </div>
        </div>
    )
}