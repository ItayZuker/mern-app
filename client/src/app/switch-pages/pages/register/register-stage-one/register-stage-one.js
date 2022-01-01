import React, {useContext, useState} from "react";
import EmailInput from './input-email/input-email';
import Button from "../../../../../components/inputs/button/button";
import {CreateUserContext} from "../../../../../global-context/create-user-context";
import './register-stage-one.scss';

const RegisterStageOne = (props) => {

    const {
        email,
        setPasswordSize,
        setStage,
    } = useContext(CreateUserContext);

    const sendCode = async () => {
        const item = {
            email: email,
            data: new Date(),
        };
        try {
            const res = await fetch('/user/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: item.email,
                    date: item.date,
                }),
            });
            const data = await res.json();
            setPasswordSize(data.passwordSize);
            setStage(data.stage)
        } catch ( err ) {
            console.log(err);
        }
    };

    if (props.stage !== 'email') {
        return <></>
    } else {
        return (
            <div className='register-stage-one-container'>
                <EmailInput
                    isActive={true}
                    placeholder='example@email.com' />
                <Button
                    isActive={!!email}
                    value='send password'
                    callback={() => sendCode()}/>
            </div>
        )
    }
}

export default RegisterStageOne;