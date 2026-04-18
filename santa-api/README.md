# Santa API

Secret Santa main API service built with NestJS + Fastify adapter.

## Tech Stack

- **NestJS** with Fastify adapter
- **MongoDB** + Mongoose
- **Redis** (caching, rate limiting)
- **RabbitMQ** (event publishing)
- **JWT** + bcrypt (authentication)
- **Pino** (logging)
- **Swagger** (API docs)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login, returns JWT |
| GET | /users/:id | Yes | Get user profile |
| POST | /rooms | Yes | Create a room |
| GET | /rooms | Yes | List user's rooms |
| GET | /rooms/:id | Yes | Get room details |
| POST | /rooms/:code/join | Yes | Join room by invite code |
| POST | /rooms/:id/draw | Yes | Trigger the draw (creator only) |
| GET | /rooms/:id/assignment | Yes | Get your assignment |
| POST | /rooms/:id/wishlist | Yes | Set your wishlist |
| GET | /rooms/:id/wishlist/:userId | Yes | Get user's wishlist |

## Getting Started

```bash
cd santa-api
npm install
cp .env.example .env
npm run start:dev
```

## Scripts

```bash
npm run start:dev    # Development with watch
npm run start:prod   # Production
npm run build        # Build
npm run test         # Run tests
npm run lint         # Lint
```

## Port

Runs on **port 3001** by default.
