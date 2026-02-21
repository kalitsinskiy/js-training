// ============================================
// CLASS BASICS Examples
// ============================================

console.log('=== 1. Basic Class ===');

class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    console.log(`${this.name} says ${this.sound}`);
  }

  toString() {
    return `Animal(${this.name})`;
  }
}

const cat = new Animal('Cat', 'meow');
const dog = new Animal('Dog', 'woof');

cat.speak();
dog.speak();

console.log('Type:', typeof Animal);        // 'function'
console.log('Is Animal?', cat instanceof Animal); // true
console.log('String:', String(cat));

console.log('\n=== 2. Getters and Setters ===');

class Temperature {
  #celsius;

  constructor(celsius) {
    this.#celsius = celsius;
  }

  get celsius() {
    return this.#celsius;
  }

  set celsius(value) {
    if (value < -273.15) {
      throw new RangeError('Temperature below absolute zero');
    }
    this.#celsius = value;
  }

  get fahrenheit() {
    return this.#celsius * 9/5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) * 5/9;
  }

  get kelvin() {
    return this.#celsius + 273.15;
  }
}

const temp = new Temperature(100);
console.log('Celsius:', temp.celsius);     // 100
console.log('Fahrenheit:', temp.fahrenheit); // 212
console.log('Kelvin:', temp.kelvin);         // 373.15

temp.fahrenheit = 32;
console.log('After setting 32F:', temp.celsius); // 0

try {
  temp.celsius = -300; // Below absolute zero
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== 3. Static Methods and Properties ===');

class MathUtils {
  static PI = 3.14159265;

  static add(a, b) { return a + b; }
  static multiply(a, b) { return a * b; }

  static circleArea(radius) {
    return MathUtils.PI * radius ** 2;
  }
}

// Call on class, not instance
console.log('PI:', MathUtils.PI);
console.log('Add:', MathUtils.add(5, 3));
console.log('Circle area r=5:', MathUtils.circleArea(5).toFixed(2));

class User {
  static #count = 0;

  constructor(name) {
    this.name = name;
    this.id = ++User.#count;
  }

  static getCount() {
    return User.#count;
  }

  static create(name) {
    return new User(name); // Factory method
  }
}

const u1 = new User('Alice');
const u2 = User.create('Bob'); // Using factory method

console.log('User count:', User.getCount()); // 2
console.log('u1 id:', u1.id, '| u2 id:', u2.id);

console.log('\n=== 4. Private Fields ===');

class BankAccount {
  #balance;
  #transactions = [];

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
    this.#transactions.push({ type: 'deposit', amount });
    return this;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
    this.#transactions.push({ type: 'withdrawal', amount });
    return this;
  }

  get balance() { return this.#balance; }
  get history() { return [...this.#transactions]; } // Copy, not reference
}

const account = new BankAccount(100);
account.deposit(50).withdraw(30); // Method chaining

console.log('Balance:', account.balance);
console.log('History:', account.history);
// console.log(account.#balance); // SyntaxError: private field

console.log('\n=== 5. Class vs Factory Function vs Object ===');

// 1. Plain object - no encapsulation, no reuse
const personObj = { name: 'Alice', greet() { return `Hi, ${this.name}`; } };

// 2. Factory function - encapsulation, no instanceof
function createPerson(name) {
  return {
    name,
    greet() { return `Hi, ${this.name}`; }
  };
}

// 3. Class - encapsulation, instanceof, inheritance
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hi, ${this.name}`; }
}

const p1 = personObj;
const p2 = createPerson('Bob');
const p3 = new Person('Charlie');

console.log(p1.greet());
console.log(p2.greet());
console.log(p3.greet());
console.log('p3 instanceof Person:', p3 instanceof Person); // true
console.log('p2 instanceof Person:', p2 instanceof Person); // false (factory!)

console.log('\n=== Best Practices ===');
console.log('1. Use classes when you need inheritance or instanceof');
console.log('2. Use factory functions for simple encapsulation');
console.log('3. Use # for truly private data');
console.log('4. Keep constructors simple - just assign values');
console.log('5. Use static methods for utilities not needing instance');
console.log('6. Use getters for computed properties');
console.log('7. Return this from methods for chaining');
