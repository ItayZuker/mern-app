import React, {useEffect, useState, useRef} from "react";
import validator from 'email-validator';
import './input-email.scss';

const InputEmail = (props) => {

    // Locale Component State Variables
    const [inputString, setInputString] = useState('');
    const [placeholder] = useState(props.placeholder || 'Select Item');
    const [placeholderActive, setPlaceholderActive] = useState(true);
    const inputValueRef = useRef();

    useEffect(() => {
        updateInput(inputString)
    },[inputString]);


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

    const updateInput = async (inputString) => {
        const email = await validateEmail(inputString);
        if (email) {
            props.valueCallback(inputString);
        } else {
            props.valueCallback('');
        }
    }

    const handleInput = (e) => {
        const string = e.target.innerText;
        setInputString(string);
    };

    const handleFocus = (e) => {
        const string = e.target.innerText;
        if (string === placeholder) {
            inputValueRef.current.innerText = '';
        }
    }

    const handleBlur = (e) => {
        const string = e.target.innerText;
        const upperCaseString = string.toUpperCase();
        const upperCasePlaceholder = placeholder.toUpperCase();
        switch (upperCaseString) {
            case upperCasePlaceholder:
                setPlaceholderActive(true);
                break;
            case '':
                setPlaceholderActive(true);
                inputValueRef.current.innerText = placeholder;
                break;
            default:
                setPlaceholderActive(false);

        }
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // JSX Output
    return (
        <label className={'input-label email ' + (props.isActive ? 'active' : '')}>
            {props.labelName.length > 0 ? capitalizeFirstLetter(props.labelName) + ':' : ''}
            <div className='input-container'>
                <p
                    suppressContentEditableWarning={true}
                    contentEditable={'true'}
                    ref={inputValueRef}
                    onFocus={(e) => handleFocus(e)}
                    onBlur={(e) => handleBlur(e)}
                    onInput={(e) => handleInput(e)}
                    className={placeholderActive ? 'placeholder' : ''}>{placeholder}</p>
            </div>
        </label>
    )
}

export default InputEmail;