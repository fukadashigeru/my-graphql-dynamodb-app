export const typeDefs = /* GraphQL */ `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    age: Int
    isActive: Boolean!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    email: String!
    name: String!
    age: Int
    isActive: Boolean
    role: String!
  }

  input UpdateUserInput {
    email: String
    name: String
    age: Int
    isActive: Boolean
    role: String
  }

  type Query {
    listUsers(limit: Int): [User!]!
    getUser(id: ID!): User
    getUserByEmail(email: String!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
