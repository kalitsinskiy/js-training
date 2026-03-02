// ============================================
// OBJECT DESTRUCTURING and SPREAD Examples
// ============================================

console.log('=== 1. Basic Destructuring ===');

const user = {
  name: 'Alice',
  age: 25,
  city: 'London'
};

// Extract properties
const { name, age } = user;
console.log('Name:', name); // 'Alice'
console.log('Age:', age);   // 25

// Extract all
const { name: n, age: a, city: c } = user;
console.log(n, a, c);

console.log('\n=== 2. Renaming Properties ===');

// Rename during destructuring
const { name: userName, age: userAge } = user;
console.log('userName:', userName);
console.log('userAge:', userAge);

// Original names still work on object
console.log('user.name:', user.name);

console.log('\n=== 3. Default Values ===');

const settings = {
  theme: 'dark',
  language: 'en'
};

// With defaults
const { theme, language, notifications = true } = settings;
console.log('Theme:', theme);
console.log('Language:', language);
console.log('Notifications:', notifications); // true (default)

// Default only used for undefined, not null
const { value = 10 } = { value: null };
console.log('Value:', value); // null (not default!)

console.log('\n=== 4. Nested Destructuring ===');

const company = {
  name: 'Tech Corp',
  address: {
    street: '123 Main St',
    city: 'New York',
    zip: '10001'
  }
};

// Destructure nested object
const {
  name: companyName,
  address: { city, zip }
} = company;

console.log('Company:', companyName);
console.log('City:', city);
console.log('Zip:', zip);

console.log('\n=== 5. Rest in Destructuring ===');

const person = {
  firstName: 'Alice',
  lastName: 'Smith',
  age: 25,
  city: 'London',
  country: 'UK'
};

// Extract some, collect rest
const { firstName, lastName, ...details } = person;
console.log('Name:', firstName, lastName);
console.log('Details:', details); // { age: 25, city: 'London', country: 'UK' }

console.log('\n=== 6. Destructuring in Function Parameters ===');

// Instead of this:
function greet1(user) {
  console.log(`Hello, ${user.name}!`);
}

// Do this:
function greet2({ name, age }) {
  console.log(`Hello, ${name}, you are ${age} years old`);
}

greet2({ name: 'Bob', age: 30 });

// With defaults
function createUser({ name, age = 18, role = 'user' }) {
  return { name, age, role };
}

console.log(createUser({ name: 'Charlie' }));
console.log(createUser({ name: 'Diana', age: 25, role: 'admin' }));

console.log('\n=== 7. Spread Operator - Copying ===');

const original = {
  x: 1,
  y: 2,
  z: 3
};

// Shallow copy
const copy = { ...original };
copy.x = 99;

console.log('Original:', original); // { x: 1, y: 2, z: 3 }
console.log('Copy:', copy);         // { x: 99, y: 2, z: 3 }

console.log('\n=== 8. Spread Operator - Merging ===');

const defaults = {
  theme: 'light',
  fontSize: 14,
  notifications: true
};

const userPrefs = {
  theme: 'dark',
  fontSize: 16
};

// Merge (later properties override earlier ones)
const finalSettings = { ...defaults, ...userPrefs };
console.log('Final settings:', finalSettings);
// { theme: 'dark', fontSize: 16, notifications: true }

console.log('\n=== 9. Spread Operator - Adding Properties ===');

const base = { a: 1, b: 2 };

// Add new properties
const extended = { ...base, c: 3, d: 4 };
console.log('Extended:', extended);

// Override existing properties
const modified = { ...base, a: 99 };
console.log('Modified:', modified);

console.log('\n=== 10. Shallow vs Deep Copy ===');

// Shallow copy problem
const nested = {
  name: 'Alice',
  address: {
    city: 'London'
  }
};

const shallowCopy = { ...nested };
shallowCopy.address.city = 'Paris'; // Modifies original!

console.log('Original city:', nested.address.city); // 'Paris'
console.log('Copy city:', shallowCopy.address.city); // 'Paris'

// Deep copy solution
const deepCopy = JSON.parse(JSON.stringify(nested));
deepCopy.address.city = 'Berlin';

console.log('After deep copy:', nested.address.city); // 'Paris'
console.log('Deep copy city:', deepCopy.address.city); // 'Berlin'

// Deep copy with structuredClone (modern)
const deepCopy2 = structuredClone(nested);

console.log('\n=== 11. Combining Destructuring and Spread ===');

const fullUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
  city: 'London'
};

// Extract some, keep rest
const { id, email, ...publicInfo } = fullUser;
console.log('ID:', id);
console.log('Email:', email);
console.log('Public info:', publicInfo);

// Update immutably
const updatedUser = {
  ...fullUser,
  age: 26,
  city: 'Paris'
};
console.log('Original:', fullUser);
console.log('Updated:', updatedUser);

console.log('\n=== 12. Practical Patterns ===');

// Remove property immutably
const data = { a: 1, b: 2, c: 3, d: 4 };
const { b, ...withoutB } = data;
console.log('Without b:', withoutB); // { a: 1, c: 3, d: 4 }

// Swap property names
const { name: fullName, ...rest } = { name: 'Alice', age: 25 };
const renamed = { fullName, ...rest };
console.log('Renamed:', renamed); // { fullName: 'Alice', age: 25 }

// Conditional properties
const includeEmail = true;
const userData = {
  name: 'Bob',
  age: 30,
  ...(includeEmail && { email: 'bob@example.com' })
};
console.log('With conditional:', userData);

// Function options pattern
function createServer(options = {}) {
  const {
    port = 3000,
    host = 'localhost',
    secure = false,
    ...otherOptions
  } = options;

  console.log(`Server: ${host}:${port}, secure: ${secure}`);
  console.log('Other options:', otherOptions);
}

createServer({ port: 8080, debug: true });

console.log('\n=== Best Practices ===');
console.log('1. Use destructuring to extract only needed properties');
console.log('2. Use default values in destructuring');
console.log('3. Use spread to copy and merge objects');
console.log('4. Be aware of shallow vs deep copy');
console.log('5. Use destructuring in function parameters');
console.log('6. Combine destructuring and spread for immutable updates');
console.log('7. Use rest (...) to collect remaining properties');
console.log('8. Remember: later properties override earlier ones in spread');
