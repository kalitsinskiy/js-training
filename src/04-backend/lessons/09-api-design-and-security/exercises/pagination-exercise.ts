export {};
// ============================================
// Exercise: Pagination
// ============================================
// Run: npx ts-node src/04-backend/lessons/09-api-design-and-security/exercises/pagination-exercise.ts

// --- Types ---

interface PaginationQuery {
  page?: number;
  limit?: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: Date;
}

// --- Simulated database ---

const tasks: Task[] = [
  { id: 1, title: 'Set up project', status: 'done', priority: 'high', assignee: 'Alice', createdAt: new Date('2025-01-01') },
  { id: 2, title: 'Design database schema', status: 'done', priority: 'high', assignee: 'Bob', createdAt: new Date('2025-01-02') },
  { id: 3, title: 'Implement auth module', status: 'in-progress', priority: 'high', assignee: 'Alice', createdAt: new Date('2025-01-03') },
  { id: 4, title: 'Create room endpoints', status: 'in-progress', priority: 'medium', assignee: 'Carol', createdAt: new Date('2025-01-04') },
  { id: 5, title: 'Write unit tests', status: 'todo', priority: 'medium', assignee: 'Bob', createdAt: new Date('2025-01-05') },
  { id: 6, title: 'Add Swagger docs', status: 'todo', priority: 'low', assignee: 'Alice', createdAt: new Date('2025-01-06') },
  { id: 7, title: 'Configure CORS', status: 'todo', priority: 'medium', assignee: 'Carol', createdAt: new Date('2025-01-07') },
  { id: 8, title: 'Set up rate limiting', status: 'todo', priority: 'low', assignee: 'Bob', createdAt: new Date('2025-01-08') },
  { id: 9, title: 'Add Helmet headers', status: 'todo', priority: 'low', assignee: 'Alice', createdAt: new Date('2025-01-09') },
  { id: 10, title: 'Deploy to staging', status: 'todo', priority: 'high', assignee: 'Carol', createdAt: new Date('2025-01-10') },
  { id: 11, title: 'Integration tests', status: 'todo', priority: 'medium', assignee: 'Bob', createdAt: new Date('2025-01-11') },
  { id: 12, title: 'Performance testing', status: 'todo', priority: 'low', assignee: 'Alice', createdAt: new Date('2025-01-12') },
  { id: 13, title: 'Fix login bug', status: 'in-progress', priority: 'high', assignee: 'Carol', createdAt: new Date('2025-01-13') },
  { id: 14, title: 'Add email notifications', status: 'todo', priority: 'medium', assignee: 'Bob', createdAt: new Date('2025-01-14') },
  { id: 15, title: 'Code review', status: 'todo', priority: 'medium', assignee: 'Alice', createdAt: new Date('2025-01-15') },
];

// ============================================
// TODO 1: Implement the paginate function
// ============================================
// Create a generic function that takes:
//   - items: T[] (the full array of items)
//   - query: PaginationQuery (page and limit from query params)
// And returns: PaginatedResponse<T>
//
// Requirements:
//   - page defaults to 1, minimum 1
//   - limit defaults to 10, minimum 1, maximum 100
//   - Calculate skip = (page - 1) * limit
//   - totalPages = Math.ceil(total / limit), minimum 1
//   - Return the correct slice of items + meta

function paginate<T>(_items: T[], _query: PaginationQuery): PaginatedResponse<T> {
  // TODO: Rename parameters (remove _ prefix) and implement this function
  throw new Error('Not implemented');
}

// ============================================
// TODO 2: Implement the filterAndPaginate function
// ============================================
// Create a function specifically for tasks that:
//   - Accepts optional filters: { status?, priority?, assignee? }
//   - Accepts PaginationQuery
//   - Filters the tasks array based on provided filters
//   - Paginates the filtered result using your paginate function
//   - Returns PaginatedResponse<Task>

interface TaskFilter {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
}

function filterAndPaginate(
  _filter: TaskFilter,
  _query: PaginationQuery,
): PaginatedResponse<Task> {
  // TODO: Rename parameters (remove _ prefix) and implement this function
  throw new Error('Not implemented');
}

// ============================================
// TODO 3: Implement cursor-based pagination
// ============================================
// Create a function that implements cursor-based pagination for tasks:
//   - cursor: the `id` of the last item from the previous page (undefined for first page)
//   - limit: number of items to return
// Return: { data: Task[], meta: { nextCursor: number | null, hasMore: boolean } }

interface CursorQuery {
  cursor?: number;
  limit?: number;
}

interface CursorResponse {
  data: Task[];
  meta: {
    nextCursor: number | null;
    hasMore: boolean;
  };
}

function paginateByCursor(_query: CursorQuery): CursorResponse {
  // TODO: Rename _query back to query and implement this function
  throw new Error('Not implemented');
}

// --- Tests ---

function main(): void {
  console.log('=== Pagination Exercise ===\n');

  // Test paginate
  console.log('--- paginate: page 1, limit 5 ---');
  const result1 = paginate(tasks, { page: 1, limit: 5 });
  console.log('Data:', result1.data.map((t) => t.title));
  console.log('Meta:', result1.meta);
  // Expected meta: { total: 15, page: 1, limit: 5, totalPages: 3 }

  console.log('\n--- paginate: page 3, limit 5 ---');
  const result2 = paginate(tasks, { page: 3, limit: 5 });
  console.log('Data:', result2.data.map((t) => t.title));
  console.log('Meta:', result2.meta);
  // Expected: 5 items, page 3

  console.log('\n--- paginate: beyond last page ---');
  const result3 = paginate(tasks, { page: 10, limit: 5 });
  console.log('Data:', result3.data); // should be empty
  console.log('Meta:', result3.meta);
  // Expected: empty data, totalPages still 3

  console.log('\n--- paginate: edge cases ---');
  const result4 = paginate(tasks, {}); // defaults: page 1, limit 10
  console.log('Default pagination:', result4.meta);

  const result5 = paginate(tasks, { page: -1, limit: 999 }); // clamped
  console.log('Clamped values:', result5.meta);
  // Expected: page=1, limit=100

  const result6 = paginate([], { page: 1, limit: 10 }); // empty array
  console.log('Empty array:', result6.meta);
  // Expected: total=0, totalPages=1

  // Test filterAndPaginate
  console.log('\n--- filterAndPaginate: high priority ---');
  const high = filterAndPaginate({ priority: 'high' }, { page: 1, limit: 10 });
  console.log('High priority tasks:', high.data.map((t) => t.title));
  console.log('Meta:', high.meta);

  console.log('\n--- filterAndPaginate: Alice\'s todo tasks ---');
  const aliceTodo = filterAndPaginate(
    { assignee: 'Alice', status: 'todo' },
    { page: 1, limit: 5 },
  );
  console.log('Alice todo:', aliceTodo.data.map((t) => t.title));
  console.log('Meta:', aliceTodo.meta);

  // Test cursor pagination
  console.log('\n--- Cursor pagination: first batch ---');
  const batch1 = paginateByCursor({ limit: 5 });
  console.log('Batch 1:', batch1.data.map((t) => t.title));
  console.log('Meta:', batch1.meta);

  console.log('\n--- Cursor pagination: second batch ---');
  const batch2 = paginateByCursor({ cursor: batch1.meta.nextCursor!, limit: 5 });
  console.log('Batch 2:', batch2.data.map((t) => t.title));
  console.log('Meta:', batch2.meta);

  console.log('\n--- Cursor pagination: last batch ---');
  const batch3 = paginateByCursor({ cursor: batch2.meta.nextCursor!, limit: 5 });
  console.log('Batch 3:', batch3.data.map((t) => t.title));
  console.log('Meta:', batch3.meta);
  // hasMore should be false

  console.log('\nDone.');
}

main();
