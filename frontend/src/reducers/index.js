/**
 * Created by Jeffr on 7/17/2017.
 */
import { combineReducers } from 'redux'
import mCal from './mCalReducer';
import eCal from './eCalReducer';
import auth from './authReducer';
import cal from './calReducer';

import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    cal,
    auth: auth,
    eCal, // To remove
    mCal, // To remove
})

export default createRootReducer;