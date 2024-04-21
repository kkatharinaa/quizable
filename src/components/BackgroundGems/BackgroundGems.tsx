import {FC} from "react";
import "./BackgroundGems.css"
import {BackgroundGemsType} from "./BackgroundGemsExports.ts";

interface BackgroundGemsProps {
    type: BackgroundGemsType
}

export const BackgroundGems: FC<BackgroundGemsProps> = ({ type }) => {

    let path = '/assets/background-gems-primary.svg'
    if (type == BackgroundGemsType.Grey) path = '/assets/background-gems-grey.svg'

    return (
        <div className={`backgroundGemsBackground ${type == BackgroundGemsType.Grey ? 'gemsGrey' : 'gemsPrimary'}`}>
            <div className={`backgroundGemsContainer ${type == BackgroundGemsType.Grey ? 'gemsGrey' : 'gemsPrimary'}`}>
                <img src={path} alt=""
                     className={`backgroundGems ${type == BackgroundGemsType.Grey ? 'gemsGrey' : 'gemsPrimary'}`}/>
            </div>
        </div>
    )
}