import {FC, useEffect, useState} from "react";
import "./Timer.css"

export interface TimerProps {
    remainingTime: number; // in seconds
    isRunning: boolean;
    onDone: () => void
}

export const Timer: FC<TimerProps> = ({ remainingTime, isRunning, onDone}) => {

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    //const [time, setTime] = useState(remainingTime)
    const [formattedTime, setFormattedTime] = useState(formatTime(remainingTime))

    const updateTime = () => {
        remainingTime -= 1
        setFormattedTime(formatTime(remainingTime))
        if (remainingTime <= 0) {
            console.log("timer over")
            onDone()
        }
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                updateTime()
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);
    /*useEffect(() => {
        const interval = setInterval(() => updateTime(), 1000);
        return () => clearInterval(interval);
    }, []);*/

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

