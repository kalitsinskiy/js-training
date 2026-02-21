// ============================================
// LOOPS Examples
// ============================================

console.log('=== 1. for Loop ===');

// Basic for loop
for (let i = 0; i < 5; i++) {
  console.log('Iteration:', i);
}

// Count backwards
for (let i = 5; i > 0; i--) {
  console.log('Countdown:', i);
}

// Step by 2
for (let i = 0; i <= 10; i += 2) {
  console.log('Even:', i);
}

// Iterate array
const fruits = ['apple', 'banana', 'orange'];
for (let i = 0; i < fruits.length; i++) {
  console.log(`${i}: ${fruits[i]}`);
}

console.log('\n=== 2. while Loop ===');

// Basic while loop
let count = 0;
while (count < 5) {
  console.log('Count:', count);
  count++;
}

// With condition
let num = 1;
while (num <= 5) {
  console.log('Number:', num);
  num++;
}

// Read until condition
let i = 0;
const numbers = [10, 20, 30, 0, 40];
while (numbers[i] !== 0) {
  console.log('Value:', numbers[i]);
  i++;
}

console.log('\n=== 3. do...while Loop ===');

// Executes at least once
let x = 0;
do {
  console.log('x:', x);
  x++;
} while (x < 3);

// Even if condition is false initially
let y = 10;
do {
  console.log('This runs once even though y >= 10');
} while (y < 10);

console.log('\n=== 4. Nested Loops ===');

// Multiplication table
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(`${i} × ${j} = ${i * j}`);
  }
}

// 2D array
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

for (let row = 0; row < matrix.length; row++) {
  for (let col = 0; col < matrix[row].length; col++) {
    console.log(`[${row}][${col}] = ${matrix[row][col]}`);
  }
}

console.log('\n=== 5. for...of Loop (Arrays) ===');

const colors = ['red', 'green', 'blue'];

// Iterate values
for (const color of colors) {
  console.log('Color:', color);
}

// With index using entries()
for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`);
}

// Works with strings
const text = 'Hello';
for (const char of text) {
  console.log('Char:', char);
}

console.log('\n=== 6. for...in Loop (Objects) ===');

const user = {
  name: 'Alice',
  age: 25,
  city: 'London'
};

// Iterate keys
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Check own properties
for (const key in user) {
  if (user.hasOwnProperty(key)) {
    console.log(`Own property: ${key}`);
  }
}

console.log('\n=== 7. for...in vs for...of ===');

const arr = ['a', 'b', 'c'];

// for...in gives indices (don't use for arrays!)
console.log('for...in (indices):');
for (const index in arr) {
  console.log(index, typeof index); // '0', '1', '2' (strings!)
}

// for...of gives values (correct for arrays)
console.log('for...of (values):');
for (const value of arr) {
  console.log(value);
}

console.log('\n=== 8. break Statement ===');

// Exit loop early
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    console.log('Breaking at', i);
    break;
  }
  console.log(i);
}

// Find first match
const nums = [1, 5, 3, 9, 2, 8];
let found;
for (const num of nums) {
  if (num > 7) {
    found = num;
    break; // Stop searching
  }
}
console.log('First number > 7:', found);

console.log('\n=== 9. continue Statement ===');

// Skip iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    continue; // Skip 2
  }
  console.log(i);
}

// Skip even numbers
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log('Odd:', i);
}

console.log('\n=== 10. Labels (Rare) ===');

// Break outer loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      console.log('Breaking outer at', i, j);
      break outer;
    }
    console.log(i, j);
  }
}

console.log('\n=== 11. Infinite Loops (Dangerous!) ===');

// ❌ Don't do this - will freeze!
// while (true) {
//   console.log('Forever!');
// }

// ✅ With break condition
let attempts = 0;
while (true) {
  attempts++;
  if (attempts > 3) {
    console.log('Breaking after 3 attempts');
    break;
  }
  console.log('Attempt:', attempts);
}

console.log('\n=== 12. Loop Performance ===');

const largeArray = Array.from({ length: 1000 }, (_, i) => i);

// Cache length (minor optimization)
console.time('cached');
for (let i = 0, len = largeArray.length; i < len; i++) {
  // Do something
}
console.timeEnd('cached');

// Recalculate length each time (slightly slower)
console.time('uncached');
for (let i = 0; i < largeArray.length; i++) {
  // Do something
}
console.timeEnd('uncached');

// for...of (usually fastest and most readable)
console.time('for...of');
for (const item of largeArray) {
  // Do something
}
console.timeEnd('for...of');

console.log('\n=== Best Practices ===');
console.log('1. Use for loop when you need index');
console.log('2. Use while when iterations unknown');
console.log('3. Use do...while when you need at least one iteration');
console.log('4. Use for...of for arrays (NOT for...in)');
console.log('5. Use for...in for objects (check hasOwnProperty)');
console.log('6. Cache array.length in critical performance loops');
console.log('7. Use break to exit early');
console.log('8. Use continue to skip iterations');
console.log('9. Avoid infinite loops');
console.log('10. Consider array methods (map, filter) instead of loops');
