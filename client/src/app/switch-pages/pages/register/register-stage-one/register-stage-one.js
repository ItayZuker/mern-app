import React, {useContext, useEffect, useState} from "react";
import EmailInput from './input-email/input-email';
import Button from "../../../../../components/inputs/button/button";
import {CreateUserContext} from "../../../../../global-context/create-user-context";
import './register-stage-one.scss';

const RegisterStageOne = (props) => {

    /* Import global state variables */
    const {
        email,
        setPassword,
        setStage,
        setMessage,
    } = useContext(CreateUserContext);

    /* Locale state variables */
    const [loading, setLoading] = useState(false);

    /* Variable triggers */
    useEffect(() => {
        setMessage({
            one: {
                string: 'Please verify your email:',
                highlight: false
            },
            two: {
                string: '',
                highlight: false
            }});
    }, []);

    /* Component functions */
    const getMinutesLifetime = (seconds) => {
        return new Promise(resolve => {
            const minutes = Math.floor(seconds / 60000);
            resolve(minutes);
        });
    };

    const handleData = async (data) => {
        if(data.passwordSent) {
            setPassword(prevState => {
                return {...prevState, size: data.passwordSize, lifetime: data.passwordLifetime}
            });
        }
        const minutes = await getMinutesLifetime(data.passwordLifetime);
        setMessage(prevState => {
            return {...prevState,
                one: {
                    string: data.message,
                    highlight: false,
                },
                two: {
                    string: '(Valid for ' + minutes + ' minutes)',
                    highlight: false,
                }}
        });
        setStage(data.stage);
    };

    const sendCode = async () => {
        setLoading(true);
        const item = {
            email: email.string,
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
            handleData(data);
        } catch ( err ) {
            console.log(err);
            setLoading(false);
        }
    };

    /* JSX output */
    if (props.stage !== 'email') {
        return <></>
    } else {
        return (
            <div className='register-stage-one-container'>
                <EmailInput
                    isActive={true}
                    placeholder='example@email.com'
                    loading={loading}/>
                <Button
                    isActive={!!email.string}
                    value='Send password'
                    callback={() => sendCode()}
                    loading={loading}/>
            </div>
        )
    }
}

export default RegisterStageOne;