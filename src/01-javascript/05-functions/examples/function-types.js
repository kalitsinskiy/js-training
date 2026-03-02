// ============================================
// FUNCTION TYPES Examples
// ============================================

console.log('=== 1. Function Declaration ===');

function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('Alice'));
console.log(greet('Bob'));

// Hoisting - can call before definition
console.log(sayHi('Charlie')); // Works!

function sayHi(name) {
  return `Hi, ${name}!`;
}

// Function with multiple parameters
function add(a, b) {
  return a + b;
}

console.log('5 + 3 =', add(5, 3));

// Function with default parameters
function greetWithTitle(name, title = 'Mr.') {
  return `Hello, ${title} ${name}!`;
}

console.log(greetWithTitle('Smith'));           // Uses default
console.log(greetWithTitle('Johnson', 'Dr.'));  // Overrides default

console.log('\n=== 2. Function Expression ===');

const multiply = function(a, b) {
  return a * b;
};

console.log('5 * 3 =', multiply(5, 3));

// NOT hoisted - must define before use
// console.log(divide(10, 2)); // ❌ Error!
const divide = function(a, b) {
  return a / b;
};
console.log('10 / 2 =', divide(10, 2));

// Named function expression (useful for recursion/debugging)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can reference itself by name
};

console.log('5! =', factorial(5)); // 120

console.log('\n=== 3. Arrow Functions - Basic ===');

// Single parameter - parentheses optional
const double = n => n * 2;
console.log('double(5):', double(5));

// Multiple parameters - need parentheses
const subtract = (a, b) => a - b;
console.log('10 - 3 =', subtract(10, 3));

// No parameters - need empty parentheses
const getPI = () => 3.14159;
console.log('PI:', getPI());

// Single expression - implicit return
const square = x => x * x;
console.log('square(4):', square(4));

console.log('\n=== 4. Arrow Functions - Block Body ===');

// Multiple statements - need braces and explicit return
const greetPerson = name => {
  const message = `Hello, ${name}!`;
  console.log('Greeting:', message);
  return message;
};

greetPerson('Diana');

// Returning object literal - wrap in parentheses
const createPerson = (name, age) => ({
  name: name,
  age: age
});

console.log(createPerson('Eve', 25));

// Without parentheses - interpreted as block
// const wrong = () => { x: 1 }; // ❌ Returns undefined

console.log('\n=== 5. Arrow Functions vs Regular Functions ===');

// Regular function - has its own 'this'
function Person(name) {
  this.name = name;

  this.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const person1 = new Person('Frank');
person1.sayHi(); // Works

// Arrow function - inherits 'this' from parent
function PersonArrow(name) {
  this.name = name;

  this.sayHi = () => {
    console.log(`Hi, I'm ${this.name}`); // Uses parent's 'this'
  };
}

const person2 = new PersonArrow('Grace');
person2.sayHi(); // Works

// Demonstrating 'this' difference
const obj = {
  name: 'Object',

  regularFunc: function() {
    console.log('Regular this:', this.name);
  },

  arrowFunc: () => {
    console.log('Arrow this:', this.name); // undefined (global context)
  }
};

obj.regularFunc(); // "Object"
obj.arrowFunc();   // undefined

console.log('\n=== 6. When to Use Each ===');

// ✅ Function Declaration - for regular named functions
function processData(data) {
  return data.toUpperCase();
}

// ✅ Function Expression - when function is a value
const operations = {
  add: function(a, b) { return a + b; },
  sub: function(a, b) { return a - b; }
};

console.log('Operation:', operations.add(5, 3));

// ✅ Arrow Function - for short callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens);

// ✅ Arrow Function - when you need parent's 'this'
class Counter {
  constructor() {
    this.count = 0;
  }

  start() {
    setInterval(() => {
      this.count++; // Arrow function preserves 'this'
      console.log('Count:', this.count);
    }, 1000);
  }
}

// Uncomment to test (runs forever):
// const counter = new Counter();
// counter.start();

console.log('\n=== 7. Function as First-Class Citizens ===');

// Functions can be assigned to variables
const myFunc = greet;
console.log(myFunc('Helen'));

// Functions can be passed as arguments
function execute(fn, value) {
  return fn(value);
}

console.log(execute(double, 10)); // 20

// Functions can be returned
function makeMultiplier(factor) {
  return x => x * factor;
}

const triple = makeMultiplier(3);
const quadruple = makeMultiplier(4);

console.log('triple(5):', triple(5));     // 15
console.log('quadruple(5):', quadruple(5)); // 20

console.log('\n=== Best Practices ===');
console.log('1. Use function declarations for top-level functions');
console.log('2. Use arrow functions for callbacks and short functions');
console.log('3. Use arrow functions when you need lexical this');
console.log('4. Use regular functions for methods that use this');
console.log('5. Use descriptive names for all functions');
console.log('6. Keep functions small and focused (single responsibility)');
