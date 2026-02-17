# 🛠 Development Tools

Quick reference for the essential tools you'll use in this course.

---

## 📦 Node.js

**What is it?** JavaScript runtime that lets you run JavaScript outside the browser.

**Installation:**
- Download from [nodejs.org](https://nodejs.org/) - get version 22.x LTS
- Or use nvm (recommended - see below)

**Verify installation:**
```bash
node -v
# Should show: v22.x.x
```

**Basic usage:**
```bash
# Run a JavaScript file
node script.js

# Interactive mode (try JavaScript commands)
node
```

---

## 📚 npm (Node Package Manager)

**What is it?** Comes with Node.js. Installs packages and runs scripts.

**Commands you'll use:**

```bash
# Install all project dependencies
npm install

# Run tests
npm test

# Run specific test
npm test -- 01-variables

# Check code quality
npm run lint
```

That's it! These are the main commands you'll use throughout the course.

---

## 🔄 nvm (Node Version Manager)

**What is it?** Tool to manage multiple Node.js versions.

**Why use it?**
- Switch between Node.js versions easily
- Use the exact version for this course (22.x)

**Installation:**

**macOS/Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Windows:**
Download from [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)

**After installation, restart terminal and run:**
```bash
nvm install 22
nvm use 22
nvm alias default 22
node -v  # Should show v22.x.x
```

**That's all you need!** The `nvm alias default 22` command ensures Node.js 22 is used every time you open a new terminal.

**If project has .nvmrc file:**
```bash
nvm use
# Automatically switches to the right version
```

---

## 💡 npx

**What is it?** Runs packages without installing them globally. Comes with npm.

**You'll see it used like:**
```bash
# Run TypeScript files (later in the course)
npx ts-node script.ts
```

No need to learn more now - we'll use it when needed!

---

## 📖 Learn More

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [nvm Documentation](https://github.com/nvm-sh/nvm)

---

**That's all you need to get started!** 🚀

← [Back to Setup](../README.md#setup-2-minutes)
