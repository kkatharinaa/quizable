import {FC, useEffect, useState} from "react";
import "./QuestionSlideInTag.css"
import {CHEVRONDOWN_ICON_LIGHT, CHEVRONUP_ICON_LIGHT} from "../../assets/Icons.ts";
import {Timer} from "../Timer/Timer.tsx";

export interface QuestionSlideInTagProps {
    questionText: string
    remainingTime: number
}

export const QuestionSlideInTag: FC<QuestionSlideInTagProps> = ({ questionText, remainingTime }) => {

    const [open, setOpen] = useState(false)
    const [chevron, setChevron] = useState(CHEVRONDOWN_ICON_LIGHT)
    const [time, setTime] = useState(remainingTime)

    const handleTagClick = () => {
        setOpen(!open)
        if (chevron == CHEVRONDOWN_ICON_LIGHT) {
            setChevron(CHEVRONUP_ICON_LIGHT)
        } else {
            setChevron(CHEVRONDOWN_ICON_LIGHT)
        }
    }

    useEffect(() => {
        setTime(remainingTime);
    }, [remainingTime]);

    return (
        <div className="questionSlideInTagContainer">
            <div className={`questionSlideInTag ${open ? "open" : ""}`}>
                <div className="content" tabIndex={0}>
                    <h1>{questionText}</h1>
                    { (remainingTime != 0) &&
                        <Timer
                            remainingTime={time}
                        />
                    }
                </div>
                <div className="tag" onClick={handleTagClick}>
                    <img src={chevron.path} alt={chevron.alt}/>
                </div>
            </div>
        </div>
    );
}

