// ============================================
// JSON Basics Examples
// ============================================

console.log('=== 1. JSON.stringify() ===');

const user = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Kyiv',
    country: 'Ukraine'
  }
};

// Basic serialization
const json = JSON.stringify(user);
console.log(typeof json);  // 'string'
console.log(json);
// {"name":"Alice","age":30,"hobbies":["reading","coding"],"address":{"city":"Kyiv","country":"Ukraine"}}

// Pretty printing with indentation
const pretty = JSON.stringify(user, null, 2);
console.log('\nPretty JSON:');
console.log(pretty);

console.log('\n=== 2. JSON.parse() ===');

const jsonString = '{"name":"Bob","age":25,"scores":[95,87,92]}';
const parsed = JSON.parse(jsonString);

console.log(typeof parsed);       // 'object'
console.log(parsed.name);         // 'Bob'
console.log(parsed.scores[0]);    // 95
console.log(Array.isArray(parsed.scores)); // true

console.log('\n=== 3. What JSON can NOT handle ===');

const tricky = {
  name: 'Test',
  fn: function() { return 42; },  // Lost!
  undef: undefined,               // Lost!
  sym: Symbol('id'),              // Lost!
  date: new Date(),               // Converted to string
  regex: /pattern/,               // Converted to {}
  nan: NaN,                       // Converted to null
  inf: Infinity                   // Converted to null
};

const trickyJson = JSON.stringify(tricky, null, 2);
console.log(trickyJson);
// Note: fn, undef, sym are gone completely
// date is a string, regex is {}, NaN/Infinity are null

console.log('\n=== 4. Replacer — filtering keys ===');

const data = {
  id: 1,
  username: 'alice',
  password: 'secret123',  // We want to hide this
  email: 'alice@example.com',
  internal: 'should be private'
};

// Array replacer — only include these keys
const safe = JSON.stringify(data, ['id', 'username', 'email'], 2);
console.log('Safe (array replacer):');
console.log(safe);

// Function replacer — transform or filter values
const censored = JSON.stringify(data, (key, value) => {
  if (key === 'password') return '[REDACTED]';
  if (key === 'internal') return undefined;  // Remove the key
  return value;
}, 2);
console.log('\nCensored (function replacer):');
console.log(censored);

console.log('\n=== 5. Reviver — transforming on parse ===');

const apiResponse = '{"name":"Alice","createdAt":"2024-01-15T10:30:00.000Z","age":30}';

// Without reviver: date is a string
const withoutReviver = JSON.parse(apiResponse);
console.log('Without reviver:', typeof withoutReviver.createdAt, withoutReviver.createdAt);
// string "2024-01-15T10:30:00.000Z"

// With reviver: date is a Date object
const withReviver = JSON.parse(apiResponse, (key, value) => {
  if (key === 'createdAt') return new Date(value);
  return value;
});
console.log('With reviver:', typeof withReviver.createdAt, withReviver.createdAt instanceof Date);
// object true

console.log('\n=== 6. Deep clone with JSON ===');

const original = {
  name: 'Alice',
  scores: [1, 2, 3],
  address: { city: 'Kyiv' }
};

// JSON clone — simple but has limitations (no functions, dates become strings, etc.)
const clone = JSON.parse(JSON.stringify(original));

clone.name = 'Bob';
clone.scores.push(4);
clone.address.city = 'Lviv';

console.log('Original:', original.name, original.scores, original.address.city);
// Alice [1,2,3] Kyiv
console.log('Clone:', clone.name, clone.scores, clone.address.city);
// Bob [1,2,3,4] Lviv

// Note: For modern code, use structuredClone() instead:
const modernClone = structuredClone(original);
console.log('structuredClone also works:', modernClone);

console.log('\n=== 7. JSON in practice — API simulation ===');

// Simulate saving to localStorage / sending to API
function saveToStorage(key, data) {
  const serialized = JSON.stringify(data);
  // localStorage.setItem(key, serialized);
  console.log(`Saved to "${key}":`, serialized.substring(0, 60) + '...');
  return serialized; // Return for demo purposes
}

function loadFromStorage(key, serialized) {
  // const serialized = localStorage.getItem(key);
  if (!serialized) return null;
  try {
    return JSON.parse(serialized);
  } catch (e) {
    console.error('Invalid JSON in storage:', e.message);
    return null;
  }
}

const settings = { theme: 'dark', language: 'uk', fontSize: 16 };
const saved = saveToStorage('settings', settings);
const loaded = loadFromStorage('settings', saved);
console.log('Loaded settings:', loaded);

console.log('\n=== 8. toJSON() custom serialization ===');

class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  // Called automatically by JSON.stringify()
  toJSON() {
    return `${this.amount} ${this.currency}`;
  }

  toString() {
    return `${this.amount} ${this.currency}`;
  }
}

const price = new Money(99.99, 'USD');
const cart = { item: 'Book', price };

console.log(JSON.stringify(cart));
// {"item":"Book","price":"99.99 USD"}

console.log('\n=== Best Practices ===');
console.log('1. Always use try/catch when parsing JSON from external sources');
console.log('2. Use replacer to exclude sensitive data before serialization');
console.log('3. Use reviver to restore Date objects from JSON strings');
console.log('4. Prefer structuredClone() over JSON parse/stringify for deep cloning');
console.log('5. Use JSON.stringify(data, null, 2) for readable debugging output');
console.log('6. Remember: JSON.stringify removes undefined, functions, and Symbols');
