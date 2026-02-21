// ============================================
// OBJECT METHODS Examples
// ============================================

console.log('=== 1. Method Definitions ===');

// Old way
const person1 = {
  name: 'Alice',
  greet: function() {
    console.log('Hello!');
  }
};

// Modern shorthand
const person2 = {
  name: 'Bob',
  greet() {
    console.log('Hi!');
  }
};

person1.greet();
person2.greet();

// Arrow function (not recommended for methods)
const person3 = {
  name: 'Charlie',
  greet: () => {
    console.log('Hey!');
  }
};

person3.greet();

console.log('\n=== 2. The this Keyword ===');

const user = {
  name: 'Alice',
  age: 25,
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  },
  getAge() {
    return this.age;
  }
};

user.greet();                  // this = user
console.log('Age:', user.getAge());

// this depends on how function is called
const greetFn = user.greet;
// greetFn(); // this = undefined (in strict mode) or global object

console.log('\n=== 3. this in Arrow Functions ===');

const obj1 = {
  name: 'Regular',
  regularMethod() {
    console.log('Regular this:', this.name);
  },
  arrowMethod: () => {
    console.log('Arrow this:', this.name); // undefined (inherits from outside)
  }
};

obj1.regularMethod(); // Works
obj1.arrowMethod();   // Doesn't work

// Arrow functions useful in nested functions
const obj2 = {
  name: 'Alice',
  hobbies: ['reading', 'coding'],
  showHobbies() {
    this.hobbies.forEach(hobby => {
      console.log(`${this.name} likes ${hobby}`); // Arrow preserves this
    });
  }
};

obj2.showHobbies();

console.log('\n=== 4. Method Chaining ===');

const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this; // Return this for chaining
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  multiply(n) {
    this.value *= n;
    return this;
  },
  getValue() {
    return this.value;
  }
};

const result = calculator
  .add(10)
  .multiply(2)
  .subtract(5)
  .getValue();

console.log('Result:', result); // 15

console.log('\n=== 5. Getter and Setter ===');

const circle = {
  radius: 5,
  get diameter() {
    return this.radius * 2;
  },
  set diameter(value) {
    this.radius = value / 2;
  },
  get area() {
    return Math.PI * this.radius ** 2;
  }
};

console.log('Radius:', circle.radius);
console.log('Diameter:', circle.diameter);  // Calls getter
circle.diameter = 20;                       // Calls setter
console.log('New radius:', circle.radius);  // 10
console.log('Area:', circle.area);

console.log('\n=== 6. Object as Collection of Methods ===');

const mathUtils = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  },
  divide(a, b) {
    return b !== 0 ? a / b : 'Cannot divide by zero';
  }
};

console.log('5 + 3 =', mathUtils.add(5, 3));
console.log('10 / 2 =', mathUtils.divide(10, 2));

console.log('\n=== 7. Factory Functions ===');

function createUser(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hello, I'm ${this.name}, ${this.age} years old`);
    },
    haveBirthday() {
      this.age++;
      console.log(`Happy birthday! Now ${this.age}`);
    }
  };
}

const alice = createUser('Alice', 25);
const bob = createUser('Bob', 30);

alice.greet();
alice.haveBirthday();
bob.greet();

console.log('\n=== 8. Combining Objects ===');

// Mixin pattern
const canWalk = {
  walk() {
    console.log(`${this.name} is walking`);
  }
};

const canEat = {
  eat(food) {
    console.log(`${this.name} is eating ${food}`);
  }
};

const person = Object.assign(
  { name: 'Alice' },
  canWalk,
  canEat
);

person.walk();
person.eat('pizza');

console.log('\n=== Best Practices ===');
console.log('1. Use method shorthand syntax');
console.log('2. Use regular functions (not arrow) for methods needing this');
console.log('3. Use arrow functions in nested callbacks to preserve this');
console.log('4. Return this from methods to enable chaining');
console.log('5. Use getters/setters for computed properties');
console.log('6. Use factory functions to create similar objects');
