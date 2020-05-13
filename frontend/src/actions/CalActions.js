export const SET_TERM = "SET_TERM";
export const GET_TERM = "GET_TERM";

export const SET_SCHEDULE = "SET_SCHEDULE";

export const UPDATE_PREFERENCE_REQUEST = "UPDATE_PREFERENCE_REQUEST";
export const UPDATE_PREFERENCE = "UPDATE_PREFERENCE";

export const TOGGLE_MODAL = "TOGGLE_MODAL";

export const getTerm = () => {
    return {
        type: GET_TERM
    };
}

export const setTerm = (term) => {
    return {
        type: SET_TERM
    };
}

export const setSchedule = (schedule) => {
    return {
        type: SET_SCHEDULE
    }
}

export const updatePreferenceRequest = (day, hour, preference) => {
    return {
        type: UPDATE_PREFERENCE_REQUEST,
        day,
        hour,
        preference
    }
}

export const toggleModal = (shiftDetails) => {
    return {
        type: TOGGLE_MODAL,
        shiftDetails
    }
}