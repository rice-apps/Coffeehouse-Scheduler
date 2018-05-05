// This is how we use GraphQL & Express together
const { GraphQLServer } = require('graphql-yoga')
// This is how we can use Prisma for context
const { Prisma } = require('prisma-binding')

// Defines our resolvers, or the actions/methods we can use to
// interact with schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      // context.db -- db is a prisma binding which turns the prisma db into
      // invokable javascript functions
      // context.db.query -- makes a query
      // context.db.query.links -- accesses array of Link objects
      // first parameter ({}) would contain variables
      // second parameter forwards along the selectionset info
      return context.db.query.links({}, info)
    },
  },
  Mutation: {
    /*
    Inputs
      root: Link object that you're creating, which is what this mutation returns
      args: object containing args specified in schema (url, description)
      context: allows resolvers to communicate with each other; able to pass data
      and functions to the resolvers
      info: carries info on the incoming GraphQL query
    */
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
  },
}


// Initializes server based on schema, resolvers, context (prisma-bindings)
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/public-flameloon-112/hackernews-node/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
// Starts server
server.start(() => console.log(`Server is running on http://localhost:4000`))
