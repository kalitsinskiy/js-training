/**
 * Examples of variable scope in JavaScript
 * Run this file with: node examples/scope.js
 */

console.log('=== Variable Scope Examples ===\n');

// Global scope
const globalVar = 'I am global';

console.log('1. Global scope:');
console.log('   globalVar:', globalVar);
console.log('   ✓ Accessible everywhere\n');

// Function scope
function demonstrateFunctionScope() {
  const functionVar = 'I am in function scope';
  console.log('2. Function scope:');
  console.log('   functionVar:', functionVar);
  console.log('   globalVar:', globalVar);
  console.log('   ✓ Function can access global variables\n');

  // Nested function scope
  function innerFunction() {
    const innerVar = 'I am in inner function';
    console.log('3. Inner function scope:');
    console.log('   innerVar:', innerVar);
    console.log('   functionVar:', functionVar);
    console.log('   globalVar:', globalVar);
    console.log('   ✓ Inner function can access outer function variables\n');
  }

  innerFunction();

  // console.log(innerVar); // ❌ Error - inner variables not accessible
}

demonstrateFunctionScope();
// console.log(functionVar); // ❌ Error - function variables not accessible

// Block scope with let/const
console.log('4. Block scope:');
{
  const blockVar = 'I am in block scope';
  let blockLet = 'Me too';
  console.log('   Inside block:', blockVar, blockLet);
}
// console.log(blockVar); // ❌ Error
// console.log(blockLet); // ❌ Error
console.log('   ✗ Block variables not accessible outside\n');

// If statement scope
console.log('5. If statement scope:');
const condition = true;
if (condition) {
  const ifVar = 'I exist only in if block';
  console.log('   Inside if:', ifVar);
}
// console.log(ifVar); // ❌ Error
console.log('   ✗ if variables not accessible outside\n');

// For loop scope
console.log('6. For loop scope:');
for (let i = 0; i < 2; i++) {
  const loopVar = `Iteration ${i}`;
  console.log('   ' + loopVar);
}
// console.log(i); // ❌ Error
// console.log(loopVar); // ❌ Error
console.log('   ✗ Loop variables not accessible outside\n');

// Shadowing (same name in different scopes)
console.log('7. Variable shadowing:');
const name = 'Global Name';
console.log('   Global:', name);

function shadowDemo() {
  const name = 'Function Name'; // Different variable!
  console.log('   Function:', name);

  {
    const name = 'Block Name'; // Yet another different variable!
    console.log('   Block:', name);
  }

  console.log('   After block:', name);
}

shadowDemo();
console.log('   After function:', name);
console.log('   ✓ Each scope has its own variable\n');

// Lexical scope (closures)
console.log('8. Lexical scope (closures):');
function outerFunction(outerVar) {
  return function innerFunction(innerVar) {
    console.log('   Outer variable:', outerVar);
    console.log('   Inner variable:', innerVar);
  };
}

const closure = outerFunction('from outer');
closure('from inner');
console.log('   ✓ Inner function remembers outer variables\n');

// Scope chain
console.log('9. Scope chain:');
const level1 = 'Level 1';

function scopeChain() {
  const level2 = 'Level 2';

  function nested1() {
    const level3 = 'Level 3';

    function nested2() {
      const level4 = 'Level 4';
      console.log('   Level 4:', level4);
      console.log('   Level 3:', level3);
      console.log('   Level 2:', level2);
      console.log('   Level 1:', level1);
      console.log('   ✓ Can access all outer scopes\n');
    }

    nested2();
  }

  nested1();
}

scopeChain();

// Temporal Dead Zone (TDZ)
console.log('10. Temporal Dead Zone:');
{
  // TDZ starts here for 'tdz' variable
  // console.log(tdz); // ❌ ReferenceError
  // TDZ continues...
  // TDZ continues...
  const tdz = 'Now accessible'; // TDZ ends
  console.log('   tdz:', tdz);
  console.log('   ✓ Variable accessible after declaration\n');
}

console.log('=== Summary ===');
console.log('• Global scope - accessible everywhere');
console.log('• Function scope - accessible inside function');
console.log('• Block scope - accessible inside block {}');
console.log('• Inner scopes can access outer scopes');
console.log('• Outer scopes cannot access inner scopes');
console.log('• Variables can be shadowed in inner scopes');
