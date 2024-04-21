import {FC} from "react";
import "./Popup.css"
import {Icon} from "../../assets/Icons.ts";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";

export interface PopupProps {
    title: string
    message: string | null
    secondaryButtonText: string
    secondaryButtonIcon: Icon | null
    primaryButtonText: string
    primaryButtonIcon: Icon | null
    type: BottomNavBarType
    onSecondaryClick?: () => void
    onPrimaryClick?: () => void
}

export const Popup: FC<PopupProps> = ({ title, message, secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, onSecondaryClick, onPrimaryClick}) => {

    return (
        <div className="popup">
            <div className="popupBackground">
            </div>
            <div className="popupField">
                <div className="popupTitleAndMessage">
                    <h2 className="popupTitle">{title}</h2>
                    {message != null && <p className="popupMessage">{message}</p>}
                </div>
                <BottomNavBar
                    secondaryButtonText={secondaryButtonText}
                    secondaryButtonIcon={secondaryButtonIcon}
                    primaryButtonText={primaryButtonText}
                    primaryButtonIcon={primaryButtonIcon}
                    type={type}
                    style={BottomNavBarStyle.Medium}
                    onSecondaryClick={onSecondaryClick}
                    onPrimaryClick={onPrimaryClick}
                />
            </div>
        </div>
    )
}