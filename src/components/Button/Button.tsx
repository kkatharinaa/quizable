import {FC} from "react";
import "./Button.css"
import {ButtonStyle, ButtonType} from "./ButtonExports.ts";
import {Icon} from "../../assets/Icons.ts";

interface ButtonProps {
    text: string
    icon: Icon | null
    type: ButtonType
    style: ButtonStyle
    onClick?: () => void
}

export const ButtonComponent: FC<ButtonProps> = ({ text, icon, type, style , onClick}) => {

    return (
        <button className={`${type} ${style}`} onClick={onClick}>
            {icon != null && <img src={icon.path} alt={icon.alt}/>}
            {type != ButtonType.Short && <span>{text}</span>}
        </button>
    )
}