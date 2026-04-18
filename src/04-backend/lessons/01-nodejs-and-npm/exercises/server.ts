export {};
// ============================================
// NODE.JS HTTP SERVER Exercise
// ============================================
// Run this file with: npx ts-node src/04-backend/lessons/01-nodejs-and-npm/exercises/server.ts

import * as http from 'node:http';

const PORT = 3000;

// TODO: Create an HTTP server that handles the following:
//
// 1. GET /health
//    - Respond with status 200
//    - Body: JSON { status: "ok", timestamp: <current ISO timestamp> }
//    - Content-Type: application/json
//
// 2. GET /info
//    - Respond with status 200
//    - Body: JSON { nodeVersion: process.version, uptime: process.uptime() }
//    - Content-Type: application/json
//
// 3. Any other route
//    - Respond with status 404
//    - Body: JSON { error: "Not Found" }
//
// Requirements:
// - Use http.createServer()
// - Parse req.method and req.url for routing
// - Always set Content-Type to application/json
// - Listen on PORT (3000)
// - Log each incoming request to console: "<METHOD> <URL>"
//
// Test with:
//   curl http://localhost:3000/health
//   curl http://localhost:3000/info
//   curl http://localhost:3000/anything-else

// Your code here:

console.log('Exercise: implement the HTTP server above and start it.');
