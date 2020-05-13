var express = require('express');
var router = express.Router();

const User = require("../models/usersModel").user;

let { SERVICE_URL } = require("../config");

/* GET home page. */
router.get('/service', function(req, res, next) {
    res.send(SERVICE_URL);
});

// router.put('/pushRecentUpdate', async (req, res, next) => {
// 	await User.update({}, { $set: { recentUpdate: true } }, { multi: true });
// 	res.sendStatus(200);
// })

module.exports = router;
