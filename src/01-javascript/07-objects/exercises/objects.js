// ============================================
// OBJECTS Exercises
// ============================================
// Complete the TODO exercises below
// Run this file with: node src/01-javascript/07-objects/exercises/objects.js

const { isBoxedPrimitive } = require("node:util/types");

console.log('=== Exercise 1: Create and access ===');
// TODO: Create an object 'car' with brand, model, and year properties
// Access and log each property using both dot and bracket notation
// Your code here:
const car = {
  brand: 'Ford',
  model: 'Focus',
  year: 2012
};
console.log(`Dot brand ${car.brand}`);
console.log(`Dot model ${car.model}`);
console.log(`Dot year ${car.year}`);
console.log(`Bracket brand ${car['brand']}`);
console.log(`Bracket model ${car['model']}`);
console.log(`Bracket year ${car['year']}`);

console.log('\n=== Exercise 2: Object methods ===');
// TODO: Create an object 'calculator' with add, subtract methods
// Each method should use this.value and return this for chaining
// Example: calculator.add(5).subtract(2).getValue() should return 3
// Your code here:
const calculator = {
  value: 0,
  add(value) {
    this.value += value;
    return this;
  },
  subtract(value) {
    this.value -= value;
    return this;
  },
  getValue() {
    return this.value;
  }
};
console.log(calculator.add(5).subtract(2).getValue());

console.log('\n=== Exercise 3: Object destructuring ===');
// TODO: Destructure this object to get name and age
// Rename age to userAge
// Set default value for city to 'Unknown'
const user = { name: 'Alice', age: 25 };
// Your code here:
const {name, age} = user;
console.log(`name: ${name}`);
console.log(`age: ${age}`);

console.log('\n=== Exercise 4: Nested destructuring ===');
// TODO: Extract city and country from the nested address
const person = {
  name: 'Bob',
  address: {
    city: 'London',
    country: 'UK'
  }
};
// Your code here:
const { address: {city, country }} = person;
console.log(city);
console.log(country);


console.log('\n=== Exercise 5: Spread operator ===');
// TODO: Create a copy of original
// Add a new property 'c: 3' without modifying original
const original = { a: 1, b: 2 };
// Your code here:
const copy = {...original, c: 3};
console.log(original);
console.log(copy);

console.log('\n=== Exercise 6: Merge objects ===');
// TODO: Merge defaults and userSettings
// userSettings should override defaults
const defaults = { theme: 'light', fontSize: 14, sidebar: true };
const userSettings = { theme: 'dark', fontSize: 16 };
// Your code here:
const settings = {...defaults, ...userSettings};
console.log(settings);

console.log('\n=== Exercise 7: Object.keys/values/entries ===');
// TODO: Use Object methods to:
// 1. Get all property names
// 2. Get all values
// 3. Log each key-value pair
const product = { name: 'Laptop', price: 1000, inStock: true };
// Your code here:
const properties = Object.keys(product);
const values = Object.values(product);
console.log(properties);
console.log(values);

Object.entries(product).forEach(([key, value]) => console.log(`${key}: ${value}`));

console.log('\n=== Exercise 8: Transform object ===');
// TODO: Double all prices using Object.entries and Object.fromEntries
const prices = { apple: 1.5, banana: 0.5, orange: 2.0 };
// Your code here:
const doubled = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value*2])
);
console.log(doubled);

console.log('\n=== Exercise 9: this keyword ===');
// TODO: Fix this object so the greet method can access the name
/*
const person = {
  name: 'Alice',
  greet: () => {
    console.log(`Hello, I'm ${this.name}`);
  }
};
*/
// Your fixed code here:
const alice = {
  name: 'Alice',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
alice.greet();

console.log('\n=== Exercise 10: Optional chaining ===');
// TODO: Safely access user.profile.email using optional chaining
// Should not throw error if profile doesn't exist
const userData = { name: 'Bob' }; // no profile!
// Your code here:
console.log(userData?.profile?.email)

console.log('\n=== 🎯 Challenge: Deep clone ===');
// TODO: Create a deep clone function that copies nested objects
function deepClone(obj) {
  // Your code here
  // Hint: Use recursion or JSON.parse(JSON.stringify())
  return JSON.parse(JSON.stringify(obj));
}

// Test it (uncomment):
const orig = { a: 1, b: { c: 2 } };
const cloned = deepClone(orig);
cloned.b.c = 99;
console.log(orig.b.c); // Should still be 2


console.log('\n=== 🎯 Challenge: Pick properties ===');
// TODO: Create a function that picks specific properties from an object
function pick(obj, keys) {
  // Your code here
  // Hint: Use Object.fromEntries and filter
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, _]) => keys.includes(key))
      .map(([key, _]) => [key, obj[key]])
  );
}

// Test it (uncomment):
const data = { a: 1, b: 2, c: 3, d: 4 };
console.log(pick(data, ['a', 'c', 'e'])); // { a: 1, c: 3 }

console.log('\n=== 🎯 Challenge: Group by property ===');
// TODO: Group array of objects by a specific property
function groupBy(array, property) {
  // Your code here
  // Hint: Use reduce
  return array.reduce(
    (result, user) => {
      const value = user[property];

      if (!value){
        return result;
      }

      if (!result[value]) {
        result[value] = [];
      }

      result[value].push(user);

      return result;
    },
    {}
  );
}

// Test it (uncomment):
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
  { name: 'Anonimus', position: 'boss' }
];
console.log(groupBy(users, 'role'));
// Should be: { admin: [{...}, {...}], user: [{...}] }


console.log('\n=== 🎯 Challenge: Flatten object ===');
// TODO: Flatten nested object to dot notation
// Example: { a: { b: { c: 1 } } } -> { 'a.b.c': 1 }
function flattenObject(obj, prefix = '') {
  // Your code here
  // Hint: Use recursion
  const shouldFlatten = function(value) {
    return typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value);
  };

  return Object.entries(obj).reduce((flat, [key, value]) => {
    const flatKey = Boolean(prefix)
      ? prefix + '.' + key
      : key;

    if (shouldFlatten(value)) {
      return {...flat, ...flattenObject(value, flatKey)}
    } else {
     flat[flatKey] = value;
    }

    return flat;
  }, {});
}

// Test it (uncomment):
const nested = { a: 1, b: { c: 2, d: { e: 3, arr: [1, 3, 6], undef: undefined }, something: null } };
console.log(flattenObject(nested));
// Should be: { a: 1, 'b.c': 2, 'b.d.e': 3 }

console.log('\n=== 🎯 Challenge: Object diff ===');
// TODO: Find differences between two objects
function diff(obj1, obj2) {
  // Your code here
  // Return object with changed properties

  if(!obj1){
    return obj2;
  }

  if (!obj2) {
    return obj1;
  }

  return Object.entries(obj2).reduce((result, [key, value]) => {
    if (!obj1[key] || obj1[key] !== value) {
      result[key] = value;
    }
    return result;
  },
  {});
}

/** Finds different properties between two objects */
function diff2(obj1, obj2) {
  // Your code here
  // Return object with changed properties
  const set1 = new Set(Object.keys(obj1));
  const set2 = new Set(Object.keys(obj2));
  const diff = set1.symmetricDifference(set2);

  if (!diff){
    return {};
  }

  return diff.values().reduce((result, prop) => {
    result[prop] = obj1[prop] ?? obj2[prop];
    return result;
  },
  {});
}

// Test it (uncomment):
const before = { a: 1, b: 2, c: 3 };
const after = { a: 1, b: 999, d: 4 };
console.log(diff(before, after));
console.log(diff2(before, after));
// Should show: { b: 999, d: 4 } (or similar)


console.log('\n✅ Exercises completed! Check your answers with a mentor.');
