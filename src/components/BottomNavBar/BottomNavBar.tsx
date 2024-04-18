import {FC} from "react";
import "./BottomNavBar.css"
import {Icon} from "../../assets/Icons.ts";
import {BottomNavBarType} from "./BottomNavBarExports.ts";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";

interface BottomNavBarProps {
    secondaryButtonText: string
    secondaryButtonIcon: Icon | null
    primaryButtonText: string
    primaryButtonIcon: Icon | null
    type: BottomNavBarType
    onSecondaryClick?: () => void
    onPrimaryClick?: () => void
}

export const BottomNavBar: FC<BottomNavBarProps> = ({ secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, onPrimaryClick, onSecondaryClick}) => {

    return (
        <div className={`bottomNavBar ${type != BottomNavBarType.Default ? "centered" : ""}`}>
            { (type == BottomNavBarType.Default || type == BottomNavBarType.SecondaryOnly) &&
            <ButtonComponent
                text={secondaryButtonText}
                icon={secondaryButtonIcon}
                type={ButtonType.Long}
                style={ButtonStyle.Secondary}
                onClick={onSecondaryClick}
            />
            }
            { (type == BottomNavBarType.Default || type == BottomNavBarType.PrimaryOnly) &&
            <ButtonComponent
                text={primaryButtonText}
                icon={primaryButtonIcon}
                type={ButtonType.Long}
                style={ButtonStyle.Primary}
                onClick={onPrimaryClick}
            />
            }
        </div>
    )
}