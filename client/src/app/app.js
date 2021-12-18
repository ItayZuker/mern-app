import React, {useContext, useEffect} from 'react';
import { GlobalContext } from "../global-context/global-context";
import SwitchPages from './switch-pages/switch-pages.js';
import '../assets/styles/_typography.scss';
import '../assets/styles/_global.scss';
import './app.scss';

const App = () => {

    const {} = useContext(GlobalContext);

    return (
        <div className='app-container'>
            <SwitchPages />
        </div>
    )
}

export default App