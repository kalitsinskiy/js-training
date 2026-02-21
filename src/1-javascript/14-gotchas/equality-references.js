// ============================================
// EQUALITY & REFERENCE GOTCHAS
// ============================================

console.log('=== Loose equality (==) table of horrors ===');

console.log(null == undefined);  // true  ← special case
console.log(null == 0);          // false ← null only == null/undefined
console.log(null == false);      // false
console.log(null == '');         // false

console.log(0 == false);         // true  ← false → 0
console.log('' == false);        // true  ← '' → 0, false → 0
console.log(0 == '');            // true  ← '' → 0

// The tricky one:
console.log([] == false);        // true  ← [] → '' → 0, false → 0
console.log([] == 0);            // true  ← [] → '' → 0

// But:
if ([]) console.log('[] is TRUTHY in boolean context'); // ← prints!
// [] == false is true (coercion), but Boolean([]) is true — contradiction!

// Rule: == uses "Abstract Equality" algorithm (complex coercion)
//       if/while/! uses ToBoolean (simple: only 6 falsy values)

// ✅ Use === to avoid surprises. Only use == to check null/undefined together:
const x = null;
console.log(x == null);  // catches both null AND undefined — sometimes useful

// ---
console.log('\n=== -0 (negative zero) ===');

console.log(0 === -0);           // true  ← === doesn't distinguish
console.log(Object.is(0, -0));   // false ← Object.is does

console.log(1 / 0);              // Infinity
console.log(1 / -0);             // -Infinity ← different!

// Practical: direction in physics/game engines
function getDirection(velocity) {
  return Object.is(velocity, -0) ? 'moving left' : 'moving right';
}
console.log(getDirection(0));    // 'moving right'
console.log(getDirection(-0));   // 'moving left'

// Array methods also see -0:
console.log([-0, 0].indexOf(-0)); // 0 (finds -0)
console.log([-0, 0].includes(-0)); // true

// ---
console.log('\n=== Objects compared by reference, not value ===');

const a = { x: 1 };
const b = { x: 1 };
const c = a; // same reference

console.log(a === b); // false ← different objects, same content
console.log(a === c); // true  ← same reference

// Mutation through reference
c.x = 99;
console.log(a.x); // 99 ← a and c point to same object!

// Arrays too:
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] ← same array!

// ✅ To copy (shallow):
const copy = { ...a };
copy.x = 1000;
console.log(a.x); // 99 ← original unchanged

// ⚠️ Shallow copy doesn't deep copy:
const nested = { inner: { val: 1 } };
const shallow = { ...nested };
shallow.inner.val = 999;
console.log(nested.inner.val); // 999 ← inner object still shared!

// ---
console.log('\n=== delete on array creates holes ===');

const nums = [1, 2, 3, 4, 5];
delete nums[2]; // removes value, NOT the slot

console.log(nums);        // [1, 2, empty, 4, 5]
console.log(nums.length); // 5 ← unchanged!
console.log(nums[2]);     // undefined
console.log(2 in nums);   // false ← slot is gone

// Holes behave oddly:
console.log(nums.map(n => n * 2));    // [2, 4, empty, 8, 10] ← skips hole!
console.log(nums.filter(n => true));  // [1, 2, 4, 5] ← skips hole!

// ✅ Use splice to actually remove element:
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 1); // remove 1 element at index 2
console.log(arr); // [1, 2, 4, 5] ✅

// ---
console.log('\n=== for...in on arrays — two traps ===');

const items = ['a', 'b', 'c'];
items.extra = 'oops'; // arrays are objects, you can add properties

for (const i in items) {
  console.log(i, typeof i);
  // '0' 'string' ← indices are STRINGS, not numbers!
  // '1' 'string'
  // '2' 'string'
  // 'extra' 'string' ← also iterates custom properties!
}

// ✅ Use for...of for values:
for (const v of items) {
  console.log(v); // 'a', 'b', 'c' — no 'extra', values not indices
}

// ✅ Use .forEach() or .entries() with indices:
items.forEach((v, i) => console.log(i, typeof i, v));
// 0 'number' 'a' ← index is number here

// ---
console.log('\n=== Object property order ===');

const obj = {};
obj.b = 2;
obj.a = 1;
obj[3] = 'three';
obj[1] = 'one';

// Integer keys come first (sorted), then string keys (insertion order)
console.log(Object.keys(obj)); // ['1', '3', 'b', 'a']
// ← Numbers sorted first, strings in insertion order

// ---
console.log('\n=== Regex global flag reuses state ===');

const re = /\d+/g; // global flag keeps lastIndex

console.log(re.test('abc123'));  // true  (lastIndex moves to 6)
console.log(re.lastIndex);       // 6
console.log(re.test('abc123'));  // false (starts from index 6, no match)
console.log(re.lastIndex);       // 0    (resets after failed match)
console.log(re.test('abc123'));  // true  (starts fresh)

// ✅ Create a new regex each time, or reset lastIndex:
function hasDigit(str) {
  return /\d+/.test(str); // new regex each call, no state
}
console.log(hasDigit('abc123'), hasDigit('abc123')); // true true ✅

// ---
console.log('\n=== Mutating function parameters (objects/arrays) ===');

// ❌ Common bug: function mutates its argument
function addItem(cart, item) {
  cart.push(item); // mutates the original array!
  return cart;
}

const myCart = ['apple'];
const newCart = addItem(myCart, 'banana');
console.log(myCart);   // ['apple', 'banana'] ← original mutated!
console.log(newCart === myCart); // true ← same reference

// ✅ Return a new array/object instead:
function addItemPure(cart, item) {
  return [...cart, item]; // new array
}

const myCart2 = ['apple'];
const newCart2 = addItemPure(myCart2, 'banana');
console.log(myCart2);  // ['apple'] ← original unchanged ✅
console.log(newCart2); // ['apple', 'banana']
