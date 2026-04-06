export {};
// ============================================
// INTERFACES & TYPE ALIASES Exercises
// ============================================
// Complete the TODO exercises below
// Run this file with: npx ts-node --project config/tsconfig.json src/02-typescript/02-interfaces/exercises/interfaces.ts

console.log('=== Exercise 1: Design a Product interface ===');
// TODO: Create an interface 'Product' with:
//   - id: number (required)
//   - name: string (required)
//   - price: number (required)
//   - sku: string (readonly)
//   - description: string (optional)
//   - tags: string[] (optional)
// Then create a valid product object

// Your code here:
interface Product {
  id: number;
  name: string;
  price: number;
  readonly sku: string;
  description?: string;
  tags?: string[];
}
const product: Product = {
  id: 1,
  name: 'Laptop',
  price: 100.99,
  sku: 'Model-123',
  description: 'Description of the product',
  tags: ['electronics', 'computer'],
};

console.log(product.name, product.price);

console.log('\n=== Exercise 2: Extend an interface ===');
// TODO: Create interface 'Animal' with name: string and speak(): string
// Then create interface 'Pet' that extends Animal and adds:
//   - owner: string
//   - vaccinated: boolean
// Create a 'cat' object that satisfies the Pet interface

// Your code here:
interface Animal {
  name: string;
  speak(): string;
}
interface Pet extends Animal {
  owner: string;
  vaccinated: boolean;
}
const cat: Pet = {
  name: 'Bob',
  speak: () => 'Meow',
  owner: 'Jack',
  vaccinated: true,
};
console.log(cat.name, cat.speak(), cat.owner);

console.log('\n=== Exercise 3: type for union + literals ===');
// TODO: Create a type 'HttpMethod' with values: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
// Then create an interface 'ApiRequest' with:
//   - url: string
//   - method: HttpMethod
//   - body?: unknown
//   - headers?: Record<string, string>
// Create a sample request object

// Your code here:
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
interface ApiRequest {
  url: string;
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}
const request: ApiRequest = {
  url: '/api/cars',
  method: 'GET',
};

console.log(request.method, request.url);

console.log('\n=== Exercise 4: Declaration merging ===');
// TODO: Create an interface 'AppConfig' with:
//   - theme: 'light' | 'dark'
//   - language: string
// In a separate declaration (same interface name), add:
//   - version: string
//   - debug: boolean
// Create a config object that satisfies both

// Your code here:
interface AppConfig {
  theme: 'light' | 'dark';
  language: string;
}
interface AppConfig {
  version: string;
  debug: boolean;
}
const appConfig: AppConfig = {
  theme: 'light',
  language: 'en',
  version: '1.0.0',
  debug: true,
};

console.log(appConfig.theme, appConfig.version);

console.log('\n=== Exercise 5: type vs interface choice ===');
// TODO: For each of the following, decide whether to use 'type' or 'interface' and implement it:
// a) A shape that can be 'circle', 'square', or 'triangle' with appropriate properties
// b) A 'Repository<T>' shape with methods: findById, findAll, save, delete
// c) A tuple representing a database row: [id: number, name: string, createdAt: Date]
// d) An intersection of 'Auditable' ({ createdBy: string }) and 'Deletable' ({ deletedAt?: Date })

// Your code here:
// a) Shape
interface Circle {
  kind: 'circle';
  radius: number;
}
interface Square {
  kind: 'square';
  side: number;
}
interface Triangle {
  kind: 'triangle';
  base: number;
  height: number;
}
type Shape = Circle | Square | Triangle;
const shape: Shape = { kind: 'circle', radius: 5 };
console.log('Shape:', shape.kind, shape.radius);

// b) Repository
interface Repository<T> {
  findById(id: number): T | null;
  findAll(): T[];
  save(item: T): void;
  delete(id: number): void;
}

const productRepository: Repository<Product> = {
  findById(id: number): Product | null {
    return id === product.id ? product : null;
  },
  findAll(): Product[] {
    return [product];
  },
  save(item: Product): void {
    console.log('Saved product:', item.name);
  },
  delete(id: number): void {
    console.log('Deleted product id:', id);
  },
};

// c) Tuple
type DbRow = [id: number, name: string, createdAt: Date];
const dbRow: DbRow = [1, 'Alice', new Date()];

// d) Intersection
type Auditable = { createdBy: string };
type Deletable = { deletedAt?: Date };
type AuditableDeletable = Auditable & Deletable;
const record: AuditableDeletable = { createdBy: 'Bob', deletedAt: new Date() };
console.log('Repository item:', productRepository.findById(1)?.name);
console.log('DB row:', dbRow[0], dbRow[1], dbRow[2].toISOString());
console.log(record.createdBy, record.deletedAt);

console.log('\n=== Exercise 6: Index signature ===');
// TODO: Create an interface 'TranslationMap' where:
//   - keys are strings (translation keys like 'welcome', 'logout')
//   - values are strings (translated text)
// Create a translations object for English ('en')
// Then write a function 'translate' that takes key and map and returns the value
// or '[key]' if not found

// Your code here:
interface TranslationMap {
  [key: string]: string;
}

const en: TranslationMap = { welcome: 'Welcome!', logout: 'Log out' };
function translate(key: string, map: TranslationMap): string {
  return map[key] ?? `[${key}]`;
}

console.log(translate('welcome', en)); // 'Welcome!'
console.log(translate('unknown', en)); // '[unknown]'

console.log('\n=== Exercise 7: Implementing an interface ===');
// TODO: Create an interface 'Stack<T>' with:
//   - push(item: T): void
//   - pop(): T | undefined
//   - peek(): T | undefined
//   - readonly size: number
//   - isEmpty(): boolean
// Then implement this interface in a class 'ArrayStack<T>'

// Your code here:
interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  readonly size: number;
  isEmpty(): boolean;
}
class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];
  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  get size(): number {
    return this.items.length;
  }
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const stack = new ArrayStack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek()); // 3
console.log(stack.pop()); // 3
console.log(stack.size); // 2

console.log('\n=== 🎯 Challenge: API client types ===');
// TODO: Design type definitions for a simple REST API client:
//
// 1. type 'HttpStatus' — union of common status codes (200, 201, 400, 401, 403, 404, 500)
// 2. type 'ApiResponse<T>' — discriminated union:
//      - success: { ok: true; status: HttpStatus; data: T }
//      - failure: { ok: false; status: HttpStatus; error: string }
// 3. interface 'ApiClient' with methods:
//      - get<T>(url: string): Promise<ApiResponse<T>>
//      - post<T>(url: string, body: unknown): Promise<ApiResponse<T>>
// 4. type 'User' with id, name, email
// 5. Simulate calling client.get<User>('/users/1') and handling both cases

// Your code here:
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type ApiResponse<T> =
  | { ok: true; status: HttpStatus; data: T }
  | { ok: false; status: HttpStatus; error: string };
interface ApiClient {
  get<T>(url: string): Promise<ApiResponse<T>>;
  post<T>(url: string, body: unknown): Promise<ApiResponse<T>>;
}

type User = { id: number; name: string; email: string };

const client: ApiClient = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    console.log('GET', url);
    return { ok: true, status: 200, data: {} as T };
  },
  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    console.log('POST', url, body);
    return { ok: true, status: 201, data: {} as T };
  },
};

async function fetchUser() {
  const response = await client.get<User>('/users/1');
  if (response.ok) {
    console.log('User:', response.data);
  } else {
    console.error('Error:', response.error);
  }
}

fetchUser();

console.log('\n✅ Exercises completed! Check your answers with a mentor.');
