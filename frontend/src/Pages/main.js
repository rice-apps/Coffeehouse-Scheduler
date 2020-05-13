/**
 * Created by Will on 5/11/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';

import Calendar from './Calendar/calendar';

const Home = ({ calendarType }) => {
    console.log(calendarType);
    return (
        <div>
            <Calendar type={calendarType} />
        </div>
    )
}

export default connect(
    (state) => {
        return {
            calendarType: state.cal.calendarType,
            user: state.auth.user
        }
    }
)(Home)