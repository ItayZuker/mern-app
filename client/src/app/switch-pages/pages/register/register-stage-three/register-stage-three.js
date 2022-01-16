import React, {useState, useContext} from "react";
import {CreateUserContext} from "../../../../../global-context/create-user-context";
import CheckBox from "../../../../../components/inputs/check-box/check-box";
import Button from "../../../../../components/inputs/button/button";
import './register-stage-three.scss';
import {GlobalContext} from "../../../../../global-context/global-context";

const RegisterStageThree = (props) => {

    /* Import global state variables */
    const {
        legal,
        setLegal,
        email,
    } = useContext(CreateUserContext);

    const {
        geoData,
    } = useContext(GlobalContext)

    const [loading, setLoading] = useState(false);

    const handleData = (data) => {
        console.log(data)
        setLoading(false);
    }

    const verifyData = () => {
        return new Promise((resolve, reject) => {
            if(!legal.agree) {
                reject('User did not agree to terms');
            } else if(!email.string) {
                reject('Email is missing');
            } else if(!email.verified) {
                reject('Email was not verified');
            } else {
                resolve();
            }
        });
    };

    const signup = async () => {
        setLoading(true);

        const item = {
            email: email,
            legal: legal,
            geoData: {
                countryCode: geoData.countryCode,
                countryName: geoData.countryName,
            },
            date: new Date(),
        };

        try {
            await verifyData();
            const res = await fetch('/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: item.email,
                    legal: item.legal,
                    geoData: item.geoData,
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

    const clickCheckBox = (boolean) => {
        setLegal(prevState => {
            return {...prevState, agree: boolean};
        });
    };

    /* JSX output */
    if (props.stage !== 'signup') {
        return <></>
    } else {
        return (
            <div className='register-stage-three-container'>

                <div className={'legal-container '  + (loading ? 'loading' : '')}>
                    <p>{legal.content}</p>
                    <CheckBox
                        text='I agree'
                        callback={(boolean) => clickCheckBox(boolean)}/>
                </div>
                <Button
                    isActive={legal.agree}
                    value='Signup'
                    callback={() => signup()}
                    loading={loading}/>
            </div>
        )
    }
}

export default RegisterStageThree