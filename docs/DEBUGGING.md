# 🐛 Debugging in VS Code

This project is pre-configured with debug profiles for VS Code. No setup needed — just open the Run & Debug panel and start.

---

## Quick Start

1. Open any `.js` or `.ts` file
2. Click on the line number gutter to set a **breakpoint** (red dot appears)
3. Press `F5` → choose a debug profile
4. Execution stops at the breakpoint — inspect variables, step through code

---

## Debug Profiles

Open the Run & Debug panel: `Cmd+Shift+D` (macOS) / `Ctrl+Shift+D` (Windows/Linux)

| Profile | When to use |
|---|---|
| **Debug Current JavaScript File** | Debug the `.js` file currently open in the editor |
| **Debug Current TypeScript File** | Debug the `.ts` file currently open in the editor |
| **Debug Jest Tests** | Run all tests with debugger attached |
| **Debug Current Jest Test File** | Run only the test file currently open |
| **Debug Jest Test (by pattern)** | Prompts for a pattern (e.g. `variables`), runs matching tests |

---

## Debugger Controls

Once execution pauses at a breakpoint:

| Button | Shortcut | What it does |
|---|---|---|
| Continue | `F5` | Run until next breakpoint |
| Step Over | `F10` | Execute current line, stay at same level |
| Step Into | `F11` | Jump inside a function call |
| Step Out | `Shift+F11` | Finish current function, return to caller |
| Stop | `Shift+F5` | Stop debugging |

---

## Example: Debugging a Function

```javascript
// examples/let-const.js

function calculateTotal(items) {
  let total = 0;

  for (const item of items) {
    total += item.price; // Set a breakpoint here
  }

  return total;
}

calculateTotal([{ price: 10 }, { price: 20 }]);
```

1. Click the gutter next to `total += item.price` — a red dot appears
2. Press `F5` → select **Debug Current JavaScript File**
3. Execution stops on that line each iteration
4. In the **Variables** panel (left side) you can see `total`, `item`, `items`
5. Press `F10` to step to next line, watch values change

---

## Example: Debugging a Failing Test

```javascript
// exercises/variables.js
function add(a, b) {
  return a - b; // bug! should be +
}
```

1. Open the test file or exercise file
2. Set a breakpoint inside `add()`
3. Press `F5` → select **Debug Current Jest Test File**
4. When execution stops, check the actual values of `a` and `b`

---

## The `debugger` Statement

You can also trigger a breakpoint from code:

```javascript
function myFunction(x) {
  debugger; // Execution will pause here when debugger is attached
  return x * 2;
}
```

Useful when you can't easily click the line in VS Code (e.g. inside a callback or loop condition).

---

## Variables Panel

When paused, the left sidebar shows:

- **Local** — variables in the current function scope
- **Closure** — variables from outer scopes (great for closures module!)
- **Global** — global variables

Hover over any variable in the editor to see its current value inline.

---

## Watch Expressions

In the **Watch** section of the Debug panel, you can type any expression to evaluate it live:

```
items.length
total * 2
typeof x
```

---

## Debug Console

At the bottom, the **Debug Console** lets you run expressions in the current paused context:

```javascript
> items.filter(i => i.price > 10)
> JSON.stringify(total)
```

---

## Tips

- **Conditional breakpoint** — right-click a breakpoint → "Edit Breakpoint" → add condition like `i === 2` (only pauses when true)
- **Logpoint** — right-click gutter → "Add Logpoint" — logs a message without stopping execution (like `console.log` but non-invasive)
- **Disable breakpoints** — click the red dot again to remove, or use the checkbox in the Breakpoints panel

---

← [Back to Getting Started](GETTING_STARTED.md)
