// ============================================
// LOGICAL OPERATORS Examples
// ============================================

console.log('=== 1. Logical AND (&&) ===');

// Returns first falsy value, or last value if all truthy
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false

// With non-boolean values — returns the ACTUAL value, not true/false
console.log(1 && 2);          // 2     (1 is truthy → returns 2)
console.log(0 && 2);          // 0     (0 is falsy → stops, returns 0)
console.log('a' && 'b');      // 'b'   (both truthy → returns last)
console.log(null && 'hello'); // null  (null is falsy → stops)

console.log('\n=== 2. Logical OR (||) ===');

// Returns first truthy value, or last value if all falsy
console.log(true || false);   // true
console.log(false || true);   // true

// With non-boolean values — returns the ACTUAL value
console.log(1 || 2);          // 1     (1 is truthy → stops, returns 1)
console.log(0 || 2);          // 2     (0 is falsy → tries next)
console.log(0 || null);       // null  (both falsy → returns last)
console.log('' || 'default'); // 'default'

console.log('\n=== 3. Logical NOT (!) ===');

console.log(!true);       // false
console.log(!false);      // true
console.log(!0);          // true   (0 is falsy)
console.log(!'');         // true   ('' is falsy)
console.log(!'hello');    // false  ('hello' is truthy)
console.log(!null);       // true
console.log(!undefined);  // true

// Double NOT — converts to boolean
console.log(!!0);         // false
console.log(!!1);         // true
console.log(!!'');        // false
console.log(!!'hello');   // true
// Same as: Boolean(value)

console.log('\n=== 4. Short-Circuit Evaluation ===');

// && stops at first FALSY value
// || stops at first TRUTHY value
// The rest is NOT evaluated — this is "short-circuiting"

let counter = 0;

function inc(label) {
  counter++;
  console.log(`  ${label} evaluated`);
  return true;
}

counter = 0;
false && inc('A');   // inc('A') is NEVER called — short-circuited
console.log('After false &&: counter =', counter); // 0

counter = 0;
true || inc('B');    // inc('B') is NEVER called — short-circuited
console.log('After true ||: counter =', counter);  // 0

counter = 0;
true && inc('C');    // inc('C') IS called
console.log('After true &&: counter =', counter);  // 1

console.log('\n=== 5. && for Conditional Execution ===');

// Pattern: condition && doSomething()
// Only executes doSomething() if condition is truthy
const user = { name: 'Alice', isAdmin: true };

user.isAdmin && console.log('Admin menu enabled');    // prints
user.isLoggedIn && console.log('Welcome back!');      // skipped (undefined is falsy)

// Common in React JSX:
// isLoading && <Spinner />

// Equivalent to:
if (user.isAdmin) {
  console.log('(same) Admin menu enabled');
}

console.log('\n=== 6. || for Default Values (legacy pattern) ===');

// Pattern: value || defaultValue
// Use when value might be falsy
function greet(name) {
  const displayName = name || 'Guest';
  console.log(`Hello, ${displayName}!`);
}

greet('Alice');  // Hello, Alice!
greet('');       // Hello, Guest! ← '' is falsy, uses default
greet(null);     // Hello, Guest!
greet(0);        // Hello, Guest! ← 0 is falsy, uses default (might be a bug!)

console.log('\n=== 7. ?? Nullish Coalescing Operator ===');

// Returns right side ONLY if left side is null or undefined
// Unlike ||, it does NOT treat 0, '', false as "missing"

const a = null ?? 'default';      // 'default'  — null → use right
const b = undefined ?? 'default'; // 'default'  — undefined → use right
const c = 0 ?? 'default';         // 0          — 0 is not null/undefined!
const d = '' ?? 'default';        // ''         — '' is not null/undefined!
const e = false ?? 'default';     // false      — false is not null/undefined!

console.log(a, b, c, d, e);

// Practical difference:
const userScore = 0;  // A valid score of zero

console.log('With ||:', userScore || 'No score');  // 'No score' — BUG! 0 is valid
console.log('With ??:', userScore ?? 'No score');  // 0          — correct

const itemCount = 0;
console.log('With ||:', itemCount || 'Empty');  // 'Empty' — wrong, 0 is a real count
console.log('With ??:', itemCount ?? 'Empty');  // 0       — correct

console.log('\n=== 8. Optional Chaining (?.) ===');

// Safe property access — returns undefined instead of throwing
const settings = null;

// Without ?. — throws TypeError
// console.log(settings.theme); // ❌ Cannot read properties of null

// With ?. — safe, returns undefined
console.log(settings?.theme);        // undefined
console.log(settings?.theme ?? 'light'); // 'light' (combined with ??)

// Nested optional chaining
const config = {
  database: {
    host: 'localhost'
  }
};

console.log(config?.database?.host);   // 'localhost'
console.log(config?.cache?.host);      // undefined (no error)
console.log(config?.database?.port ?? 5432); // 5432 (default)

// Optional method call
const obj = { greet: () => 'hello' };
console.log(obj.greet?.());            // 'hello'
console.log(obj.notExist?.());         // undefined (no error)

// Optional array access
const arr = [1, 2, 3];
console.log(arr?.[0]);   // 1
console.log(null?.[0]);  // undefined

console.log('\n=== 9. Logical Assignment Operators ===');

// &&= — assign only if current value is truthy
let x = 1;
x &&= 99;
console.log('x &&= 99:', x); // 99 (x was truthy, so assigned)

let y = 0;
y &&= 99;
console.log('y &&= 99:', y); // 0 (y was falsy, no assignment)

// ||= — assign only if current value is falsy
let name = '';
name ||= 'Anonymous';
console.log('name ||= Anonymous:', name); // 'Anonymous'

let existingName = 'Alice';
existingName ||= 'Anonymous';
console.log('existingName ||= Anonymous:', existingName); // 'Alice' (unchanged)

// ??= — assign only if current value is null/undefined
let count = 0;
count ??= 10;
console.log('count ??= 10:', count); // 0 (0 is not null/undefined)

let missing = null;
missing ??= 10;
console.log('missing ??= 10:', missing); // 10

console.log('\n=== 10. Practical Patterns ===');

// Pattern 1: Safe config with defaults
function initConfig(options) {
  return {
    host: options?.host ?? 'localhost',
    port: options?.port ?? 3000,
    debug: options?.debug ?? false,
  };
}
console.log(initConfig(null));         // all defaults
console.log(initConfig({ port: 8080 })); // override port, rest default

// Pattern 2: Short-circuit guard
function processOrder(order) {
  const isValid = order && order.items && order.items.length > 0;
  isValid && console.log('Processing order:', order.id);
  !isValid && console.log('Invalid order');
}
processOrder(null);
processOrder({ id: 1, items: [{ sku: 'ABC' }] });

// Pattern 3: Find first available value
const fromCache = null;
const fromDB = null;
const fallback = 'default-value';
const result = fromCache ?? fromDB ?? fallback;
console.log('First available:', result);

console.log('\n=== Best Practices ===');
console.log('1. Use ?? instead of || when 0, false, "" are valid values');
console.log('2. Use ?. for safe property access on potentially null objects');
console.log('3. Use && short-circuit for conditional execution');
console.log('4. Combine ?. and ?? for safe access with fallback: obj?.prop ?? default');
console.log('5. Use ??= to initialize only if null/undefined');
console.log('6. Avoid long chains of && and || — use if/else for clarity');
