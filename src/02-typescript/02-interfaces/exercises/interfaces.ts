export {};
// ============================================
// INTERFACES & TYPE ALIASES Exercises
// ============================================
// Complete the TODO exercises below
// Run this file with: npx ts-node src/02-typescript/02-interfaces/exercises/interfaces.ts

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
  id: number,
  name: string,
  price: number,
  readonly sku: string,
  description?: string,
  tags?: string[]
}

const product: Product = {
  id: 1,
  name: 'Cookie',
  price: 15,
  sku: 'L0901262',
  tags: ['limited', 'running out']
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
  name: string,
  speak(): string
}

interface Pet extends Animal {
  owner: string,
  vaccinated: boolean
}

const cat: Pet = {
  name: 'Emma',
  owner: 'Vitalii',
  vaccinated: true,
  speak() {
    return 'Go clean the shit. Hurry up!';
  }
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
  url: string,
  method: HttpMethod,
  body?: unknown,
  headers?: Record<string, string>
}

const request: ApiRequest = {
  url: 'https://music.youtube.com/playlist?list=OLAK5uy_m5hcqg1URqAtwV8-7Wf8O92j3eBgAdfXw',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
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
type Theme = 'light' | 'dark';
type Langugage = 'en' | 'uk' | 'es' | 'it' | 'pl';
interface AppConfig {
  theme: Theme,
  language: Langugage,
}

interface AppConfig {
  version: string,
  debug: boolean
}

const appConfig: AppConfig = {
  theme: 'dark',
  language: 'uk',
  version: '1.0.0',
  debug: true
};

console.log(appConfig.theme, appConfig.version);


console.log('\n=== Exercise 5: type vs interface choice ===');
// TODO: For each of the following, decide whether to use 'type' or 'interface' and implement it:
// a) A shape that can be 'circle', 'square', or 'triangle' with appropriate properties
// b) A 'Repository<T>' shape with methods: findById, findAll, save, delete
// c) A tuple representing a database row: [id: number, name: string, createdAt: Date]
// d) An intersection of 'Auditable' ({ createdBy: string }) and 'Deletable' ({ deletedAt?: Date })

// Your code here:
// a - type
// b - interface
// c - type
// d - type

console.log('\n=== Exercise 6: Index signature ===');
// TODO: Create an interface 'TranslationMap' where:
//   - keys are strings (translation keys like 'welcome', 'logout')
//   - values are strings (translated text)
// Create a translations object for English ('en')
// Then write a function 'translate' that takes key and map and returns the value
// or '[key]' if not found

// Your code here:
interface TranslationMap {
  [key: string]: string
}

function translate(key: string, map: TranslationMap): string {
  return map[key] ?? `[${key}]`;
}

const en: TranslationMap = { welcome: 'Welcome!', logout: 'Log out' };
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
  push(item: T): void,
  pop(): T | undefined,
  peek(): T | undefined,
  readonly size: number,
  isEmpty(): boolean
}

class ArrayStack<T> implements Stack<T> {
  #arr: Array<T> = [];

  push(item: T): void {
    this.#arr.push(item);
  }

  pop(): T | undefined {
    return this.#arr.pop();
  }

  peek(): T | undefined {
    if (this.#arr.length > 0) {
      return this.#arr[this.#arr.length - 1];
    }

    return undefined;
  }

  get size(): number {
    return this.#arr.length;
  }

  isEmpty(): boolean {
    return this.size < 1;
  }
}

const stack = new ArrayStack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek());  // 3
console.log(stack.pop());   // 3
console.log(stack.size);    // 2


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
type ApiResponse<T> = { ok: true; status: HttpStatus; data: T } |
                      { ok: false; status: HttpStatus; error: string };
interface ApiClient {
  get<T>(url: string): Promise<ApiResponse<T>>,
  post<T>(url: string, body: unknown): Promise<ApiResponse<T>>
}
type User = { id: string; name: string; email: string };

class RandomBoolean {
  getBoolean(): boolean {
    return Math.random() > 0.5;
  }
}

class RandomApiClient implements ApiClient {
  #random: RandomBoolean = new RandomBoolean();

  get<T>(url: string): Promise<ApiResponse<T>> {
    return this.doWork<T>(url);
  }
  post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return this.doWork<T>(url, body);
  }

  private doWork<T>(url: string, body: unknown = null): Promise<ApiResponse<T>> {
    console.info(`Going to resolve "${url}": ${body ?? '<EMPTY BODY>'}`);
    return new Promise<ApiResponse<T>>(resolve => resolve(this.getRandomResponse<T>()));
  }

  private getRandomResponse<T>(): ApiResponse<T> | PromiseLike<ApiResponse<T>> {
    if (this.#random.getBoolean()) {
      return {
        ok: true,
        status: 200,
        data: {
          id: '1',
          name: 'John',
          email: 'example@dot.com'
        } as T
      };
    }

    return {
      ok: false,
      status: 500,
      error: 'Just because'
    };
  }
}

const client: ApiClient = new RandomApiClient();
client.get<User>('/user/1')
  .then(response => {
    const status = response.status;
    if (response.ok) {
      const user = response.data;

      console.log('Success', status, user);
    } else {
      const failure = response.error;
      console.log('Failure', status, failure);
    }
  })
  .catch(error => {
    console.error('Error', error);
  });

console.log('\n✅ Exercises completed! Check your answers with a mentor.');
