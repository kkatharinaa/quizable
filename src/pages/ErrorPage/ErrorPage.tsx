import {FC, useEffect} from "react";
import "./ErrorPage.css"
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorPageLinkedTo} from "./ErrorPageExports.ts";
import {BackgroundGems} from "../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../components/BackgroundGems/BackgroundGemsExports.ts";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../components/BottomNavBar/BottomNavBarExports.ts";
import {ButtonComponent} from "../../components/Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../../components/Button/ButtonExports.ts";

export interface ErrorPageProps {
    message?: string
    linkTo?: ErrorPageLinkedTo
    buttonText?: string
    onButtonClick?: () => void
}

export const ErrorPage: FC<ErrorPageProps> = (props) => {

    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const message: string | null = (state != null && typeof state.message == "string") ? state.message : (props.message ?? null)
    const linkTo: ErrorPageLinkedTo = (state != null && typeof state.linkTo == "string") ? state.linkTo : (props.linkTo ?? ErrorPageLinkedTo.Home)
    const buttonText: string | null = (state != null && typeof state.buttonText == "string") ? state.buttonText : (props.buttonText ?? null)
    const onButtonClick: (() => void) | undefined = (state != null && typeof state.onButtonClick != "undefined") ? state.onButtonClick : (props.onButtonClick ?? undefined)

    useEffect(() => {
        // prevent someone from manually going to the error path
        if (message == null) {
            navigate(`/`)
        }
    }, []);

    const handleButtonClick = () => {
        switch (linkTo) {
            case ErrorPageLinkedTo.Home:
                navigate(`/`)
                break
            case ErrorPageLinkedTo.Overview:
                navigate(`/overview`)
                break
            case ErrorPageLinkedTo.Join:
                navigate(`/join`)
                break
        }
    }

    return (
        <div className="errorPage">
            <BackgroundGems
                type={BackgroundGemsType.Primary}
            />
            <div className="content" tabIndex={0}>
                <h1>{message}</h1>
                { buttonText != null &&
                    <ButtonComponent
                        text={buttonText}
                        icon={null}
                        type={ButtonType.Long}
                        style={ButtonStyle.Primary}
                        onClick={onButtonClick}
                    />
                }
            </div>

            <BottomNavBar
                secondaryButtonText={`To ${linkTo}`}
                secondaryButtonIcon={null}
                primaryButtonText={""}
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={handleButtonClick}
            />
        </div>
    );
}

