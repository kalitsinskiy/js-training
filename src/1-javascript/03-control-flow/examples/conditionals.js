// ============================================
// CONDITIONALS Examples
// ============================================

console.log('=== 1. if Statement ===');

const age = 25;

if (age >= 18) {
  console.log('You are an adult');
}

if (age < 18) {
  console.log('You are a minor');
}

console.log('\n=== 2. if...else Statement ===');

const score = 85;

if (score >= 90) {
  console.log('Grade: A');
} else {
  console.log('Grade: B or lower');
}

console.log('\n=== 3. if...else if...else Statement ===');

const grade = 78;

if (grade >= 90) {
  console.log('A - Excellent!');
} else if (grade >= 80) {
  console.log('B - Good!');
} else if (grade >= 70) {
  console.log('C - Satisfactory');
} else if (grade >= 60) {
  console.log('D - Pass');
} else {
  console.log('F - Fail');
}

console.log('\n=== 4. Nested if Statements ===');

const hasLicense = true;
const hasInsurance = true;
const carAge = 3;

if (hasLicense) {
  if (hasInsurance) {
    if (carAge < 5) {
      console.log('You can drive!');
    } else {
      console.log('Car is too old');
    }
  } else {
    console.log('Need insurance');
  }
} else {
  console.log('Need license');
}

// Better: combine conditions
if (hasLicense && hasInsurance && carAge < 5) {
  console.log('✅ You can drive!');
}

console.log('\n=== 5. Ternary Operator ===');

const userAge = 20;
const status = userAge >= 18 ? 'Adult' : 'Minor';
console.log('Status:', status);

// Multiple ternaries (harder to read)
const num = 15;
const result = num > 10 ? 'large' : num > 5 ? 'medium' : 'small';
console.log('Size:', result);

// Ternary in expressions
const price = 100;
const finalPrice = price * (age >= 65 ? 0.8 : 1); // 20% discount for seniors
console.log('Final price:', finalPrice);

console.log('\n=== 6. switch Statement ===');

const day = 'Monday';

switch (day) {
  case 'Monday':
    console.log('Start of work week');
    break;
  case 'Tuesday':
  case 'Wednesday':
  case 'Thursday':
    console.log('Middle of week');
    break;
  case 'Friday':
    console.log('Almost weekend!');
    break;
  case 'Saturday':
  case 'Sunday':
    console.log('Weekend!');
    break;
  default:
    console.log('Unknown day');
}

console.log('\n=== 7. switch Fall-through ===');

const month = 2;
let days;

switch (month) {
  case 1: case 3: case 5: case 7: case 8: case 10: case 12:
    days = 31;
    break;
  case 4: case 6: case 9: case 11:
    days = 30;
    break;
  case 2:
    days = 28;
    break;
  default:
    days = 0;
}

console.log(`Month ${month} has ${days} days`);

console.log('\n=== 8. switch vs if/else ===');

// Good use of switch - single variable, many values
const color = 'red';

switch (color) {
  case 'red':
    console.log('Stop');
    break;
  case 'yellow':
    console.log('Slow');
    break;
  case 'green':
    console.log('Go');
    break;
}

// Bad use of switch - complex conditions
// Use if/else instead
const temperature = 25;

if (temperature < 0) {
  console.log('Freezing');
} else if (temperature < 15) {
  console.log('Cold');
} else if (temperature < 25) {
  console.log('Moderate');
} else {
  console.log('Hot');
}

console.log('\n=== 9. Truthy and Falsy in Conditions ===');

// Falsy values
if (0) console.log('0 is truthy');
else console.log('0 is falsy');

if ('') console.log('"" is truthy');
else console.log('"" is falsy');

if (null) console.log('null is truthy');
else console.log('null is falsy');

// Truthy values
if ('hello') console.log('"hello" is truthy');
if (1) console.log('1 is truthy');
if ([]) console.log('[] is truthy'); // Empty array is truthy!
if ({}) console.log('{} is truthy'); // Empty object is truthy!

console.log('\n=== 10. Guard Clauses ===');

function processUser(user) {
  // ❌ Nested conditions (harder to read)
  if (user) {
    if (user.name) {
      if (user.age >= 18) {
        console.log('Processing adult user:', user.name);
      }
    }
  }
}

// ✅ Guard clauses (easier to read)
function processUserBetter(user) {
  if (!user) return;
  if (!user.name) return;
  if (user.age < 18) return;

  console.log('Processing adult user:', user.name);
}

processUserBetter({ name: 'Alice', age: 25 });

console.log('\n=== 11. Nullish Coalescing and Optional Chaining ===');

const user = {
  name: 'Alice',
  settings: null
};

// Optional chaining - safe property access
const theme = user.settings?.theme;
console.log('Theme:', theme); // undefined (no error)

// Nullish coalescing - default for null/undefined only
const displayTheme = theme ?? 'light';
console.log('Display theme:', displayTheme); // 'light'

// Compare with OR operator
const count = 0;
console.log('With ||:', count || 10);  // 10 (0 is falsy)
console.log('With ??:', count ?? 10);  // 0 (0 is not null/undefined)

console.log('\n=== 12. Logical Operators in Conditions ===');

const isLoggedIn = true;
const isAdmin = false;
const hasPermission = true;

// AND - all must be true
if (isLoggedIn && hasPermission) {
  console.log('Access granted');
}

// OR - at least one must be true
if (isAdmin || hasPermission) {
  console.log('Can view content');
}

// NOT - invert condition
if (!isAdmin) {
  console.log('Regular user');
}

// Complex conditions
if ((isAdmin || hasPermission) && isLoggedIn) {
  console.log('Can perform action');
}

console.log('\n=== Best Practices ===');
console.log('1. Use if/else for complex conditions');
console.log('2. Use ternary for simple, inline conditions');
console.log('3. Use switch for single variable with many values');
console.log('4. Always use break in switch (unless intentional fall-through)');
console.log('5. Use guard clauses to reduce nesting');
console.log('6. Be aware of truthy/falsy values');
console.log('7. Use optional chaining (?.) for safe property access');
console.log('8. Use nullish coalescing (??) for defaults');
