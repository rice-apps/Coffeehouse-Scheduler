/**
 * Created by Will on 5/13/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { getUserScheduled, shiftToTime } from '../utils/userUtils';

const UserList = ({ schedule, user }) => {
    let scheduledShifts = getUserScheduled(schedule, user)
    return (
        <div style={{ margin: "50px 50px", flexGrow: 1 }}>
            <Typography variant={"h4"}>
                Welcome, {user.netid}
            </Typography>
            <Typography variant={"h6"}>
                Ideal Hours: {user.idealHour}
            </Typography>
            <Typography variant={"h6"}>
                Max Hours: {user.maxHour}
            </Typography>
            <Typography variant={"h6"}>
                Scheduled Shifts
            </Typography>
            {scheduledShifts.map(shift => (<p>{shiftToTime(shift)}</p>))}
        </div>
    )
}

export default connect(
    (state) => {
        return {
            schedule: state.cal.schedule,
            user: state.auth.user
        }
    },
    (dispatch) => {
        return {
        }
    }
)(UserList)