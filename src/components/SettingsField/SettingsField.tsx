import {ChangeEvent, FC} from "react";
import "./SettingsField.css"
import {SettingsFieldType} from "./SettingsFieldExports.ts";

interface SettingsFieldProps {
    text: string
    type: SettingsFieldType
    currentValue: number | boolean
    onChange: (value?: number) => void
    placeholder: string | null
    unitText?: string
    unlimitedAtO?: boolean
}

export const SettingsField: FC<SettingsFieldProps> = ({ text, type, currentValue, onChange, placeholder, unitText, unlimitedAtO }) => {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        // Check if input value is a number
        if (!isNaN(Number(inputValue))) {
            onChange(Number(inputValue));
        }
    }
    const handleToggleClick = () => {
        onChange()
    }

    return (
        <div className="settingsField">
            <p>{text}</p>
            { type == SettingsFieldType.Toggle &&
                <img className="toggle"
                     src={`/assets/icon-toggle-${(currentValue == true || currentValue != 0) ? "on" : "off"}.svg`} alt={`Toggle is ${(currentValue == true || currentValue != 0) ? "on" : "off"}`}
                     onClick={handleToggleClick}
                />
            }
            {(type == SettingsFieldType.NumberInput && typeof currentValue === 'number') &&
                <div className="numberInputField">
                    <input
                        type="text"
                        value={(unlimitedAtO === true && currentValue === 0) ? "" : currentValue.toString()}
                        onChange={handleInputChange}
                        placeholder={(unlimitedAtO === true) ? "∞" : placeholder ?? ""}
                    />
                    {unitText != undefined &&
                        <span>{unitText}</span>
                    }
                </div>
            }
        </div>
    )
}