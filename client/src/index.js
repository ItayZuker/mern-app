import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { GlobalContextComponent } from './global-context/global-context.js'
import App from './app/app.js';

ReactDOM.render(
    <BrowserRouter>
        <GlobalContextComponent>
            <App />
        </GlobalContextComponent>
    </BrowserRouter>,
  document.getElementById('root')
);
