// backend/src/schema/typeDefs.ts
export const typeDefs = /* GraphQL */ `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    age: Int
    isActive: Boolean!
    role: String!
    hoge: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    email: String!
    name: String!
    age: Int
    isActive: Boolean
    role: String!
    hoge: String
  }

  input UpdateUserInput {
    email: String
    name: String
    age: Int
    isActive: Boolean
    role: String
  }

  type Task {
    id: ID!
    title: String!
    content: String
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTaskInput {
    title: String!
    content: String
    completed: Boolean
  }

  input UpdateTaskInput {
    title: String
    content: String
    completed: Boolean
  }


  type Query {
    listUsers(limit: Int): [User!]!
    getUser(id: ID!): User
    getUserByEmail(email: String!): User
    listTasks: [Task!]!
    getTask(id: ID!): Task
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;
