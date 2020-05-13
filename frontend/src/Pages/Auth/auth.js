import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import LoadingScreen from "../LoadingScreen";
import { authenticateRequest } from "../../actions/AuthActions";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

const Auth = ({ authenticateRequest }) => {
    console.log("About to send request.")
    authenticateRequest();
    console.log("Sent request.")

    return (
        <LoadingScreen />
    )
}

export default connect(
    (state) => ({
        
    }),
    (dispatch) => {
        return ({
            authenticateRequest: () => dispatch(authenticateRequest()),
        });
    },
)(Auth);