const { ApolloServer, gql } = require("apollo-server");
const typeDefs = require("./schema/type-defs");
const { resolvers } = require("./schema/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
