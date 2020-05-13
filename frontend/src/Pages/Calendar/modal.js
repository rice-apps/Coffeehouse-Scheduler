import React, {Component} from 'react'
import { Dialog, DialogTitle, Button, DialogContent, Grid, makeStyles, Paper, Divider } from '@material-ui/core';

import { connect } from "react-redux";
import useModalOpen from '../../hooks/useModalOpen';
import { toggleModal } from '../../actions/CalActions';
import { getScheduled, filterByPreference, getPreferenceTitle } from '../../utils/calUtils';

/**
 * Helper Functions
 * @param {*} param0 
 */

/**
 * JSX Components
 * @param {} param0 
 */
const NameItem = ({ user }) => {

    return (
        <Button
        variant={"outlined"}
        >
            {user.netid}
        </Button>
    )
}

const ScheduledMenu = ({ activeShiftDetails }) => {
    let scheduled = getScheduled(activeShiftDetails);
    return (
        <div style={{ textAlign: "center" }}>
            {scheduled.map(preferenceObject => {
                return (
                    <NameItem user={preferenceObject.user} />
                )
            })}
        </div>
    )
}

const SelectionMenu = ({ activeShiftDetails }) => {
    let possiblePreferences = [0, 1, 2, 3, 4];

    let preferenceFragments = [];
    for (let preferenceNum of possiblePreferences) {
        // Filter preference array
        let filtered = filterByPreference(activeShiftDetails, preferenceNum);
        // Map each object in filtered array to name object
        let mapped = filtered.map(prefObj => (<NameItem user={prefObj.user} />))
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

const Modal = ({ modalOpen, toggleModal, activeShiftDetails }) => {
    let possiblePreferences = [1, 2, 3, 4];

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
                        <SelectionMenu activeShiftDetails={activeShiftDetails} />
                    </Grid>
                    <Grid item xs={6} style={{ padding: '1em' }}>
                        <DialogTitle style={{ textAlign: 'center' }}>Scheduled</DialogTitle>
                        <ScheduledMenu activeShiftDetails={activeShiftDetails} />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default connect(
    (state) => ({
        modalOpen: state.cal.modalOpen,
        activeShiftDetails: state.cal.activeShiftDetails
    }),
    (dispatch) => ({
        toggleModal: (shiftDetails) => dispatch(toggleModal(shiftDetails))
    })
)(Modal)