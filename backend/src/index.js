/**
 * Welcome to our index page. This is the main file that connects our
 * entire backend database.
 * We will declare our dependencies and connect our backend
 * routes in this file. 
 */

// Declaring our dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Enable cross orgin resource sharing
const enableCORS = function(req, res, next) {
     res.header("Access-Control-Allow-Origin", req.headers.origin);
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header("Access-Control-Allow-Credentials", "true");
     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
     if (req.method === "OPTIONS") {
          res.status(200).send('OK')
     } else {
          next();
     }
}

// Connecting our declared routes in to our express app
var userRouter = require('./routes/users')
var scheduleRouter = require('./routes/schedule')
var authRouter = require('./routes/auth')

const app = express()
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
app.use(cookieParser());
app.use(enableCORS);

// Setup routes
app.use('/api/users', userRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/auth', authRouter);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000

// Run our express app
const server = app.listen(port, () => {
    const addr = server.address()
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
