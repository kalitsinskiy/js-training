/**
 * Variables Exercises
 *
 * Complete the TODO tasks below.
 * Run tests with: npm test -- 01-variables
 */

/**
 * TODO 1: Create a function that returns a greeting message
 * Use const for the variable that stores the greeting
 *
 * @param {string} name - The name to greet
 * @returns {string} - Greeting message like "Hello, Ivan!"
 *
 * Example:
 *   greet('Ivan') => 'Hello, Ivan!'
 *   greet('Maria') => 'Hello, Maria!'
 */
function greet(name) {
  // Your code here
}

/**
 * TODO 2: Create a counter function that increments and returns the count
 * Use let for the counter variable since it needs to change
 *
 * @returns {number} - The incremented counter value
 *
 * Example:
 *   counter() => 1
 *   counter() => 2
 *   counter() => 3
 */
let count = 0; // Don't modify this line

function counter() {
  // Your code here - increment count and return it
}

/**
 * TODO 3: Create a function that checks if a variable is in scope
 * Return true if the block variable exists in the block, false otherwise
 *
 * @returns {boolean} - true if blockVar is accessible inside the block
 *
 * Example:
 *   checkBlockScope() => true (inside block)
 *   // blockVar should not be accessible outside
 */
function checkBlockScope() {
  {
    // Your code here - create a block-scoped variable
  }
  // Try to access the variable here - it should not be accessible
  // Return true if this understanding is correct
  return false; // Change this
}

/**
 * TODO 4: Create a function that demonstrates const with objects
 * Create a const object and modify its properties
 *
 * @param {string} newName - New name to set
 * @param {number} newAge - New age to set
 * @returns {object} - The modified object
 *
 * Example:
 *   updateUser('Ivan', 25) => { name: 'Ivan', age: 25 }
 *   updateUser('Maria', 30) => { name: 'Maria', age: 30 }
 */
function updateUser(newName, newAge) {
  // Your code here
  // 1. Create a const object with name and age properties
  // 2. Update the properties with newName and newAge
  // 3. Return the object
}

/**
 * TODO 5: Create a function that demonstrates variable shadowing
 * Return an object showing global, function, and block scope variables
 *
 * @param {string} value - Value to use in different scopes
 * @returns {object} - Object with global, function, and block properties
 *
 * Example:
 *   shadowDemo('test') => { global: 'test', function: 'test', block: 'test' }
 */
const globalValue = 'global'; // Don't modify this

function shadowDemo(value) {
  // Your code here
  // 1. Create a function-scoped variable with the same name
  // 2. Create a block-scoped variable with the same name
  // 3. Return an object with all three values
}

/**
 * TODO 6: Create a function that returns a closure
 * The closure should remember the outer variable
 *
 * @param {string} prefix - Prefix to remember
 * @returns {function} - A function that uses the prefix
 *
 * Example:
 *   const sayHello = createGreeting('Hello');
 *   sayHello('World') => 'Hello World'
 *
 *   const sayHi = createGreeting('Hi');
 *   sayHi('There') => 'Hi There'
 */
function createGreeting(prefix) {
  // Your code here
  // Return a function that takes a name and returns prefix + name
}

/**
 * TODO 7: Create a function that demonstrates const with arrays
 * Add items to a const array and return it
 *
 * @param {Array} items - Items to add to the array
 * @returns {Array} - The array with added items
 *
 * Example:
 *   addToList([1, 2, 3]) => [1, 2, 3]
 *   addToList([4, 5]) => [1, 2, 3, 4, 5] (cumulative)
 */
const sharedList = []; // Don't modify this line

function addToList(items) {
  // Your code here
  // Add all items from the items array to sharedList
  // Return sharedList
}

// Export functions for testing
module.exports = {
  greet,
  counter,
  checkBlockScope,
  updateUser,
  shadowDemo,
  createGreeting,
  addToList,
};
