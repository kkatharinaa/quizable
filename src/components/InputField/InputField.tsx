import React, {ChangeEvent, FC, useRef} from "react";
import "./InputField.css"
import {InputFieldType} from "./InputFieldExports.ts";

interface InputFieldProps {
    value: string
    onChange: (newValue: string) => void
    onEnter?: () => void
    type: InputFieldType
}

export const InputField: FC<InputFieldProps> = ({ value, onChange, onEnter, type}) => {

    const inputRef = useRef<HTMLInputElement>(null);

    let maxCharacters = 100
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    let placeholder = ""
    switch (type) {
        case InputFieldType.Question:
            placeholder = "Type your question here"
            break
        case InputFieldType.Quizname:
            placeholder = "Add a title (mandatory)"
            break
        case InputFieldType.Quizcode:
            placeholder = "Enter quiz code"
            maxCharacters = 7
            break
        case InputFieldType.Username:
            placeholder = "Enter user name"
            maxCharacters = 20
            break
    }

    const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (inputRef.current) {
                inputRef.current.blur(); // remove focus from the input to close the keyboard on mobile
            }
            if (onEnter != undefined) onEnter();
        }
    };

    // TODO for inputs: when clicking on input jump to end of input

    return (
        <div className="inputField">
            <p className="characterCount">{`${value.length}/${maxCharacters}`}</p>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleOnEnter}
                placeholder={placeholder}
                maxLength={maxCharacters}
                ref={inputRef}
            />
        </div>
    )
}