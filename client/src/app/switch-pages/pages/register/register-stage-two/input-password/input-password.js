import React, {useEffect, useContext} from "react";
import InputCharacter from './input-character/input-character';
import {CreateUserContext} from "../../../../../../global-context/create-user-context";
import './input-password.scss';

const InputPassword = (props) => {

    /* Import global state variables */
    const {
        password,
        setPassword
    } = useContext(CreateUserContext);

    /* Variable triggers */
    useEffect(() => {
        if(password.size > 0) {
            buildPasswordInput(password.size);
        }
    }, [password.size]);

    /* Component functions */
    const buildPasswordInput = async (size) => {
        const newPasswordArray = await buildNewPasswordArray(size);
        setPassword(prevState => {
            return {...prevState, array: newPasswordArray}
        })
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

    /* JSX output */
    return (
        <div className={'input-password-container ' + (props.isActive ? 'active ' : '') + (props.loading ? 'loading' : '')}>
            {password.array.map((item, i) => {
                return <InputCharacter
                key={i}
                index={i}
                isActive={props.isActive}
                />
            })}
        </div>
    )
}

export default InputPassword;