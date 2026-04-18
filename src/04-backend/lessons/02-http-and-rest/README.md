# HTTP & REST

## Quick Overview

HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web. REST (Representational State Transfer) is an architectural style for designing APIs on top of HTTP. Together, they define how clients and servers exchange data.

## Key Concepts

### HTTP Request Structure

```
POST /api/users HTTP/1.1          ← method, path, protocol
Host: example.com                  ← headers
Content-Type: application/json
Authorization: Bearer eyJhbG...

{                                  ← body
  "name": "Alice",
  "email": "alice@example.com"
}
```

### HTTP Response Structure

```
HTTP/1.1 201 Created              ← protocol, status code, reason phrase
Content-Type: application/json
Location: /api/users/42

{                                  ← body
  "id": 42,
  "name": "Alice",
  "email": "alice@example.com"
}
```

### HTTP Methods

| Method | Purpose | Has Body? | Idempotent? | Safe? |
|--------|---------|-----------|-------------|-------|
| GET | Read a resource | No | Yes | Yes |
| POST | Create a resource | Yes | No | No |
| PUT | Replace a resource entirely | Yes | Yes | No |
| PATCH | Partially update a resource | Yes | No* | No |
| DELETE | Remove a resource | Rarely | Yes | No |
| HEAD | GET without body (metadata only) | No | Yes | Yes |
| OPTIONS | Describe communication options | No | Yes | Yes |

*PATCH can be made idempotent but is not required to be.

**Idempotent** means calling the same request multiple times produces the same result as calling it once. `PUT /users/42 { name: "Alice" }` always results in the same state -- no matter how many times you call it. `POST /users` creates a new user each time.

**Safe** means the method does not modify server state. GET and HEAD only read data.

### Status Code Families

| Range | Category | Examples |
|-------|----------|---------|
| 1xx | Informational | 101 Switching Protocols |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity |
| 5xx | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

**Most commonly used in REST APIs:**

```
200 OK           — GET success, PUT/PATCH success (with body)
201 Created      — POST success (new resource created)
204 No Content   — DELETE success (no body returned)
400 Bad Request  — Invalid input / validation error
401 Unauthorized — Missing or invalid authentication
403 Forbidden    — Authenticated but not allowed
404 Not Found    — Resource does not exist
409 Conflict     — Duplicate / state conflict
500 Internal     — Unexpected server error
```

### HTTP Headers

**Request headers:**
```
Content-Type: application/json      ← what format the body is in
Accept: application/json            ← what format the client wants back
Authorization: Bearer <token>       ← authentication credentials
```

**Response headers:**
```
Content-Type: application/json      ← body format
Location: /api/users/42             ← URL of newly created resource (with 201)
Cache-Control: no-cache             ← caching instructions
```

### REST Principles

1. **Resources** -- everything is a resource identified by a URI
2. **Uniform interface** -- use standard HTTP methods on resources
3. **Statelessness** -- each request contains all info needed; server stores no session
4. **Client-server** -- separation of concerns
5. **Representation** -- resources can have multiple representations (JSON, XML, etc.)

### REST URI Design

```
GET    /api/users           ← list all users
POST   /api/users           ← create a new user
GET    /api/users/42        ← get user 42
PUT    /api/users/42        ← replace user 42
PATCH  /api/users/42        ← partially update user 42
DELETE /api/users/42        ← delete user 42

GET    /api/users/42/rooms  ← list rooms for user 42 (sub-resource)
```

**URI conventions:**
- Use nouns, not verbs: `/api/users` not `/api/getUsers`
- Use plural nouns: `/api/users` not `/api/user`
- Use kebab-case: `/api/wish-lists` not `/api/wishLists`
- Nest for relationships: `/api/rooms/5/members`
- Use query params for filtering/sorting: `/api/users?role=admin&sort=name`

### Content Negotiation

The client tells the server what format it expects:
```
GET /api/users
Accept: application/json     ← client wants JSON

GET /api/users
Accept: text/xml             ← client wants XML
```

The server responds with the appropriate `Content-Type` header, or `406 Not Acceptable` if it cannot satisfy the request.

### Request/Response Cycle in Code

```typescript
import * as http from 'node:http';

const server = http.createServer((req, res) => {
  // Read request
  const { method, url, headers } = req;
  console.log(`${method} ${url}`);
  console.log('Content-Type:', headers['content-type']);

  // Parse body for POST/PUT
  if (method === 'POST' || method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const parsed = JSON.parse(body);
      console.log('Body:', parsed);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: 1, ...parsed }));
    });
    return;
  }

  // GET
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello' }));
});

server.listen(3000);
```

## Learn More

- [MDN: HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [MDN: HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [MDN: HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [MDN: HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Cats (status codes)](https://http.cat/) -- fun visual reference

## How to Work

1. **Study examples**:
   ```bash
   npx ts-node src/04-backend/lessons/02-http-and-rest/examples/http-methods.ts
   npx ts-node src/04-backend/lessons/02-http-and-rest/examples/status-codes.ts
   ```

2. **Complete exercises**:
   ```bash
   # Design exercise (markdown):
   # Open src/04-backend/lessons/02-http-and-rest/exercises/rest-api-design.md
   # and fill in the TODO sections

   # Coding exercise:
   npx ts-node src/04-backend/lessons/02-http-and-rest/exercises/crud-server.ts
   ```

## App Task

Design the complete REST API contract for both Secret Santa services. Document every planned endpoint:

**santa-api (port 3001):**

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | /api/auth/register | Register a new user | 201, 400, 409 |
| POST | /api/auth/login | Login and get JWT | 200, 401 |
| GET | /api/users/me | Get current user profile | 200, 401 |
| PATCH | /api/users/me | Update current user profile | 200, 400, 401 |
| POST | /api/rooms | Create a new room | 201, 400, 401 |
| GET | /api/rooms | List rooms for current user | 200, 401 |
| GET | /api/rooms/:id | Get room details | 200, 401, 404 |
| POST | /api/rooms/:id/join | Join a room by invite code | 200, 400, 401, 404 |
| POST | /api/rooms/:id/draw | Trigger Secret Santa draw | 200, 400, 401, 403 |
| GET | /api/rooms/:id/assignment | Get my assignment for a room | 200, 401, 404 |
| PUT | /api/rooms/:id/wishlist | Set my wishlist for a room | 200, 400, 401 |
| GET | /api/rooms/:id/wishlist/:userId | Get a user's wishlist | 200, 401, 404 |

**santa-notifications (port 3002):**

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | /health | Health check | 200 |
| POST | /api/notifications | Create a notification | 201, 400 |
| GET | /api/notifications/:userId | Get notifications for a user | 200 |
| PATCH | /api/notifications/:id/read | Mark notification as read | 200, 404 |
| POST | /api/messages | Send an anonymous message | 201, 400 |
| GET | /api/messages/:roomId/:userId | Get messages for user in room | 200 |

Create a document (e.g., `docs/api-contract.md` in each project root) describing all endpoints with request/response examples.
