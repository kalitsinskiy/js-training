/**
 * Examples of let and const usage
 * Run this file with: node examples/let-const.js
 */

console.log('=== LET Examples ===\n');

// Example 1: let allows reassignment
let userName = 'Ivan';
console.log('1. Initial userName:', userName);

userName = 'Petro';
console.log('   Updated userName:', userName);
// ✓ This works - let allows reassignment

// Example 2: let has block scope
{
  let blockVariable = 'inside block';
  console.log('\n2. Inside block:', blockVariable);
}
// console.log(blockVariable); // ❌ This would cause an error
console.log('   Outside block: blockVariable is not accessible');

// Example 3: let in loops
console.log('\n3. Let in for loop:');
for (let i = 0; i < 3; i++) {
  console.log(`   Iteration ${i}`);
}
// console.log(i); // ❌ i is not accessible outside the loop

console.log('\n=== CONST Examples ===\n');

// Example 4: const must be initialized
const APP_NAME = 'MyApp';
console.log('4. APP_NAME:', APP_NAME);
// const EMPTY; // ❌ This would cause an error - must initialize

// Example 5: const prevents reassignment
const MAX_USERS = 100;
console.log('\n5. MAX_USERS:', MAX_USERS);
// MAX_USERS = 200; // ❌ This would cause an error

// Example 6: const with objects - you CAN modify properties
const user = {
  name: 'Ivan',
  age: 25
};
console.log('\n6. Original user:', user);

user.age = 26; // ✓ This is OK
user.email = 'ivan@example.com'; // ✓ Adding new properties is OK
console.log('   Modified user:', user);

// user = {}; // ❌ But you can't reassign the whole object

// Example 7: const with arrays - you CAN modify contents
const numbers = [1, 2, 3];
console.log('\n7. Original array:', numbers);

numbers.push(4); // ✓ This is OK
numbers[0] = 10; // ✓ This is OK
console.log('   Modified array:', numbers);

// numbers = []; // ❌ But you can't reassign the whole array

console.log('\n=== Best Practices ===\n');

// Rule 1: Use const by default
const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
console.log('✓ Use const for values that don\'t change');

// Rule 2: Use let only when you need to reassign
let counter = 0;
counter++;
counter++;
console.log('✓ Use let for values that change:', counter);

// Rule 3: Never use var (we'll see why in var-hoisting.js)
console.log('✗ Don\'t use var (it\'s outdated)');

console.log('\n=== Summary ===');
console.log('• const - for constants and values that won\'t be reassigned');
console.log('• let - for variables that will be reassigned');
console.log('• var - DON\'T USE (use let or const instead)');
