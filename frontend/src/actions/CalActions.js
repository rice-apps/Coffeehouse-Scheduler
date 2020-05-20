export const SET_TERM = "SET_TERM";
export const GET_TERM = "GET_TERM";

export const SET_SCHEDULE = "SET_SCHEDULE";

export const UPDATE_PREFERENCE_REQUEST = "UPDATE_PREFERENCE_REQUEST";
export const UPDATE_PREFERENCE = "UPDATE_PREFERENCE";

export const TOGGLE_MODAL = "TOGGLE_MODAL";

export const TOGGLE_CALENDAR_TYPE = "TOGGLE_CALENDAR_TYPE";

export const CHANGE_TERM_REQUEST = "CHANGE_TERM_REQUEST";

export const SCHEDULE_USER_SHIFT_REQUEST = "SCHEDULE_USER_SHIFT_REQUEST";
export const UNSCHEDULE_USER_SHIFT_REQUEST = "UNSCHEDULE_USER_SHIFT_REQUEST";
export const SCHEDULE_USER = "SCHEDULE_USER";
export const UNSCHEDULE_USER = "UNSCHEDULE_USER";

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

export const toggleCalendarType = () => {
    return {
        type: TOGGLE_CALENDAR_TYPE
    }
}

export const changeTerm = (term) => {
    console.log(term);
    return {
        type: CHANGE_TERM_REQUEST,
        term
    }
}

export const scheduleUser = (user, shift) => {
    return {
        type: SCHEDULE_USER_SHIFT_REQUEST,
        user,
        shift
    }
}

export const unscheduleUser = (user, shift) => {
    return {
        type: UNSCHEDULE_USER_SHIFT_REQUEST,
        user,
        shift
    }
}