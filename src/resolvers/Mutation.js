const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

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
  deleteUser
}
