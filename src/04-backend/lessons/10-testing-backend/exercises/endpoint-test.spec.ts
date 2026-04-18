// ============================================
// Exercise: Integration Tests with Supertest
// ============================================
// Run: npx jest src/04-backend/lessons/10-testing-backend/exercises/endpoint-test.spec.ts
// Install: npm install supertest @types/supertest fastify

import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest'; // used in TODO implementations below

// --- App to test (given to you — do not modify) ---

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

function buildApp(): FastifyInstance {
  const app = Fastify();
  const items: Item[] = [];
  let nextId = 1;

  // POST /items — create a new item
  app.post<{ Body: Partial<Item> }>('/items', async (req, reply) => {
    const { name, description, price, category } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return reply.status(400).send({ error: 'Name is required and must be a non-empty string' });
    }
    if (!description || typeof description !== 'string') {
      return reply.status(400).send({ error: 'Description is required' });
    }
    if (price == null || typeof price !== 'number' || price < 0) {
      return reply.status(400).send({ error: 'Price must be a non-negative number' });
    }
    if (!category || typeof category !== 'string') {
      return reply.status(400).send({ error: 'Category is required' });
    }

    // Check for duplicate name
    if (items.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      return reply.status(409).send({ error: 'Item with this name already exists' });
    }

    const item: Item = {
      id: String(nextId++),
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      inStock: true,
    };
    items.push(item);

    return reply.status(201).send(item);
  });

  // GET /items — list items with optional filters
  app.get<{ Querystring: { category?: string; inStock?: string; page?: string; limit?: string } }>(
    '/items',
    async (req, reply) => {
      let filtered = [...items];

      if (req.query.category) {
        filtered = filtered.filter((i) => i.category === req.query.category);
      }
      if (req.query.inStock !== undefined) {
        const inStock = req.query.inStock === 'true';
        filtered = filtered.filter((i) => i.inStock === inStock);
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
      const skip = (page - 1) * limit;
      const data = filtered.slice(skip, skip + limit);

      return reply.send({
        data,
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit) || 1,
        },
      });
    },
  );

  // GET /items/:id — get item by ID
  app.get<{ Params: { id: string } }>('/items/:id', async (req, reply) => {
    const item = items.find((i) => i.id === req.params.id);
    if (!item) {
      return reply.status(404).send({ error: 'Item not found' });
    }
    return reply.send(item);
  });

  // PATCH /items/:id — partial update
  app.patch<{ Params: { id: string }; Body: Partial<Item> }>('/items/:id', async (req, reply) => {
    const index = items.findIndex((i) => i.id === req.params.id);
    if (index === -1) {
      return reply.status(404).send({ error: 'Item not found' });
    }

    const { name, description, price, inStock } = req.body;

    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return reply.status(400).send({ error: 'Name must be a non-empty string' });
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return reply.status(400).send({ error: 'Price must be a non-negative number' });
    }

    const existing = items[index]!;
    items[index] = {
      ...existing,
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(inStock !== undefined && { inStock }),
    };

    return reply.send(items[index]);
  });

  // DELETE /items/:id
  app.delete<{ Params: { id: string } }>('/items/:id', async (req, reply) => {
    const index = items.findIndex((i) => i.id === req.params.id);
    if (index === -1) {
      return reply.status(404).send({ error: 'Item not found' });
    }
    items.splice(index, 1);
    return reply.status(204).send();
  });

  return app;
}

// --- Your tests ---

describe('Items API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // Placeholder to ensure the test suite can run before TODOs are implemented
  it('should have the app ready', () => {
    expect(app).toBeDefined();
  });

  // ============================================
  // TODO 1: Test POST /items
  // ============================================
  describe('POST /items', () => {
    // TODO: Write a test that creates an item successfully
    //   - Send: { name, description, price, category }
    //   - Expect: status 201
    //   - Expect: response body has id, name, description, price, category, inStock: true

    // TODO: Write a test that returns 400 when name is missing

    // TODO: Write a test that returns 400 when price is negative

    // TODO: Write a test that returns 400 when description is missing

    // TODO: Write a test that returns 409 when creating an item with a duplicate name
    //   (create an item first, then try to create another with the same name)
  });

  // ============================================
  // TODO 2: Test GET /items/:id
  // ============================================
  describe('GET /items/:id', () => {
    // TODO: Write a test that retrieves an existing item by ID
    //   (create an item first with POST, then GET it by the returned ID)

    // TODO: Write a test that returns 404 for a non-existent ID
  });

  // ============================================
  // TODO 3: Test GET /items (list with filters and pagination)
  // ============================================
  describe('GET /items', () => {
    // TODO: Write a test that returns all items with correct pagination meta
    //   - Create 3+ items first
    //   - GET /items
    //   - Expect: response has data array and meta object

    // TODO: Write a test that filters by category
    //   - Create items with different categories
    //   - GET /items?category=electronics
    //   - Expect: only items with that category are returned

    // TODO: Write a test that paginates correctly
    //   - Create enough items to have multiple pages
    //   - GET /items?page=1&limit=2
    //   - Expect: correct data length and meta values (total, page, limit, totalPages)
  });

  // ============================================
  // TODO 4: Test PATCH /items/:id
  // ============================================
  describe('PATCH /items/:id', () => {
    // TODO: Write a test that partially updates an item
    //   - Create an item, then PATCH with { name: 'New Name' }
    //   - Expect: name is updated, other fields remain unchanged

    // TODO: Write a test that returns 400 for invalid price (negative number)

    // TODO: Write a test that returns 404 for non-existent ID
  });

  // ============================================
  // TODO 5: Test DELETE /items/:id
  // ============================================
  describe('DELETE /items/:id', () => {
    // TODO: Write a test that deletes an item and verifies it's gone
    //   - Create an item, DELETE it, then GET it and expect 404

    // TODO: Write a test that returns 404 for non-existent ID
  });

  // ============================================
  // TODO 6: Test a full CRUD flow
  // ============================================
  describe('Full CRUD flow', () => {
    // TODO: Write a single test that goes through the complete lifecycle:
    //   1. POST /items — create an item
    //   2. GET /items/:id — verify it was created
    //   3. PATCH /items/:id — update the price
    //   4. GET /items/:id — verify the update
    //   5. DELETE /items/:id — delete it
    //   6. GET /items/:id — verify it returns 404
  });
});
