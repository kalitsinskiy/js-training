# React Fundamentals

## Quick Overview

React is a JavaScript library for building user interfaces from **components**. Instead of manipulating the DOM directly, you describe **what** the UI should look like for a given state, and React figures out **how** to update the DOM efficiently. Components are functions that return JSX (HTML-like syntax in JavaScript). State is managed with the `useState` hook, and user interactions are handled through event handlers.

## Key Concepts

### Why React?

- **Component model** — break the UI into small, reusable, self-contained pieces
- **Declarative** — describe the desired state, not the DOM operations to get there
- **Virtual DOM** — React diffs a lightweight in-memory tree against the real DOM and only updates what changed
- **Ecosystem** — massive community, libraries for routing, state management, testing, etc.

### JSX

JSX looks like HTML but lives in your JavaScript/TypeScript files. Babel/SWC compiles it to `React.createElement()` calls at build time.

```tsx
// JSX
const element = <h1 className="title">Hello, World!</h1>;

// Compiles to (roughly):
const element = React.createElement('h1', { className: 'title' }, 'Hello, World!');
```

Key differences from HTML:
- `className` instead of `class` (because `class` is a reserved word in JS)
- `htmlFor` instead of `for` on labels
- Self-closing tags are required: `<img />`, `<input />`, `<br />`
- Style is an object: `style={{ color: 'red', fontSize: '16px' }}`
- All attribute names are camelCase: `onClick`, `onChange`, `tabIndex`

**Expressions in JSX** — use `{}` to embed any JavaScript expression:

```tsx
const name = 'Alice';
const count = 5;

return (
  <div>
    <h1>Hello, {name}!</h1>
    <p>You have {count} items in your wishlist.</p>
    <p>Total: {count * 2}</p>
    <p>Current date: {new Date().toLocaleDateString()}</p>
  </div>
);
```

**Fragments** — when you need to return multiple elements without a wrapper `<div>`:

```tsx
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);
```

### Functional Components

A React component is a function that returns JSX:

```tsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}

// Usage
<Greeting />
```

### Props

Props are the inputs to a component — like function arguments:

```tsx
interface WelcomeProps {
  name: string;
  role?: string;  // optional
}

function Welcome({ name, role = 'guest' }: WelcomeProps) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>Role: {role}</p>
    </div>
  );
}

// Usage
<Welcome name="Alice" role="admin" />
<Welcome name="Bob" />  {/* role defaults to 'guest' */}
```

**Children prop** — content between opening and closing tags:

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="My Room">
  <p>12 participants</p>
  <button>Join</button>
</Card>
```

### useState Hook

`useState` lets a component remember data between renders:

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // initial value: 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

Key rules:
- `useState` returns `[currentValue, setterFunction]`
- Calling the setter triggers a re-render
- State is preserved between renders (unlike local variables)
- Never mutate state directly — always use the setter

**Functional updates** — when the new state depends on the old state:

```tsx
// Preferred for updates based on previous state
setCount(prev => prev + 1);

// Avoids bugs with batched updates
function handleTripleIncrement() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // count will be +3 (not +1)
}
```

**Object and array state:**

```tsx
const [user, setUser] = useState({ name: '', email: '' });

// Always create a new object (don't mutate!)
setUser({ ...user, name: 'Alice' });
// or
setUser(prev => ({ ...prev, name: 'Alice' }));

const [items, setItems] = useState<string[]>([]);

// Add item
setItems(prev => [...prev, 'New item']);

// Remove item at index
setItems(prev => prev.filter((_, i) => i !== index));

// Update item at index
setItems(prev => prev.map((item, i) => i === index ? 'Updated' : item));
```

### Event Handling

React events use camelCase and pass event objects:

```tsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();  // prevent page reload
    console.log('Login:', email, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Log In</button>
    </form>
  );
}
```

Common events:
- `onClick` — buttons, divs, any element
- `onChange` — inputs, selects, textareas
- `onSubmit` — forms
- `onKeyDown` / `onKeyUp` — keyboard
- `onFocus` / `onBlur` — focus

### Conditional Rendering

Three patterns:

```tsx
function Room({ isJoined, memberCount }: { isJoined: boolean; memberCount: number }) {
  // 1. Logical AND (&&) — render if true
  return (
    <div>
      {isJoined && <span className="badge">Joined</span>}

      {/* 2. Ternary — either/or */}
      <button>{isJoined ? 'Leave Room' : 'Join Room'}</button>

      {/* 3. Null for "render nothing" */}
      {memberCount > 0 ? <p>{memberCount} members</p> : null}
    </div>
  );
}

// 4. Early return — for loading/error states
function RoomPage({ room, isLoading }: { room: Room | null; isLoading: boolean }) {
  if (isLoading) return <p>Loading...</p>;
  if (!room) return <p>Room not found.</p>;

  return <div>{room.name}</div>;
}
```

**Warning:** Be careful with `&&` and numbers. `{count && <List />}` renders `0` when count is 0. Use `{count > 0 && <List />}` instead.

### List Rendering

Use `.map()` to render arrays. Every item needs a unique `key`:

```tsx
interface Room {
  id: string;
  name: string;
  participants: number;
}

function RoomList({ rooms }: { rooms: Room[] }) {
  return (
    <ul>
      {rooms.map(room => (
        <li key={room.id}>
          {room.name} — {room.participants} people
        </li>
      ))}
    </ul>
  );
}
```

**Why keys matter:**
- Keys help React identify which items changed, were added, or removed
- Without keys (or with index as key), React re-renders all items on any change
- Use a **stable unique ID** (database id, UUID) — not the array index
- Index as key is only safe if the list is static and never reordered

```tsx
// BAD — index as key with a dynamic list
{items.map((item, index) => <li key={index}>{item}</li>)}

// GOOD — stable unique ID
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

### Controlled Components

In a controlled component, React state is the single source of truth for the input value:

```tsx
function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      type="text"
      value={query}                         // React controls the value
      onChange={(e) => setQuery(e.target.value)}  // update state on every keystroke
      placeholder="Search rooms..."
    />
  );
}
```

This means:
- The input always shows what is in state
- You can validate, transform, or restrict input
- You have access to the current value at any time without reading the DOM

### Vite Project Setup

Create a new React + TypeScript project with Vite:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

Project structure:
```
my-app/
├── index.html          ← single HTML file (Vite entry point)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/             ← static assets (favicon, images)
└── src/
    ├── main.tsx        ← React entry: renders <App /> into #root
    ├── App.tsx         ← root component
    ├── App.css         ← styles for App
    └── vite-env.d.ts   ← Vite type declarations
```

`main.tsx` mounts the React app:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Learn More

- [React Official Docs (new)](https://react.dev/)
- [React: Describing the UI](https://react.dev/learn/describing-the-ui)
- [React: useState](https://react.dev/reference/react/useState)
- [React: Responding to Events](https://react.dev/learn/responding-to-events)
- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
- [React: Controlled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
- [Vite Guide](https://vitejs.dev/guide/)

## How to Work

1. **Study examples** — these are `.tsx` files. To run them:
   - Create a Vite + React + TS project (or use your `santa-app`)
   - Copy the example file into `src/`
   - Import and render the component in `App.tsx`
   ```
   src/05-frontend/lessons/04-react-fundamentals/examples/components-and-props.tsx
   src/05-frontend/lessons/04-react-fundamentals/examples/state-and-events.tsx
   src/05-frontend/lessons/04-react-fundamentals/examples/lists-and-conditionals.tsx
   ```

2. **Complete exercises** — follow TODO comments, run in your Vite project:
   ```
   src/05-frontend/lessons/04-react-fundamentals/exercises/counter.tsx
   src/05-frontend/lessons/04-react-fundamentals/exercises/todo-list.tsx
   ```

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

In `santa-app`, create these components:

### 1. LoginForm

- Controlled inputs for email and password
- Form submission handler (just `console.log` for now, no real auth yet)
- Basic validation: both fields required, email must look like an email
- "Don't have an account? Register" link below the form

### 2. RegisterForm

- Controlled inputs for name, email, password, confirm password
- Validate that passwords match
- Form submission handler (just `console.log`)
- "Already have an account? Login" link below the form

### 3. RoomCard

Props: `name`, `code`, `participantCount`, `status` ('open' | 'drawn' | 'closed')

- Displays: room name, room code, "X participants", status badge
- "Join" button (just `console.log` on click for now)

### 4. RoomList

Props: `rooms` (array of room objects)

- Renders an array of `RoomCard` components
- Uses `.map()` with proper `key` prop
- Shows "No rooms yet" message when array is empty
