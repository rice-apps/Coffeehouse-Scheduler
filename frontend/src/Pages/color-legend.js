/**
 * Created by Will on 5/25/2018.
 */

import React, {Component} from 'react'
import { Button } from '@material-ui/core';

/*
Input:
- legend: object containing mapping of setting (string) to corresponding color (string)
Ex: 
{
    "Empty": "#FFFFFF",
    "Has Room": "#000000",
    ...
}
*/
const ColorLegend = ({legend}) => {
    return (
        <React.Fragment>
            {   // Iterate through keys of object
                Object.keys(legend).map((setting, index) => {
                // Get color associated to setting
                var color = legend[setting];
                return (
                    <div>
                        <Button variant={"outlined"} style={{ backgroundColor: color, height: 15, minWidth: 15, marginTop: '-4.5px', marginRight: 5 }} />
                        = {setting}
                    </div>
                )
            })}
        </React.Fragment>
    )
}

export default ColorLegend;