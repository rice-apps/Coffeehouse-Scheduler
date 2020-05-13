import { all, call, put, takeLeading, takeLatest, take, select, fork } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESTED, GET_SERVICE, SAVE_SERVICE, SET_USER, SET_RECENT_UPDATE, SEEN_RECENT_UPDATE_SUCCESS, SEEN_RECENT_UPDATE_REQUEST, VERIFY_REQUESTED, AUTHENTICATE_REQUESTED } from '../actions/AuthActions';
import { history } from '../configureStore';
import { backendURL, serviceURL } from '../config';
import { SET_SCHEDULE, UPDATE_PREFERENCE_REQUEST, UPDATE_PREFERENCE, CHANGE_TERM_REQUEST, SET_TERM } from '../actions/CalActions';

// import Api from '...'

const config = {
    loginURL: "https://idp.rice.edu/idp/profile/cas/login",
    token: '',
}

const fetchCurrentService = () => {
    return fetch(backendURL + "/api/deploy/service")
    .then(response => {
        return response.text().then(text => {
            return text;
        })
    })
}

const sendTicket = (ticket) => {
    return fetch(backendURL + "/api/auth/login", {
        method: "GET",
        headers: {
            'X-Ticket': ticket
        }
    }).then(response => {
        return response.json().then(body => {
            return { token: body.token, user: body.user };
        })
    }).catch(err => {
        console.log(err);
    })
}

const verifyToken = (token) => {
    return fetch(backendURL + "/api/auth/verify", {
        method: "GET",
        headers: {
            'X-Token': token
        }
    }).then(response => {
        return response.json().then(body => {
            return { verificationStatus: body.success, user: body.user };
        })
    }).catch(err => {
        console.log(err);
    })
}

const fetchSchedule = (term) => {
    return fetch(backendURL + "/api/schedule?term=" + term, {
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        },
    }).then(response => {
        return response.json().then(body => {
            return body;
        })
    })
}

const updatePreference = ({ term, day, hour, preference, user }) => {
    let body = {
        term,
        day,
        hour,
        preference,
        netid: user.netid
    }
    console.log(body);
    return fetch(backendURL + "/api/schedule/updateAvailability", {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json().then(body => {
            return body.success;
        })
    }).catch(err => {
        console.log(err);
    })
}

function* getService(action) {
    try {
        let serviceURL = yield call(fetchCurrentService);

        yield put({ type: SAVE_SERVICE, service: serviceURL });
    } catch (e) {
        yield put({ type: "GET_SERVICE_URL_FAILED", message: e.message });
    }
}

function* loginRequest(action) {
    try {
        const state = yield select();

        // Redirect to Rice IDP
        let redirectURL = config.loginURL + "?service=" + state.auth.service;
        window.open(redirectURL, "_self");
    } catch (e) {
        yield put({ type: "LOGIN_REQUEST_FAILED", message: e.message });
    }
}

function* authenticateRequest(action) {
    try {
        const state = yield select();

        // We've redirected back from Rice's IDP

        // Get current URL
        let ticket = state.router.location.query.ticket;
        
        if (!ticket) {
            console.log("Missing ticket!");
            // Redirect to login page
            yield call(history.push, "/login");
        }

        // Send ticket to backend
        let success;
        try {
            success = yield call(sendTicket, ticket);
        } catch (e) {
            yield call(history.push, "/login");
            yield put({ type: LOGIN_FAILURE, message: e.message });
        }

        // Extract from success
        let { token, user } = success;

        // Save token to config
        config.token = token;

        // Set token in local storage
        localStorage.setItem('token', token);

        // Save user info
        yield put({ type: SET_USER, user });

        yield put({ type: LOGIN_SUCCESS });

        // Get current term
        // TODO: For now we just have one so we'll hardcode this
        let term = state.cal.term;

        // Load schedule
        let schedule = yield call(fetchSchedule, term);

        yield put({ type: SET_SCHEDULE, schedule });

        // Redirect depending on role
        if (user.role == "user") {
            // Redirect to employee cal
            yield call(history.push, "/ecal");
        } else {
            // Redirect to master cal
            yield call(history.push, "/mcal");
        }
    } catch (e) {
        yield put({ type: "LOGIN_REQUEST_FAILED", message: e.message });
        // yield call(history.push, "/error");
    }
}

function* verifyRequest(action) {
    try {
        // Get state
        const state = yield select();

        // Get token
        let token = yield localStorage.getItem('token');

        // Send token to backend for verification
        let { verificationStatus, user } = yield call(verifyToken, token);

        if (verificationStatus) {
            // Store token in config
            config.token = token;

            // Set to logged in
            yield put({ type: LOGIN_SUCCESS });

            // Save user info
            yield put({ type: SET_USER, user });

            // Get current term
            // For now we just have one so we'll hardcode this
            let term = state.cal.term;

            // Load schedule
            let schedule = yield call(fetchSchedule, term);

            console.log("Inside verify, pre schedule");
            console.log(schedule);

            // Set schedule
            yield put({ type: SET_SCHEDULE, schedule });

            // Redirect to desired protected page
            yield call(history.push, history.location.pathname);
        } else {
            // Remove token bc it's not verified
            localStorage.removeItem('token');
            // Redirect to login
            yield call(history.push, "/login");
        }

    } catch (e) {
        yield put({ type: "VERIFY_REQUEST_FAILED", message: e.message });
    }
}

function* updatePreferenceRequest(action) {
    try {
        // Get state
        const state = yield select();

        // Get term
        let term = state.cal.term;
        let user = state.auth.user;

        // Set payload
        let payload = {
            term,
            user,
            day: action.day,
            hour: action.hour,
            preference: action.preference,
        }

        // Send update preference request to backend
        yield fork(updatePreference, payload)

        // Set on frontend
        yield put({ type: UPDATE_PREFERENCE, payload });
    } catch (e) {
        console.log(e.message);
        yield put({ type: "UPDATE_PREFERENCE_REQUEST_FAILED", message: e.message });
    }
}

function* changeTermRequest(action) {
    try {
        // Request new term
        let schedule = yield call(fetchSchedule, action.term);

        // Set schedule
        yield put({ type: SET_SCHEDULE, schedule });

        // Set new term
        yield put({ type: SET_TERM, term: action.term });
    } catch (e) {
        console.log(e.message);
        yield put({ type: "CHANGE_TERM_REQUEST_FAILED", message: e.message });
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* serviceWatcher() {
    yield takeLatest(GET_SERVICE, getService);
}

function* loginWatcher() {
    yield takeLatest(LOGIN_REQUESTED, loginRequest);
}

function* verifyWatcher() {
    yield takeLatest(VERIFY_REQUESTED, verifyRequest);
}

function* authenticateWatcher() {
    yield takeLatest(AUTHENTICATE_REQUESTED, authenticateRequest);
}

function* updatePreferenceWatcher() {
    yield takeLeading(UPDATE_PREFERENCE_REQUEST, updatePreferenceRequest);
}

function* changeTermWatcher() {
    yield takeLatest(CHANGE_TERM_REQUEST, changeTermRequest);
}

export default function* rootSaga() {
    yield all([
        serviceWatcher(),
        loginWatcher(),
        authenticateWatcher(),
        verifyWatcher(),
        updatePreferenceWatcher(),
        changeTermWatcher()
    ])
};