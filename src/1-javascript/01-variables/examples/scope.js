// ============================================
// SCOPE Examples
// ============================================

console.log('=== 1. Global scope ===');
const globalVar = 'I am global';

function showGlobal() {
  console.log(globalVar); // ✅ Can access global variable
}
showGlobal();

console.log('\n=== 2. Function scope ===');
function myFunction() {
  const functionVar = 'I am in function';
  console.log(functionVar); // ✅ Works
}
myFunction();
// console.log(functionVar); // ❌ Error: not defined outside function

console.log('\n=== 3. Block scope ===');
{
  const blockVar = 'I am in block';
  console.log('Inside block:', blockVar); // ✅ Works
}
// console.log(blockVar); // ❌ Error: not defined outside block

if (true) {
  const ifVar = 'I am in if block';
  console.log('Inside if:', ifVar); // ✅ Works
}
// console.log(ifVar); // ❌ Error

console.log('\n=== 4. Nested scope ===');
const outer = 'outer';

function outerFunction() {
  const middle = 'middle';

  function innerFunction() {
    const inner = 'inner';

    console.log(inner);  // ✅ Has access to inner
    console.log(middle); // ✅ Has access to middle (parent scope)
    console.log(outer);  // ✅ Has access to outer (global scope)
  }

  innerFunction();
  // console.log(inner); // ❌ Cannot access inner from here
}

outerFunction();

console.log('\n=== 5. Variable shadowing ===');
const name = 'Global John';

function test() {
  const name = 'Function Jane'; // Shadows global name
  console.log('Inside function:', name); // Function Jane

  if (true) {
    const name = 'Block Bob'; // Shadows function name
    console.log('Inside block:', name); // Block Bob
  }

  console.log('After block:', name); // Function Jane
}

test();
console.log('Global:', name); // Global John

console.log('\n=== 6. Closure and scope ===');
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
// console.log(count); // ❌ Error: count is not accessible

console.log('\n=== 7. Scope chain ===');
const level1 = 'Level 1';

function first() {
  const level2 = 'Level 2';

  function second() {
    const level3 = 'Level 3';

    console.log(level3); // Has access to level3
    console.log(level2); // Has access to level2 (parent)
    console.log(level1); // Has access to level1 (grandparent)
  }

  second();
}

first();

console.log('\n=== Best Practices ===');
console.log('1. Declare variables in the smallest scope possible');
console.log('2. Avoid polluting global scope');
console.log('3. Use const by default (block-scoped)');
console.log('4. Be aware of variable shadowing');
console.log('5. Use closures to create private variables');
