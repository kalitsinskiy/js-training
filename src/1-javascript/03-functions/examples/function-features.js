// ============================================
// FUNCTION FEATURES Examples
// ============================================

console.log('=== 1. Parameters vs Arguments ===');

// Parameters - variables in function definition
function greet(name, age) { // name and age are parameters
  console.log(`Hello ${name}, you are ${age} years old`);
}

// Arguments - actual values passed when calling
greet('Alice', 25); // 'Alice' and 25 are arguments

// More arguments than parameters
function add(a, b) {
  return a + b;
}
console.log(add(1, 2, 3, 4)); // Extra args ignored: 3

// Fewer arguments than parameters
function multiply(x, y) {
  console.log('x:', x, 'y:', y);
  return x * y;
}
console.log(multiply(5)); // y is undefined: NaN

console.log('\n=== 2. Default Parameters ===');

function greetUser(name = 'Guest', greeting = 'Hello') {
  console.log(`${greeting}, ${name}!`);
}

greetUser();                    // Uses both defaults
greetUser('Alice');             // Uses default greeting
greetUser('Bob', 'Hi');         // Uses provided values
greetUser(undefined, 'Hey');    // Uses default name

// Default parameter can reference previous parameters
function createMessage(name = 'User', message = `Welcome, ${name}!`) {
  console.log(message);
}

createMessage('Alice'); // "Welcome, Alice!"

console.log('\n=== 3. Rest Parameters ===');

// Collect remaining arguments into an array
function sum(...numbers) {
  console.log('Numbers:', numbers); // Array
  return numbers.reduce((total, n) => total + n, 0);
}

console.log('sum(1, 2):', sum(1, 2));
console.log('sum(1, 2, 3, 4, 5):', sum(1, 2, 3, 4, 5));

// Mix regular parameters with rest
function introduce(greeting, ...names) {
  console.log(`${greeting} ${names.join(', ')}!`);
}

introduce('Hello', 'Alice', 'Bob', 'Charlie');

// Rest must be last parameter
// function invalid(...rest, other) {} // ❌ Syntax Error

console.log('\n=== 4. Spread Operator with Functions ===');

const numbers = [1, 2, 3, 4, 5];

// Spread array as arguments
console.log('Max:', Math.max(...numbers)); // Same as Math.max(1, 2, 3, 4, 5)

function multiply3(a, b, c) {
  return a * b * c;
}

const values = [2, 3, 4];
console.log('Result:', multiply3(...values));

// Combine arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log('Combined:', combined);

console.log('\n=== 5. Function Scope ===');

const global = 'I am global';

function outer() {
  const outerVar = 'I am outer';

  function inner() {
    const innerVar = 'I am inner';

    // Inner can access all scopes
    console.log(global);    // ✅ Works
    console.log(outerVar);  // ✅ Works
    console.log(innerVar);  // ✅ Works
  }

  inner();
  // console.log(innerVar); // ❌ Error: innerVar not accessible
}

outer();
// console.log(outerVar); // ❌ Error: outerVar not accessible

console.log('\n=== 6. Closures ===');

// Inner function "remembers" outer function's variables
function createCounter() {
  let count = 0; // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log('Initial:', counter.getCount());      // 0
console.log('After increment:', counter.increment()); // 1
console.log('After increment:', counter.increment()); // 2
console.log('After decrement:', counter.decrement()); // 1
// console.log(count); // ❌ Error: count is private

// Each counter is independent
const counter2 = createCounter();
console.log('Counter2:', counter2.getCount()); // 0

console.log('\n=== 7. Closure Examples ===');

// Private variables
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private

  return {
    deposit(amount) {
      balance += amount;
      console.log(`Deposited: $${amount}, New balance: $${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log('Insufficient funds');
      } else {
        balance -= amount;
        console.log(`Withdrawn: $${amount}, New balance: $${balance}`);
      }
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.withdraw(30);
console.log('Balance:', account.getBalance());
// console.log(balance); // ❌ Cannot access private balance

// Function factory with closure
function makeMultiplier(factor) {
  return function(number) {
    return number * factor; // Remembers 'factor'
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log('double(5):', double(5));  // 10
console.log('triple(5):', triple(5));  // 15

console.log('\n=== 8. IIFE (Immediately Invoked Function Expression) ===');

// Execute function immediately
(function() {
  const message = 'I am private';
  console.log('IIFE executed:', message);
})();

// console.log(message); // ❌ Error: message not accessible

// With parameters
(function(name) {
  console.log(`Hello, ${name}!`);
})('Alice');

// Arrow function IIFE
(() => {
  console.log('Arrow IIFE executed');
})();

console.log('\n=== 9. Pure Functions ===');

// Pure - same input always gives same output, no side effects
function pureAdd(a, b) {
  return a + b;
}

console.log(pureAdd(2, 3)); // Always 5
console.log(pureAdd(2, 3)); // Always 5

// Impure - depends on external state
let total = 0;
function impureAdd(n) {
  total += n; // Side effect: modifies external variable
  return total;
}

console.log(impureAdd(5)); // 5
console.log(impureAdd(5)); // 10 (different result!)

// Pure function with objects - return new object
function updateUser(user, newName) {
  return { ...user, name: newName }; // New object
}

const user = { name: 'Alice', age: 25 };
const updatedUser = updateUser(user, 'Bob');
console.log('Original:', user);      // Unchanged
console.log('Updated:', updatedUser);

console.log('\n=== 10. Recursion ===');

// Function calling itself
function countdown(n) {
  if (n <= 0) {
    console.log('Done!');
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(5);

// Recursive calculation
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log('5! =', factorial(5)); // 120

// Recursive array processing
function sumArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumArray(arr.slice(1));
}

console.log('Sum:', sumArray([1, 2, 3, 4, 5])); // 15

console.log('\n=== 11. Function Arguments Object (Legacy) ===');

// 'arguments' - array-like object containing all arguments
function oldStyleSum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log('oldStyleSum:', oldStyleSum(1, 2, 3, 4, 5));

// Modern way: use rest parameters
function modernSum(...numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

console.log('modernSum:', modernSum(1, 2, 3, 4, 5));

console.log('\n=== 12. Named Parameters (Object Pattern) ===');

// Instead of many parameters
function createUser(name, age, email, isActive, role) {
  // Hard to remember order!
}

// Use object for named parameters
function createUserBetter({ name, age, email, isActive = true, role = 'user' }) {
  console.log({ name, age, email, isActive, role });
}

createUserBetter({
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
  // isActive and role use defaults
});

console.log('\n=== Best Practices ===');
console.log('1. Use default parameters for optional values');
console.log('2. Use rest parameters instead of arguments object');
console.log('3. Keep functions pure when possible (no side effects)');
console.log('4. Use closures for private data');
console.log('5. Use object parameters for functions with many options');
console.log('6. Limit function parameters to 3-4 max');
console.log('7. Be careful with recursion (can cause stack overflow)');
console.log('8. Return new values instead of mutating parameters');
