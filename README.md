# 🚀 Fullstack JavaScript/TypeScript Training

Welcome to hands-on fullstack development training! Learn JavaScript, TypeScript, Node.js Backend, and React Frontend through practical examples and test-driven exercises.

## 🎯 What You'll Learn

This course includes **21 practical modules** across 4 areas:

- **JavaScript Basics** (7 modules) - Variables, functions, arrays, objects, control flow, async programming
- **TypeScript** (4 modules) - Types, interfaces, typed functions, classes
- **Node.js Backend** (5 modules) - Server development, Express, REST APIs, databases
- **React Frontend** (5 modules) - Components, state management, hooks, forms

<details>
<summary>📋 <strong>View Complete Course Structure</strong></summary>

### 1. JavaScript Basics (7 modules)
- **01-variables** - `let`, `const`, `var`, hoisting, scope
- **02-data-types** - Primitives, type conversion, `typeof`
- **03-functions** - Declarations, expressions, arrow functions, higher-order
- **04-arrays** - Array methods, iteration, `map/filter/reduce`
- **05-objects** - Literals, methods, destructuring, spread
- **06-control-flow** - `if/else`, `switch`, ternary operator, loops
- **07-async-javascript** - Callbacks, promises, `async/await`

### 2. TypeScript Basics (4 modules)
- **01-types** - Basic types, type annotations, type inference
- **02-interfaces** - Object types, optional properties, readonly
- **03-functions** - Typed parameters, return types, overloads
- **04-classes** - Class syntax, access modifiers, inheritance

### 3. Node.js Backend (5 modules)
- **01-node-basics** - Modules, require, exports, process
- **02-file-system** - fs module, read/write, async operations
- **03-express-basics** - Creating server, routing, middleware
- **04-rest-api** - CRUD operations, JSON, HTTP methods
- **05-database** - Simple JSON database, CRUD with files

### 4. React Frontend (5 modules)
- **01-jsx-basics** - JSX syntax, components, props
- **02-components** - Functional components, composition
- **03-state** - useState, state management basics
- **04-hooks** - useEffect, useContext, custom hooks
- **05-forms-events** - Form handling, event listeners, controlled inputs

</details>

## 🚀 Getting Started

### What You're Learning

**JavaScript** is the language of the web - originally created in 1995 for browsers, it's now one of the most popular programming languages in the world. You'll find JavaScript running:
- 🌐 **In browsers** - Making websites interactive (React, Vue, Angular)
- 🖥️ **On servers** - Building APIs and backend systems (Node.js, Express)
- 📱 **In mobile apps** - React Native, Ionic
- 🖨️ **In desktop apps** - Electron (VS Code, Slack, Discord)
- 🤖 **In IoT devices** - Embedded systems, robotics

**Node.js** is a JavaScript runtime built on Chrome's V8 engine. It lets you run JavaScript outside the browser - on servers, in build tools, anywhere! Released in 2009, Node.js transformed JavaScript from a browser-only language into a full-stack powerhouse.

**TypeScript** adds static typing to JavaScript, catching errors before your code runs. Created by Microsoft in 2012, it's become the industry standard for large-scale applications.

**Why this stack?**
- ✅ One language for frontend and backend
- ✅ Huge ecosystem (npm has 2+ million packages)
- ✅ Modern, actively developed
- ✅ High demand in job market

**Want to learn more?**
- [JavaScript: The First 20 Years](https://dl.acm.org/doi/10.1145/3386327) - History and evolution
- [How JavaScript Works](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - MDN Web Docs
- [Node.js: Under the Hood](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) - Official docs

---

### Prerequisites

**You'll need Node.js and npm installed.**

**Recommended setup with nvm:**

```bash
# Install nvm (Node Version Manager)
# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows: Download from https://github.com/coreybutler/nvm-windows/releases

# After installation, restart terminal and run:
nvm install 22
nvm use 22
nvm alias default 22  # Set as default version
node -v  # Should show v22.x.x
```

**Why nvm?**
- 🔄 Switch between Node.js versions easily
- 🎯 Use latest stable version (Node.js 22 LTS)
- 🚀 Avoid permission issues

**Alternative:** Download Node.js directly from [nodejs.org](https://nodejs.org/) - get version 22.x LTS

**New to these tools?** → **[Development Tools Guide](docs/TOOLS.md)** explains Node.js, npm, npx, nvm in detail

---

### Setup (2 minutes)

**1. Install dependencies if you not done that before**
```bash
npm install
```

**2. Create your student branch:**
Create your own branch to keep your work separate and safe.

```bash
git checkout -b student/<your-name>
```

Example: `git checkout -b student/john`

💡 New to Git? See [Git Branching Basics](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

✅ **You're ready to start learning!**

---

## 📚 Your Learning Workflow

This is your step-by-step process for each module:

### Step 1: Read the Theory

Navigate to a module and read its README:

```bash
cd modules/01-javascript-basics/01-variables
cat README.md
```

Each module README contains concepts, examples, and learning objectives.

### Step 2: Study the Examples

Run working examples to see concepts in action:

```bash
node examples/let-const.js
node examples/scope.js
```

**Need help running scripts?** → **[Running Scripts Guide](docs/RUNNING_SCRIPTS.md)**

### Step 3: Complete the Exercises

Open exercise files in your editor and write code:

```bash
code exercises/variables.js
```

You can choose your learning approach:
- **Test-Driven:** Run tests first, then write code to make them pass
- **Example-Based:** Study examples, write code, then verify with tests

### Step 4: Test Your Solution

Run tests for the module (from project root):

```bash
cd ../../..  # Navigate back to project root
npm test -- 01-variables
```

**Pro tip:** Use watch mode for automatic test reruns when you save:

```bash
npm test -- --watch 01-variables
```

### Step 5: Commit Your Progress

Save your completed work:

```bash
git add .
git commit -m "Completed 01-variables"
```

### Step 6: Move to Next Module

Repeat steps 1-6 for the next module. Modules are designed to be completed in order!

---

## 🛠 Quick Command Reference

**Testing:**
```bash
npm test                    # Run all tests
npm test -- 01-variables    # Test specific module
npm test -- --watch         # Watch mode (auto-rerun)
npm run test:coverage       # Coverage report
```

**Code Quality:**
```bash
npm run lint                # Check code style
npm run lint:fix            # Auto-fix issues
npm run type-check          # TypeScript validation
```

---

## 📖 Documentation & Resources

### Course Documentation

- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Detailed setup and first steps
- **[Development Tools](docs/TOOLS.md)** - Node.js, npm, npx, nvm, ts-node explained
- **[Running Scripts](docs/RUNNING_SCRIPTS.md)** - How to run and debug your code

### External Resources

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript documentation
- [React Documentation](https://react.dev/) - React official docs
- [Jest Documentation](https://jestjs.io/) - Testing framework docs

---

## 💡 Learning Tips

1. **Follow the order** - Modules build on previous concepts
2. **Experiment freely** - Modify examples to see what happens
3. **Use tests as specs** - They show exactly what's expected
4. **Commit often** - Save progress after each module
5. **Don't rush** - Understanding beats speed every time
6. **Review when stuck** - Return to theory and examples

---

## 🤝 Need Help?

1. Check **[Getting Started Guide](docs/GETTING_STARTED.md)** for setup issues
2. Review the **module's README** for theory
3. Study **examples/** in the module folder
4. Read **[Running Scripts Guide](docs/RUNNING_SCRIPTS.md)** for execution help
5. Contact your instructor

## 📜 License

MIT

---

**Happy learning! 🎓✨**
