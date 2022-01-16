import React from 'react';
import {useParams} from 'react-router-dom';
import Start from './start/start';
import Register from './register/register';
import { CreateUserContextComponent } from '../../../global-context/create-user-context'
import './pages.scss';

const Pages = () => {

    /* Import global state variables */
    const { page } = useParams();

    /* JSX output */
    return (
        <div className='pages-container'>
                { page === undefined ? <Start /> : null }
            <CreateUserContextComponent>
                { page === 'register' ? <Register /> : null }
            </CreateUserContextComponent>
        </div>
    )
}

export default Pages