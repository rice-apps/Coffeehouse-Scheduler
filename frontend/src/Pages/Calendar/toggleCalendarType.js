import React, {Component, useState} from 'react'
import { Button } from '@material-ui/core';

import { connect } from "react-redux";
import { toggleCalendarType } from "../../actions/CalActions";

const ToggleCalendarType = ({ isMasterCalendar, toggleCalendarType }) => {

    return (
        <Button
        variant={"contained"}
        onClick={() => toggleCalendarType()}
        >
            Toggle To {isMasterCalendar ? "Employee" : "Master"}
        </Button>
    )
}

export default connect(
    (state) => ({
        isMasterCalendar: state.cal.isMasterCalendar
    }),
    (dispatch) => ({
        toggleCalendarType: () => dispatch(toggleCalendarType())
    })
)(ToggleCalendarType)