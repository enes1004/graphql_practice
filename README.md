# GraphQL Practice

A sample GraphQL API built with Node.js and Express for practicing GraphQL queries and mutations.

Reference: https://graphql.org/graphql-js/

## Features

- **User Management**: Complete CRUD operations for users
- **GraphQL Queries**: Fetch all users or specific user by ID  
- **GraphQL Mutations**: Create, update, and delete users
- **Interactive GraphQL IDE**: Built-in GraphQL playground using Ruru
- **Sample Data**: Pre-loaded with sample users for testing

## Quick Start

### 1. Install Dependencies
```sh
npm install
```

### 2. Start API Server
```sh
node server.js
```

### 3. Open GraphQL Playground
Navigate to: http://localhost:4000

GraphQL Endpoint: http://localhost:4000/graphql

## API Schema

### Types

```graphql
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
```

### Queries

```graphql
# Get all users
query {
  users {
    id
    name
    email
    createdAt
  }
}

# Get specific user by ID
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    createdAt
  }
}

# Simple hello query
query {
  hello
}
```

### Mutations

```graphql
# Create a new user
mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    id
    name
    email
    createdAt
  }
}

# Update existing user
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    email
    createdAt
  }
}

# Delete user
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

## Sample Data

The API comes pre-loaded with sample users:
- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)  
- Charlie Brown (charlie@example.com)

## Testing with Postman

Import the Postman collection from `postman/graphql_practice.postman_collection.json` to get started with pre-configured requests.

The collection includes:
- **Queries**: Hello, Get All Users, Get User by ID
- **Mutations**: Create User, Update User, Delete User

## Example Usage

### Using cURL

```sh
# Get all users
curl -X POST -H "Content-Type: application/json" \
  -d '{"query": "{ users { id name email } }"}' \
  http://localhost:4000/graphql

# Create a new user
curl -X POST -H "Content-Type: application/json" \
  -d '{"query": "mutation { createUser(input: {name: \"John Doe\", email: \"john@example.com\"}) { id name email } }"}' \
  http://localhost:4000/graphql
```

### Using JavaScript (fetch)

```javascript
// Fetch all users
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `{
      users {
        id
        name
        email
        createdAt
      }
    }`
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Development

The API uses in-memory storage, so data will be reset each time the server restarts. This is perfect for testing and learning GraphQL concepts without the complexity of a database setup.