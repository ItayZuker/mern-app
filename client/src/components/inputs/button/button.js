import React, {useState} from "react";
import './button.scss';

const Button = (props) => {

    /* Locale State Variables */
    const [value] = useState(props.value || 'Submit');

    /* JSX Output */
    return (
        <div
            className={'button ' + (props.isActive ? 'active ' : '') + (props.loading ? 'loading' : '')}
            onClick={() => props.callback()}>
            <p>{value}</p>
        </div>
    )
}

export default Button