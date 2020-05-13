/**
 * Created by Will on 5/11/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';

import Calendar from './Calendar/calendar';
import Sidebar from './Sidebar';
import UserList from './UserList';

const Home = ({ }) => {
    return (
        <div>
            <Sidebar />
            <div style={{ display: "flex" }}>
                <UserList style={{ flexGrow: 1 }} />
                <Calendar style={{ flexGrow: 2 }} />
            </div>
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