# Santa Notifications

Secret Santa notification and messaging service built with raw Fastify.

## Tech Stack

- **Fastify** (plugins, hooks, Context DI)
- **MongoDB** + Mongoose
- **Redis** (online tracking, Socket.IO adapter)
- **RabbitMQ** (event consuming)
- **Socket.IO** (real-time push)
- **Pino** (logging)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| GET | /notifications | Yes | List user's notifications |
| PATCH | /notifications/:id/read | Yes | Mark notification as read |
| POST | /messages | Yes | Send anonymous message |
| GET | /messages/:roomId | Yes | Get received messages |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| notification | Server → Client | New notification pushed |
| message | Server → Client | New anonymous message received |

## Getting Started

```bash
cd santa-notifications
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev      # Development with watch
npm run start    # Production
npm run build    # Build
npm run test     # Run tests
npm run lint     # Lint
```

## Port

Runs on **port 3002** by default.
