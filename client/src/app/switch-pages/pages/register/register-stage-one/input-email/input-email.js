import React, {useEffect, useState, useRef, useContext} from "react";
import validator from 'email-validator';
import {CreateUserContext} from "../../../../../../global-context/create-user-context";
import './input-email.scss';

const InputEmail = (props) => {

    // Import Global State Variables
    const {
        setEmail,
    } = useContext(CreateUserContext);

    // Locale Component State Variables
    const [placeholder] = useState('example@email.com');
    const inputValueRef = useRef();

    // All Component Functions
    const validateEmail = (emailString) => {
        return new Promise(resolve => {
            const validation = validator.validate(emailString);
            if (validation) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    const handleKeyPress = (e) => {
        switch (e.charCode) {
            case 13: {
                e.preventDefault();
                break;
            }
            case 32: {
                e.preventDefault();
                break;
            }
        };
    };

    const handleInput = async (e) => {
        const string = e.target.innerText;
        const emailTrue = await validateEmail(string);
        if (emailTrue) {
            setEmail(string);
        } else {
            setEmail('');
        }
    };

    const handleFocus = (e) => {
        const string = e.target.innerText;
        if (string === placeholder) {
            inputValueRef.current.innerText = '';
        }
    };

    const handleBlur = (e) => {
        const string = e.target.innerText;
        if (!string) {
            inputValueRef.current.innerText = placeholder;
        }
    };

    // JSX Output
    return (
        <label className={'input-label email ' + (props.isActive ? 'active' : '')}>
            <p>Enter email</p>
            <div className='input-container'>
                <p
                    suppressContentEditableWarning={true}
                    contentEditable={'true'}
                    ref={inputValueRef}
                    onFocus={(e) => handleFocus(e)}
                    onBlur={(e) => handleBlur(e)}
                    onInput={(e) => handleInput(e)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    >{placeholder}</p>
            </div>
        </label>
    )
}

export default InputEmail;