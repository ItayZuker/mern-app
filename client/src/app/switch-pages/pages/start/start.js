import React from 'react';
import {Link} from "react-router-dom";
import './start.scss';

const Start = () => {

    /* JSX output */
    return (
        <div className='start-app-container'>
            <div className='top-container'>
                <h2>Start</h2>
            </div>
            <div className='navigation-container'>
                <Link className='link create-user' to="/register">Creat user</Link>
                <Link className='link login' to="/login">Login</Link>
            </div>
        </div>
    )
}

export default Start