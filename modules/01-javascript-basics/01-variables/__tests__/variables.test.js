/**
 * Tests for Variables Exercises
 * These tests check if you've correctly implemented the functions
 */

const {
  greet,
  counter,
  checkBlockScope,
  updateUser,
  shadowDemo,
  createGreeting,
  addToList,
} = require('../exercises/variables');

describe('Variables Exercises', () => {
  describe('greet', () => {
    test('should return greeting with name', () => {
      expect(greet('Ivan')).toBe('Hello, Ivan!');
    });

    test('should work with different names', () => {
      expect(greet('Maria')).toBe('Hello, Maria!');
      expect(greet('Petro')).toBe('Hello, Petro!');
    });

    test('should handle empty string', () => {
      expect(greet('')).toBe('Hello, !');
    });
  });

  describe('counter', () => {
    // Reset counter before tests
    beforeEach(() => {
      // Access module internals to reset - in real app, we'd design this differently
      const mod = require('../exercises/variables');
      // This is a workaround for testing - normally you wouldn't do this
    });

    test('should increment and return count', () => {
      const firstCall = counter();
      const secondCall = counter();
      const thirdCall = counter();

      expect(secondCall).toBeGreaterThan(firstCall);
      expect(thirdCall).toBeGreaterThan(secondCall);
    });

    test('should return a number', () => {
      expect(typeof counter()).toBe('number');
    });
  });

  describe('checkBlockScope', () => {
    test('should return true (understanding block scope)', () => {
      expect(checkBlockScope()).toBe(true);
    });

    test('should be a boolean', () => {
      expect(typeof checkBlockScope()).toBe('boolean');
    });
  });

  describe('updateUser', () => {
    test('should return object with updated name and age', () => {
      const result = updateUser('Ivan', 25);
      expect(result).toEqual({ name: 'Ivan', age: 25 });
    });

    test('should work with different values', () => {
      const result = updateUser('Maria', 30);
      expect(result).toEqual({ name: 'Maria', age: 30 });
    });

    test('should return an object', () => {
      const result = updateUser('Test', 20);
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    test('should have name and age properties', () => {
      const result = updateUser('Test', 20);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('age');
    });
  });

  describe('shadowDemo', () => {
    test('should return object with all scope values', () => {
      const result = shadowDemo('test');
      expect(result).toHaveProperty('global');
      expect(result).toHaveProperty('function');
      expect(result).toHaveProperty('block');
    });

    test('should show different values in different scopes', () => {
      const result = shadowDemo('test');
      expect(result.global).toBe('global');
      expect(result.function).toBeDefined();
      expect(result.block).toBeDefined();
    });

    test('should be an object', () => {
      const result = shadowDemo('test');
      expect(typeof result).toBe('object');
    });
  });

  describe('createGreeting', () => {
    test('should return a function', () => {
      const greeter = createGreeting('Hello');
      expect(typeof greeter).toBe('function');
    });

    test('should create greeting with prefix', () => {
      const sayHello = createGreeting('Hello');
      expect(sayHello('World')).toBe('Hello World');
    });

    test('should work with different prefixes', () => {
      const sayHi = createGreeting('Hi');
      expect(sayHi('There')).toBe('Hi There');

      const sayHey = createGreeting('Hey');
      expect(sayHey('Friend')).toBe('Hey Friend');
    });

    test('should maintain separate closures', () => {
      const greet1 = createGreeting('Hello');
      const greet2 = createGreeting('Hi');

      expect(greet1('A')).toBe('Hello A');
      expect(greet2('B')).toBe('Hi B');
      // Each closure should remember its own prefix
      expect(greet1('C')).toBe('Hello C');
    });
  });

  describe('addToList', () => {
    // Note: This test modifies shared state, which is generally not ideal
    // In real applications, avoid shared mutable state

    test('should add items to the list', () => {
      const result = addToList([1, 2, 3]);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
    });

    test('should return an array', () => {
      const result = addToList([]);
      expect(Array.isArray(result)).toBe(true);
    });

    test('should be cumulative', () => {
      // Clear the list first
      const mod = require('../exercises/variables');
      // First call
      addToList([1]);
      // Second call should add to existing
      const result = addToList([2]);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('Variables Concepts', () => {
  test('const with objects - can modify properties', () => {
    const obj = { value: 1 };
    obj.value = 2; // This should work
    expect(obj.value).toBe(2);
  });

  test('const with arrays - can modify contents', () => {
    const arr = [1, 2, 3];
    arr.push(4); // This should work
    expect(arr).toContain(4);
  });

  test('let allows reassignment', () => {
    let value = 1;
    value = 2; // This should work
    expect(value).toBe(2);
  });

  test('block scope - variable not accessible outside block', () => {
    {
      const blockVar = 'inside';
    }
    // blockVar should not be defined here
    expect(() => {
      // This should throw ReferenceError
      // eslint-disable-next-line no-undef
      return blockVar;
    }).toThrow();
  });
});
