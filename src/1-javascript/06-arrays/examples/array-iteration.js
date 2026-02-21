// ============================================
// ARRAY ITERATION Methods Examples
// ============================================

console.log('=== 1. forEach() - Execute Function for Each Element ===');

const numbers = [1, 2, 3, 4, 5];

// Basic forEach
console.log('Using forEach:');
numbers.forEach(n => {
  console.log(n);
});

// forEach with index
console.log('\nWith index:');
numbers.forEach((n, index) => {
  console.log(`[${index}]: ${n}`);
});

// forEach with array parameter
console.log('\nWith array reference:');
numbers.forEach((n, index, arr) => {
  console.log(`${n} is at index ${index} of array with length ${arr.length}`);
});

// forEach for side effects
const doubled = [];
numbers.forEach(n => {
  doubled.push(n * 2);
});
console.log('Doubled:', doubled);

// forEach doesn't return anything
const result = numbers.forEach(n => n * 2);
console.log('forEach return value:', result); // undefined

console.log('\n=== 2. find() - Get First Element That Matches ===');

const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
];

// Find by condition
const user = users.find(u => u.age > 28);
console.log('First user over 28:', user); // Bob

// Find returns undefined if not found
const notFound = users.find(u => u.age > 40);
console.log('User over 40:', notFound); // undefined

// Find with complex condition
const youngUser = users.find(u => u.age < 30 && u.name.startsWith('A'));
console.log('Young user starting with A:', youngUser); // Alice

// Find in array of primitives
const nums = [10, 20, 30, 40, 50];
const firstLarge = nums.find(n => n > 25);
console.log('First number > 25:', firstLarge); // 30

console.log('\n=== 3. findIndex() - Get Index of First Match ===');

// Find index
const index = users.findIndex(u => u.name === 'Bob');
console.log('Index of Bob:', index); // 1

// Returns -1 if not found
const notFoundIndex = users.findIndex(u => u.age > 40);
console.log('Index of user over 40:', notFoundIndex); // -1

// Difference between indexOf and findIndex
const values = [1, 2, 3, 4, 5];
console.log('indexOf(3):', values.indexOf(3));              // 2
console.log('findIndex(n => n === 3):', values.findIndex(n => n === 3)); // 2
console.log('findIndex(n => n > 3):', values.findIndex(n => n > 3));     // 3 (index of 4)

console.log('\n=== 4. findLast() and findLastIndex() ===');

const items = [
  { id: 1, status: 'active' },
  { id: 2, status: 'inactive' },
  { id: 3, status: 'active' },
  { id: 4, status: 'active' }
];

// Find last matching element
const lastActive = items.findLast(item => item.status === 'active');
console.log('Last active:', lastActive); // { id: 4, status: 'active' }

// Find last matching index
const lastActiveIndex = items.findLastIndex(item => item.status === 'active');
console.log('Last active index:', lastActiveIndex); // 3

console.log('\n=== 5. some() - Check if ANY Element Passes Test ===');

const scores = [45, 67, 82, 91, 55];

// Check if any score is above 90
const hasHighScore = scores.some(score => score > 90);
console.log('Has score > 90?', hasHighScore); // true

// Check if any score is below 50
const hasLowScore = scores.some(score => score < 50);
console.log('Has score < 50?', hasLowScore); // true

// Check with all failing
const allHigh = scores.some(score => score > 100);
console.log('Has score > 100?', allHigh); // false

// some() with objects
const products = [
  { name: 'Apple', inStock: false },
  { name: 'Banana', inStock: true },
  { name: 'Orange', inStock: false }
];

const hasInStock = products.some(p => p.inStock);
console.log('Has in-stock products?', hasInStock); // true

// some() stops at first match (short-circuit)
console.log('\nsome() stops early:');
const result1 = [1, 2, 3, 4, 5].some(n => {
  console.log('Checking:', n);
  return n > 2;
});
// Only checks 1, 2, 3 (stops at first true)

console.log('\n=== 6. every() - Check if ALL Elements Pass Test ===');

// Check if all scores pass
const allPass = scores.every(score => score >= 50);
console.log('All scores >= 50?', allPass); // false (45 is below)

const allAbove40 = scores.every(score => score >= 40);
console.log('All scores >= 40?', allAbove40); // true

// every() with objects
const allInStock = products.every(p => p.inStock);
console.log('All products in stock?', allInStock); // false

// Check array of same types
const allNumbers = [1, 2, 3, 4, 5].every(n => typeof n === 'number');
console.log('All numbers?', allNumbers); // true

const mixedTypes = [1, '2', 3].every(n => typeof n === 'number');
console.log('Mixed all numbers?', mixedTypes); // false

// every() stops at first failure (short-circuit)
console.log('\nevery() stops early:');
const result2 = [1, 2, 3, 4, 5].every(n => {
  console.log('Checking:', n);
  return n < 3;
});
// Only checks 1, 2, 3 (stops at first false)

console.log('\n=== 7. Combining some() and every() ===');

const ages = [18, 21, 25, 30, 35];

// Check if any minors
const hasMinors = ages.some(age => age < 18);
console.log('Has minors?', hasMinors); // false

// Check if all adults
const allAdults = ages.every(age => age >= 18);
console.log('All adults?', allAdults); // true

// Validation example
const passwords = ['Pass123!', 'weak', 'Strong456!', 'Secure789!'];

const hasStrongPassword = passwords.some(pwd => pwd.length >= 8);
console.log('Has strong password?', hasStrongPassword); // true

const allStrongPasswords = passwords.every(pwd => pwd.length >= 8);
console.log('All strong passwords?', allStrongPasswords); // false

console.log('\n=== 8. Practical Examples ===');

// Check permissions
const userPermissions = ['read', 'write', 'delete'];

const canRead = userPermissions.some(p => p === 'read');
const canWrite = userPermissions.some(p => p === 'write');
const canExecute = userPermissions.some(p => p === 'execute');

console.log('Can read?', canRead);       // true
console.log('Can write?', canWrite);     // true
console.log('Can execute?', canExecute); // false

// Form validation
const formFields = [
  { name: 'username', value: 'alice', valid: true },
  { name: 'email', value: '', valid: false },
  { name: 'password', value: 'pass123', valid: true }
];

const allFieldsValid = formFields.every(field => field.valid);
console.log('Form valid?', allFieldsValid); // false

const hasEmptyFields = formFields.some(field => field.value === '');
console.log('Has empty fields?', hasEmptyFields); // true

// Array validation
function isValidArray(arr) {
  return arr.length > 0 && arr.every(item => item != null);
}

console.log(isValidArray([1, 2, 3]));           // true
console.log(isValidArray([1, null, 3]));        // false
console.log(isValidArray([]));                  // false

console.log('\n=== 9. Comparison with find() vs filter() ===');

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// find() - returns first match
const firstEven = testArray.find(n => n % 2 === 0);
console.log('find (first even):', firstEven); // 2

// filter() - returns all matches
const allEvens = testArray.filter(n => n % 2 === 0);
console.log('filter (all evens):', allEvens); // [2, 4, 6, 8, 10]

// some() - returns boolean
const hasEven = testArray.some(n => n % 2 === 0);
console.log('some (has even):', hasEven); // true

// every() - returns boolean
const allEven = testArray.every(n => n % 2 === 0);
console.log('every (all even):', allEven); // false

console.log('\n=== 10. Performance Tips ===');

// Use find() instead of filter()[0]
const largeArray = Array.from({ length: 1000 }, (_, i) => i);

// ❌ Slower - checks all elements
const slowFind = largeArray.filter(n => n > 500)[0];

// ✅ Faster - stops at first match
const fastFind = largeArray.find(n => n > 500);

console.log('Both find same value:', slowFind === fastFind);

// Use some() instead of filter().length > 0
// ❌ Slower
const hasLargeNumbers = largeArray.filter(n => n > 500).length > 0;

// ✅ Faster
const hasLargeNumbers2 = largeArray.some(n => n > 500);

console.log('Both check same thing:', hasLargeNumbers === hasLargeNumbers2);

console.log('\n=== 11. Common Patterns ===');

// Check if array is empty
const emptyCheck = [];
const isEmpty = !emptyCheck.length;
console.log('Is empty?', isEmpty); // true

// Check if array has elements
const hasElements = emptyCheck.length > 0;
console.log('Has elements?', hasElements); // false

// Find and update
const todoList = [
  { id: 1, task: 'Buy milk', done: false },
  { id: 2, task: 'Walk dog', done: true },
  { id: 3, task: 'Write code', done: false }
];

// Find specific todo
const todo = todoList.find(t => t.id === 2);
if (todo) {
  console.log('Found todo:', todo.task);
}

// Check if all todos are done
const allDone = todoList.every(t => t.done);
console.log('All todos done?', allDone); // false

// Check if any todos are done
const anyDone = todoList.some(t => t.done);
console.log('Any todos done?', anyDone); // true

// Process each todo
todoList.forEach(todo => {
  const status = todo.done ? '✓' : '○';
  console.log(`${status} ${todo.task}`);
});

console.log('\n=== Best Practices ===');
console.log('1. Use forEach() only for side effects (logging, API calls)');
console.log('2. Use find() to get first matching element');
console.log('3. Use some() to check if at least one element matches');
console.log('4. Use every() to check if all elements match');
console.log('5. Use find() instead of filter()[0] for better performance');
console.log('6. Use some() instead of filter().length > 0');
console.log('7. Remember: find() returns element, findIndex() returns index');
console.log('8. some() and every() stop early (short-circuit evaluation)');
