import {FC} from "react";
import "./BackgroundGems.css"
import {BackgroundGemsType} from "./BackgroundGemsExports.ts";

interface BackgroundGemsProps {
    type: BackgroundGemsType
}

export const BackgroundGems: FC<BackgroundGemsProps> = ({ type }) => {

    let path = '/assets/background-gems-primary.svg'
    let className = 'gemsPrimary'

    switch (type) {
        case BackgroundGemsType.Primary:
            break;
        case BackgroundGemsType.Grey:
            path = '/assets/background-gems-grey.svg'
            className = 'gemsGrey'
            break;
        case BackgroundGemsType.Primary2:
            path = '/assets/background-gems-primary-2.svg'
            className = 'gemsPrimary'
            break;
    }

    return (
        <div className={`backgroundGemsBackground ${className}`}>
            <div className={`backgroundGemsContainer ${className}`}>
                <img src={path} alt=""
                     className={`backgroundGems ${className}`}/>
            </div>
        </div>
    )
}