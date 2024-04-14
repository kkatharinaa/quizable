import {FC} from "react";
import "./AnswerInputFieldContainer.css"
import {getAnswerInputFieldTypeForIndex} from "../AnswerInputField/AnswerInputFieldExports.ts";
import {AnswerInputFieldWithActions} from "../AnswerInputFieldWithActions/AnswerInputFieldWithActions.tsx";
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";

interface AnswerInputFieldContainerProps {
    answers: string[]
    correctIndex: number
    onChange: (newValue: string, index: number) => void
    onDelete: (index: number) => void
    onToggleCorrect: (index: number) => void
    onAdd: () => void
}

export const AnswerInputFieldContainer: FC<AnswerInputFieldContainerProps> = ({ answers, correctIndex, onChange, onDelete, onToggleCorrect, onAdd }) => {

    return (
        <div className="answerInputFieldContainer">
            {answers.map((item, index) => (
                <AnswerInputFieldWithActions
                    key={index}
                    value={item}
                    type={getAnswerInputFieldTypeForIndex(index)}
                    correct={(correctIndex == index)}
                    index={index}
                    canBeDeleted={(answers.length>2)}
                    onChange={onChange}
                    onDelete={onDelete}
                    onToggleCorrect={onToggleCorrect}
                />
            ))}
            <div className="filler">
                <ButtonComponent
                    text={"Add One More Answer"}
                    icon={null}
                    type={ButtonType.Medium}
                    style={ButtonStyle.Accent}
                    onClick={onAdd}
                />
            </div>
            {answers.length % 2 == 0 &&
                <div className="filler"></div>
            } {/* empty div for layout purposes*/}
        </div>
    )
}