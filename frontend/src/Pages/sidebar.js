/**
 * Created by Will on 5/11/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';
import { AppBar, Toolbar, IconButton, MenuIcon, Typography, Button, Divider, Link } from '@material-ui/core';
import { changePath } from '../actions/RouteActions';

const Sidebar = ({ changePath }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography style={{ flexGrow: 1 }} variant="h6">Scheduler</Typography>
                <Divider orientation={"vertical"} flexItem />
                <Button 
                color="inherit" 
                onClick={() => changePath("/cal")}
                >
                    Calendar
                </Button>
                <Divider orientation={"vertical"} flexItem />
                <Button 
                color="inherit" 
                style={{ float: "left" }}
                onClick={() => changePath("/user")}
                >
                    User Management
                </Button>
                <Divider orientation={"vertical"} flexItem />
            </Toolbar>
        </AppBar>
    )
}

export default connect(
    (state) => {
        return {
            user: state.auth.user
        }
    },
    (dispatch) => {
        return {
            changePath: (path) => dispatch(changePath(path))
        }
    }
)(Sidebar)