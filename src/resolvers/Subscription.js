function newLinkSubscribe (parent, args, context, info) {
  // Prisma Binding that proxies subscriptions in Prisma API
  return context.db.subscription.link(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

function newVoteSubscribe (parent, args, context, info) {
  return context.db.subscription.vote(
    { where: { mutation_in: ['CREATED'] } },
    info
  )
}

// Necessary: must wrap the function as value of subscribe in an object
const newLink = {
  subscribe: newLinkSubscribe
}

const newVote = {
  subscribe: newVoteSubscribe
}

module.exports = {
  newLink,
  newVote
}
