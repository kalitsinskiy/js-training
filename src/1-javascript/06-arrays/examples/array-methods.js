// ============================================
// ARRAY METHODS Examples (map, filter, reduce)
// ============================================

console.log('=== 1. map() - Transform Each Element ===');

const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
console.log('Original:', numbers);  // [1, 2, 3, 4, 5]
console.log('Doubled:', doubled);   // [2, 4, 6, 8, 10]

// Square each number
const squared = numbers.map(n => n * n);
console.log('Squared:', squared);   // [1, 4, 9, 16, 25]

// map() with index
const withIndex = numbers.map((n, i) => `${i}: ${n}`);
console.log('With index:', withIndex); // ['0: 1', '1: 2', ...]

// Transform objects
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

const names = users.map(user => user.name);
console.log('Names:', names); // ['Alice', 'Bob', 'Charlie']

const upperNames = users.map(user => user.name.toUpperCase());
console.log('Upper names:', upperNames); // ['ALICE', 'BOB', 'CHARLIE']

console.log('\n=== 2. filter() - Keep Elements That Pass Test ===');

// Keep even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens); // [2, 4]

// Keep odd numbers
const odds = numbers.filter(n => n % 2 !== 0);
console.log('Odds:', odds); // [1, 3, 5]

// Keep numbers greater than 3
const greaterThan3 = numbers.filter(n => n > 3);
console.log('Greater than 3:', greaterThan3); // [4, 5]

// Filter objects
const adults = users.filter(user => user.age >= 30);
console.log('Adults:', adults);
// [{ name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }]

// Filter with multiple conditions
const youngAdults = users.filter(user => user.age >= 25 && user.age < 35);
console.log('Young adults:', youngAdults);

// Filter truthy values
const mixed = [0, 1, false, 2, '', 3, null, undefined, 4];
const truthyOnly = mixed.filter(Boolean);
console.log('Truthy only:', truthyOnly); // [1, 2, 3, 4]

console.log('\n=== 3. reduce() - Combine All Elements ===');

// Sum all numbers
const sum = numbers.reduce((total, n) => total + n, 0);
console.log('Sum:', sum); // 15

// Product of all numbers
const product = numbers.reduce((total, n) => total * n, 1);
console.log('Product:', product); // 120

// Find maximum
const max = numbers.reduce((max, n) => n > max ? n : max, numbers[0]);
console.log('Max:', max); // 5

// Find minimum
const min = numbers.reduce((min, n) => n < min ? n : min, numbers[0]);
console.log('Min:', min); // 1

// Concatenate strings
const words = ['Hello', 'World', 'JavaScript'];
const sentence = words.reduce((str, word) => str + ' ' + word, '');
console.log('Sentence:', sentence.trim()); // "Hello World JavaScript"

console.log('\n=== 4. reduce() - Advanced ===');

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log('Count:', count);
// { apple: 3, banana: 2, orange: 1 }

// Group by property
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
  { name: 'Diana', age: 30 }
];

const groupedByAge = people.reduce((acc, person) => {
  const age = person.age;
  if (!acc[age]) {
    acc[age] = [];
  }
  acc[age].push(person);
  return acc;
}, {});
console.log('Grouped by age:', groupedByAge);

// Flatten nested arrays
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log('Flattened:', flattened); // [1, 2, 3, 4, 5, 6]

// Sum array of objects
const items = [
  { name: 'apple', price: 1.5 },
  { name: 'banana', price: 0.5 },
  { name: 'orange', price: 2.0 }
];

const total = items.reduce((sum, item) => sum + item.price, 0);
console.log('Total price:', total); // 4.0

console.log('\n=== 5. Method Chaining ===');

// Combine map, filter, reduce
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .filter(n => n % 2 === 0)        // [2, 4, 6, 8, 10]
  .map(n => n * 2)                 // [4, 8, 12, 16, 20]
  .reduce((sum, n) => sum + n, 0); // 60

console.log('Chained result:', result);

// Real-world example: process user data
const usersData = [
  { name: 'Alice', age: 17, score: 85 },
  { name: 'Bob', age: 25, score: 92 },
  { name: 'Charlie', age: 19, score: 78 },
  { name: 'Diana', age: 30, score: 95 }
];

const avgAdultScore = usersData
  .filter(user => user.age >= 18)          // Adults only
  .map(user => user.score)                 // Extract scores
  .reduce((sum, score, i, arr) => {        // Calculate average
    sum += score;
    return i === arr.length - 1 ? sum / arr.length : sum;
  }, 0);

console.log('Average adult score:', avgAdultScore);

console.log('\n=== 6. map() vs forEach() ===');

// forEach - for side effects (returns undefined)
const prices = [10, 20, 30];
console.log('Using forEach:');
prices.forEach(price => {
  console.log(`Price: $${price}`);
});

// map - for transformation (returns new array)
const withTax = prices.map(price => price * 1.1);
console.log('With tax:', withTax);

// ❌ Bad: using map for side effects
prices.map(price => console.log(price)); // Don't do this!

// ✅ Good: using forEach for side effects
prices.forEach(price => console.log(price));

// ❌ Bad: using forEach when you need a new array
const doubled2 = [];
prices.forEach(price => {
  doubled2.push(price * 2);
});

// ✅ Good: using map when you need a new array
const doubled3 = prices.map(price => price * 2);

console.log('\n=== 7. Common Patterns ===');

// Remove duplicates
const withDuplicates = [1, 2, 2, 3, 3, 3, 4, 4, 5];
const unique = [...new Set(withDuplicates)];
console.log('Unique:', unique); // [1, 2, 3, 4, 5]

// Or using reduce
const unique2 = withDuplicates.reduce((acc, n) => {
  if (!acc.includes(n)) {
    acc.push(n);
  }
  return acc;
}, []);
console.log('Unique (reduce):', unique2);

// Get specific properties from array of objects
const productNames = items.map(item => item.name);
console.log('Product names:', productNames);

// Transform array to object
const arr = ['a', 'b', 'c'];
const obj = arr.reduce((acc, letter, i) => {
  acc[letter] = i;
  return acc;
}, {});
console.log('Array to object:', obj); // { a: 0, b: 1, c: 2 }

// Partition array (split into two groups)
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const { even, odd } = nums.reduce((acc, n) => {
  if (n % 2 === 0) {
    acc.even.push(n);
  } else {
    acc.odd.push(n);
  }
  return acc;
}, { even: [], odd: [] });

console.log('Even:', even);
console.log('Odd:', odd);

console.log('\n=== 8. Performance Considerations ===');

// Single pass vs multiple passes
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ❌ Multiple passes (less efficient)
const result1 = data
  .filter(n => n > 5)
  .map(n => n * 2)
  .filter(n => n < 20);

// ✅ Single pass with reduce (more efficient)
const result2 = data.reduce((acc, n) => {
  if (n > 5) {
    const doubled = n * 2;
    if (doubled < 20) {
      acc.push(doubled);
    }
  }
  return acc;
}, []);

console.log('Result 1:', result1);
console.log('Result 2:', result2);
// Both produce same result, but result2 is faster for large arrays

console.log('\n=== 9. Error Handling ===');

// Always check if result exists
const numbersArr = [1, 2, 3, 4, 5];

const found = numbersArr.find(n => n > 10);
if (found) {
  console.log('Found:', found);
} else {
  console.log('Not found');
}

// Safe property access in map
const usersWithPhone = [
  { name: 'Alice', phone: '123' },
  { name: 'Bob' }, // No phone!
  { name: 'Charlie', phone: '789' }
];

const phones = usersWithPhone.map(user => user.phone || 'N/A');
console.log('Phones:', phones); // ['123', 'N/A', '789']

console.log('\n=== Best Practices ===');
console.log('1. Use map() for transformations, forEach() for side effects');
console.log('2. Use filter() to keep elements, not map()');
console.log('3. Use reduce() for aggregations and complex transformations');
console.log('4. Chain methods for readable data transformations');
console.log('5. Always provide initial value to reduce()');
console.log('6. Keep callback functions pure (no side effects in map/filter)');
console.log('7. Consider performance for large arrays');
console.log('8. Use descriptive names for reduce accumulator');
