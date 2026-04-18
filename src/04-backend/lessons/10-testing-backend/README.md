# Testing Backend

## Quick Overview

Backend testing ensures your API works correctly at every layer — from individual service methods to full HTTP request/response cycles. This lesson covers the testing pyramid for backends, unit testing services with mocked dependencies, integration testing with supertest, using mongodb-memory-server for database tests, and the NestJS testing module.

## Key Concepts

### Backend Testing Pyramid

```
         /  E2E Tests  \          Few, slow, high confidence
        /  (supertest)   \
       /------------------\
      / Integration Tests  \      Some, medium speed
     /   (HTTP + DB layer)  \
    /------------------------\
   /      Unit Tests          \   Many, fast, focused
  /  (services, pure logic)    \
 /------------------------------\
```

- **Unit tests**: Test a single function/method in isolation. Mock all dependencies (database, external services). Fast, many of these.
- **Integration tests**: Test multiple components working together. Often test HTTP endpoints with a real (in-memory) database. Slower, fewer of these.
- **E2E tests**: Test the full flow from HTTP request to database and back. Closest to real user behavior. Slowest, fewest of these.

### Unit Testing Services

Unit test a service by mocking its dependencies (Mongoose models, other services).

```typescript
// rooms.service.ts
@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  async create(dto: CreateRoomDto, userId: string): Promise<Room> {
    const inviteCode = this.generateInviteCode();
    return this.roomModel.create({
      ...dto,
      creatorId: userId,
      inviteCode,
      participants: [userId],
      status: 'pending',
    });
  }

  async findById(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
```

```typescript
// rooms.service.spec.ts
describe('RoomsService', () => {
  let service: RoomsService;
  let roomModel: any;

  beforeEach(() => {
    // Create a mock model
    roomModel = {
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
    };

    service = new RoomsService(roomModel);
  });

  describe('create', () => {
    it('should create a room with invite code and creator as participant', async () => {
      const dto = { name: 'Office Party' };
      const userId = 'user-123';
      const mockRoom = { _id: 'room-1', ...dto, creatorId: userId, inviteCode: 'ABC123' };

      roomModel.create.mockResolvedValue(mockRoom);

      const result = await service.create(dto, userId);

      expect(roomModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Office Party',
          creatorId: userId,
          participants: [userId],
          status: 'pending',
        }),
      );
      expect(result).toEqual(mockRoom);
    });
  });

  describe('findById', () => {
    it('should return the room if found', async () => {
      const mockRoom = { _id: 'room-1', name: 'Party' };
      roomModel.findById.mockResolvedValue(mockRoom);

      const result = await service.findById('room-1');
      expect(result).toEqual(mockRoom);
    });

    it('should throw NotFoundException if room not found', async () => {
      roomModel.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow('Room not found');
    });
  });
});
```

### Integration Testing with Supertest

Supertest lets you make HTTP requests against your server and assert on the response.

```typescript
import request from 'supertest';
import { app } from '../src/app'; // your Fastify or Express app

describe('POST /auth/register', () => {
  it('should register a new user and return a token', async () => {
    const response = await request(app.server)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        displayName: 'Test User',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app.server)
      .post('/auth/register')
      .send({ password: 'TestPass123!', displayName: 'Test' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  it('should return 409 if email is already registered', async () => {
    // Register first
    await request(app.server)
      .post('/auth/register')
      .send({ email: 'dup@example.com', password: 'Pass123!', displayName: 'User1' });

    // Try to register again with the same email
    await request(app.server)
      .post('/auth/register')
      .send({ email: 'dup@example.com', password: 'Pass123!', displayName: 'User2' })
      .expect(409);
  });
});

describe('GET /rooms (authenticated)', () => {
  let token: string;

  beforeAll(async () => {
    // Register and get token
    const res = await request(app.server)
      .post('/auth/register')
      .send({ email: 'rooms@example.com', password: 'Pass123!', displayName: 'Rooms User' });
    token = res.body.accessToken;
  });

  it('should return rooms for the authenticated user', async () => {
    const response = await request(app.server)
      .get('/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return 401 without a token', async () => {
    await request(app.server)
      .get('/rooms')
      .expect(401);
  });
});
```

### mongodb-memory-server

`mongodb-memory-server` spins up a real MongoDB instance in memory — no Docker needed, fully isolated, fast.

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Stop after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

This gives you a real MongoDB that you can query, index, and aggregate against — but it starts in ~1 second and requires no external dependencies.

### NestJS Testing Module

`@nestjs/testing` provides `Test.createTestingModule()` to bootstrap a NestJS module with overridden providers for testing.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getModelToken } from '@nestjs/mongoose';
import { Room } from './room.schema';

describe('RoomsService (NestJS Testing Module)', () => {
  let service: RoomsService;
  let roomModel: any;

  beforeEach(async () => {
    const mockRoomModel = {
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getModelToken(Room.name),
          useValue: mockRoomModel,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    roomModel = module.get(getModelToken(Room.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a room', async () => {
    roomModel.create.mockResolvedValue({ _id: '1', name: 'Test Room' });
    const result = await service.create({ name: 'Test Room' }, 'user-1');
    expect(result.name).toBe('Test Room');
  });
});
```

### Test Factories / Fixtures

Create helper functions to generate test data consistently:

```typescript
// test/factories.ts
import { Types } from 'mongoose';

export function createMockUser(overrides: Partial<any> = {}) {
  return {
    _id: new Types.ObjectId(),
    email: `user-${Date.now()}@test.com`,
    displayName: 'Test User',
    role: 'user',
    passwordHash: '$2b$10$hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockRoom(overrides: Partial<any> = {}) {
  return {
    _id: new Types.ObjectId(),
    name: 'Test Room',
    creatorId: new Types.ObjectId(),
    inviteCode: 'ABCD1234',
    participants: [],
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// Usage in tests:
const user = createMockUser({ role: 'admin' });
const room = createMockRoom({ name: 'Holiday Party', creatorId: user._id });
```

### What to Test (and What Not To)

**Test:**
- Service business logic (validation, transformations, error cases)
- Auth flow (register, login, token validation, protected routes)
- CRUD operations (happy path + error cases)
- Edge cases (empty input, duplicate entries, not found)
- Pagination (first page, last page, empty results, invalid params)

**Don't test:**
- Mongoose/NestJS framework internals
- Third-party library behavior
- Simple getters/setters with no logic
- Database driver functionality

### Code Coverage

```bash
# Run tests with coverage
npx jest --coverage

# Coverage thresholds in jest.config.ts
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

Focus on meaningful coverage — 80% with good tests is better than 100% with shallow tests.

## Learn More

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/ladjs/supertest)
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## How to Work

1. **Study examples**:
   ```bash
   npx jest src/04-backend/lessons/10-testing-backend/examples/unit-test-service.spec.ts
   npx jest src/04-backend/lessons/10-testing-backend/examples/integration-test.spec.ts
   npx jest src/04-backend/lessons/10-testing-backend/examples/mongodb-memory.spec.ts
   npx jest src/04-backend/lessons/10-testing-backend/examples/nestjs-testing.spec.ts
   ```

2. **Complete exercises**:
   ```bash
   npx jest src/04-backend/lessons/10-testing-backend/exercises/service-test.spec.ts
   npx jest src/04-backend/lessons/10-testing-backend/exercises/endpoint-test.spec.ts
   ```

## App Task

### Tests for santa-api

1. **Unit tests** for `RoomsService`:
   - `create()`: creates room with invite code, adds creator as participant
   - `findById()`: returns room or throws NotFoundException
   - `join()`: adds participant, prevents duplicate join, rejects if room is already drawn
   - `draw()`: assigns Secret Santas, requires minimum 3 participants

2. **Unit tests** for `AuthService`:
   - `register()`: hashes password, creates user, returns token
   - `register()`: rejects duplicate email
   - `login()`: returns token for valid credentials
   - `login()`: rejects invalid password
   - `login()`: rejects non-existent email

3. **Integration tests**:
   - `POST /auth/register`: valid registration, duplicate email, missing fields
   - `POST /auth/login`: valid login, wrong password, non-existent user
   - `POST /rooms`: create room (authenticated), reject unauthenticated
   - `GET /rooms`: list user's rooms (paginated), reject unauthenticated

### Tests for santa-notifications

1. **Integration tests** for notification CRUD:
   - `POST /notifications`: create notification
   - `GET /notifications?userId=...`: list user's notifications
   - `PATCH /notifications/:id/read`: mark as read
   - `DELETE /notifications/:id`: delete notification

### Setup

Use `mongodb-memory-server` for all database tests. Create test factories for User, Room, Wishlist, and Notification.
