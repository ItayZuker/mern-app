import React from 'react';
import SwitchPages from './switch-pages/switch-pages.js';
import '../assets/styles/_typography.scss';
import '../assets/styles/_global.scss';
import './app.scss';

const App = () => {

    /* JSX output */
    return (
        <div className='app-container'>
            <SwitchPages />
        </div>
    )
}

export default App