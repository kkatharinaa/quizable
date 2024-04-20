import {FC} from "react";
import "./Button.css"
import {ButtonStyle, ButtonType} from "./ButtonExports.ts";
import {Icon} from "../../assets/Icons.ts";

interface ButtonProps {
    text: string
    icon: Icon | null
    type: ButtonType
    style: ButtonStyle
    onClick?: () => void,
    className?: string
}

export const ButtonComponent: FC<ButtonProps> = ({ text, icon, type, style , onClick, className}) => {

    return (
        <button className={`${type} ${style} ${className}`} onClick={onClick}>
            {icon != null &&
                <img src={icon.path} alt={icon.alt}/>
            }
            {type == ButtonType.Long && <span>{text}</span>}
        </button>
    )
}