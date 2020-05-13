var express = require('express');
var router = express.Router();
// var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
// var https = require('https');
var request = require('request');
var xmlParser = require('xml2js').parseString;
var stripPrefix = require('xml2js').processors.stripPrefix;
var config = require('../config');

var User = require('../models/usersModel').user;

const getOrCreateToken = async (user) => {
    // Verify token
    return jwt.verify(user.token, config.secret, async (err, decoded) => {
        console.log(decoded);
        let token;
        if (err) {
            // Create token
            token = jwt.sign({
                id: user._id,
                netid: user.netid
            }, config.secret, { expiresIn: 129600 });
            
            // Save token with user
            user.token = token;
            await user.save();
        } else {
            token = user.token;
        }
        return token;
    })
}

var sendJSON = function (res, user, token) {
    // send our token to the frontend! now, whenever the user tries to access a resource, we check their
    // token by verifying it and seeing if the payload (the username) allows this user to access
    // the requested resource.
    // res.status(200).json({success: true, message: 'CAS Authentication Succeeded', user: {netid: username, token: token}});
    res.json({
        success: true,
        message: 'CAS authentication success',
        user,
        token
    });
};

/**
 * After the browser is redirected by the IDP, the frontend takes the ticket off the URL and sends a GET
 * request to the backend, here, with the ticket as a query parameter. Here, we validate the ticket against
 * the CAS server and then parse the response to see if we succeeded, and let the frontend know.
 */
const getAuth = (req, res) => {
    // Fetch ticket securely from custom header
    var ticket = req.get('X-Ticket');

    // Convert to string
    ticket = String(ticket);

    if (ticket) {
        // validate our ticket against the CAS server
        var url = `${config.CASValidateURL}?ticket=${ticket}&service=${config.SERVICE_URL}`;
        request(url, (err, response, body) => {

            if (err) res.status(500).send();
            // parse the XML.
            // notice the second argument - it's an object of options for the parser, one to strip the namespace
            // prefix off of tags and another to prevent the parser from creating 1-element arrays.
            xmlParser(body, {
                tagNameProcessors: [stripPrefix],
                explicitArray: false
            }, function (err, result) {
                if (err) return res.status(500);
                serviceResponse = result.serviceResponse;
                var authSucceded = serviceResponse.authenticationSuccess;
                if (authSucceded) {
                    // see if this netID exists as a user already. if not, create one.
                    // Assume authSucceded.user is the netid
                    User.findOne({netid: authSucceded.user}, async function (err, returnedUser) {
                        if (err) return res.status(500);

                        let user;
                        if (!returnedUser) {
                            // Create user
                            user = await createUser(netid);
                        } else {
                            user = returnedUser;
                        }
                        
                        // Check if user has a token; if not, create for them
                        getOrCreateToken(user).then(token => {
                            sendJSON(res, user, token);
                            // res.json({ token, user });
                        })
                    });
                } else if (serviceResponse.authenticationFailure) {
                    res.status(401).json({success: false, message: 'CAS authentication failed'});
                } else {
                    res.status(500).send();
                }
            })
        })
    } else {
        return res.status(400).send();
    }
}

const getVerify = (req, res) => {
    // Get token from header
    let token = req.get('X-Token');

    return jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            res.json({ success: false, message: "Nope.", user: {} });
        } else {
            // Get user object
            let user = await User.findById(decoded.id);
            res.json({ success: true, message: "Enter.", user: user });
        }
        return;
    })
}

// Routes
router.get('/login', getAuth);
router.get('/verify', getVerify);

module.exports = router;
