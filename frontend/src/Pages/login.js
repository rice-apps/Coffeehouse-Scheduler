/**
 * Created by Will Mundy, Danny Andreini on 4/8/18.
 */
import React, {Component} from 'react'
import { loginRequest } from '../actions/AuthActions';
import { connect } from 'react-redux';
import { Button } from "@material-ui/core";

const LoginPage = ({ loginRequest }) => {
    

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FBFBFB" }}>
            <div>
              <a href={'http://coffeehouse.rice.edu/'} target={'_blank'} >
                  <img src={"http://coffeehouse.blogs.rice.edu/files/2017/07/Website-header-logo-utp0mt.png"} height={120} />
              </a>
              <h3>Shift Scheduler</h3>
            </div>
            <div style={{ position: 'absolute', marginTop: '125px' }}>
                <Button variant="outlined" style={{ color: "#272D2D", textTransform: "none" }} onClick={() => loginRequest()}>enter</Button>
            </div>
            <div style={{ position: 'absolute', marginTop: '250px' }}>
              <h3>Powered By: </h3>
              <a href={'https://www.riceapps.org'} target={'_blank'}>
                  <img src={"https://riceapps.org/static/media/logo_color_light.7d03c94d.png"} height={63} />
              </a>
            </div>
        </div>
    )
}

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        loginRequest: () => dispatch(loginRequest())
    })
)(LoginPage);
