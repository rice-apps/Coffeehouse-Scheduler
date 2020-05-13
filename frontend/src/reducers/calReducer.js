import { combineReducers } from "redux";

/*

Created by Will on 4/8/18

*/

import * as ACTIONS from "../actions/CalActions"

const defaultCalReducerState = {
    schedule: {},
    term: "Fall 2019",
    calendarType: "master",
    modalOpen: false,
    activeShiftDetails: {}
}

const CalReducer = (state=defaultCalReducerState, action) => {
        switch (action.type) {
            case ACTIONS.SET_SCHEDULE:
                let newSchedule = {};
                // Split up schedule into days
                let distinctDays = new Set(action.schedule.map(shift => shift.day));

                // Iterate through each day and group
                for (let day of distinctDays) {
                    // Filter schedule for that day, set day in schedule to filtered shifts 
                    newSchedule[day] = action.schedule.filter(shift => shift.day == day);
                }

                return { ...state, schedule: newSchedule }
            case ACTIONS.UPDATE_PREFERENCE:
                let scheduleCopy = {...state.schedule};

                let { day, hour, preference, user } = action.payload;

                // Change preference of particular shift
                let shiftIdx = scheduleCopy[day].findIndex(shift => shift.hour == hour);
                let prefIdx = scheduleCopy[day][shiftIdx].preferences.findIndex(prefObj => prefObj.user._id == user._id)
                
                // Update preference of this particular shift
                scheduleCopy[day][shiftIdx].preferences[prefIdx].preference = preference;
                
                return { ...state, schedule: scheduleCopy }
            case ACTIONS.TOGGLE_MODAL:
                return { ...state, modalOpen: !state.modalOpen, activeShiftDetails: action.shiftDetails };
            default:
                return {...state};
        }
}

export default CalReducer;