import {FC, useEffect, useState} from "react";
import "./Timer.css"

export interface TimerProps {
    remainingTime: number; // in seconds
}

export const Timer: FC<TimerProps> = ({ remainingTime}) => {

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const [formattedTime, setFormattedTime] = useState(formatTime(remainingTime))

    useEffect(() => {
        setFormattedTime(formatTime(remainingTime));
    }, [remainingTime]);

    return (
        <div className="timer">
            <div className="digit">
                <p>{formattedTime[0]}</p>
            </div>
            <div className="digit">
                <p>{formattedTime[1]}</p>
            </div>
            <p className="digitSeparator">{formattedTime[2]}</p>
            <div className="digit">
                <p>{formattedTime[3]}</p>
            </div>
            <div className="digit">
                <p>{formattedTime[4]}</p>
            </div>
        </div>
    );
}

