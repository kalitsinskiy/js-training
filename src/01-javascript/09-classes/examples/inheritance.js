// ============================================
// CLASS INHERITANCE Examples
// ============================================

console.log('=== 1. Basic Inheritance ===');

class Shape {
  constructor(color = 'black') {
    this.color = color;
  }

  area() {
    return 0; // Override in subclass
  }

  describe() {
    return `A ${this.color} shape with area ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(radius, color) {
    super(color); // Must call super BEFORE using this
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }

  describe() {
    return `${super.describe()} (circle, r=${this.radius})`;
  }
}

class Rectangle extends Shape {
  constructor(width, height, color) {
    super(color);
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

const circle = new Circle(5, 'red');
const rect = new Rectangle(4, 6, 'blue');

console.log(circle.describe());
console.log(rect.describe());

console.log('\n=== 2. instanceof and Type Checking ===');

console.log('circle instanceof Circle:', circle instanceof Circle);  // true
console.log('circle instanceof Shape:', circle instanceof Shape);    // true (parent!)
console.log('rect instanceof Circle:', rect instanceof Circle);      // false
console.log('rect instanceof Shape:', rect instanceof Shape);        // true

// Check specific type
const shapes = [circle, rect, new Shape()];
shapes.forEach(shape => {
  if (shape instanceof Circle) {
    console.log(`Circle with radius ${shape.radius}`);
  } else if (shape instanceof Rectangle) {
    console.log(`Rectangle ${shape.width}x${shape.height}`);
  } else {
    console.log('Generic shape');
  }
});

console.log('\n=== 3. Calling Parent Methods ===');

class Vehicle {
  constructor(brand, speed) {
    this.brand = brand;
    this.speed = speed;
  }

  describe() {
    return `${this.brand} going at ${this.speed}km/h`;
  }

  accelerate(amount) {
    this.speed += amount;
    return this;
  }
}

class ElectricCar extends Vehicle {
  constructor(brand, speed, range) {
    super(brand, speed);
    this.range = range;
    this.battery = 100;
  }

  describe() {
    // Extend parent's describe
    return `${super.describe()}, range: ${this.range}km, battery: ${this.battery}%`;
  }

  accelerate(amount) {
    super.accelerate(amount); // Call parent method
    this.battery -= amount * 0.5; // Extra: drain battery
    return this;
  }
}

const tesla = new ElectricCar('Tesla', 0, 500);
tesla.accelerate(100).accelerate(50);
console.log(tesla.describe());

console.log('\n=== 4. Abstract-Like Classes ===');

// JavaScript doesn't have abstract classes, but we can simulate
class AbstractRepository {
  constructor(tableName) {
    if (new.target === AbstractRepository) {
      throw new Error('Cannot instantiate abstract class');
    }
    this.tableName = tableName;
  }

  // "Abstract" method - must be implemented
  findById(id) {
    throw new Error('findById() must be implemented');
  }

  findAll() {
    throw new Error('findAll() must be implemented');
  }

  // Concrete method (shared behavior)
  log(action, data) {
    console.log(`[${this.tableName}] ${action}:`, data);
  }
}

class UserRepository extends AbstractRepository {
  constructor() {
    super('users');
    this.data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
  }

  findById(id) {
    const user = this.data.find(u => u.id === id);
    this.log('findById', { id, found: !!user });
    return user;
  }

  findAll() {
    this.log('findAll', { count: this.data.length });
    return [...this.data];
  }
}

try {
  new AbstractRepository('test'); // Throws
} catch (e) {
  console.log('Cannot instantiate:', e.message);
}

const userRepo = new UserRepository();
console.log(userRepo.findById(1));
console.log(userRepo.findAll());

console.log('\n=== 5. Mixin Pattern ===');

// Mix multiple behaviors into a class (since JS has no multiple inheritance)
const Serializable = (Base) => class extends Base {
  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(json) {
    return Object.assign(new this(), JSON.parse(json));
  }
};

const Validatable = (Base) => class extends Base {
  validate() {
    const errors = [];
    if (!this.name) errors.push('name is required');
    if (!this.email) errors.push('email is required');
    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }
};

class BaseModel {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

class UserModel extends Serializable(Validatable(BaseModel)) {
  constructor(data) {
    super(data);
  }
}

const user = new UserModel({ name: 'Alice', email: 'alice@example.com' });
console.log('Valid:', user.isValid());
console.log('Serialized:', user.serialize());

const invalid = new UserModel({ name: 'Bob' });
console.log('Invalid errors:', invalid.validate());

console.log('\n=== 6. Class Expressions ===');

// Classes can be expressions too
const Dog = class {
  constructor(name) { this.name = name; }
  bark() { console.log(`${this.name}: Woof!`); }
};

const rex = new Dog('Rex');
rex.bark();

// Anonymous class
const makeClass = (greeting) => class {
  greet(name) { return `${greeting}, ${name}!`; }
};

const HelloClass = makeClass('Hello');
const HiClass = makeClass('Hi');

console.log(new HelloClass().greet('Alice'));
console.log(new HiClass().greet('Bob'));

console.log('\n=== Best Practices ===');
console.log('1. Use extends for "is-a" relationships (Circle is-a Shape)');
console.log('2. Always call super() first in child constructors');
console.log('3. Use super.method() to extend (not replace) parent behavior');
console.log('4. Use mixins for shared behavior across different class trees');
console.log('5. Prefer composition over inheritance when possible');
console.log('6. Use new.target to prevent abstract class instantiation');
console.log('7. Keep inheritance depth shallow (2-3 levels max)');
