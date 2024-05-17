import {FC} from "react";
import "./Loading.css"
import {BackgroundGems} from "../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../components/BackgroundGems/BackgroundGemsExports.ts";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar.tsx";
import {LoadingSpinner} from "../../components/LoadingSpinner/LoadingSpinner.tsx";
import {Icon} from "../../assets/Icons.ts";
import {BottomNavBarStyle, BottomNavBarType} from "../../components/BottomNavBar/BottomNavBarExports.ts";
import {ButtonStyle} from "../../components/Button/ButtonExports.ts";

export interface LoadingPageProps {
    hasBottomNavBar: boolean
    secondaryButtonText?: string
    secondaryButtonIcon?: Icon | null
    primaryButtonText?: string
    primaryButtonIcon?: Icon | null
    type?: BottomNavBarType
    onSecondaryClick?: () => void
    onPrimaryClick?: () => void
    alternativeSecondaryButtonStyle?: ButtonStyle
    alternativePrimaryButtonStyle?: ButtonStyle
}

export const LoadingPage: FC<LoadingPageProps> = ({hasBottomNavBar, secondaryButtonText, secondaryButtonIcon, primaryButtonText, primaryButtonIcon, type, onPrimaryClick, onSecondaryClick, alternativeSecondaryButtonStyle, alternativePrimaryButtonStyle}) => {
    return (
        <div className="loadingPage">
            <BackgroundGems type={window.innerWidth > 480 ? BackgroundGemsType.Primary : BackgroundGemsType.PrimarySlave}/>

            <Loading/>

            { hasBottomNavBar &&
                <BottomNavBar
                    secondaryButtonText={secondaryButtonText ?? ""}
                    secondaryButtonIcon={secondaryButtonIcon ?? null}
                    primaryButtonText={primaryButtonText ?? ""}
                    primaryButtonIcon={primaryButtonIcon ?? null}
                    type={type ?? BottomNavBarType.Default}
                    style={BottomNavBarStyle.Long}
                    onSecondaryClick={onSecondaryClick}
                    onPrimaryClick={onPrimaryClick}
                    alternativeSecondaryButtonStyle={alternativeSecondaryButtonStyle}
                    alternativePrimaryButtonStyle={alternativePrimaryButtonStyle}
                />
            }
        </div>
    )
}

export const Loading: FC = () => {
    return (
        <div className="loading">
            <h1>Loading</h1>
            <LoadingSpinner/>
        </div>
    )
}