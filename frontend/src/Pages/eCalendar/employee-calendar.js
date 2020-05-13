/**
 * Created by Will & Josh on 10/22/2017.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
//Material Imports
import { GridList, GridListTile } from '@material-ui/core'
// import Subheader from 'material-ui/Subheader'
import CalendarDay from './calendar-day'
import { Grid } from '@material-ui/core'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridlist: {
    margin: 10,
    height: 500
  },
  times: {
    marginTop: 48,
    width: 88
  }
}

const HourCount = () => {
    var hours = [];
    for (var i = 6; i < 24; i++) {
        hours.push(i);
    }
    return hours
}

const EmployeeCalendar = ({schedule, mon, tues, wed, thurs, fri, sat, sun, user}) => {
  return (
    <div style={styles.root}>

      <GridList
        cols={8}
        padding={-2}
        style={styles.gridlist}
        cellHeight={730}
        >
        <GridListTile style={{marginTop: '-35px', height: 760}}>
          <GridList
            cols={1}
            cellHeight={38}
            padding={0}
            style={styles.times}>
            {HourCount().map(
              (hour) => (
                <GridListTile key={hour}>
                    <p key={hour} style={{display: 'flex', justifyContent: 'flex-end'}}>{((hour)%12==0 ? (12):((hour)%12)).toString() + ":55" + ((hour) > 11 ? (" PM"):(" AM"))}</p>
                  {/* <Subheader key={hour} style={{display: 'flex', justifyContent: 'flex-end'}}>{((hour)%12==0 ? (12):((hour)%12)).toString() + ":55" + ((hour) > 11 ? (" PM"):(" AM"))}</Subheader> */}
                </GridListTile>
              )
            )}
            <GridListTile>
                <p style={{display: 'flex', justifyContent: 'flex-end', marginTop: -9}}>Close</p>
              {/* <Subheader style={{display: 'flex', justifyContent: 'flex-end', marginTop: -9}}>Close</Subheader> */}
            </GridListTile>
          </GridList>
        </GridListTile>
        {Object.keys(schedule).map(dayName => {
            return (
                <CalendarDay key={dayName} dayname={dayName} shifts={schedule[dayName]} user={user} />
            )
        })}
      </GridList>
    </div>
  )
}

export default connect (
    (state) => {
        return {
          schedule: state.cal.schedule,
          // schedules
          mon: state.eCal.scheduleReducer.schedule.M,
          tues: state.eCal.scheduleReducer.schedule.T,
          wed: state.eCal.scheduleReducer.schedule.W,
          thurs: state.eCal.scheduleReducer.schedule.R,
          fri: state.eCal.scheduleReducer.schedule.F,
          sat: state.eCal.scheduleReducer.schedule.S,
          sun: state.eCal.scheduleReducer.schedule.U,
          // user
          user: state.auth.user
        }
    }
)(EmployeeCalendar)
