const { gql } = require("apollo-server");

const typeDefs = gql`
  type Location {
    name: String!
    url: String!
  }
  type Origin {
    name: String!
    url: String!
  }
  type Person {
    id: ID!
    name: String!
    status: String!
    species: String!
    type: String!
    gender: String!
    origin: Origin!
    location: Location!
    image: String!
    episode: [String]!
    url: String!
    created: String!
  }

  type Query {
    characters(page: Int, limit: Int): [Person!]!
    character(id: Int!): Person!
    ricks(page: Int, limit: Int): [Person!]!
    mortys(page: Int, limit: Int): [Person!]
    upload(image: String!): String
  }

  type Mutation {
    createPerson(name: String!, location: String!, image: String!): Person!
    deletePerson(id: Int!): Person
    updatePerson(
      id: Int!
      name: String
      location: String
      image: String
    ): Person!
  }
`;

module.exports = typeDefs;
