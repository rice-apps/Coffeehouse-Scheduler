const Shift = require('../models/shiftsModel').shift;
const User = require('../models/usersModel').user;

/**
 * Check if a term has shifts; that is, if a schedule exists for a term.
 * @param {*} term 
 */
const checkTerm = async (term) => {
    let exists = await Shift.exists({ term: term });
    return exists;
}

/*
Call: Helper function checkUser(jhw5)
Effect: checks whether IDP logged user is in DB
Input: users NetId
Output: whether user is in our DB or not
test: jhw5 has 27 instances.
*/
const checkUser = async (netid) => {
    let exists = await User.exists({ netid: netid });
    return exists;
}

module.exports = {
    checkTerm,
    checkUser
}