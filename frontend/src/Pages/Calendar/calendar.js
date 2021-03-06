/**
 * Created by Will on 5/11/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import CalendarButton from './calendarButton';
import ColorLegend from '../color-legend';
import ToggleCalendarType from './toggleCalendarType';
import { dayAbbrev2Name } from '../../utils/calUtils';
import SelectCalendarTerm from './selectCalendarTerm';

let settings = {
    startTime: 7,
    endTime: 24 // exclusive
}

const masterLegend = {
    "Empty": "#5fa55a",
    "Has Room": "#f6d51f",
    "Full Shift": "#fa8925",
    "Overbooked": "#fa5457"
}

const employeeLegend = {
    "Undetermined": "#01b4bc",
    "Preferred": "#5fa55a",
    "Available": "#f6d51f",
    "Not Preferred": "#fa8925",
    "Unavailable": "#fa5457"
}

/**
 * Helper Functions
 * @param {*} param0 
 */
const orderedDays = (schedule) => {
    let _dayAbbrevs = Object.keys(schedule);
    // Ordered dayNames
    let _orderedDayAbbrevs = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
    // Take union of _dayNames and _ordered
    let dayAbbrevs = _orderedDayAbbrevs.filter(abbrev => _dayAbbrevs.includes(abbrev));
    
    return dayAbbrevs;
}

/**
 * 
 * @param {*} start : military hour integer, inclusive
 * @param {*} end : military hour integer, inclusive
 */
const generateHourMarkers = (start, end) => {
    let hourMarkers = [];
    for (let i = start; i <= end; i++) {
        let timePeriod = (i > 11) && (i < 24) ? ("PM") : ("AM")
        let time = ((i - 1) % 12) + 1;

        // let hourString = String(time) + ":55 " + timePeriod;
        let hourString = String(time) + " " + timePeriod;
        hourMarkers.push(hourString);
    }
    return hourMarkers;
}

const generateHours = (start, end) => {
    let hours = [];
    for (let hour = start; hour <= end; hour++) {
        hours.push(hour);
    }
    return hours;
}

const getShiftDetails = (hour, shifts) => {
    let filteredShifts = shifts.filter(shift => shift.hour == hour);
    return filteredShifts.length > 0 ? filteredShifts[0] : null;
}

/**
 * JSX Components
 * @param {} param0 
 */
const HourMarkers = ({}) => {
    // Inclusive of both
    let hourMarkers = generateHourMarkers(settings.startTime, settings.endTime);
    let headerStyle = {
        textAlign: 'center',
        marginRight: '10px',
    };
    let markerStyle = {
        alignContent: "left",
        textAlign: 'left',
        // width: '88px',
        marginRight: '10px',
        // marginTop: '1px',
        // paddingBottom: '12px'
    };
    return (
        <div>
        <p style={headerStyle}>Times</p>
        {hourMarkers.map(marker => (
            <Grid item xs={1}>
                <Button disabled variant={"text"} key={marker}>{marker}</Button>
            </Grid>
        ))}
        </div>
    )
    
}

const Hour = ({ shiftDetails }) => {
    return (
        <Grid item xs={1}>
            <CalendarButton shiftDetails={shiftDetails} />
        </Grid>
    )
}

const Day = ({ dayAbbrev, shifts }) => {
    
    return (
        <Grid item>
            <p style={{ textAlign: 'center' }}>{dayAbbrev2Name(dayAbbrev)}</p>
            {generateHours(settings.startTime, settings.endTime).map(hour => {
                // If shift exists for this hour, then shiftDetails is not null
                let shiftDetails = getShiftDetails(hour, shifts);

                // shiftDetails: _id, term, day, hour, preferences arr
                return (<Hour key={dayAbbrev + hour} shiftDetails={shiftDetails} />)
            })}
        </Grid>
    )
}

const Calendar = ({ schedule, user, isMasterCalendar }) => {
    let dayAbbrevs = orderedDays(schedule);

    return (
        <div style={{ display: "flex", marginTop: "30px", flexGrow: 4 }}>
            <Grid container direction={'row'} spacing={0} style={{ flexGrow: 3, width: "0%" }}>
                <HourMarkers />
                {dayAbbrevs.map(dayAbbrev => {
                    return (<Day key={dayAbbrev} dayAbbrev={dayAbbrev} shifts={schedule[dayAbbrev]} />)
                })}
            </Grid>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", flexGrow: 1 }}>
                <div style={{ paddingBottom: "5%" }}>
                    <ToggleCalendarType />
                </div>
                <SelectCalendarTerm />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "baseline", flexGrow: 1 }}>
                <ColorLegend legend={isMasterCalendar ? masterLegend : employeeLegend} />
            </div>
        </div>
    )
}

export default connect(
    (state) => {
        return {
            schedule: state.cal.schedule,
            user: state.auth.user,
            isMasterCalendar: state.cal.isMasterCalendar
        }
    }
)(Calendar)