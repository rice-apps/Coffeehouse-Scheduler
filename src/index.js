// This is how we use GraphQL & Express together
const { GraphQLServer } = require('graphql-yoga')

// Defines our schema, will be turned into its own file soon
const typeDefs = `
type Query {
  info: String!
}
`
// const typeDefs = './src/schema.graphql';

// Defines our resolvers, or the actions/methods we can use to
// interact with schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
}

// Initializes server based on schema & resolvers
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})
// Starts server
server.start(() => console.log(`Server is running on http://localhost:4000`))
