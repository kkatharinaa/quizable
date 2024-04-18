import {FC} from "react";
import "./ThreeDots.css"
import {ThreeDotsStyle} from "./ThreeDotsExports.ts";
import {Icon} from "../../assets/Icons.ts";

interface ThreeDotsProps {
    style: ThreeDotsStyle
}

export const ThreeDots: FC<ThreeDotsProps> = ({ style }) => {

    let path = '/assets/dot-primaryshadow.svg'

    switch (style) {
        case ThreeDotsStyle.PrimaryColour:
            path = '/assets/dot-primary.svg'
            break
        case ThreeDotsStyle.PrimaryShadow:
            break
        case ThreeDotsStyle.TextfieldText:
            path = '/assets/dot-textfieldtext.svg'
    }

    const dot: Icon = {
        path: path,
        alt: 'dot',
    }

    return (
        <div className="threeDots">
            <img src={dot.path} alt={dot.alt}/>
            <img src={dot.path} alt={dot.alt}/>
            <img src={dot.path} alt={dot.alt}/>
        </div>
    )
}