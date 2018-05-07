const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var request = require('request');
var xmlParser = require('xml2js').parseString;
var config = require('../config');
const { APP_SECRET, DAYS_OF_WEEK, getUserId } = require('../utils')

// User Mutations
async function createUser(parent, args, context, info) {
  return context.db.mutation.createUser({
    data: { ...args }
  }, info)
}

async function updateUser(parent, args, context, info) {
  // Using Prisma Binding to retrieve existing user from db who has this email
  let user = await context.db.query.user({ where: { netid: args.netid } }, ` { id } `)
  if (!user) {
    throw new Error('No such user found')
  }

  // const updatedProperties = {}

  // Iterate through args, set updatedProperties to updated values
  for (var arg in args.keys) {
    // updatedProperties[arg] = args[arg]
    let argVal = args[arg]
    user = {...user, [arg]: argVal}
  }

  //
  return context.db.mutation.updateUser({
    data: {...user}
  }, info)
}

function deleteUser(parent, args, context, info) {
  return context.db.mutation.deleteUser({
    where: {netid: args.netid}
  }, info)
}

// Login Process
async function login(parent, args, context, info) {
  // 1: Validate ticket against CAS Server
  var url = `${config.CASValidateURL}?ticket=${args.ticket}&service=${config.thisServiceURL}`;
  return await request(url, (err, response, body) => {
    if (err) return {};
    // 2: Parse XML
    return xmlParser(body, {
                tagNameProcessors: [stripPrefix],
                explicitArray: false
            }, async (err, result) => {
              if (err) return {};
              serviceResponse = result.serviceResponse;
              var authSucceded = serviceResponse.authenticationSuccess;
              // 3: Check if authentication succeeded
              if (authSucceded) {
                // 4: Check if user authenticated exists in our DB
                const existingUser = await context.db.query.users({
                  netid: authSucceded.user
                }, `{ id }`)
                if (existingUser) {
                  var token = jwt.sign({
                    data: authSucceded,
                    userID: existingUser.id
                  }, config.secret)
                  return token
                }
                else {
                  const newUser = await context.db.mutation.createUser({
                    data: { netid: authSucceded.user }
                  }, `{ id }`)
                  var token = jwt.sign({
                    data: authSucceded,
                    userID: newUser.id
                  }, config.secret)
                  return token
                }
              }
            });
          })
}

// Schedule Mutations
async function createSchedule(parent, args, context, info) {
  // Build Week
  const schedule = await context.db.mutation.createSchedule({
    data: { ...args }
  }, `{ id }`)
  // Build Days
  let dayObjects = []
  for (var i in DAYS_OF_WEEK) {
    var dayName = DAYS_OF_WEEK[i]
    dayObjects.push(context.db.mutation.createDay({
      data: { dayName }
    }, `{ id dayName shifts { id } }`))
  }
  // Wait for everything to build
  dayObjects = await Promise.all(dayObjects)
  // Build Shifts in each day
  let allShifts = []
  for (i in dayObjects) {
    // Shift Array for this specific day
    let dayShifts = []
    // M-Th: iterate through hours 7am - midnight as starttimes of shifts
    if (i < 4) {
      var startTime = 7;
      var finalStartTime = 24;
    }
    // Friday: iterate through hours 7am - 5pm
    else if (i == 4) {
      var startTime = 7;
      var finalStartTime = 17;
    }
    // Saturday: iterate through hours 10am - 5pm
    else if (i == 5) {
      var startTime = 10;
      var finalStartTime = 17;
    }
    // Sunday: iterate through hours 2pm - midnight
    else if (i == 6) {
      var startTime = 14;
      var finalStartTime = 24;
    }
    for (startTime; startTime <= finalStartTime; startTime++) {
      // Each shift is 1 hour long
      var endTime = startTime + 1;
      // Create shift object
      var shift = context.db.mutation.createShift({
        data: { startTime, endTime }
      }, `{ id }`);
      // Add shift to list of shifts for day
      dayShifts.push(shift);
    }
    // Add array of day's shifts to array of all shifts
    allShifts.push(dayShifts);
  }
  // Wait for all shifts to Build (in a parallel batch)
  allShifts = await Promise.all(allShifts.map((shiftArray) => Promise.all(shiftArray)));
  // Attach each shift array to its respective day
  let dayUpdates = [];
  // i is integer; index of dayObjects corresponds to index of allShifts
  for (i in dayObjects) {
    // Get Shift Objects by Id (since createShift doesn't return actual shift objects,
    // which the following mutation needs)
    // dayShifts = []
    // for (let shift in allShifts[i]) {
    //   dayShifts.push(context.db.query.shifts({
    //     where: { id: allShifts[i][shift]}
    //   }))
    // }
    dayUpdates.push(context.db.mutation.updateDay({
      data: {
        shifts: { connect: allShifts[i] }
      },
      where: { id: dayObjects[i].id }
    }, `{ id }`));
  }
  // Wait for all days to be updated with new shifts
  dayUpdates = await Promise.all(dayUpdates)
  console.log(dayUpdates);
  // Add days to week
  return context.db.mutation.updateSchedule({
    data: {
      week: { connect: dayUpdates }
    },
    where: { id: schedule.id }
  }, info);
  // return {
  //   schedule
  // }
}

/*
Inputs
  parent: Same as root
  args: object containing args specified in schema (url, description)
  context: allows resolvers to communicate with each other; able to pass data
  and functions to the resolvers
  info: carries info on the incoming GraphQL query
*/
// async function signup(parent, args, context, info) {
//   // Encrypts user's password
//   const password = await bcrypt.hash(args.password, 10)
//   // Creates user in the Prisma DB using a binding, and hardcodes 'id' into
//   // selection set so that users can't access other fields (like password)
//   const user = await context.db.mutation.createUser({
//     data: { ...args, password },
//   }, `{ id }`)
//
//   // Signed JWT with APP_SECRET
//   const token = jwt.sign({ userId: user.id }, APP_SECRET)
//
//   return {
//     token,
//     user,
//   }
// }
//
// async function login(parent, args, context, info) {
//   // Using Prisma Binding to retrieve existing user from db who has this email
//   const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `)
//   if (!user) {
//     throw new Error('No such user found')
//   }
//
//   // Validates user submitted password to the one stored
//   const valid = await bcrypt.compare(args.password, user.password)
//   if (!valid) {
//     throw new Error('Invalid password')
//   }
//
//   // Creates signed JWT
//   const token = jwt.sign({ userId: user.id }, APP_SECRET)
//
//   return {
//     token,
//     user,
//   }
// }
//
// function post(parent, args, context, info) {
//   // Uses our helper functiont to verify user
//   const userId = getUserId(context)
//   // Uses our prisma binding mutation
//   return context.db.mutation.createLink(
//     {
//       data: {
//         url: args.url,
//         description: args.description,
//         // connect creates a relation between user & link
//         postedBy: { connect: { id: userId } },
//       },
//     },
//     info,
//   )
// }
//
// async function vote(parent, args, context, info) {
//   // Validation of user
//   const userId = getUserId(context)
//
//   // Check if the user has already voted
//   const linkExists = await context.db.exists.Vote({
//     user: { id: userId },
//     // Link ID is an arg from schema
//     link: { id: args.linkId },
//   })
//   if (linkExists) {
//     throw new Error(`Already voted for link: ${args.linkId}`)
//   }
//
//   // If user hasn't already voted, create a vote object
//   return context.db.mutation.createVote(
//     {
//       data: {
//         // Associate UserID and LinkID to Vote
//         user: { connect: { id: userId } },
//         link: { connect: { id: args.linkId } },
//       },
//     },
//     info,
//   )
// }
//
// module.exports = {
//     signup,
//     login,
//     post,
//     vote
// }

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  createSchedule
}
