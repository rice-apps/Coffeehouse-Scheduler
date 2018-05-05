// This is how we use GraphQL & Express together
const { GraphQLServer } = require('graphql-yoga')

// For resolver
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length
// Defines our resolvers, or the actions/methods we can use to
// interact with schema
const resolvers = {
  // Available query methods (essentially GET requests)
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (root, args) => links.find((link) => link.id == args.id)
    // link(id: ID!): Link
  },
  // These methods can change our data
  Mutation: {
    /*
    Inputs
      root: Link object that you're creating, which is what this mutation returns
      args: object containing args specified in schema (url, description)
    */
    post: (root, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (root, args) => {
      // Find existing link
      var curLink = links.find((link) => link.id == args.id)
      if (args.url != null)
        curLink.url = args.url
      if (args.description != null)
        curLink.description = args.description
      return curLink
    },
    deleteLink: (root, args) => {
      // Find existing link index
      const linkIndex = links.findIndex((link) => link.id == args.id);
      // Get existing link to return
      const formerLink = links[linkIndex]
      links.splice(linkIndex, 1);
      return formerLink
    }
  },
}

// Initializes server based on schema & resolvers
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
// Starts server
server.start(() => console.log(`Server is running on http://localhost:4000`))
