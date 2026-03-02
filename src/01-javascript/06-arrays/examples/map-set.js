// ============================================
// MAP and SET Examples
// ============================================

console.log('=== 1. Set — unique values only ===');

// Set stores only UNIQUE values (no duplicates)
const set = new Set([1, 2, 3, 2, 1, 3]);
console.log(set);          // Set(3) { 1, 2, 3 }
console.log(set.size);     // 3 (not .length!)

// Add / delete / has
set.add(4);
set.add(1);           // duplicate — ignored
console.log(set.has(2));   // true
console.log(set.has(99));  // false
set.delete(2);
console.log(set);          // Set(3) { 1, 3, 4 }

// Clear all
const tmp = new Set([1, 2]);
tmp.clear();
console.log(tmp.size); // 0

console.log('\n=== 2. Set — most common use: remove duplicates ===');

const withDups = [1, 2, 3, 2, 1, 4, 3];
const unique = [...new Set(withDups)];
console.log('Unique:', unique); // [1, 2, 3, 4]

const tags = ['js', 'node', 'js', 'react', 'node', 'js'];
const uniqueTags = [...new Set(tags)];
console.log('Unique tags:', uniqueTags); // ['js', 'node', 'react']

// Also works for strings
const letters = [...new Set('banana')];
console.log('Unique letters:', letters); // ['b', 'a', 'n']

console.log('\n=== 3. Set — iteration ===');

const fruits = new Set(['apple', 'banana', 'cherry']);

// for...of
for (const fruit of fruits) {
  console.log(fruit);
}

// forEach
fruits.forEach(fruit => console.log('  -', fruit));

// Convert to array when you need array methods
const fruitArray = Array.from(fruits);
console.log('Sorted:', fruitArray.sort());

console.log('\n=== 4. Set — set operations (union, intersection, difference) ===');

const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

// Union — all elements from both
const union = new Set([...a, ...b]);
console.log('Union:', [...union]);         // [1, 2, 3, 4, 5, 6]

// Intersection — only elements in both
const intersection = new Set([...a].filter(x => b.has(x)));
console.log('Intersection:', [...intersection]); // [3, 4]

// Difference — elements in a but not in b
const difference = new Set([...a].filter(x => !b.has(x)));
console.log('Difference a-b:', [...difference]); // [1, 2]

console.log('\n=== 5. Map — key/value pairs (better than plain object) ===');

// Map stores key-value pairs, like an object, but:
// - Keys can be ANY type (not just strings)
// - Maintains insertion order
// - Has a .size property
// - Better performance for frequent add/delete

const map = new Map();
map.set('name', 'Alice');
map.set('age', 30);
map.set(42, 'the answer');     // number as key
map.set(true, 'yes');          // boolean as key

console.log(map.get('name'));  // 'Alice'
console.log(map.get(42));      // 'the answer'
console.log(map.size);         // 4
console.log(map.has('age'));   // true
console.log(map.has('email')); // false

map.delete('age');
console.log(map.size);         // 3

console.log('\n=== 6. Map — create from array of pairs ===');

// Initialize with entries
const scores = new Map([
  ['Alice', 95],
  ['Bob', 87],
  ['Charlie', 92]
]);

console.log(scores.get('Alice')); // 95
console.log(scores.get('Bob'));   // 87

// Convert Map → array of entries
console.log([...scores.entries()]); // [['Alice', 95], ['Bob', 87], ...]
console.log([...scores.keys()]);    // ['Alice', 'Bob', 'Charlie']
console.log([...scores.values()]); // [95, 87, 92]

console.log('\n=== 7. Map — iteration ===');

const config = new Map([
  ['host', 'localhost'],
  ['port', 3000],
  ['debug', true]
]);

// for...of (most common)
for (const [key, value] of config) {
  console.log(`${key}: ${value}`);
}

// forEach
config.forEach((value, key) => {  // Note: value comes FIRST in forEach
  console.log(`  ${key} = ${value}`);
});

console.log('\n=== 8. Map vs plain Object ===');

console.log('Use Map when:');
console.log('  - keys are not strings (numbers, objects)');
console.log('  - key set changes frequently (add/delete)');
console.log('  - you need to count items or store metadata');
console.log('  - order of insertion matters');
console.log('');
console.log('Use plain Object when:');
console.log('  - keys are strings (like a config or DTO)');
console.log('  - you need JSON serialization');
console.log('  - you need dot notation: obj.key');

// Object has prototype pollution risk:
const obj = {};
console.log('toString' in obj); // true — inherited from Object.prototype!

// Map has NO prototype pollution:
const m = new Map();
console.log(m.has('toString')); // false — clean

// JSON: Map doesn't serialize by default
const mapData = new Map([['a', 1]]);
console.log(JSON.stringify(mapData));      // {} ← lost!
console.log(JSON.stringify([...mapData])); // [["a",1]] ← use entries

console.log('\n=== 9. Map — practical patterns ===');

// Pattern 1: Count frequency
function countFrequency(arr) {
  const freq = new Map();
  for (const item of arr) {
    freq.set(item, (freq.get(item) ?? 0) + 1);
  }
  return freq;
}

const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
const freq = countFrequency(words);
console.log('apple:', freq.get('apple'));   // 3
console.log('banana:', freq.get('banana')); // 2

// Pattern 2: Cache (memoization)
const cache = new Map();
function expensiveFn(n) {
  if (cache.has(n)) return cache.get(n);
  const result = n * n; // simulate expensive work
  cache.set(n, result);
  return result;
}

// Pattern 3: Map with object keys (e.g. DOM nodes, class instances)
const elementData = new Map();
// In browser: elementData.set(domElement, { clicks: 0 });
// elementData.get(domElement).clicks++;

// Pattern 4: Group by key
function groupBy(arr, keyFn) {
  const groups = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
}

const people = [
  { name: 'Alice', dept: 'Engineering' },
  { name: 'Bob', dept: 'Design' },
  { name: 'Charlie', dept: 'Engineering' },
];
const byDept = groupBy(people, p => p.dept);
console.log('Engineering:', byDept.get('Engineering').map(p => p.name));

console.log('\n=== 10. WeakMap and WeakSet — brief intro ===');

console.log('WeakMap: same as Map, but:');
console.log('  - keys must be OBJECTS (not primitives)');
console.log('  - keys are weakly held (garbage collected when no other refs)');
console.log('  - no iteration, no .size');
console.log('  - use case: attach private data to objects without memory leaks');
console.log('');
console.log('WeakSet: same as Set, but:');
console.log('  - values must be OBJECTS');
console.log('  - weakly held (garbage collected)');
console.log('  - use case: track which objects have been processed');
console.log('');

// WeakMap example: private data pattern
const _private = new WeakMap();

class User {
  constructor(name, password) {
    _private.set(this, { password });
    this.name = name;
  }
  checkPassword(input) {
    return _private.get(this).password === input;
  }
}

const user = new User('Alice', 'secret123');
console.log(user.name);              // 'Alice'
console.log(user.checkPassword('secret123')); // true
console.log(user.password);          // undefined (not on the object)
// When 'user' is garbage collected, WeakMap entry is removed too

console.log('\n=== Best Practices ===');
console.log('1. Use Set to remove duplicates from arrays: [...new Set(arr)]');
console.log('2. Use Map instead of {} when keys are not strings');
console.log('3. Use Map for counting/frequency: map.set(k, (map.get(k) ?? 0) + 1)');
console.log('4. Remember: Map.size (not .length), Set.size (not .length)');
console.log('5. Map keys use SameValueZero equality (like ===, but NaN === NaN)');
console.log('6. Convert Map to JSON: JSON.stringify([...map]) or Object.fromEntries(map)');
console.log('7. Use WeakMap for private instance data to avoid memory leaks');
