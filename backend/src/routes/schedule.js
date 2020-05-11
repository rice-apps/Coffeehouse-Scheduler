var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const Shift = require('../models/shiftsModel').shift;
const User = require('../models/usersModel').user;

const { checkTerm, checkUser } = require('../utils/utils');

const createShiftsToInsert = (term, days) => {
    let shifts = [];
    let dayNames = Object.keys(days);

    // Iterate through each day
    for (let dayIndex = 0; dayIndex < dayNames.length; dayIndex++) {
        let currentDay = dayNames[dayIndex];

        // Extract start, end
        let startHour = days[currentDay].start - 1;
        let endHour = days[currentDay].end - 1;

        // Check if end hour < start hour, which indicates we wrap around the day
        if (endHour < startHour) {
            // Add 24 hours; don't worry, we'll modulo it out inside the for loop later
            endHour += 24;
        }

        // Iterate through each hour
        // We need to construct a dummy range object
        for (let iter = startHour; iter < endHour; iter++) {
            // Transform iter into hour
            let hour = (iter % 24) + 1;

            let shift = {
              term: term,
              day: currentDay,
              hour: hour,
              preferences: []
            }

            // Create shift object
            shifts.push(shift);
        }
    }

    return shifts;
}

const createTermSchedule = async (req, res) => {
    /**
     * Example body:
     * {
     *     term: "Fall 2020",
     *     days: {
     *         M: { start: 7, end: 1 } // because hours are 7am to 1am
     *         ...
     *         S: [10, 17] // because 5pm = 17:00 in military time
     *     }
     * }
     */
    if (!req.body.term || !req.body.days) {
      res.send({ success: false, message: "Need a term and day collection." });
    }

    let term = req.body.term;
    let days = req.body.days; // this will be an array of days available ['M', 'T', ...]

    // Check that no shifts currently exist for this term
    let exists = await Shift.exists({ term: term });
    if (exists) {
        res.send({ success: false, message: "Term already exists." });
        return;
    }

    let shiftsToInsert = createShiftsToInsert(term, days);
    
    // Create shift objects
    Shift.insertMany(shiftsToInsert, (err, newShifts) => {
        res.send(newShifts);
    })
}

const getSchedule = async (req, res) => {
    // Get All Shifts in Schedule for this term
    if (!req.query.term) {
      res.send({ success: false, message: "Need term." });
    }

    let term = req.query.term;
    let filter = { term: term };

    if (req.query.day) {
      filter["day"] = req.query.day;
    }

    if (req.query.hour) {
      filter["hour"] = req.query.hour;
    }

    try {
      let termShifts = await Shift.find(filter)
      .populate({ path: 'preferences.user' })
      .sort({ day: 1, hour: 1 });

      res.send(termShifts);
    } catch (exception) {
      console.log(exception)
      res.sendStatus(400);
      return;
    }
}

/*
Call: app.get('/master/hourtotal/:netid?', getHourTotal)
Effect: gets the total hours worked by user with ID :netid?

Input: users NetId
Output: total number of hours the given employee is currently scheduled

test: jhw5 has 27 instances.

*/
const getHourTotal = async (req, res) => {
    const term = req.query.term;

    // Check that term exists
    let termExists = await checkTerm(term);
    if (!termExists) {
        res.send({ success: false, message: "Term not found." });
    }

    let netid = req.params.netid;

    // First check if the user already exists; if not, do nothing
    let existingUser = await checkUser(netid);
    if (!existingUser) {
        res.send({ success: false, message: "User does not exist." });
        return;
    }

    // Get user
    let user = await User.findOne({ netid: netid });

    let scheduledShifts = await Shift.find({
        term: term,
        preferences: {
            $elemMatch: {
                user: user._id,
                scheduled: true
            }
        }
    });

    res.json({ "totalHours": scheduledShifts.length });
}

/**
 * Gets all shift objects that a user is scheduled for
 * @TODO move this to user routes
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getScheduledShifts = async (req, res) => {
    const term = req.query.term;

    // Check that term exists
    let termExists = await checkTerm(term);
    if (!termExists) {
        res.send({ success: false, message: "Term not found." });
    }

    let netid = req.params.netid;

    // First check if the user already exists; if not, do nothing
    let existingUser = await checkUser(netid);
    if (!existingUser) {
        res.send({ success: false, message: "User does not exist." });
        return;
    }

    // Get user
    let user = await User.findOne({ netid: netid });

    let scheduledShifts = await Shift.find({
        term: term,
        preferences: {
            $elemMatch: {
                user: user._id,
                scheduled: true
            }
        }
    });

    res.json(scheduledShifts);
}

/**
 * Adds user preference objects to all shifts for the given term
 * @param {*} req 
 * @param {*} res 
 */
const addUserToTerm = async (req, res) => {
    const term = req.body.term;

    // Check that term exists
    let termExists = await checkTerm(term);
    if (!termExists) {
        res.send({ success: false, message: "Term not found." });
    }

    const netid = req.body.netid;
    if (!netid) {
        res.send({ success: false, message: "NetID not found." });
    }

    // Check that netid is valid
    let user = await User.findOne({ netid: netid });
    if (!user) {
        res.send({ success: false, message: "User not found." });
    }

    // If exists, iterate through all shifts and add user
    // let shifts = await Shift.find({ term: term });
    let updatedShifts = await Shift.collection.updateMany({ term: term }, [
        { $set: { preferences: { $concatArrays: [ "$preferences", [ { user: { $toObjectId: user._id } , preference: 1, scheduled: false } ] ]}}}
    ])

    res.sendStatus(200);
}

const removeUserFromTerm = async (req, res) => {
    const term = req.body.term;

    // Check that term exists
    let termExists = await checkTerm(term);
    if (!termExists) {
        res.send({ success: false, message: "Term not found." });
    }

    const netid = req.body.netid;
    if (!netid) {
        res.send({ success: false, message: "NetID not found." });
    }

    // Check that netid is valid
    let user = await User.findOne({ netid: netid });
    if (!user) {
        res.send({ success: false, message: "User not found." });
    }

    Shift.collection.updateMany({ term: term }, {
        $pull: { preferences: { user: user._id } }
    })

    // let updatedShifts = await Shift.collection.updateMany({ term: term }, [
    //     { $set: { preferences: { 
    //         $filter: {
    //             input: "$preferences", 
    //             as: "prefs", 
    //             cond: { $ne: ["$prefs.user", user._id] }
    //         }
    //     } } }
    // ])

    res.sendStatus(200);
}

const scheduleUser = async (req, res) => {
    let term = req.body.term;

    if (!(await checkTerm(term))) {
        res.send({ success: false, message: "Term does not exist." });
    }

    let day = req.body.day;
    let hour = req.body.hour;

    if (!day || !hour) {
        res.send({ success: false, message: "Need day and hour." });
    }

    // Find user
    let netid = req.body.netid;
    
    let user;
    if (!(await checkUser(netid))) {
        res.send({ success: false, message: "User does not exist." });
    } else {
        user = await User.findOne({ netid: netid });
    }

    // Schedule user for the given shift
    await Shift.updateOne(
        { term: term, day: day, hour: hour, "preferences.user": user._id },
        { $set: { "preferences.$.scheduled": true } }
    )

    res.sendStatus(200);
}

const unscheduleUser = async (req, res) => {
    let term = req.body.term;

    if (!(await checkTerm(term))) {
        res.send({ success: false, message: "Term does not exist." });
    }

    let day = req.body.day;
    let hour = req.body.hour;

    if (!day || !hour) {
        res.send({ success: false, message: "Need day and hour." });
    }

    // Find user
    let netid = req.body.netid;
    
    let user;
    if (!(await checkUser(netid))) {
        res.send({ success: false, message: "User does not exist." });
    } else {
        user = await User.findOne({ netid: netid });
    }

    // Schedule user for the given shift
    await Shift.updateOne(
        { term: term, day: day, hour: hour, "preferences.user": user._id },
        { $set: { "preferences.$.scheduled": false } }
    )

    res.sendStatus(200);
}

const updateUserAvailability = async (req, res) => {
    let term = req.body.term;

    if (!(await checkTerm(term))) {
        res.send({ success: false, message: "Term does not exist." });
    }

    let day = req.body.day;
    let hour = req.body.hour;

    if (!day || !hour) {
        res.send({ success: false, message: "Need day and hour." });
    }

    let preference = req.body.preference;
    if (!preference || preference < 1 || preference > 4) {
        res.send({ success: false, message: "Preference needed." });
    }

    // Find user
    let netid = req.body.netid;
    
    let user;
    if (!(await checkUser(netid))) {
        res.send({ success: false, message: "User does not exist." });
    } else {
        user = await User.findOne({ netid: netid });
    }

    // Set availability of user for the given shift
    await Shift.updateOne(
        { term: term, day: day, hour: hour, "preferences.user": user._id },
        { $set: { "preferences.$.preference": preference } }
    )

    res.sendStatus(200);
}

router.get('/', getSchedule)
router.get('/hours/:netid', getHourTotal);
router.get('/scheduled/:netid', getScheduledShifts);
router.post('/', createTermSchedule)
router.put('/addUser', addUserToTerm)
router.put('/scheduleUser', scheduleUser);
router.put('/unscheduleUser', unscheduleUser);
router.put('/updateAvailability', updateUserAvailability);
router.delete('/removeUser', removeUserFromTerm);
// router.put('/shift/:day?/:hour?', addUserToShift)
// router.delete('/schedule/shift/:day?/:hour?', removeUserFromShift)

module.exports = router;
