import React, {useEffect, useState, useContext} from "react";
import InputCharacter from './input-character/input-character';
import {CreateUserContext} from "../../../../../../global-context/create-user-context";
import './input-password.scss';

const InputPassword = () => {

    const {
        passwordSize,
        passwordArray,
        setPasswordArray
    } = useContext(CreateUserContext);

    useEffect(() => {
        if(passwordSize > 0) {
            buildPasswordInput(passwordSize);
        }
    }, [passwordSize]);

    const buildPasswordInput = async (size) => {
        const newPasswordArray = await buildNewPasswordArray(size);
        setPasswordArray(newPasswordArray)
    };

    const buildNewPasswordArray = (size) => {
        return new Promise(resolve => {
            let array = [];
            for (let i = 0; i < size; i++) {
                array.push({character: '', index: i});
            }
            resolve(array);
        });
    };

    return (
        <div className='input-password-container'>
            {passwordArray.map((item, i) => {
                return <InputCharacter
                key={i}
                index={i}
                />
            })}
        </div>
    )
}

export default InputPassword;