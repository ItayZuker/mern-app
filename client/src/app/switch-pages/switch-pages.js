import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Pages from './pages/pages.js';
import './switch-pages.scss';

const SwitchPages = () => {

    /* JSX output */
    return (
        <div className='switch-pages-container'>
            <Routes>
                <Route path='/' element={ <Pages /> } />
                <Route path='/:page' element={ <Pages /> } />
            </Routes>
        </div>
    )
}

export default SwitchPages