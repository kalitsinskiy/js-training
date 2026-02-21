// ============================================
// TRY...CATCH Examples
// ============================================

console.log('=== 1. Basic try...catch ===');

try {
  const result = 10 / 0;
  console.log('Result:', result); // Infinity (not an error in JS)

  null.property; // TypeError!
} catch (error) {
  console.log('Caught error:', error.message);
  console.log('Error type:', error.name);
}

console.log('Program continues after catch');

console.log('\n=== 2. Error Object Properties ===');

try {
  undeclaredVariable; // ReferenceError
} catch (error) {
  console.log('name:', error.name);       // 'ReferenceError'
  console.log('message:', error.message); // 'undeclaredVariable is not defined'
  console.log('stack:', error.stack.split('\n')[0]); // first line of stack trace
}

console.log('\n=== 3. try...catch...finally ===');

function riskyOperation(value) {
  console.log('Starting operation...');
  try {
    if (value < 0) {
      throw new Error('Value must be positive');
    }
    console.log('Success:', value * 2);
    return value * 2;
  } catch (error) {
    console.log('Error caught:', error.message);
    return null;
  } finally {
    // Always runs - perfect for cleanup
    console.log('Operation complete (finally)');
  }
}

console.log('Result 1:', riskyOperation(5));
console.log('Result 2:', riskyOperation(-1));

console.log('\n=== 4. finally Always Runs ===');

function withReturn() {
  try {
    return 'from try';    // finally still runs before returning
  } finally {
    console.log('finally ran even with return');
  }
}

console.log('Return value:', withReturn());

function withThrow() {
  try {
    throw new Error('test');
  } catch (error) {
    return 'from catch';  // finally still runs
  } finally {
    console.log('finally ran after catch return');
  }
}

console.log('Return value:', withThrow());

console.log('\n=== 5. Throwing Errors ===');

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new RangeError('Cannot divide by zero');
  }
  return a / b;
}

try {
  console.log(divide(10, 2));   // 5
  console.log(divide(10, 0));   // Throws RangeError
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

try {
  console.log(divide('10', 2)); // Throws TypeError
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

console.log('\n=== 6. You Can Throw Anything ===');

// Though Error objects are recommended
try {
  throw 'A string error'; // Works but not recommended
} catch (e) {
  console.log('Caught string:', e);
}

try {
  throw { code: 404, message: 'Not found' }; // Object
} catch (e) {
  console.log('Caught object:', e.code, e.message);
}

// Best practice: always throw Error objects
try {
  throw new Error('Best practice');
} catch (e) {
  console.log('Error name:', e.name, '| message:', e.message);
}

console.log('\n=== 7. Error Propagation ===');

function step3() {
  throw new Error('Error in step3');
}

function step2() {
  step3(); // Error propagates up
}

function step1() {
  step2(); // Error propagates up further
}

try {
  step1();
} catch (error) {
  console.log('Caught in step1 caller:', error.message);
  // Stack trace shows: step3 → step2 → step1
}

console.log('\n=== 8. Re-throwing Errors ===');

function processInput(input) {
  try {
    if (!input) throw new Error('Input is required');
    return JSON.parse(input);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Handle JSON parse errors specifically
      console.log('Invalid JSON:', error.message);
      return null;
    }
    // Re-throw unknown errors
    throw error;
  }
}

console.log(processInput('{"name": "Alice"}')); // works
console.log(processInput('{invalid json}'));     // handles SyntaxError

try {
  processInput(null); // re-throws Error
} catch (error) {
  console.log('Re-thrown:', error.message);
}

console.log('\n=== 9. try...catch in Loops ===');

const inputs = ['42', 'hello', '{"key": "value"}', null, '10'];

inputs.forEach(input => {
  try {
    const parsed = JSON.parse(input);
    console.log('Parsed:', parsed);
  } catch (error) {
    console.log(`Failed to parse "${input}":`, error.message);
  }
});

console.log('\n=== 10. Async Error Handling ===');

async function fetchData(url) {
  try {
    // Simulate fetch
    if (!url.startsWith('https')) {
      throw new Error('HTTPS required');
    }
    console.log('Fetching:', url);
    return { data: 'success' };
  } catch (error) {
    console.log('Fetch error:', error.message);
    throw error; // Re-throw for caller to handle
  }
}

async function main() {
  try {
    await fetchData('http://insecure.com'); // Will throw
  } catch (error) {
    console.log('Main caught:', error.message);
  }

  try {
    const result = await fetchData('https://secure.com');
    console.log('Success:', result);
  } catch (error) {
    console.log('Should not reach here');
  }
}

main();

console.log('\n=== Best Practices ===');
console.log('1. Use try/catch for operations that can fail');
console.log('2. Always throw Error objects (not strings/numbers)');
console.log('3. Use finally for cleanup (close connections, release locks)');
console.log('4. Re-throw errors you can\'t handle');
console.log('5. Be specific in catch - handle only what you expect');
console.log('6. Log errors with enough context to debug');
console.log('7. Don\'t swallow errors silently');
