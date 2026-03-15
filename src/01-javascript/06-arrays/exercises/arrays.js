// ============================================
// ARRAYS Exercises
// ============================================
// Complete the TODO exercises below
// Run this file with: node src/01-javascript/06-arrays/exercises/arrays.js

console.log('=== Exercise 1: Array basics ===');
// TODO: Create an array of 5 colors
// Add one color to the end
// Remove the first color
// Log the final array
// Your code here:
const colors = ['red', 'green', 'blue', 'black', 'white'];
colors.push('yellow');
colors.splice(0,1);
console.log(colors);

console.log('\n=== Exercise 2: map() ===');
// TODO: Use map() to double each number
const numbers = [1, 2, 3, 4, 5];
// Your code here:
const doubled = numbers.map(n => n*2);
console.log(doubled);

console.log('\n=== Exercise 3: filter() ===');
// TODO: Use filter() to keep only even numbers
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Your code here:
const even = nums.filter(n => n % 2 === 0);
console.log(even);

console.log('\n=== Exercise 4: reduce() ===');
// TODO: Use reduce() to sum all numbers
const values = [10, 20, 30, 40, 50];
// Your code here:
const sum = values.reduce((sum, curr) => sum + curr);
console.log(sum);

console.log('\n=== Exercise 5: Method chaining ===');
// TODO: Chain map, filter, and reduce to:
// 1. Square each number
// 2. Keep only numbers > 10
// 3. Sum the remaining numbers
const chain = [1, 2, 3, 4, 5];
// Your code here:
const chained = chain
  .map(n => n * n)
  .filter(n => n > 10)
  .reduce((sum, curr) => sum + curr);

console.log(chained);

console.log('\n=== Exercise 6: forEach() vs map() ===');
// TODO: Explain the difference and rewrite this using the correct method
/*
const prices = [10, 20, 30];
const doubled = [];
prices.map(price => {
  doubled.push(price * 2);
});
*/
// Your code here:
const prices = [10, 20, 30];
const doubled2 = prices.map(price => price * 2); // map already returns new array
console.log(doubled2);

console.log('\n=== Exercise 7: find() ===');
// TODO: Find the first user over 25 years old
const users = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];
// Your code here:
const user = users.find(u => u?.age > 25);
console.log(user ?? 'Not found');

console.log('\n=== Exercise 8: some() and every() ===');
// TODO: Check if ANY score is above 90
// TODO: Check if ALL scores are above 50
const scores = [65, 78, 92, 55, 88];
// Your code here:
console.log(`Any >90: ${scores.some(s => s > 90)}`);
console.log(`All >50: ${scores.every(s => s > 50)}`);

console.log('\n=== Exercise 9: Array destructuring ===');
// TODO: Destructure this array to get first, second, and rest
const arr = [1, 2, 3, 4, 5];
// const [?, ?, ...?] = arr;
// Your code here:
const [first, second, ...rest] = arr;
console.log(first);
console.log(second);
console.log(rest);

console.log('\n=== Exercise 10: Spread operator ===');
// TODO: Combine these arrays using spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
// Your code here:
const combined = [...arr1, ...arr2];
console.log(combined);

console.log('\n=== 🎯 Challenge: Remove duplicates ===');
// TODO: Remove all duplicate numbers from this array
const withDuplicates = [1, 2, 2, 3, 3, 3, 4, 4, 5];
// Hint: Use Set or reduce
// Your code here:
const unique = new Set(withDuplicates);
console.log(unique);

console.log('\n=== 🎯 Challenge: Group by property ===');
// TODO: Group users by age
// Expected output: { 20: [{...}], 25: [{...}, {...}] }
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 20 },
  { name: 'Charlie', age: 25 },
  null,
  { otherProperty: 25 }
];
// Hint: Use reduce
// Your code here:
const groupedByAge = people.reduce(
  (group, person) => {
    const age = person?.age ?? 'unknown';
    if (!group.has(age))
      group.set(age, []);

    group.get(age).push(person);
    return group;
  },
  new Map()
);
console.log(groupedByAge);

console.log('\n=== 🎯 Challenge: Flatten nested array ===');
// TODO: Flatten this nested array completely
const nested = [1, [2, [3, [4, 5]]]];
// Expected: [1, 2, 3, 4, 5]
// Try two ways: 1) flat(Infinity) 2) reduce recursively
// Your code here:
const flattened = nested.flat(Infinity);
console.log(flattened);

console.log('\n=== 🎯 Challenge: Array intersection ===');
// TODO: Find common elements in both arrays
const set1 = [1, 2, 3, 4, 5];
const set2 = [3, 4, 5, 6, 7];
// Expected: [3, 4, 5]
// Your code here:
const common = set1.filter(n => set2.includes(n));
console.log(common);

console.log('\n=== 🎯 Challenge: Count occurrences ===');
// TODO: Count how many times each fruit appears
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
// Expected: { apple: 3, banana: 2, orange: 1 }
// Hint: Use reduce
// Your code here:
const counted = fruits.reduce(
  (counter, fruit) => {
    if (!counter.has(fruit))
      counter.set(fruit, 0);

    counter.set(fruit, counter.get(fruit) + 1);
    return counter;
  },
  new Map()
);
console.log(counted);

console.log('\n=== 🎯 Challenge: Custom map() ===');
// TODO: Implement your own version of map()
function customMap(array, callback) {
  const result = [];
  for (const val of array){
    result.push(callback(val));
  }
  return result;
}

// Test it (uncomment):
const test = customMap([1, 2, 3], n => n * 2);
console.log(test); // Should be [2, 4, 6]


console.log('\n=== 🎯 Challenge: Array pagination ===');
// TODO: Split array into pages of given size
function paginate(array, pageSize) {
  // Your code here
  // Hint: Use reduce or a loop
  return array.reduce(
    (prev, curr, index, arr) => {
      const pageIndex = Math.floor(index / pageSize);
      if (!prev[pageIndex])
        prev[pageIndex] = [];

      prev[pageIndex].push(curr);

      return prev;
    },
    []
  );
}

// Test it (uncomment):
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(paginate(data, 3));
//Should be: [[1,2,3], [4,5,6], [7,8,9], [10]]


console.log('\n=== 🎯 Challenge: Sort by multiple properties ===');
// TODO: Sort users by age (ascending), then by name (alphabetically)
const usersToSort = [
  { name: 'Charlie', age: 25 },
  { name: 'Alice', age: 25 },
  { name: 'Stiven', age: 25 },
  { name: 'Marry', age: 25 },
  { name: 'Donald', age: 25 },
  { name: 'denzel', age: 25 },
  { name: 'Alice', age: 13 },
  { name: 'Bob', age: 20 }
];
// Expected order: Bob (20), Alice (25), Charlie (25)
// Your code here:
const sorted = usersToSort.sort((a, b) => a.age - b.age + a.name.localeCompare(b.name));
console.log(sorted);

console.log('\n✅ Exercises completed! Check your answers with a mentor.');
