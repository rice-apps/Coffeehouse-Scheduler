import React, {Component, useState} from 'react'
import { Button } from '@material-ui/core';

import { connect } from "react-redux";
import { toggleCalendarType } from "../../actions/CalActions";

const ToggleCalendarType = ({ calendarType, toggleCalendarType }) => {

    return (
        <Button
        variant={"contained"}
        style={{ height: "15%", width: "20%" }}
        onClick={() => toggleCalendarType()}
        >
            Toggle To {calendarType ? "Master" : "Employee"}
        </Button>
    )
}

export default connect(
    (state) => ({
        calendarType: state.cal.calendarType
    }),
    (dispatch) => ({
        toggleCalendarType: () => dispatch(toggleCalendarType())
    })
)(ToggleCalendarType)