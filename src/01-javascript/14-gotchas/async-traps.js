// ============================================
// ASYNC GOTCHAS
// ============================================

console.log('=== await inside .map() returns Promises ===');

async function demo1() {
  const delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));

  // ❌ WRONG: map returns [Promise, Promise, Promise], not values
  const wrongResult = [1, 2, 3].map(async (n) => {
    return await delay(10, n * 2);
  });
  console.log('wrong:', wrongResult); // [Promise, Promise, Promise]

  // ✅ CORRECT: wrap in Promise.all
  const correctResult = await Promise.all([1, 2, 3].map(async (n) => {
    return await delay(10, n * 2);
  }));
  console.log('correct:', correctResult); // [2, 4, 6]
}

demo1();

// ---
console.log('\n=== await inside .forEach() is silently ignored ===');

async function demo2() {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  const results = [];

  // ❌ WRONG: forEach doesn't await the async callback
  [1, 2, 3].forEach(async (n) => {
    await delay(10);
    results.push(n);  // runs after forEach has already returned
  });

  console.log('after forEach (wrong):', results); // []  ← empty!

  // ✅ CORRECT: for...of waits for each await
  const results2 = [];
  for (const n of [1, 2, 3]) {
    await delay(10);
    results2.push(n);
  }
  console.log('after for...of (correct):', results2); // [1, 2, 3]

  // ✅ Also correct: Promise.all + map (parallel, not sequential)
  const results3 = await Promise.all([1, 2, 3].map(async (n) => {
    await delay(10);
    return n;
  }));
  console.log('Promise.all (parallel):', results3); // [1, 2, 3]
}

setTimeout(demo2, 100);

// ---
console.log('\n=== async constructor is impossible ===');

// ❌ You CANNOT make a constructor async:
// class Service {
//   async constructor() { this.data = await fetch(...); }  // SyntaxError!
// }

// ✅ Pattern 1: static async factory method
class DatabaseService {
  #connection = null;

  static async connect(url) {
    const service = new DatabaseService();
    service.#connection = await Promise.resolve(`connected to ${url}`); // simulate
    return service;
  }

  query(sql) {
    return `${this.#connection} → ${sql}`;
  }
}

// Usage: const db = await DatabaseService.connect('localhost');
DatabaseService.connect('localhost').then(db => {
  console.log(db.query('SELECT * FROM users'));
});

// ✅ Pattern 2: init() method
class CacheService {
  #ready = false;

  async init() {
    await Promise.resolve(); // simulate async setup
    this.#ready = true;
    return this;
  }

  get(key) {
    if (!this.#ready) throw new Error('Call init() first');
    return `cache:${key}`;
  }
}

// ---
console.log('\n=== Promise.resolve().then() is NOT synchronous ===');

console.log('1 — before');
Promise.resolve('value').then(v => console.log('3 — then:', v)); // microtask
console.log('2 — after');
// Output: 1, 2, 3  ← .then is always async even for resolved promise

// ---
setTimeout(() => {
  console.log('\n=== Unhandled promise rejections ===');

  // ❌ This error disappears silently (or crashes Node.js process):
  // async function bad() { throw new Error('lost'); }
  // bad(); // ← no .catch(), error is unhandled

  // ✅ Always handle:
  async function risky() {
    throw new Error('handled');
  }
  risky().catch(e => console.log('Caught:', e.message));

  // ✅ Or:
  (async () => {
    try {
      await risky();
    } catch (e) {
      console.log('Also caught:', e.message);
    }
  })();

  // ---
  console.log('\n=== await only pauses its own async function ===');

  async function child() {
    console.log('child: before await');
    await Promise.resolve();
    console.log('child: after await'); // resumes as microtask
  }

  async function parent() {
    console.log('parent: before child()');
    child(); // ← no await! parent continues immediately
    console.log('parent: after child() call'); // runs BEFORE child's "after await"
  }

  parent();
  // Output:
  // parent: before child()
  // child: before await
  // parent: after child() call  ← sync continues
  // child: after await           ← then microtask resumes
}, 300);

// ---
setTimeout(() => {
  console.log('\n=== for await...of vs for...of ===');

  async function demo3() {
    // for await...of is for async iterables
    async function* generateItems() {
      yield await Promise.resolve(1);
      yield await Promise.resolve(2);
      yield await Promise.resolve(3);
    }

    const results = [];
    for await (const item of generateItems()) {
      results.push(item);
    }
    console.log('for await...of:', results); // [1, 2, 3]
  }

  demo3();
}, 600);
