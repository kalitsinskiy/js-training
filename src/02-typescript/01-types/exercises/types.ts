export {};
// ============================================
// TYPES Exercises
// ============================================
// Complete the TODO exercises below
// Run this file with: npx ts-node src/02-typescript/01-types/exercises/types.ts

console.log('=== Exercise 1: Add type annotations ===');
// TODO: Add explicit type annotations to all variables below
// (Even though TypeScript can infer them, this exercise is for practice)

const productName: string = 'Laptop';
const price: number = 999.99;
const inStock: boolean = true;
const quantity: number | null = null;

console.log(productName, price, inStock, quantity);

console.log('\n=== Exercise 2: Union type ===');
// TODO: Create a type alias 'StringOrNumber' that can be string or number
// Then write a function 'stringify' that accepts StringOrNumber
// and returns a string (use String() to convert)

// Your type alias here:

type StringOrNumber = string | number;

// Your function here:

function stringify(value: StringOrNumber): string {
  return String(value);
}

console.log(stringify(42)); // '42'
console.log(stringify('hello')); // 'hello'

console.log('\n=== Exercise 3: Literal types ===');
// TODO: Create a type 'Season' with exactly 4 values: 'spring', 'summer', 'autumn', 'winter'
// Then create a function 'getMonths' that takes a Season and returns the months array
// Example: getMonths('summer') => ['June', 'July', 'August']

// Your code here:
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

function getMonths(season: Season): string[] {
  switch (season) {
    case 'spring':
      return ['March', 'April', 'May'];
    case 'summer':
      return ['June', 'July', 'August'];
    case 'autumn':
      return ['September', 'October', 'November'];
    case 'winter':
      return ['December', 'January', 'February'];
  }
}

console.log(getMonths('summer'));
console.log(getMonths('winter'));

console.log('\n=== Exercise 4: Discriminated union ===');
// TODO: Create a discriminated union type 'PaymentResult':
//   - success case: { status: 'success'; transactionId: string; amount: number }
//   - failure case: { status: 'failure'; error: string; code: number }
// Then write a function 'handlePayment' that accepts PaymentResult
// and returns a human-readable string

// Your code here:

interface PaymentSuccess {
  status: 'success';
  transactionId: string;
  amount: number;
}

interface PaymentFailure {
  status: 'failure';
  error: string;
  code: number;
}

type PaymentResult = PaymentSuccess | PaymentFailure;

function handlePayment(result: PaymentResult): string {
  if (result.status === 'success') {
    return `Payment successful: ${result.amount} (ID: ${result.transactionId})`;
  }
  return `Payment failed: ${result.error} (Code: ${result.code})`;
}

console.log(handlePayment({ status: 'success', transactionId: 'tx_123', amount: 100 }));
console.log(handlePayment({ status: 'failure', error: 'Insufficient funds', code: 402 }));

console.log('\n=== Exercise 5: Type narrowing ===');
// TODO: Write a function 'describeInput' that accepts (string | number | boolean)
// and returns:
//   - for string: 'String of length N: "value"'
//   - for number: 'Number, rounded: N'
//   - for boolean: 'Boolean: true/false'

// Your function here:
function describeInput(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return `String of length ${value.length}: "${value}"`;
  }
  if (typeof value === 'number') {
    return `Number, rounded: ${Math.round(value)}`;
  }
  return `Boolean: ${value}`;
}

console.log(describeInput('hello')); // 'String of length 5: "hello"'
console.log(describeInput(3.7)); // 'Number, rounded: 4'
console.log(describeInput(true)); // 'Boolean: true'

console.log('\n=== Exercise 6: Tuple ===');
// TODO: Create a function 'parseCSVRow' that accepts a string like "Alice,30,true"
// and returns a tuple [name: string, age: number, active: boolean]
// Use split(','), Number(), and value === 'true'

// Your function here:

function parseCSVRow(row: string): [string, number, boolean] {
  const [name, ageStr, activeStr] = row.split(',');
  const age = Number(ageStr);
  const active = activeStr === 'true';
  return [name, age, active];
}

const [name, age, active] = parseCSVRow('Alice,30,true');
console.log(name, age, active); // Alice 30 true

console.log('\n=== Exercise 7: Intersection type ===');
// TODO: Create types 'Timestamped' ({ createdAt: Date; updatedAt: Date })
// and 'Identifiable' ({ id: string })
// Create type 'Entity' = Timestamped & Identifiable
// Then create a function 'createEntity' that takes an id and returns an Entity
// with current timestamps

// Your code here:

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

type Entity = Timestamped & Identifiable;

function createEntity(id: string): Entity {
  const now = new Date();
  return {
    id,
    createdAt: now,
    updatedAt: now,
  };
}

const entity = createEntity('user_1');
console.log(entity.id, entity.createdAt, entity.updatedAt);

console.log('\n=== Exercise 8: any vs unknown ===');
// TODO: Fix the function below — it uses 'any' unsafely.
// Change the parameter type to 'unknown' and add proper type narrowing
// before calling .toUpperCase()

function shout(value: any): string {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  return value.toUpperCase(); // dangerous if value is not a string
}
console.log('shout (unsafe):', shout('hello')); // 'HELLO' — works, but breaks for non-strings

// Your fixed version here:
function shoutSafe(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new Error('Input is not a string');
}

console.log(shoutSafe('hello')); // 'HELLO'
console.log(shoutSafe(42)); // 'Not a string'

console.log('\n=== 🎯 Challenge: Exhaustive type checking ===');
// TODO: Create a type 'Notification' with 3 variants:
//   - { type: 'email'; to: string; subject: string }
//   - { type: 'sms'; to: string; message: string }
//   - { type: 'push'; deviceId: string; title: string }
// Write a function 'sendNotification' that handles all variants
// and throws an error for unhandled ones using 'never'

// Your code here:
type Notification =
  | { type: 'email'; to: string; subject: string }
  | { type: 'sms'; to: string; message: string }
  | { type: 'push'; deviceId: string; title: string };

function sendNotification(notification: Notification): string {
  switch (notification.type) {
    case 'email':
      return `Sending email to ${notification.to} with subject "${notification.subject}"`;
    case 'sms':
      return `Sending SMS to ${notification.to} with message "${notification.message}"`;
    case 'push':
      return `Sending push notification to device ${notification.deviceId} with title "${notification.title}"`;
    default:
      const _exhaustiveCheck: never = notification;
      throw new Error(`Unhandled notification type: ${_exhaustiveCheck}`);
  }
}

sendNotification({ type: 'email', to: 'user@example.com', subject: 'Hello' });
sendNotification({ type: 'sms', to: '+380501234567', message: 'Hi' });
sendNotification({ type: 'push', deviceId: 'dev_1', title: 'Alert' });

console.log('\n✅ Exercises completed! Check your answers with a mentor.');
