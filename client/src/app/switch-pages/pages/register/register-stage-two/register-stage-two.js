import React, {useContext, useEffect, useState} from "react";
import {CreateUserContext} from "../../../../../global-context/create-user-context";
import InputPassword from './input-password/input-password';
import Button from "../../../../../components/inputs/button/button";
import './register-stage-two.scss';

const RegisterStageTwo = (props) => {

    /* Import global state variables */
    const {
        setStage,
        password,
        setPassword,
        email,
        setEmail,
        setMessage,
    } = useContext(CreateUserContext);

    /* Locale state variables */
    const [verifyActive, setVerifyActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordActive, setPasswordActive] = useState(true);

    /* Variable triggers */
    useEffect(() => {
        if(!!password.array) {
            checkForPasswordString();
        }
    }, [password.array]);

    /* Component functions */
    const checkForPasswordString = async () => {
        const passwordString = await getPasswordString();
        if(passwordString.length === password.array.length) {
            setVerifyActive(true);
        } else {
            setVerifyActive(false);
        }
    }

    const getCleanPasswordArray = () => {
        return new Promise(resolve => {
            const cleanPasswordArray = password.array.map((item, i) => {
                return {character: '', index: i};
            });
            resolve(cleanPasswordArray);
        });
    };

    const clearPasswordArray = async () => {
        const cleanPasswordArray = await getCleanPasswordArray();
        setPassword(prevState => {
            return {...prevState, array: cleanPasswordArray}
        });
    };

    const backStageOne = () => {
        clearPasswordArray();
        setStage('email');
    };

    const getPasswordString = () => {
        return new Promise(resolve => {
            const passwordCharactersArray = password.array.map(item => {
                return item.character
            })
            const passwordString = passwordCharactersArray.join('');
            resolve(passwordString);
        });
    };

    const handleData = (data) => {
        clearPasswordArray();
        setEmail({
            string: data.email,
            verified: data.match,
        });
        if(!data.email) {
            setPasswordActive(false);
            setMessage(prevState => {
                return {...prevState,
                    one: {
                        string: 'Sorry, password expired',
                        highlight: true,
                    },
                    two: {
                        string: '',
                        highlight: false,
                    }}
            });
        } else if(!data.match) {
            setMessage(prevState => {
                return {...prevState,
                    one: {
                        string: 'Wrong Password, try again',
                        highlight: true,
                    }}
            });
            setTimeout(() => {
                setMessage(prevState => {
                    return {...prevState,
                        one: {
                            string: 'Wrong Password, try again',
                            highlight: false,
                        }}
                });
            }, 3000);
        } else {
            setMessage(prevState => {
                return {...prevState,
                    one: {
                        string: 'Please read the following',
                        highlight: false,
                    },
                    two: {
                        string: '',
                        highlight: false,
                    }}
            });
            setStage(data.stage);
        }
    };

    const verifyCode = async () => {
        setLoading(true);
        const passwordString = await getPasswordString();
        const item = {
            email: email.string,
            password: passwordString,
            data: new Date(),
        };
        try {
            const res = await fetch('/user/verify-email-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: item.email,
                    password: item.password,
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
    if (props.stage !== 'validate') {
        return <></>
    } else {
        return (
            <div className='register-stage-two-container'>
                {passwordActive ?
                    <InputPassword
                        isActive={passwordActive}
                        loading={loading}/>
                    : <></> }
                {passwordActive ?
                    <Button
                        isActive={verifyActive}
                        value='verify'
                        callback={() => verifyCode()}
                        loading={loading}/>
                    : <></> }
                <p className={passwordActive ? '' : 'password-expired'}
                    onClick={() => backStageOne()}>
                    Send another password</p>
            </div>
        )
    }
}

export default RegisterStageTwo;