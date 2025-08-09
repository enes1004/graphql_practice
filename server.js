var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")

// Sample data storage (in-memory)
var users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    name: "Bob Smith",
    email: "bob@example.com",
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "3",
    name: "Charlie Brown", 
    email: "charlie@example.com",
    createdAt: "2024-01-17T09:15:00Z"
  }
]

var nextUserId = 4

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  input UserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean!
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!"
  },
  users: () => {
    return users
  },
  user: ({ id }) => {
    return users.find(user => user.id === id)
  },
  createUser: ({ input }) => {
    // Input validation
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name is required and cannot be empty')
    }
    if (!input.email || input.email.trim() === '') {
      throw new Error('Email is required and cannot be empty')
    }
    if (!input.email.includes('@')) {
      throw new Error('Email must be a valid email address')
    }

    // Check for duplicate email
    if (users.find(user => user.email === input.email)) {
      throw new Error('User with this email already exists')
    }

    const newUser = {
      id: nextUserId.toString(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    nextUserId++
    return newUser
  },
  updateUser: ({ id, input }) => {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    // Validation for update inputs
    if (input.name !== undefined && input.name.trim() === '') {
      throw new Error('Name cannot be empty')
    }
    if (input.email !== undefined) {
      if (input.email.trim() === '') {
        throw new Error('Email cannot be empty')
      }
      if (!input.email.includes('@')) {
        throw new Error('Email must be a valid email address')
      }
      // Check for duplicate email (excluding current user)
      const existingUser = users.find(user => user.email === input.email && user.id !== id)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.email !== undefined && { email: input.email.trim().toLowerCase() })
    }
    users[userIndex] = updatedUser
    return updatedUser
  },
  deleteUser: ({ id }) => {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    users.splice(userIndex, 1)
    return true
  }
}

var app = express()

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

// Start the server at port
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")