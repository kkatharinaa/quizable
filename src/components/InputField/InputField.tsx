import {ChangeEvent, FC} from "react";
import "./InputField.css"
import {InputFieldType} from "./InputFieldExports.ts";

interface InputFieldProps {
    value: string
    onChange: (newValue: string) => void
    type: InputFieldType
}

export const InputField: FC<InputFieldProps> = ({ value, onChange, type}) => {

    const maxCharacters = 100
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    // TODO for inputs: when clicking on input jump to end of input

    return (
        <div className="inputField">
            <p className="characterCount">{`${value.length}/${maxCharacters}`}</p>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={type == InputFieldType.Question ? "Type your question here" : "Add a title (mandatory)"}
                maxLength={maxCharacters}
            />
        </div>
    )
}