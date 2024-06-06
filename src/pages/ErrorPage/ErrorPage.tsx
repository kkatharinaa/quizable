import {FC, useEffect} from "react";
import "./ErrorPage.css"
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorPageLinkedTo} from "./ErrorPageExports.ts";
import {BackgroundGems} from "../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../components/BackgroundGems/BackgroundGemsExports.ts";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../components/BottomNavBar/BottomNavBarExports.ts";

export interface ErrorPageProps {
    message?: string
    linkTo?: ErrorPageLinkedTo
}

export const ErrorPage: FC<ErrorPageProps> = (props) => {

    const navigate = useNavigate();
    const {state} = useLocation();

    // Read values passed on state
    const message: string | null = state.message ?? props.message ?? null
    const linkTo: ErrorPageLinkedTo = state.linkTo ?? props.linkTo ?? ErrorPageLinkedTo.Home

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

