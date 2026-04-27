// ============================================
// NODE.JS HTTP SERVER Exercise
// ============================================
// Run this file with: npx ts-node src/04-backend/lessons/01-nodejs-and-npm/exercises/server.ts
//
// This exercise goes beyond the basic example — you'll build a mini notes API
// with in-memory storage, POST body parsing, and URL query parameters.
// These are real skills you'll need for every backend you build.

import * as http from 'node:http';

const PORT = 3000;

// In-memory storage for notes
interface Note {
  id: number;
  text: string;
  createdAt: string;
}

const notes: Note[] = [];
let nextId = 1;

// TODO: Implement a helper that reads the request body and parses it as JSON.
//
// The `http` module gives you the body as a stream of chunks, not a single string.
// You need to collect all chunks, concatenate them, and then JSON.parse().
//

function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function send(res: http.ServerResponse, status: number, body: unknown): void {
  res.writeHead(status);
  res.end(JSON.stringify(body));
}

// Test with:
//   curl http://localhost:3000/health
//   curl http://localhost:3000/notes
//   curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" -d '{"text":"Buy milk"}'
//   curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" -d '{"text":"Learn Node.js"}'
//   curl http://localhost:3000/notes?search=milk
//   curl -X DELETE http://localhost:3000/notes/1
//   curl http://localhost:3000/notes

const server = http.createServer(async (req, res) => {
  const { method, url = '/' } = req;
  console.log(`${method} ${url}`);
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url === '/health') {
    return send(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
  }

  if (method === 'GET' && url.startsWith('/notes')) {
    const { searchParams } = new URL(url, 'http://localhost');
    const search = searchParams.get('search')?.toLowerCase() ?? '';
    const result = search ? notes.filter((n) => n.text.toLowerCase().includes(search)) : notes;
    return send(res, 200, result);
  }

  if (method === 'POST' && url === '/notes') {
    try {
      const body = (await parseBody(req)) as Record<string, unknown>;
      if (typeof body['text'] !== 'string' || !body['text'].trim()) {
        return send(res, 400, { error: 'text is required' });
      }
      const note: Note = { id: nextId++, text: body['text'], createdAt: new Date().toISOString() };
      notes.push(note);
      return send(res, 201, note);
    } catch {
      return send(res, 400, { error: 'Invalid JSON' });
    }
  }

  if (method === 'DELETE' && url.startsWith('/notes/')) {
    const id = Number(url.split('/')[2]);
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) return send(res, 404, { error: 'Note not found' });
    notes.splice(index, 1);
    return send(res, 200, { deleted: true });
  }

  send(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
