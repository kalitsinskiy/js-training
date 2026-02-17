# 📦 Variables in JavaScript

## 🎯 Learning Goals

After completing this module, you will be able to:
- Understand the difference between `let`, `const`, and `var`
- Explain the concept of hoisting
- Understand block scope vs function scope
- Correctly choose between `let` and `const`
- Avoid common mistakes with scope

## 📚 Theory

### 1. `let` - Variable with block scope

`let` allows you to declare a variable that is limited to block scope.

```javascript
let name = 'Ivan';
name = 'Petro'; // ✓ OK - can be reassigned

if (true) {
  let age = 25;
  console.log(age); // 25
}
console.log(age); // ❌ Error: age is not defined
```

**Features:**
- Value can be reassigned
- Cannot be redeclared in the same scope
- Block-scoped (accessible only within the block `{}`)
- Not subject to hoisting (cannot be used before declaration)

### 2. `const` - Constant

`const` declares a constant - a variable whose value cannot be reassigned.

```javascript
const PI = 3.14159;
PI = 3.14; // ❌ Error: Assignment to constant variable

const user = { name: 'Ivan' };
user.name = 'Petro'; // ✓ OK - can modify object properties
user = {}; // ❌ Error - cannot reassign the constant
```

**Features:**
- Value cannot be reassigned
- Must be initialized at declaration
- Block-scoped
- For objects and arrays - can modify contents, but not the variable itself

### 3. `var` - Deprecated variable (not recommended)

`var` - the old way of declaring variables with function scope.

```javascript
var oldVar = 'old';
var oldVar = 'new'; // ✓ OK - can be redeclared (bad practice)

if (true) {
  var test = 'value';
}
console.log(test); // 'value' - var is not block-scoped!
```

**Problems with `var`:**
- Function-scoped, not block-scoped
- Can be redeclared
- Hoisting (hoisted to the beginning of the function)
- Can lead to unpredictable bugs

### 4. Hoisting

Hoisting - a JavaScript mechanism where variable and function declarations are "hoisted" to the top of their scope.

```javascript
console.log(x); // undefined (not error!)
var x = 5;

// Interpreted as:
var x;
console.log(x); // undefined
x = 5;

// With let/const - error
console.log(y); // ❌ ReferenceError
let y = 10;
```

### 5. When to use `let` vs `const`

**Use `const` by default:**
```javascript
const MAX_SIZE = 100;
const users = ['Ivan', 'Petro'];
const config = { theme: 'dark' };
```

**Use `let` only if the value will be reassigned:**
```javascript
let counter = 0;
counter++;

let message = 'Hello';
message = 'Goodbye';

for (let i = 0; i < 10; i++) {
  // i changes in the loop
}
```

**Never use `var`** (deprecated, use `let` or `const` instead)

## 📂 Module Structure

```
01-variables/
├── README.md              # This instruction
├── examples/              # Working examples
│   ├── let-const.js       # Examples of let and const
│   ├── var-hoisting.js    # Problems with var
│   └── scope.js           # Scopes
├── exercises/             # Your tasks
│   └── variables.js       # Exercises to complete
└── __tests__/             # Tests
    └── variables.test.js  # Code verification
```

## 🚀 How to Work with This Module

### Step 1: Study the examples

```bash
node examples/let-const.js
node examples/var-hoisting.js
node examples/scope.js
```

### Step 2: Complete the exercises

Open `exercises/variables.js` and complete the TODO tasks.

### Step 3: Run the tests

```bash
# From the project root directory
npm test -- 01-variables
```

### Step 4: Commit the result

```bash
git add exercises/variables.js
git commit -m "Completed 01-variables"
```

## 🎓 Additional Resources

- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
- [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

## ✅ Checklist

- [ ] Read the theory
- [ ] Run all examples
- [ ] Complete all exercises
- [ ] All tests pass
- [ ] Understand the difference between let, const, var
- [ ] Understand hoisting and scope

---

**Ready? Move on to the examples!** 🚀
