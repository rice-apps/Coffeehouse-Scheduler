import { combineReducers } from "redux";

/*

Created by Will on 4/8/18

*/

import * as ACTIONS from "../actions/AuthActions"

const defaultAuthReducerState = {
    loginRequesting: false,
    loggedIn: false,
    user: {},
    // service: 'https://coffeehouse.riceapps.org/auth',
    service: 'http://localhost:8080/auth',
    recentUpdate: false
}

const AuthReducer = (state=defaultAuthReducerState, action) => {
        switch (action.type) {
            case ACTIONS.LOGIN_REQUESTED:
                return {...state, loginRequesting: true};
            case ACTIONS.LOGIN_SUCCESS:
                return {...state, loginRequesting: false, loggedIn: true};
            case ACTIONS.LOGIN_FAILURE:
                return {...state, loginRequesting: false, loggedIn: false};
            case ACTIONS.LOGIN_REQUEST_FAILED:
                return {...state, loginRequesting: false};
            case ACTIONS.SAVE_SERVICE:
                return {...state, service: action.service};
            case ACTIONS.SET_USER:
                return {...state, user: action.user};
            default:
                return {...state};
        }
}

export default AuthReducer;