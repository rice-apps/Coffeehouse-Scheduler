import { combineReducers } from "redux";

/*

Created by Will on 4/8/18

*/

import * as ACTIONS from "../actions/CalActions"

const defaultCalReducerState = {
    schedule: {},
    term: "Fall 2019",
    isMasterCalendar: true,
    modalOpen: false,
    activeShiftDetails: {}
}

const CalReducer = (state=defaultCalReducerState, action) => {
    
    const getIndices = (scheduleCopy, user, day, hour) => {
        // Change preference of particular shift
        let shiftIdx = scheduleCopy[day].findIndex(shift => shift.hour == hour);
        let prefIdx = scheduleCopy[day][shiftIdx].preferences.findIndex(prefObj => prefObj.user._id == user._id);
        
        return [shiftIdx, prefIdx];
    }

    let scheduleCopy, shiftIdx, prefIdx, user, shift;
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
            scheduleCopy = {...state.schedule};

            let { day, hour, preference } = action.payload;
            user = action.payload.user;

            [shiftIdx, prefIdx] = getIndices(scheduleCopy, user, day, hour);

            // Update preference of this particular shift
            scheduleCopy[day][shiftIdx].preferences[prefIdx].preference = preference;
            
            return { ...state, schedule: scheduleCopy }
        case ACTIONS.SET_TERM:
            return { ...state, term: action.term }
        case ACTIONS.TOGGLE_MODAL:
            return { ...state, modalOpen: !state.modalOpen, activeShiftDetails: action.shiftDetails };
        case ACTIONS.TOGGLE_CALENDAR_TYPE:
            return { ...state, isMasterCalendar: !state.isMasterCalendar };
        case ACTIONS.SCHEDULE_USER:
            scheduleCopy = {...state.schedule};

            shift = action.shift;
            user = action.user;

            // Change scheduled of particular shift
            [shiftIdx, prefIdx] = getIndices(scheduleCopy, user, shift.day, shift.hour);

            // Update scheduled property
            scheduleCopy[shift.day][shiftIdx].preferences[prefIdx].scheduled = true;

            return { ...state, schedule: scheduleCopy };
        case ACTIONS.UNSCHEDULE_USER:
            scheduleCopy = {...state.schedule};

            shift = action.shift;
            user = action.user;

            // Change scheduled of particular shift
            [shiftIdx, prefIdx] = getIndices(scheduleCopy, user, shift.day, shift.hour);

            // Update scheduled property
            scheduleCopy[shift.day][shiftIdx].preferences[prefIdx].scheduled = false;

            return { ...state, schedule: scheduleCopy };
        default:
            return {...state};
    }
}

export default CalReducer;