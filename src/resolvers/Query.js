function feed(parent, args, context, info) {
  const where = args.filter
    ? {
      // Similar to a real GraphQL query; can explore options using Schema API in Playground
        OR: [
          { url_contains: args.filter },
          { description_contains: args.filter },
        ],
      }
    : {}

  return context.db.query.links({ where }, info)
}

module.exports = {
  feed,
}
