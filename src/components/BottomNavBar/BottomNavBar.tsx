import {FC} from "react";
import "./BottomNavBar.css"
import {Icon} from "../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "./BottomNavBarExports.ts";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";

interface BottomNavBarProps {
    secondaryButtonText: string
    secondaryButtonIcon: Icon | null
    primaryButtonText: string
    primaryButtonIcon: Icon | null
    type: BottomNavBarType
    style: BottomNavBarStyle
    onSecondaryClick?: () => void
    onPrimaryClick?: () => void
    alternativeSecondaryButtonStyle?: ButtonStyle
    alternativePrimaryButtonStyle?: ButtonStyle
}

export const BottomNavBar: FC<BottomNavBarProps> = ({ secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, style, onPrimaryClick, onSecondaryClick, alternativeSecondaryButtonStyle, alternativePrimaryButtonStyle}) => {

    return (
        <div className={`bottomNavBar ${type != BottomNavBarType.Default ? "centered" : ""} ${style == BottomNavBarStyle.Medium ? "navForPopup" : ""}`}>
            { (type == BottomNavBarType.Default || type == BottomNavBarType.SecondaryOnly) &&
            <ButtonComponent
                text={secondaryButtonText}
                icon={secondaryButtonIcon}
                type={style == BottomNavBarStyle.Long ? ButtonType.Long: ButtonType.Medium}
                style={alternativeSecondaryButtonStyle ?? ButtonStyle.Secondary}
                onClick={onSecondaryClick}
            />
            }
            { (type == BottomNavBarType.Default || type == BottomNavBarType.PrimaryOnly) &&
            <ButtonComponent
                text={primaryButtonText}
                icon={primaryButtonIcon}
                type={style == BottomNavBarStyle.Long ? ButtonType.Long: ButtonType.Medium}
                style={alternativePrimaryButtonStyle ?? ButtonStyle.Primary}
                onClick={onPrimaryClick}
            />
            }
        </div>
    )
}