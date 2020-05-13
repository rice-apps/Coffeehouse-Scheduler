import React, { Component } from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'

import { ConnectedRouter } from 'connected-react-router'

// Import store
import configureStore, { history } from './configureStore';

const store = configureStore({});

console.log("Store configured.");

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <App />
            </div>
        </ConnectedRouter>
    </Provider>, 
    document.querySelector('#app')
)
