import {FC, useEffect, useState} from "react";
import "./BackgroundGems.css"
import {BackgroundGemsType} from "./BackgroundGemsExports.ts";

interface BackgroundGemsProps {
    type: BackgroundGemsType
}

export const BackgroundGems: FC<BackgroundGemsProps> = ({ type }) => {

    const [path, setPath] = useState('/assets/background-gems-primary.svg')
    const [className, setClassName] = useState('gemsPrimary')

    // if screen is too wide for slave gems, turn them into master gems
    const handleResize = () => {
        if (window.innerWidth <= 480) {
            setUpGems(true)
        } else {
            setUpGems(false)
        }
    };

    const setUpGems = (forSlave: boolean) => {
        switch (type) {
            case BackgroundGemsType.Primary:
                setPath(forSlave ? '/assets/background-gems-primary-slave.svg' : '/assets/background-gems-primary.svg')
                setClassName(forSlave ? 'gemsPrimarySlave' : 'gemsPrimary')
                break;
            case BackgroundGemsType.Grey:
                setPath('/assets/background-gems-grey.svg')
                setClassName('gemsGrey')
                break;
            case BackgroundGemsType.Primary2:
                setPath(forSlave ? '/assets/background-gems-primary-slave-2.svg' : '/assets/background-gems-primary-2.svg')
                setClassName(forSlave ? 'gemsPrimarySlave2' : 'gemsPrimary')
                break;
        }
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`backgroundGemsBackground ${className}`}>
            <div className={`backgroundGemsContainer ${className}`}>
                <img src={path} alt=""
                     className={`backgroundGems ${className}`}/>
            </div>
        </div>
    )
}