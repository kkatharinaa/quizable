import {FC} from "react";
import "./Popup.css"
import {Icon} from "../../assets/Icons.ts";
import {PopupType} from "./PopupExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";

export interface PopupProps {
    title: string
    message: string | null
    secondaryButtonText: string
    secondaryButtonIcon: Icon | null
    primaryButtonText: string
    primaryButtonIcon: Icon | null
    type: PopupType
    onSecondaryClick?: () => void
    onPrimaryClick?: () => void
}

export const Popup: FC<PopupProps> = ({ title, message, secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, onSecondaryClick, onPrimaryClick}) => {

    // TODO: adjust css based on design

    return (
        <div className="popup">
            <div className="popupBackground">
            </div>
            <div className="popupField">
                <h2 className="popupTitle">{title}</h2>
                {message != null && <p className="popupMessage">{message}</p>}
                <div className="popupButtons">
                    {(type == PopupType.Default || type == PopupType.SecondaryOnly) &&
                        <ButtonComponent
                            text={secondaryButtonText}
                            icon={secondaryButtonIcon}
                            type={ButtonType.Medium}
                            style={ButtonStyle.Secondary}
                            onClick={onSecondaryClick}
                        />
                    }
                    {(type == PopupType.Default || type == PopupType.PrimaryOnly) &&
                        <ButtonComponent
                            text={primaryButtonText}
                            icon={primaryButtonIcon}
                            type={ButtonType.Medium}
                            style={ButtonStyle.Primary}
                            onClick={onPrimaryClick}
                        />
                    }
                </div>
            </div>
        </div>
    )
}