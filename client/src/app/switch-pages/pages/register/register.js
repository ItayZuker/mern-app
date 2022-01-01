import React, {useContext, useEffect, useState} from "react";
import RegisterStageOne from './register-stage-one/register-stage-one';
import RegisterStageTwo from './register-stage-two/register-stage-two';
import './register.scss';
import {CreateUserContext} from "../../../../global-context/create-user-context";

const Register = () => {

    const {
        stage,
    } = useContext(CreateUserContext);

    return (
        <div className='register-container'>
            <div className='top-container'>
                <h2>Register</h2>
            </div>
            <div className='verification-container'>
                <div className={'step-one-container ' + (stage !== 'email' ? 'hide' : '')}>
                    <RegisterStageOne stage={stage}/>
                </div>
                <div className={'step-two-container ' + (stage !== 'validate' ? 'hide' : '')}>
                    <RegisterStageTwo stage={stage}/>
                </div>
            </div>
        </div>
    )
}

export default Register