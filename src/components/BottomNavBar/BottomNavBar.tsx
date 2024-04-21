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
}

export const BottomNavBar: FC<BottomNavBarProps> = ({ secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, style, onPrimaryClick, onSecondaryClick}) => {

    return (
        <div className={`bottomNavBar ${type != BottomNavBarType.Default ? "centered" : ""} ${style == BottomNavBarStyle.Medium ? "navForPopup" : ""}`}>
            { (type == BottomNavBarType.Default || type == BottomNavBarType.SecondaryOnly) &&
            <ButtonComponent
                text={secondaryButtonText}
                icon={secondaryButtonIcon}
                type={BottomNavBarStyle.Long ? ButtonType.Long: ButtonType.Medium}
                style={ButtonStyle.Secondary}
                onClick={onSecondaryClick}
            />
            }
            { (type == BottomNavBarType.Default || type == BottomNavBarType.PrimaryOnly) &&
            <ButtonComponent
                text={primaryButtonText}
                icon={primaryButtonIcon}
                type={BottomNavBarStyle.Long ? ButtonType.Long: ButtonType.Medium}
                style={ButtonStyle.Primary}
                onClick={onPrimaryClick}
            />
            }
        </div>
    )
}