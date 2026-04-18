export {};
// ============================================
// CRUD SERVER Exercise
// ============================================
// Run this file with: npx ts-node src/04-backend/lessons/02-http-and-rest/exercises/crud-server.ts
//
// Build a CRUD REST API for "items" using only Node's built-in http module.
// Each item has: { id: number, name: string, price: number, createdAt: string }

import * as http from 'node:http';

const PORT = 3000;

interface Item {
  id: number;
  name: string;
  price: number;
  createdAt: string;
}

let nextId = 1;
const items: Item[] = [];
void nextId; void items; // Will be used when you implement the TODOs

// TODO 1: Implement a helper function to parse JSON body from a request
// function parseBody(req: http.IncomingMessage): Promise<unknown> { ... }
// Hint: collect chunks with req.on('data'), parse JSON in req.on('end')

// TODO 2: Implement a helper function to send a JSON response
// function sendJson(res: http.ServerResponse, statusCode: number, data?: unknown): void { ... }
// - Set Content-Type to application/json
// - If data is undefined (for 204), send no body

// TODO 3: Implement the server with the following endpoints:
//
// GET /api/items
//   → 200 with array of all items
//
// GET /api/items/:id
//   → 200 with the item
//   → 404 if not found
//
// POST /api/items
//   → Parse body, validate that 'name' (string) and 'price' (number) are present
//   → 400 if validation fails (return { error: "..." } explaining what's missing)
//   → 201 with the created item + Location header
//
// PUT /api/items/:id
//   → Parse body, validate 'name' and 'price'
//   → Replace the item entirely (keep original id and createdAt)
//   → 200 with updated item
//   → 400 if validation fails
//   → 404 if not found
//
// DELETE /api/items/:id
//   → 204 on success (no body)
//   → 404 if not found
//
// Any other route → 404 { error: "Not Found" }
//
// Requirements:
// - Extract :id from URL using regex or string parsing
// - Log each request: "<METHOD> <URL> → <STATUS>"
// - Handle JSON parse errors gracefully (return 400)

const server = http.createServer(async (_req, _res) => {
  // Your code here
});

server.listen(PORT, () => {
  console.log(`CRUD server running at http://localhost:${PORT}`);
  console.log('\nTest with:');
  console.log(`  curl http://localhost:${PORT}/api/items`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/items -H "Content-Type: application/json" -d '{"name":"Laptop","price":999}'`);
  console.log(`  curl http://localhost:${PORT}/api/items/1`);
  console.log(`  curl -X PUT http://localhost:${PORT}/api/items/1 -H "Content-Type: application/json" -d '{"name":"Laptop Pro","price":1299}'`);
  console.log(`  curl -X DELETE http://localhost:${PORT}/api/items/1`);
});
