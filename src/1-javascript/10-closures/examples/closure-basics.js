// ============================================
// CLOSURE BASICS Examples
// ============================================

console.log('=== 1. What is a Closure? ===');

// A closure is a function that remembers its outer scope variables
function makeGreeter(greeting) {
  // 'greeting' is captured by the returned function
  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const sayHello = makeGreeter('Hello');
const sayHi = makeGreeter('Hi');

sayHello('Alice'); // 'Hello, Alice!'
sayHi('Bob');      // 'Hi, Bob!'

// 'greeting' is still accessible even though makeGreeter() has returned!

console.log('\n=== 2. Lexical Scope ===');

// Functions see variables where they are DEFINED, not where they are CALLED
const x = 'global';

function outer() {
  const x = 'outer';

  function inner() {
    const x = 'inner';
    console.log('inner x:', x); // 'inner' — closest scope
  }

  function middle() {
    console.log('middle x:', x); // 'outer' — no local x, uses outer's
  }

  inner();
  middle();
}

outer();
console.log('global x:', x); // 'global'

console.log('\n=== 3. Closures Capture Variables by Reference ===');

function makeCounter() {
  let count = 0;

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
}

const counter = makeCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

// Closures share the same variable:
function sharedCounter() {
  let count = 0;
  const inc = () => ++count;
  const dec = () => --count;
  const get = () => count;
  return [inc, dec, get];
}

const [inc, dec, get] = sharedCounter();
inc(); inc(); inc();
dec();
console.log('Shared count:', get()); // 2

console.log('\n=== 4. The Classic Loop Problem ===');

// BUG: var + closure in loop
console.log('--- var (buggy) ---');
const funcsVar = [];
for (var i = 0; i < 3; i++) {
  funcsVar.push(function() { return i; });
}
funcsVar.forEach(f => console.log(f())); // 3, 3, 3 (all share same 'i')

// FIX 1: use let (block scope creates new variable per iteration)
console.log('--- let (fixed) ---');
const funcsLet = [];
for (let i = 0; i < 3; i++) {
  funcsLet.push(function() { return i; });
}
funcsLet.forEach(f => console.log(f())); // 0, 1, 2

// FIX 2: IIFE to create new scope
console.log('--- IIFE (fixed) ---');
const funcsIIFE = [];
for (var i = 0; i < 3; i++) {
  funcsIIFE.push((function(j) {
    return function() { return j; };
  })(i));
}
funcsIIFE.forEach(f => console.log(f())); // 0, 1, 2

console.log('\n=== 5. Private State with Closures ===');

function createWallet(initialBalance) {
  let balance = initialBalance; // PRIVATE — only accessible via the returned object

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error('Amount must be positive');
      balance += amount;
      console.log(`Deposited $${amount}. New balance: $${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      console.log(`Withdrew $${amount}. New balance: $${balance}`);
    },
    getBalance() { return balance; }
  };
}

const wallet = createWallet(100);
wallet.deposit(50);
wallet.withdraw(30);
console.log('Balance:', wallet.getBalance()); // 120
// balance is inaccessible from outside!
// console.log(balance); // ReferenceError

console.log('\n=== 6. Scope Chain ===');

function level1() {
  const a = 1;

  function level2() {
    const b = 2;

    function level3() {
      const c = 3;
      // Access to all levels via scope chain
      console.log('Can access:', a, b, c);
    }

    level3();
    // console.log(c); // ReferenceError - c is not in scope here
  }

  level2();
  // console.log(b); // ReferenceError - b is not in scope here
}

level1();

console.log('\n=== 7. Closures in setTimeout ===');

// Common mistake: loop with setTimeout
console.log('--- var in timeout (bug) ---');
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var i:', i), 100); // 3, 3, 3
}

// Fix with let
console.log('--- let in timeout (fixed) ---');
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let j:', j), 200); // 0, 1, 2
}

console.log('\n=== 8. Closure Memory ===');

// Closures keep outer variables alive as long as they exist
function createHeavy() {
  const data = new Array(1000).fill('big data');

  return {
    getData() { return data[0]; }
  };
}

const heavy = createHeavy();
console.log('Heavy data:', heavy.getData()); // 'big data'
// data array is kept in memory as long as 'heavy' exists

// Avoiding memory leaks
// When done: heavy = null; // allows GC to collect

console.log('\n=== Best Practices ===');
console.log('1. Use closures for private state');
console.log('2. Use let in loops (not var) to avoid closure bugs');
console.log('3. Be aware closures keep outer variables alive (memory)');
console.log('4. Use closures for factory functions and module patterns');
console.log('5. Avoid creating closures in tight loops (performance)');
console.log('6. Null out closed-over large objects when done with them');
