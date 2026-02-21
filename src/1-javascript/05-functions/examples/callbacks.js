// ============================================
// CALLBACKS Examples
// ============================================
// A callback is a function passed as an argument to another function
// to be executed later (called back)

console.log('=== 1. Simple Callbacks ===');

function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

function sayGoodbye() {
  console.log('Goodbye!');
}

greet('Alice', sayGoodbye);

// Inline callback
greet('Bob', function() {
  console.log('Nice to meet you!');
});

// Arrow function callback
greet('Charlie', () => console.log('See you later!'));

console.log('\n=== 2. Callbacks with Parameters ===');

function processData(data, callback) {
  console.log('Processing:', data);
  const result = data * 2;
  callback(result);
}

processData(5, function(result) {
  console.log('Result:', result);
});

// Arrow function version
processData(10, result => console.log('Result:', result));

console.log('\n=== 3. Callbacks for Asynchronous Operations ===');

// Simulate async operation with setTimeout
function fetchUser(userId, callback) {
  console.log(`Fetching user ${userId}...`);

  setTimeout(() => {
    const user = { id: userId, name: 'Alice' };
    callback(user);
  }, 1000);
}

console.log('Start');
fetchUser(1, user => {
  console.log('Got user:', user);
});
console.log('End'); // Runs before callback!

console.log('\n=== 4. Error-First Callbacks (Node.js Style) ===');

function readFile(filename, callback) {
  console.log(`Reading ${filename}...`);

  setTimeout(() => {
    if (filename === 'error.txt') {
      callback(new Error('File not found'), null);
    } else {
      callback(null, 'File contents here');
    }
  }, 500);
}

readFile('data.txt', (error, data) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Data:', data);
  }
});

readFile('error.txt', (error, data) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Data:', data);
  }
});

console.log('\n=== 5. Multiple Callbacks ===');

function calculateWithCallbacks(a, b, onSuccess, onError) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    onError('Both arguments must be numbers');
  } else {
    onSuccess(a + b);
  }
}

calculateWithCallbacks(
  5,
  3,
  result => console.log('Success:', result),
  error => console.log('Error:', error)
);

calculateWithCallbacks(
  5,
  '3',
  result => console.log('Success:', result),
  error => console.log('Error:', error)
);

console.log('\n=== 6. Callback Hell (Problem) ===');

// Multiple nested callbacks - hard to read!
function step1(callback) {
  setTimeout(() => {
    console.log('Step 1 complete');
    callback();
  }, 500);
}

function step2(callback) {
  setTimeout(() => {
    console.log('Step 2 complete');
    callback();
  }, 500);
}

function step3(callback) {
  setTimeout(() => {
    console.log('Step 3 complete');
    callback();
  }, 500);
}

// The "pyramid of doom"
step1(() => {
  step2(() => {
    step3(() => {
      console.log('All steps complete!');
    });
  });
});

console.log('\n=== 7. Array Methods with Callbacks ===');

const numbers = [1, 2, 3, 4, 5];

// forEach - execute callback for each element
console.log('--- forEach ---');
numbers.forEach(n => console.log('Number:', n));

// map - transform each element
console.log('\n--- map ---');
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

// filter - keep elements that pass test
console.log('\n--- filter ---');
const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens);

// find - get first element that passes test
console.log('\n--- find ---');
const firstEven = numbers.find(n => n % 2 === 0);
console.log('First even:', firstEven);

// some - check if ANY element passes test
console.log('\n--- some ---');
const hasEven = numbers.some(n => n % 2 === 0);
console.log('Has even?', hasEven);

// every - check if ALL elements pass test
console.log('\n--- every ---');
const allPositive = numbers.every(n => n > 0);
console.log('All positive?', allPositive);

// reduce - combine all elements
console.log('\n--- reduce ---');
const sum = numbers.reduce((total, n) => {
  console.log(`Total: ${total}, Current: ${n}`);
  return total + n;
}, 0);
console.log('Sum:', sum);

console.log('\n=== 8. Custom Callback-Based Functions ===');

// Custom forEach
function customForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

console.log('Using custom forEach:');
customForEach([10, 20, 30], (value, index) => {
  console.log(`[${index}]: ${value}`);
});

// Custom map
function customMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

const squared = customMap([1, 2, 3, 4], n => n * n);
console.log('Squared:', squared);

// Custom filter
function customFilter(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

const odds = customFilter([1, 2, 3, 4, 5], n => n % 2 !== 0);
console.log('Odds:', odds);

console.log('\n=== 9. Event Listeners (Browser-Style) ===');

// Simulating event listener pattern
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

const emitter = new EventEmitter();

// Register callbacks
emitter.on('userLogin', user => {
  console.log(`User logged in: ${user.name}`);
});

emitter.on('userLogin', user => {
  console.log(`Welcome, ${user.name}!`);
});

// Trigger event
emitter.emit('userLogin', { name: 'Alice', id: 1 });

console.log('\n=== 10. Practical Example: Data Processing ===');

// Process data with various callbacks
function processUserData(users, filterFn, transformFn, callback) {
  console.log('Processing users...');

  // Filter
  const filtered = users.filter(filterFn);
  console.log('After filter:', filtered.length);

  // Transform
  const transformed = filtered.map(transformFn);
  console.log('After transform:', transformed.length);

  // Call back with result
  callback(transformed);
}

const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 17, active: false },
  { name: 'Charlie', age: 30, active: true },
  { name: 'Diana', age: 16, active: true }
];

processUserData(
  users,
  user => user.age >= 18 && user.active,  // Filter: adults only
  user => ({ name: user.name.toUpperCase(), age: user.age }), // Transform
  result => console.log('Final result:', result)
);

console.log('\n=== Best Practices ===');
console.log('1. Use descriptive names for callback parameters');
console.log('2. Keep callbacks short and focused');
console.log('3. Handle errors properly (error-first pattern)');
console.log('4. Avoid deep nesting (callback hell) - use Promises/async-await');
console.log('5. Use arrow functions for simple callbacks');
console.log('6. Remember: callbacks can be executed multiple times (events)');
console.log('7. Be aware of timing - callbacks may execute later');
