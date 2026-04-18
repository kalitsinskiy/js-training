export {};
// ============================================
// FASTIFY MINI CRUD Exercise
// ============================================
// Run this file with: npx ts-node src/04-backend/lessons/03-fastify/exercises/mini-crud.ts
//
// Build a mini CRUD API for "tasks" using Fastify plugins.
//
// Requirements:
// - Use a plugin architecture (separate plugins for db, routes)
// - Use fastify-plugin (fp) for shared state
// - Use typed routes with Fastify generics
// - Add JSON Schema validation for request body

import Fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

// These will be used when you implement the TODOs below
void Fastify; void fp;
void (undefined as unknown as FastifyInstance);
void (undefined as unknown as FastifyPluginOptions);

// --- Task interface ---
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TaskStore {
  tasks: Task[];
  nextId: number;
}
void (undefined as unknown as TaskStore);

// TODO 1: Create a "dbPlugin" that decorates the Fastify instance with a TaskStore
//
// - Create a TaskStore with an empty tasks array and nextId = 1
// - Use fastify.decorate('taskStore', store) to attach it
// - Wrap with fp() so it's available to other plugins
//
// async function dbPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions) {
//   ...
// }

// TODO 2: Create a "taskRoutes" plugin that registers CRUD routes for tasks
//
// Routes to implement (all prefixed with /api/tasks via register options):
//
// GET /api/tasks
//   → Return all tasks: { tasks: Task[] }
//   → Support ?completed=true/false query filter
//
// GET /api/tasks/:id
//   → Return a single task
//   → 404 if not found
//
// POST /api/tasks
//   → Body: { title: string, description?: string }
//   → title is required, minLength 1
//   → description defaults to ""
//   → completed defaults to false
//   → createdAt is set to current ISO timestamp
//   → Return 201 with the created task
//   → Add JSON Schema validation for the body
//
// PATCH /api/tasks/:id
//   → Body: { title?: string, description?: string, completed?: boolean }
//   → Partially update the task (only change provided fields)
//   → 404 if not found
//   → 200 with the updated task
//
// DELETE /api/tasks/:id
//   → Remove the task
//   → 204 on success
//   → 404 if not found
//
// async function taskRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
//   const store = (fastify as any).taskStore as TaskStore;
//   ...
// }

// TODO 3: Create a "requestLoggerPlugin" that logs each request
//
// - Add an onResponse hook
// - Log: method, url, statusCode, and response time (use reply.elapsedTime)
// - Wrap with fp() so it applies globally
//
// async function requestLoggerPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions) {
//   ...
// }

// TODO 4: Assemble the application
//
// - Create a Fastify instance with logger: true
// - Register dbPlugin (shared store)
// - Register requestLoggerPlugin (global hook)
// - Register taskRoutes with prefix '/api/tasks'
// - Add a custom 404 handler
// - Start the server on port 3000
//
// Test with:
//   curl http://localhost:3000/api/tasks
//   curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Learn Fastify"}'
//   curl http://localhost:3000/api/tasks/1
//   curl -X PATCH http://localhost:3000/api/tasks/1 -H "Content-Type: application/json" -d '{"completed":true}'
//   curl -X DELETE http://localhost:3000/api/tasks/1
//   curl http://localhost:3000/api/tasks?completed=true

console.log('Exercise: implement the Fastify CRUD plugins above and start the server.');
