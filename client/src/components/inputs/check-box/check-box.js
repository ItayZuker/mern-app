import React, {useState} from "react";
import './check-box.scss';

const CheckBox = (props) => {

    const [check, setCheck] = useState(false);

    const clickCheckBox = () => {
        if(check) {
            setCheck(false);
            props.callback(false);

        } else {
            setCheck(true);
            props.callback(true);
        }
    };

    return (
        <div
            className={'check-box-container ' + (check ? 'check' : '')}
            onClick={() => clickCheckBox()}>
            <div className='check-box'>
            </div>
            <p>{props.text}</p>
        </div>
    )
}

export default CheckBox;