import React, {Component} from 'react'
import { Dialog, DialogTitle, Button, DialogContent, Grid, makeStyles, Paper, Divider } from '@material-ui/core';

import { connect } from "react-redux";
import useModalOpen from '../../hooks/useModalOpen';
import { toggleModal, unscheduleUser, scheduleUser } from '../../actions/CalActions';
import { getScheduled, filterByPreference, getPreferenceTitle } from '../../utils/calUtils';

/**
 * Helper Functions
 * @param {*} param0 
 */

const getShift = (day, hour, schedule) => {
    let shiftIdx = schedule[day].findIndex(shift => shift.hour == hour);
    return schedule[day][shiftIdx];
}

/**
 * JSX Components
 * @param {} param0 
 */
const NameItem = ({ user, handleClick }) => {

    return (
        <Button
        variant={"outlined"}
        onClick={() => handleClick(user)}
        >
            {user.netid}
        </Button>
    )
}

const ScheduledMenu = ({ unscheduleUser, activeShift }) => {
    let scheduled = getScheduled(activeShift);

    const handleClick = (user) => {
        // Unschedule the user
        unscheduleUser(user, activeShift);
    }

    return (
        <div style={{ textAlign: "center" }}>
            {scheduled.map(preferenceObject => {
                return (
                    <NameItem key={preferenceObject.user._id} user={preferenceObject.user} handleClick={handleClick} />
                )
            })}
        </div>
    )
}

const SelectionMenu = ({ scheduleUser, activeShift }) => {
    let possiblePreferences = [0, 1, 2, 3, 4];

    const handleClick = (user) => {
        // Schedule the user
        scheduleUser(user, activeShift);
    }

    let preferenceFragments = [];
    for (let preferenceNum of possiblePreferences) {
        // Filter preference array
        let filtered = filterByPreference(activeShift, preferenceNum);
        // Map each object in filtered array to name object
        let mapped = filtered.map(prefObj => (<NameItem user={prefObj.user} handleClick={handleClick} />))
        // Combine title with list of name objects
        let preferenceFragment = (
            <React.Fragment>
                <h3>{getPreferenceTitle(preferenceNum)}</h3>
                {mapped}
            </React.Fragment>
        )
        preferenceFragments.push(preferenceFragment);
    }
    return (
        <React.Fragment>
            <div>
            {preferenceFragments}
            </div>
        </React.Fragment>
    )
}

const Modal = ({ modalOpen, toggleModal, scheduleUser, unscheduleUser, activeShiftDetails, schedule }) => {
    let possiblePreferences = [1, 2, 3, 4];

    // Prevents issues in getShift
    if (!modalOpen) {
        return (<p style={{ visibility: "hidden" }} />)
    }

    // Use activeShiftDetails to get up to date info from schedule (schedule will always be the one updated)
    let { day, hour } = activeShiftDetails;
    let activeShift = getShift(day, hour, schedule);

    return (
        <Dialog 
        open={modalOpen} 
        onClose={() => toggleModal({})}
        fullWidth={true}
        maxWidth={"md"}
        scroll={"body"}
        >
            <DialogTitle style={{ textAlign: 'center' }}>Scheduling Screen</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={6} style={{ borderRight: '0.1em solid #dddddd', padding: '1em' }}>
                        <DialogTitle style={{ textAlign: 'center' }}>Preferences</DialogTitle>
                        <SelectionMenu 
                        activeShift={activeShift} 
                        scheduleUser={scheduleUser}
                        />
                    </Grid>
                    <Grid item xs={6} style={{ padding: '1em' }}>
                        <DialogTitle style={{ textAlign: 'center' }}>Scheduled</DialogTitle>
                        <ScheduledMenu 
                        activeShift={activeShift} 
                        unscheduleUser={unscheduleUser}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default connect(
    (state) => ({
        modalOpen: state.cal.modalOpen,
        activeShiftDetails: state.cal.activeShiftDetails,
        schedule: state.cal.schedule
    }),
    (dispatch) => ({
        toggleModal: (shiftDetails) => dispatch(toggleModal(shiftDetails)),
        scheduleUser: (user, shift) => dispatch(scheduleUser(user, shift)),
        unscheduleUser: (user, shift) => dispatch(unscheduleUser(user, shift))
    })
)(Modal)