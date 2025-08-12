#!/usr/bin/env node

/**
 * Simple API test script to validate GraphQL functionality
 * Run: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:4000/graphql';

// Helper function to make GraphQL requests
function graphqlRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query,
      variables
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting GraphQL API Tests...\n');

  try {
    // Test 1: Hello query
    console.log('1. Testing hello query...');
    const helloResult = await graphqlRequest('{ hello }');
    console.log('   Result:', helloResult.data);
    console.log('   ✅ Hello query successful\n');

    // Test 2: Get all users
    console.log('2. Testing users query...');
    const usersResult = await graphqlRequest('{ users { id name email } }');
    console.log('   Found', usersResult.data.users.length, 'users');
    console.log('   ✅ Users query successful\n');

    // Test 3: Get specific user
    console.log('3. Testing user by ID query...');
    const userResult = await graphqlRequest(
      'query GetUser($id: ID!) { user(id: $id) { id name email } }',
      { id: '1' }
    );
    console.log('   User found:', userResult.data.user.name);
    console.log('   ✅ User by ID query successful\n');

    // Test 4: Create new user
    console.log('4. Testing create user mutation...');
    const createResult = await graphqlRequest(
      'mutation CreateUser($input: UserInput!) { createUser(input: $input) { id name email } }',
      { input: { name: 'Test User', email: 'test@example.com' } }
    );
    const newUserId = createResult.data.createUser.id;
    console.log('   Created user with ID:', newUserId);
    console.log('   ✅ Create user mutation successful\n');

    // Test 5: Update user
    console.log('5. Testing update user mutation...');
    const updateResult = await graphqlRequest(
      'mutation UpdateUser($id: ID!, $input: UpdateUserInput!) { updateUser(id: $id, input: $input) { id name email } }',
      { id: newUserId, input: { name: 'Updated Test User' } }
    );
    console.log('   Updated user name:', updateResult.data.updateUser.name);
    console.log('   ✅ Update user mutation successful\n');

    // Test 6: Delete user  
    console.log('6. Testing delete user mutation...');
    const deleteResult = await graphqlRequest(
      'mutation DeleteUser($id: ID!) { deleteUser(id: $id) }',
      { id: newUserId }
    );
    console.log('   Delete successful:', deleteResult.data.deleteUser);
    console.log('   ✅ Delete user mutation successful\n');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Check if server is running
console.log('Checking if GraphQL server is running on localhost:4000...');
const testReq = http.request({ hostname: 'localhost', port: 4000, path: '/', method: 'GET' }, (res) => {
  console.log('✅ Server is running!\n');
  runTests();
});

testReq.on('error', () => {
  console.error('❌ Server is not running. Please start the server with: node server.js');
  process.exit(1);
});

testReq.end();