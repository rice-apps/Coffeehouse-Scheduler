/**
 * Created by Jeffr on 7/17/2017.
 */

 // Dependencies
 import React, { Component } from 'react'
 import { Switch, Route, Redirect } from 'react-router'

// Pages
import FullCalendar from '../Pages/eCalendar/full-calendar';
import LoginPage from '../Pages/login'
import Auth from '../Pages/Auth/Auth'
import { connect } from 'react-redux'
import { verifyRequest } from '../actions/AuthActions'
import Main from "../Pages/main";

// const Authorization = (allowedRoles) => (
//     ({ component: Component, ...rest }) => (
//         <Route {...rest} render={(props) => (
//             localStorage.getItem('token') && allowedRoles.includes(props.user.role)
//                 ? <Component {...props} />
//                 : <Redirect to='/login' />
//         )} />
//     )
// );


const PrivateRoute = ({ children, loggedIn, verifyRequest, ...rest }) => {
    return (
        <Route {...rest} render={(props) => {
            if (loggedIn) {
                return (children);
            } else {
                // Check if token
                if (localStorage.getItem('token')) {
                    verifyRequest();
                } else {
                    // Redirect to login
                    props.history.push("/login");
                }
            }
        }} />
    )
}

const App = ({ loggedIn, verifyRequest }) => {
    console.log("Inside app.");
    return (
        <Switch>
            <PrivateRoute 
            exact path='/' 
            loggedIn={loggedIn} 
            verifyRequest={verifyRequest}>
                <FullCalendar />
            </PrivateRoute>
            <PrivateRoute 
            path='/ecal' 
            loggedIn={loggedIn} 
            verifyRequest={verifyRequest}>
                <FullCalendar />
            </PrivateRoute>
            <PrivateRoute 
            path='/mcal' 
            loggedIn={loggedIn} 
            verifyRequest={verifyRequest}>
                <FullCalendar />
            </PrivateRoute>
            <PrivateRoute
            path='/cal'
            loggedIn={loggedIn}
            verifyRequest={verifyRequest}>
                <Main />
            </PrivateRoute>
            <Route path='/login'>
                <LoginPage />
            </Route>
            <Route path='/auth'>
                <Auth />
            </Route>
        </Switch>  
    )
}

export default connect(
    (state) => ({
        loggedIn: state.auth.loggedIn
    }),
    (dispatch) => ({
        verifyRequest: () => dispatch(verifyRequest())
    })
)(App)
