import {FC} from "react";
import "./LoadingSpinner.css"

export const LoadingSpinner: FC = () => {
    return (
        <div className="loadingSpinner">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    )
}