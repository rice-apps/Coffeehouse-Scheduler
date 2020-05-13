import React, {Component, useState} from 'react'
import { Grid, Button } from '@material-ui/core';

import { connect } from "react-redux";
import { updatePreferenceRequest } from "../../actions/CalActions";

const colorMenu = {
    0: "#01b4bc",
    1: "#5fa55a",
    2: "#f6d51f",
    3: "#fa8925",
    4: "#fa5457"
}

const PreferenceMenu = ({ day, hour, updatePreferenceRequest, setAnchorElem }) => {
    let possiblePreferences = [1, 2, 3, 4];

    return (
        <Grid style={{ backgroundColor: "transparent" }} container direction={'row'}>
            {possiblePreferences.map(preference => {
                let preferenceStyle = {
                    backgroundColor: colorMenu[preference],
                    height: '35px'
                }

                const handleClick = () => {
                    updatePreferenceRequest(day, hour, preference)
                    
                    // Close menu
                    setAnchorElem(null);
                }
                return (
                    <Grid key={preference} item style={preferenceStyle}>
                        <Button 
                        disableElevation
                        key={preference}
                        style={preferenceStyle} 
                        variant={"contained"} 
                        onClick={() => handleClick()}
                        />
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        updatePreferenceRequest: (day, hour, preference) => dispatch(updatePreferenceRequest(day, hour, preference))
    })
)(PreferenceMenu)