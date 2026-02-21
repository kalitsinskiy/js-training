// ============================================
// HIGHER-ORDER FUNCTIONS Examples
// ============================================
// A higher-order function either:
// 1. Takes a function as an argument, OR
// 2. Returns a function

console.log('=== 1. Functions that Take Functions ===');

// Simple example - execute a function
function executeFunction(fn, value) {
  console.log('Executing function...');
  return fn(value);
}

const double = x => x * 2;
const square = x => x * x;

console.log('Result:', executeFunction(double, 5));  // 10
console.log('Result:', executeFunction(square, 5));  // 25

// Repeat a function n times
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

console.log('\nRepeating 3 times:');
repeat(3, i => console.log(`Iteration ${i}`));

console.log('\n=== 2. Functions that Return Functions ===');

// Function factory - creates customized functions
function makeMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double2 = makeMultiplier(2);
const triple = makeMultiplier(3);
const times10 = makeMultiplier(10);

console.log('double2(5):', double2(5));    // 10
console.log('triple(5):', triple(5));      // 15
console.log('times10(5):', times10(5));    // 50

// Greeting generator
function makeGreeter(greeting) {
  return name => `${greeting}, ${name}!`;
}

const sayHello = makeGreeter('Hello');
const sayHi = makeGreeter('Hi');
const sayGoodbye = makeGreeter('Goodbye');

console.log(sayHello('Alice'));
console.log(sayHi('Bob'));
console.log(sayGoodbye('Charlie'));

console.log('\n=== 3. Built-in Higher-Order Functions ===');

const numbers = [1, 2, 3, 4, 5];

// Array.map - transforms each element
const doubled = numbers.map(n => n * 2);
console.log('Original:', numbers);
console.log('Doubled:', doubled);

// Array.filter - keeps elements that pass test
const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens);

// Array.reduce - combines all elements into single value
const sum = numbers.reduce((total, n) => total + n, 0);
console.log('Sum:', sum);

// Chaining
const result = numbers
  .filter(n => n > 2)          // [3, 4, 5]
  .map(n => n * 2)             // [6, 8, 10]
  .reduce((sum, n) => sum + n); // 24

console.log('Chained result:', result);

console.log('\n=== 4. Function Composition ===');

// Combine functions to create new behavior
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

// First multiply, then add
const multiplyThenAdd = compose(addOne, multiplyByTwo);
console.log('multiplyThenAdd(5):', multiplyThenAdd(5)); // (5 * 2) + 1 = 11

// First add, then multiply
const addThenMultiply = compose(multiplyByTwo, addOne);
console.log('addThenMultiply(5):', addThenMultiply(5)); // (5 + 1) * 2 = 12

console.log('\n=== 5. Partial Application ===');

// Create specialized functions from general ones
function multiply(a, b) {
  return a * b;
}

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const double3 = partial(multiply, 2);
const triple2 = partial(multiply, 3);

console.log('double3(5):', double3(5));  // 2 * 5 = 10
console.log('triple2(5):', triple2(5));  // 3 * 5 = 15

console.log('\n=== 6. Currying ===');

// Transform function with multiple args into sequence of functions
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function(...moreArgs) {
        return curried(...args, ...moreArgs);
      };
    }
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log('curriedAdd(1, 2, 3):', curriedAdd(1, 2, 3));     // 6
console.log('curriedAdd(1)(2)(3):', curriedAdd(1)(2)(3));     // 6
console.log('curriedAdd(1, 2)(3):', curriedAdd(1, 2)(3));     // 6

const add5 = curriedAdd(5);
console.log('add5(10, 15):', add5(10, 15)); // 30

console.log('\n=== 7. Decorator Pattern ===');

// Add functionality to existing functions
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling with args: ${args}`);
    const result = fn(...args);
    console.log(`Result: ${result}`);
    return result;
  };
}

function withTiming(fn) {
  return function(...args) {
    const start = Date.now();
    const result = fn(...args);
    const end = Date.now();
    console.log(`Execution time: ${end - start}ms`);
    return result;
  };
}

// Original function
function slowAdd(a, b) {
  // Simulate slow operation
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum = a + b;
  }
  return sum;
}

// Decorate it
const loggedAdd = withLogging(slowAdd);
const timedAdd = withTiming(slowAdd);

console.log('\nWith logging:');
loggedAdd(3, 4);

console.log('\nWith timing:');
timedAdd(3, 4);

// Combine decorators
const fullyDecoratedAdd = withLogging(withTiming(slowAdd));
console.log('\nWith both:');
fullyDecoratedAdd(3, 4);

console.log('\n=== 8. Practical Example: Array Utils ===');

// Create reusable filtering functions
function createFilter(predicate) {
  return function(array) {
    return array.filter(predicate);
  };
}

const getEvens = createFilter(n => n % 2 === 0);
const getOdds = createFilter(n => n % 2 !== 0);
const getPositive = createFilter(n => n > 0);

const testNumbers = [-2, -1, 0, 1, 2, 3, 4, 5];

console.log('Evens:', getEvens(testNumbers));
console.log('Odds:', getOdds(testNumbers));
console.log('Positive:', getPositive(testNumbers));

console.log('\n=== 9. Practical Example: Validators ===');

// Build complex validators from simple ones
function createValidator(test, errorMessage) {
  return function(value) {
    if (!test(value)) {
      return errorMessage;
    }
    return null; // No error
  };
}

const isNotEmpty = createValidator(
  val => val && val.length > 0,
  'Value cannot be empty'
);

const isEmail = createValidator(
  val => val && val.includes('@'),
  'Must be valid email'
);

const isLongEnough = createValidator(
  val => val && val.length >= 8,
  'Must be at least 8 characters'
);

function validate(value, ...validators) {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return 'Valid!';
}

console.log(validate('', isNotEmpty));                    // Error
console.log(validate('test', isEmail));                   // Error
console.log(validate('test@example.com', isNotEmpty, isEmail)); // Valid
console.log(validate('short', isLongEnough));             // Error
console.log(validate('long-enough-password', isLongEnough)); // Valid

console.log('\n=== Best Practices ===');
console.log('1. Use higher-order functions to create reusable logic');
console.log('2. Keep individual functions simple and focused');
console.log('3. Use function composition to build complex behavior');
console.log('4. Leverage built-in higher-order functions (map, filter, reduce)');
console.log('5. Use descriptive names for returned functions');
console.log('6. Consider partial application for specialized functions');
