/**
 * Created by Will on 5/11/20.
 */

import React, {Component, useState} from 'react'
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import PreferenceMenu from './preferenceMenu';
import useModalOpen from '../../hooks/useModalOpen';
import { toggleModal } from '../../actions/CalActions';

/**
 * Styles
 */
const popoverSettings = {
    anchorOrigin: {
        horizontal: "left",
        vertical: "center"
    },
    targetOrigin: {
        horizontal: "top",
        vertical: "center"
    },
    transformOrigin: {
        horizontal: "left",
        vertical: "center",
    }
}


const colorMenu = {
    0: "#01b4bc",
    1: "#a8e6cf",
    2: "#dcedc1",
    3: "#ffd3b6",
    4: "#ffaaa5"
}

/**
 * Helper Functions
 * @param {*} param0 
 */

const getPreference = (shiftDetails, user) => {
    // Find corresponding user preference object
    let preferenceObject = shiftDetails.preferences.find(prefObj => prefObj.user._id == user._id);
    return preferenceObject.preference;
}

const getScheduled = (shiftDetails) => {
    // Check user preference objects for # scheduled
    let scheduled = shiftDetails.preferences.filter(prefObj => prefObj.scheduled == true);
    return scheduled;
}

/**
 * JSX Components
 * @param {} param0 
 */

const EmployeeButton = ({ shiftDetails, disabled, user }) => {
    const [getAnchorElem, setAnchorElem] = useState(null);

    const buttonClick = (event) => {
        setAnchorElem(event.currentTarget);
    }

    const popoverClose = () => {
        setAnchorElem(null);
    }

    let buttonStyle = {
        height: '33px',
        width: '38px',
        backgroundColor: shiftDetails ? colorMenu[getPreference(shiftDetails, user)]: "transparent"
    }

    // If shiftDetails is null, return disabled button
    if (!shiftDetails) {
        return (
            <Button 
            disabled={disabled} 
            style={buttonStyle} 
            variant={"outlined"}
            onClick={buttonClick}
            color={"primary"}
            />
        )
    }
    
    // Employee button is preferences
    return (
        <div>
            <Button 
            disabled={disabled} 
            style={buttonStyle} 
            variant={"outlined"}
            onClick={buttonClick}
            />
            <Popover 
            style={{ backgroundColor: "transparent" }}
            open={Boolean(getAnchorElem)} 
            anchorEl={getAnchorElem} 
            onClose={popoverClose}
            anchorOrigin={popoverSettings.anchorOrigin}
            transformOrigin={popoverSettings.transformOrigin}
            >
                <PreferenceMenu day={shiftDetails.day} hour={shiftDetails.hour} setAnchorElem={setAnchorElem} />
            </Popover>
        </div>
    )
}

const MasterButton = ({ shiftDetails, disabled, toggleModal }) => {
    // Master button shows modal
    let scheduled = shiftDetails ? getScheduled(shiftDetails) : [];

    let buttonStyle = {
        height: '33px',
        width: '38px',
        backgroundColor: scheduled.length > 0 ? "#d9455f" : "transparent"
    }

    return (
        <Button 
        disabled={disabled} 
        style={buttonStyle} 
        variant={"outlined"} 
        onClick={() => toggleModal(shiftDetails)}
        />
    )
}

const CalendarButton = ({ isMasterCalendar, shiftDetails, user, toggleModal }) => {
    // If shiftDetails is null, then button is disabled
    let disabled = shiftDetails ? false : true;

    if (isMasterCalendar) {
        // Return master
        return (
            <MasterButton 
            disabled={disabled} 
            shiftDetails={shiftDetails}
            toggleModal={toggleModal}
            />
        )
    } else {
        // Return employee
        return (
            <EmployeeButton 
            disabled={disabled} 
            shiftDetails={shiftDetails} 
            user={user}
            />
        )
    }
}

export default connect(
    (state) => {
        return {
            isMasterCalendar: state.cal.isMasterCalendar,
            user: state.auth.user
        }
    },
    (dispatch) => {
        return {
            toggleModal: (shiftDetails) => dispatch(toggleModal(shiftDetails))
        }
    }
)(CalendarButton)