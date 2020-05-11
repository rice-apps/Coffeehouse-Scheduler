/**
 * Created by Jeffr on 7/22/2017.
 */
var express = require('express');
var router = express.Router();

const User = require('../models/usersModel').user;
const Shift = require('../models/shiftsModel').shift;
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
// For JWT-related functions
var jwt = require('jsonwebtoken');
var config = require('../config');
// Calls from employee.js
const getEmployeeScheduled = require('./employee').getEmployeeScheduled

let userConfig = {
    idealHour: 8,
    maxHour: 10
}

/**
 * Helper functions
 */

/**
 * Router functions
 */

/**
 * Get all users in the database. 
 * @param {*} req 
 * @param {*} res 
 */
const getUsers = (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) {
            res.send('error has occured')
        } else {
            res.json(users)
        }
    })
}

const getUser = (req, res) => {
    if (!req.params.netid) {
        res.send({ success: false, message: "Need a NetID" });
        return;
    }

    User.findOne({ netid: req.params.netid }).exec((err, user) => {
        if (err) {
            res.send('error has occured')
        } else {
            res.json(user)
        }
    })
}

const getUserAvailability = async (req, res) => {
    let netid = req.query.netid;
    let term = req.query.term;

    if (!term || !netid) {
        res.send({ success: false, message: "Need both NetID and term." });
    }

    // First check if the user already exists; if so, do nothing
    let existingUser = await checkUser(netid);
    if (!existingUser) {
        res.send({ success: false, message: "User does not exist." });
        return;
    }

    let shiftsCursor = Shift.collection.aggregate([
        { $match: { term: term } },
        { $lookup: 
			{
				from: "users",
				localField: "preferences.user",
				foreignField: "_id",
				as: "preferences.user"
			}
        },
        { $unwind: "$preferences.user" },
        { $match: { "preferences.user.netid": netid } },
    ])

    let shifts = await shiftsCursor.toArray();

    res.json(shifts);
}

/*
Set Properties for a User
url: 

Payload format: (req.body)
e.g. { netid: "xyz1", update: { idealHour: 1, role: "admin" } }
*/
const updateUser = (req, res) => {
    let netid = req.body.netid;
    let update = req.body.update;

    if (!req.body.netid || !req.body.update) {
        res.send({ success: false, message: "No netid or update provided." });
        return;
    }

    User.findOneAndUpdate({ netid: netid }, update, { new: true }, (err, user) => {
        if (err) {
            res.send('Error occurred. Please try again');
        }
        else {
            res.json(user);
        }
    })
}


/*
Create a user entry in the database:
url: /add/:netid?

Payload format:  (req.body)
 e.g. {firstName: Will, lastName: Mundy, idealHours: 8, maxHour: 10}

 */
const createUser = async (req, res) => {
    let netid = req.body.netid;

    // First check if the user already exists; if so, do nothing
    let existingUser = await checkUser(netid);
    if (existingUser) {
        res.send({ success: false, message: "User already exists." });
        return;
    }

    // Otherwise, create user
    let newUser = {
        netid: netid,
        idealHour: userConfig.idealHour,
        maxHour: userConfig.maxHour,
        totalHours: 0
    };

    let user = await User.create(newUser);

    res.send(user);
}

const removeUser = async (req, res) => {
    let netid = req.body.netid;

    // First check if the user already exists; if not, do nothing
    let existingUser = await checkUser(netid);
    if (!existingUser) {
        res.send({ success: false, message: "User does not exist." });
        return;
    }

    // Get user
    let user = await User.findOne({ netid: netid });

    // TODO: Find all schedules they are part of and delete them
    Shift.collection.updateMany({}, {
        $pull: { preferences: { user: user._id } }
    })

    // Delete the user
    await User.findOneAndDelete({ netid: netid });

    res.sendStatus(200);
}

router.get('/all', getUsers);
router.get('/availability', getUserAvailability);
router.get('/user/:netid', getUser);
router.put('/update', updateUser);
router.post('/create', createUser);
router.delete('/delete', removeUser);

module.exports = router;

// module.exports = app => {
//     // Get all users
//     app.get('/api/users', getUsers)
//     // Get a specific user 
//     app.get('/api/user/:netid?', getUser)
//     // Get all netids
//     app.get('/api/netids', getNetIDs)
//     // Remove an user
//     app.get('/api/remove/:netid?', removeUser)
//     // Check user role
//     app.get('/api/role/:netid?', getRole)
//     // Get active user info from JWT Token
//     app.get('/api/activeUser/:token', getUserByToken)
//     // Sets idealHour/idealHour of user
//     app.put('/api/idealHour/:netid?', setUserIdealHour)
//     // Sets maxHour of user
//     app.put('/api/maxHour/:netid?', setUserMaxHour)
//     // Sets the totalHours of user 
//     app.put('/api/totalHours/:netid?', setUserTotalHours)
//     // Adds a user based on netid
//     app.put('/api/add/:netid?', addUser)
//     // Set user role
//     app.put('/api/role/:netid?', setRole)
//     // app.get('/user/hours/:netid', getTotalHours)
//     // app.put('/user/:netid?', updateUser)
// }
