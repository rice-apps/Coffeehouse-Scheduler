import React, {Component, useState} from 'react'
import { Button, Select, MenuItem } from '@material-ui/core';

import { connect } from "react-redux";
import { changeTerm } from "../../actions/CalActions";

const SelectCalendarTerm = ({ term, changeTerm }) => {

    return (
        <Select
            style={{ height: "15%", width: "20%", marginTop: "25px" }}
            value={term}
            onChange={(event) => changeTerm(event.target.value)}
        >
          <MenuItem value={"Fall 2019"}>Fall 2019</MenuItem>
          <MenuItem value={"Spring 2020"}>Spring 2020</MenuItem>
        </Select>
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