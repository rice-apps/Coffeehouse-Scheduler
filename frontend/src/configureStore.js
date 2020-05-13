import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import createRootReducer from './reducers/index.js';
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas/sagas';

// Create history
export const history = createBrowserHistory();

// Create redux-sagas middleware
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState) {
    const store = createStore(
      createRootReducer(history), // root reducer with router state
      preloadedState,
      compose(
        applyMiddleware(
          sagaMiddleware,
          routerMiddleware(history), // for dispatching history actions
        ),
      ),
    );

    // Initialize sagas
    sagaMiddleware.run(rootSaga);
  
    return store
}
