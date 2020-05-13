/**
 * Created by Will & Josh on 10/22/2017.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
//Material Imports
import {GridList, GridListTile} from '@material-ui/core'
import Subheader from 'material-ui/Subheader'
//Inner Imports
import CalendarHour from './calendar-hour'
// Action Imports
import {selectUser} from '../../actions/userActions'
import {get_availability} from '../../actions/employeeActions'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridlist: {
    width: 96
  }
}

const DayTitle = (dayname) => {
    switch(dayname) {
        case "U":
            return "Sunday"
        case "M":
            return "Monday"
        case "T":
            return "Tuesday"
        case "W":
            return "Wednesday"
        case "R":
            return "Thursday"
        case "F":
            return "Friday"
        case "S":
            return "Saturday"
    }
}

const CalendarDay = ({dayname, shifts, users, user, get_availability, selectUser}) => {
  return (
    <div style={styles.root}>
      <GridList
        cellHeight={38}
        padding={0}
        style={styles.gridlist}
        cols={1}>
          <GridListTile>
              <p style={{padding: 2, display: 'flex'}}>{DayTitle(dayname)}</p>
          </GridListTile>
        {shifts.map(
          (shift) => {
            return (
                <GridListTile key={shift.hour}>
                      <CalendarHour key={shift.hour} dayname={dayname} hour={shift.hour} />
                </GridListTile>
            )
        }
        )}
      </GridList>
    </div>
  )
}

export default connect (
    (state) => {
        return {
          // dayName: state.sunReducer.sun,
          // day: state.day
          // dayName: state.dayName,
          // day: state.day
        }
    },
    (dispatch) => {
      return {
        get_availability: (netid) => dispatch(get_availability(netid)),
        selectUser: (user) => dispatch(selectUser(user)),
      }
    }
)(CalendarDay)
