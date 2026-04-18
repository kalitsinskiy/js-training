export {};
// ============================================
// HTTP METHODS Example — In-Memory CRUD Server
// ============================================
// Run this file with: npx ts-node src/04-backend/lessons/02-http-and-rest/examples/http-methods.ts
//
// Then test with:
//   curl http://localhost:3000/api/items
//   curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d '{"name":"Book"}'
//   curl -X PUT http://localhost:3000/api/items/1 -H "Content-Type: application/json" -d '{"name":"Updated Book"}'
//   curl -X DELETE http://localhost:3000/api/items/1

import * as http from 'node:http';

const PORT = 3000;

// --- In-memory store ---
interface Item {
  id: number;
  name: string;
  createdAt: string;
}

let nextId = 1;
const items: Item[] = [];

// --- Helpers ---
function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: http.ServerResponse, statusCode: number, data: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function extractId(url: string): number | null {
  const match = url.match(/^\/api\/items\/(\d+)$/);
  return match ? parseInt(match[1]!, 10) : null;
}

// --- Server ---
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);

  try {
    // GET /api/items — list all items
    if (method === 'GET' && url === '/api/items') {
      sendJson(res, 200, items);
      return;
    }

    // GET /api/items/:id — get one item
    if (method === 'GET' && url?.startsWith('/api/items/')) {
      const id = extractId(url);
      const item = items.find((i) => i.id === id);
      if (!item) {
        sendJson(res, 404, { error: 'Item not found' });
        return;
      }
      sendJson(res, 200, item);
      return;
    }

    // POST /api/items — create an item
    if (method === 'POST' && url === '/api/items') {
      const body = await parseBody(req) as { name?: string };
      if (!body.name) {
        sendJson(res, 400, { error: 'name is required' });
        return;
      }
      const item: Item = {
        id: nextId++,
        name: body.name,
        createdAt: new Date().toISOString(),
      };
      items.push(item);
      // 201 Created + Location header pointing to the new resource
      res.writeHead(201, {
        'Content-Type': 'application/json',
        'Location': `/api/items/${item.id}`,
      });
      res.end(JSON.stringify(item));
      return;
    }

    // PUT /api/items/:id — replace an item entirely
    if (method === 'PUT' && url?.startsWith('/api/items/')) {
      const id = extractId(url!);
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) {
        sendJson(res, 404, { error: 'Item not found' });
        return;
      }
      const body = await parseBody(req) as { name?: string };
      if (!body.name) {
        sendJson(res, 400, { error: 'name is required' });
        return;
      }
      // PUT replaces the entire resource (keeps id and createdAt)
      items[index] = { id: items[index]!.id, createdAt: items[index]!.createdAt, name: body.name };
      sendJson(res, 200, items[index]);
      return;
    }

    // DELETE /api/items/:id — remove an item
    if (method === 'DELETE' && url?.startsWith('/api/items/')) {
      const id = extractId(url!);
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) {
        sendJson(res, 404, { error: 'Item not found' });
        return;
      }
      items.splice(index, 1);
      // 204 No Content — success, nothing to return
      res.writeHead(204);
      res.end();
      return;
    }

    // Fallback
    sendJson(res, 404, { error: 'Not Found' });
  } catch (err) {
    console.error('Error:', err);
    sendJson(res, 500, { error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Methods demo server running at http://localhost:${PORT}`);
  console.log('\nTry these commands:');
  console.log(`  curl http://localhost:${PORT}/api/items`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/items -H "Content-Type: application/json" -d '{"name":"Book"}'`);
  console.log(`  curl http://localhost:${PORT}/api/items/1`);
  console.log(`  curl -X PUT http://localhost:${PORT}/api/items/1 -H "Content-Type: application/json" -d '{"name":"Updated Book"}'`);
  console.log(`  curl -X DELETE http://localhost:${PORT}/api/items/1`);
  console.log('\nPress Ctrl+C to stop');
});
