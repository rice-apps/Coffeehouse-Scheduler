// This is how we use GraphQL & Express together
const { GraphQLServer } = require('graphql-yoga')

// Defines our resolvers, or the actions/methods we can use to
// interact with schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
}

// Initializes server based on schema & resolvers
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
// Starts server
server.start(() => console.log(`Server is running on http://localhost:4000`))
