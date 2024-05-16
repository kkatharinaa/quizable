import {FC, useState} from "react";
import "./QuizEnd.css"
import {BottomNavBar} from "../../../components/BottomNavBar/BottomNavBar.tsx";
import {BottomNavBarStyle, BottomNavBarType} from "../../../components/BottomNavBar/BottomNavBarExports.ts";
import {QuizCodeTag} from "../../../components/QuizCodeTag/QuizCodeTag.tsx";
import {BackgroundGems} from "../../../components/BackgroundGems/BackgroundGems.tsx";
import {BackgroundGemsType} from "../../../components/BackgroundGems/BackgroundGemsExports.ts";
import {QuizMasterChildrenProps} from "../QuizMaster/QuizMaster.tsx";
import {ButtonComponent} from "../../../components/Button/Button.tsx";
import {SEND_ICON_DISABLED, SEND_ICON_LIGHT} from "../../../assets/Icons.ts";
import {ButtonStyle, ButtonType} from "../../../components/Button/ButtonExports.ts";

export const QuizEnd: FC<QuizMasterChildrenProps> = ({quizSessionManager, endQuizSession}) => {

    const [sentReport, setSentReport] = useState(false)

    const sendReport = () => {
        setSentReport(true)
        // TODO: working but only enable if authenticated user email is not a fake email! completely enable only once auth is implemented. for testing purposes replace the email address of the defaultAuthenticatedUser and then uncomment the next line
        //QuizSessionManager.getInstance().sendReport()
    }

    return (
        <div className="quizEnd">
            <BackgroundGems
                type={BackgroundGemsType.Primary2}
            />
            <QuizCodeTag
                code={quizSessionManager.quizCode}
            />
            <div className="content">
                <p>Would you like to get a report of the results via email?</p>
                <div className={"buttonAndMessage"}>
                    <ButtonComponent
                        text={sentReport ? "Resend Report" : "Send Report"}
                        icon={quizSessionManager.canSendReport ? SEND_ICON_LIGHT : SEND_ICON_DISABLED}
                        type={ButtonType.Long}
                        style={quizSessionManager.canSendReport ? ButtonStyle.Primary : ButtonStyle.Disabled}
                        onClick={quizSessionManager.canSendReport ? sendReport : () => {}}
                    />
                    { sentReport &&
                        <p className={"infoMessage"}>{"We have sent you the report! Didn't receive anything? You can try again " + (quizSessionManager.canSendReport ? "now." : "in a few minutes.")}</p>
                    }
                </div>
            </div>

            <BottomNavBar
                secondaryButtonText="To Home"
                secondaryButtonIcon={null}
                primaryButtonText={""}
                primaryButtonIcon={null}
                type={BottomNavBarType.SecondaryOnly}
                style={BottomNavBarStyle.Long}
                onSecondaryClick={endQuizSession}
            />
        </div>
    );
}

