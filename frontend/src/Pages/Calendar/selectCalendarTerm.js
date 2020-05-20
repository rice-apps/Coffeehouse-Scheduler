import React, {Component, useState} from 'react'
import { Button, Select, MenuItem } from '@material-ui/core';

import { connect } from "react-redux";
import { changeTerm } from "../../actions/CalActions";

const SelectCalendarTerm = ({ term, changeTerm }) => {

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", width: "6vw" }}>
            <span style={{ justifySelf: "flex-start" }}>Term:</span>
            <Select
            style={{ justifySelf: "flex-end" }}
            value={term}
            onChange={(event) => changeTerm(event.target.value)}
            >
                <MenuItem value={"Fall 2019"}>Fall 2019</MenuItem>
                <MenuItem value={"Spring 2020"}>Spring 2020</MenuItem>
            </Select>
        </div>
    )
}

export default connect(
    (state) => ({
        term: state.cal.term
    }),
    (dispatch) => ({
        changeTerm: (term) => dispatch(changeTerm(term))
    })
)(SelectCalendarTerm)