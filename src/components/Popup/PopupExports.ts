import {PopupProps} from "./Popup.tsx";
import {BottomNavBarType} from "../BottomNavBar/BottomNavBarExports.ts";
import {NavigateFunction} from "react-router-dom";

export const showPopupSomethingWentWrong = (showPopup: (popup: PopupProps) => void, hidePopup: () => void) => {
    const popup: PopupProps = {
        title: "Looks like something went wrong.",
        message: "Please try again later or contact us if the issue persists.",
        secondaryButtonText: "Ok",
        secondaryButtonIcon: null,
        primaryButtonText: "",
        primaryButtonIcon: null,
        type: BottomNavBarType.SecondaryOnly,
        onSecondaryClick: () => {
            hidePopup()
        }
    }
    showPopup(popup)
}

export const showPopupLeaveSession = (showPopup: (popup: PopupProps) => void, hidePopup: () => void, navigate: NavigateFunction, leaveSession: () => void) => {
    const leavePopup: PopupProps = {
        title: "Are you sure you want to leave this quiz session?",
        message: null,
        secondaryButtonText: "Cancel",
        secondaryButtonIcon: null,
        primaryButtonText: "Yes, I Am Sure",
        primaryButtonIcon: null,
        type: BottomNavBarType.Default,
        onSecondaryClick: () => {
            hidePopup()
        },
        onPrimaryClick: () => {
            leaveSession()
            hidePopup()
            navigate('/')
        },
    }
    showPopup(leavePopup)
}