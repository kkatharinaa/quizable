import {FC} from "react";
import "./ErrorPage.css"
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorPageLinkedTo, getErrorPageLinkedTo} from "./ErrorPageExports.ts";
import {BackgroundGems} from "../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../components/BackgroundGems/BackgroundGemsExports.ts";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../components/BottomNavBar/BottomNavBarExports.ts";

export const ErrorPage: FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const message = searchParams.get('message');
    const linkTo = searchParams.get('linkTo') ?? "Home"
    const errorPageLinkedTo = getErrorPageLinkedTo(linkTo) ?? ErrorPageLinkedTo.Home;

    // prevent someone from manually going to the error path
    if (message == null) {
        navigate(`/`)
        return ''
    }

    const handleButtonClick = () => {
        switch (errorPageLinkedTo) {
            case ErrorPageLinkedTo.Home:
                navigate(`/`)
                break
            case ErrorPageLinkedTo.Overview:
                navigate(`/overview`)
                break
        }
    }

    return (
        <div className="errorPage">
            <BackgroundGems
                type={BackgroundGemsType.Primary}
            />
            <div className="content">
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

