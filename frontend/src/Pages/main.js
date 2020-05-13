/**
 * Created by Will on 5/11/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';

import Calendar from './Calendar/calendar';
import Sidebar from './Sidebar';

const Home = ({ }) => {
    return (
        <div>
            <Sidebar />
            <Calendar />
        </div>
    )
}

export default connect(
    (state) => {
        return {
            user: state.auth.user
        }
    }
)(Home)