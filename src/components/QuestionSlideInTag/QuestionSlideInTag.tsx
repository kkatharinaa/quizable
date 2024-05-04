import {FC, useState} from "react";
import "./QuestionSlideInTag.css"
import {CHEVRONDOWN_ICON_LIGHT, CHEVRONUP_ICON_LIGHT} from "../../assets/Icons.ts";
import {Timer} from "../Timer/Timer.tsx";

export interface QuestionSlideInTagProps {
    questionText: string
    maxQuestionTime: number
}

export const QuestionSlideInTag: FC<QuestionSlideInTagProps> = ({ questionText, maxQuestionTime }) => {

    const [open, setOpen] = useState(false)
    const [chevron, setChevron] = useState(CHEVRONDOWN_ICON_LIGHT)

    const handleTagClick = () => {
        setOpen(!open)
        if (chevron == CHEVRONDOWN_ICON_LIGHT) {
            setChevron(CHEVRONUP_ICON_LIGHT)
        } else {
            setChevron(CHEVRONDOWN_ICON_LIGHT)
        }
    }

    return (
        <div className="questionSlideInTagContainer">
            <div className={`questionSlideInTag ${open ? "open" : ""}`}>
                <div className="content">
                    <h1>{questionText}</h1>
                    { (maxQuestionTime != 0) &&
                        <Timer
                            remainingTime={maxQuestionTime}
                            isRunning={true}
                            onDone={() => {}} // handled by master, not slave!
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

