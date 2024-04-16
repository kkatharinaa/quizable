import {ChangeEvent, FC} from "react";
import "./QuestionInputField.css"

interface QuestionInputFieldProps {
    value: string
    onChange: (newValue: string) => void
}

export const QuestionInputField: FC<QuestionInputFieldProps> = ({ value, onChange}) => {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="questionInputField">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="Type your question here"
            />
        </div>
    )
}