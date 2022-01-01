import React, {useContext, useEffect, useState} from "react";
import InputPassword from './input-password/input-password';
import Button from "../../../../../components/inputs/button/button";
import {CreateUserContext} from "../../../../../global-context/create-user-context";
import './register-stage-two.scss';

const RegisterStageTwo = (props) => {

    const {
        setStage,
        passwordArray,
        setPasswordArray,
        email
    } = useContext(CreateUserContext);

    const [verifyActive, setVerifyActive] = useState(false);

    useEffect(() => {
        if(!!passwordArray) {
            checkForPasswordString();
        }
    }, [passwordArray]);

    const checkForPasswordString = async () => {
        const passwordString = await getPasswordString();
        if(passwordString.length === passwordArray.length) {
            setVerifyActive(true);
        } else {
            setVerifyActive(false);
        }
    }

    const getCleanPasswordArray = () => {
        return new Promise(resolve => {
            const cleanPasswordArray = passwordArray.map((item, i) => {
                return {character: '', index: i};
            });
            resolve(cleanPasswordArray);
        });
    };

    const clearPasswordArray = async () => {
        const cleanPasswordArray = await getCleanPasswordArray();
        setPasswordArray(cleanPasswordArray);
    };

    const backStageOne = () => {
        clearPasswordArray();
        setStage('email');
    };

    const getPasswordString = () => {
        return new Promise(resolve => {
            const passwordCharactersArray = passwordArray.map(item => {
                return item.character
            })
            const passwordString = passwordCharactersArray.join('');
            resolve(passwordString);
        });
    };

    const verifyCode = async () => {
        const passwordString = await getPasswordString();
        const item = {
            email: email,
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
            console.log(data)
            // setPasswordSize(data.passwordSize);
        //     setStage(data.stage)
        } catch ( err ) {
            console.log(err);
        }
        //
        // console.log(passwordArray)
    }

    if (props.stage !== 'validate') {
        return <></>
    } else {
        return (
            <div className='register-stage-two-container'>
                <h3>Enter Password:</h3>
                <InputPassword />
                <Button
                    isActive={verifyActive}
                    value='verify'
                    callback={() => verifyCode()}/>
                <p
                    onClick={() => backStageOne()}>
                    Send another password</p>
            </div>
        )
    }
}

export default RegisterStageTwo;