import React, {useContext} from "react";
import {CreateUserContext} from "../../../../global-context/create-user-context";
import RegisterStageOne from './register-stage-one/register-stage-one';
import RegisterStageTwo from './register-stage-two/register-stage-two';
import RegisterStageThree from './register-stage-three/register-stage-three';
import './register.scss';

const Register = () => {

    /* Import global state variables */
    const {
        stage,
        message,
    } = useContext(CreateUserContext);

    /* JSX output */
    return (
        <div className='register-container'>
            <div className='top-container'>
                <h2>Register</h2>
            </div>
            <div className='message-container'>
                <p className={message.one.highlight ? 'highlight' : ''}>
                    {message.one.string}</p>
                <p className={message.two.highlight ? 'highlight' : ''}>
                    {message.two.string}</p>
            </div>
            <div className='verification-container'>
                <div className={'step-one-container ' + (stage !== 'email' ? 'hide' : '')}>
                    {stage !== 'email' ? <></> : <RegisterStageOne stage={stage}/>}
                </div>
                <div className={'step-two-container ' + (stage !== 'validate' ? 'hide' : '')}>
                    {stage !== 'validate' ? <></> : <RegisterStageTwo stage={stage}/>}
                </div>
                <div className={'step-three-container ' + (stage !== 'signup' ? 'hide' : '')}>
                    {stage !== 'signup' ? <></> : <RegisterStageThree stage={stage}/>}
                </div>
            </div>
        </div>
    )
}

export default Register