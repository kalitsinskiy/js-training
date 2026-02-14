/**
 * Examples showing problems with var and hoisting
 * Run this file with: node examples/var-hoisting.js
 */

console.log('=== Why VAR is Problematic ===\n');

// Problem 1: var has function scope, not block scope
console.log('1. var ignores block scope:');
if (true) {
  var functionScoped = 'I leak outside!';
}
console.log('   Outside if block:', functionScoped);
console.log('   ✗ This is confusing and error-prone!\n');

// Compare with let
if (true) {
  let blockScoped = 'I stay inside';
}
// console.log(blockScoped); // ❌ Error - this is correct behavior
console.log('   ✓ let respects block scope\n');

// Problem 2: var can be redeclared
console.log('2. var allows redeclaration:');
var age = 25;
console.log('   First declaration:', age);
var age = 30; // ✗ No error! This can hide bugs
console.log('   Redeclared:', age);
console.log('   ✗ This can accidentally overwrite variables!\n');

// let prevents redeclaration
let name = 'Ivan';
// let name = 'Petro'; // ❌ Error - this prevents bugs
console.log('   ✓ let prevents redeclaration\n');

// Problem 3: Hoisting with var
console.log('3. Hoisting with var:');
console.log('   Accessing before declaration:', x);
var x = 5;
console.log('   After declaration:', x);
console.log('   ✗ var is "hoisted" - declaration moves to top\n');

// This is how JavaScript actually interprets it:
console.log('   JavaScript sees it as:');
console.log('   var x;           // declaration hoisted');
console.log('   console.log(x);  // undefined');
console.log('   x = 5;           // assignment stays here\n');

// let/const have "temporal dead zone"
console.log('4. let/const temporal dead zone:');
// console.log(y); // ❌ ReferenceError: Cannot access before initialization
let y = 10;
console.log('   ✓ let prevents accessing before declaration\n');

// Problem 4: var in loops
console.log('5. var in loops (classic problem):');
var functions = [];
for (var i = 0; i < 3; i++) {
  functions.push(function() {
    return i;
  });
}
console.log('   Calling functions:');
functions.forEach((fn, index) => {
  console.log(`   Function ${index} returns:`, fn());
});
console.log('   ✗ All functions return 3! (not 0, 1, 2)\n');

// With let, it works correctly
console.log('6. let in loops (correct behavior):');
const correctFunctions = [];
for (let j = 0; j < 3; j++) {
  correctFunctions.push(function() {
    return j;
  });
}
console.log('   Calling functions:');
correctFunctions.forEach((fn, index) => {
  console.log(`   Function ${index} returns:`, fn());
});
console.log('   ✓ Each function captures its own j value\n');

// Hoisting demonstration
console.log('=== Hoisting in Detail ===\n');

function hoistingDemo() {
  console.log('7. Inside function:');

  // Accessing before declaration
  console.log('   varVariable:', varVariable); // undefined (not error)
  // console.log('   letVariable:', letVariable); // ❌ ReferenceError

  var varVariable = 'var value';
  let letVariable = 'let value';

  console.log('   After declaration:');
  console.log('   varVariable:', varVariable);
  console.log('   letVariable:', letVariable);
}

hoistingDemo();

console.log('\n=== Summary: Why Avoid var ===');
console.log('✗ Function scope (not block scope) - confusing');
console.log('✗ Can be redeclared - hides bugs');
console.log('✗ Hoisting - can use before declaration');
console.log('✗ Loop closure issues');
console.log('\n✓ Always use let or const instead!');
