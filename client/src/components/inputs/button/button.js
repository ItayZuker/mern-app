import React, {useState} from "react";
import './button.scss';

const Button = (props) => {

    // Locale Component State Variables
    const [value] = useState(props.value || 'submit');

    // All Component Functions
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // JSX Output
    return (
        <div
            className={'button ' + (props.isActive ? 'active' : '')}
            onClick={() => props.isActive ? props.callback() : null}>
            <p>{capitalizeFirstLetter(value)}</p>
        </div>
    )
}

export default Button