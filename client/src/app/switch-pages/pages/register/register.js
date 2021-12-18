import React, {useEffect, useState} from "react";
import EmailInput from "../../../../components/inputs/input-email/input-email";
import Button from '../../../../components/inputs/button/button';
import './register.scss';

const Register = () => {

    const [email, setEmail] = useState('');

    const sendCode = async () => {
        const item = {
            email: email,
            data: new Date()
        }
        try {
            const res = await fetch('/user/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: item.email,
                    date: item.date
                }),
            });
            const message = await res.json()
            console.log(message)
        } catch ( err ) {
            console.log(err)
        }
    };

    return (
        <div className='register-container'>
            <div className='top-container'>
                <h2>Register</h2>
            </div>
            <div className='verification-container'>
                <div className='step-one-container'>
                    <EmailInput
                        labelName='enter email'
                        isActive={true}
                        placeholder='example@email.com'
                        valueCallback={setEmail}/>
                    <Button
                        isActive={!!email}
                        value='send code'
                        callback={() => sendCode()}/>
                </div>
                <div className='step-two-container'>

                </div>
            </div>
        </div>
    )
}

export default Register