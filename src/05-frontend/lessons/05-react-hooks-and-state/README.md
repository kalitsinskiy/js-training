# React Hooks & State

## Quick Overview

React Hooks let you use state, side effects, context, and other React features in function components. Beyond the basic `useState`, React provides `useEffect` for side effects, `useContext` for shared state, `useRef` for mutable refs, and `useMemo`/`useCallback` for performance optimization. You can also build **custom hooks** to extract and reuse stateful logic across components.

## Key Concepts

### useEffect

`useEffect` runs side effects after render. It replaces the lifecycle methods of class components (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).

**Three dependency patterns:**

```tsx
// 1. No dependency array — runs after EVERY render
useEffect(() => {
  console.log('Runs on every render');
});

// 2. Empty array — runs ONCE after initial render
useEffect(() => {
  console.log('Runs once on mount');
}, []);

// 3. With dependencies — runs when any dependency changes
useEffect(() => {
  console.log(`userId changed to ${userId}`);
}, [userId]);
```

**Cleanup function** — returned function runs before the effect re-runs and on unmount:

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => console.log(e.key);
  window.addEventListener('keydown', handler);

  return () => {
    window.removeEventListener('keydown', handler); // cleanup
  };
}, []);
```

**Common patterns:**

```tsx
// Fetch data
useEffect(() => {
  let cancelled = false;

  async function fetchUser() {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    if (!cancelled) setUser(data);
  }

  fetchUser();
  return () => { cancelled = true; }; // prevent state update on unmounted component
}, [id]);

// Timer
useEffect(() => {
  const interval = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(interval);
}, []);

// Document title
useEffect(() => {
  document.title = `${unreadCount} new messages`;
}, [unreadCount]);
```

### useContext & createContext

Context provides a way to pass data through the component tree without prop drilling.

**Steps:**
1. Create context with `createContext`
2. Wrap a subtree with `<Context.Provider value={...}>`
3. Consume with `useContext(Context)` in any descendant

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const value: AuthContextType = {
    user,
    login: (name) => setUser(name),
    logout: () => setUser(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for clean consumption
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

**When to use context:** global state shared by many components (theme, auth, locale). Not a replacement for all prop passing — if only a few components need the data, props are fine.

### Custom Hooks

Custom hooks extract reusable stateful logic. Rules:
- Name must start with `use`
- Can call other hooks inside
- Each component using the hook gets its own state (no shared state between callers)

```tsx
// useLocalStorage — persist state to localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

```tsx
// useDebounce — debounce a rapidly changing value
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage — only fires API call after user stops typing for 300ms
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  if (debouncedSearch) fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

### useRef

`useRef` holds a mutable value that persists across renders **without causing re-renders** when changed.

**Two main uses:**

```tsx
// 1. DOM references
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// 2. Mutable value that survives re-renders (like an instance variable)
function Timer() {
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = window.setInterval(() => console.log('tick'), 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
  };

  return <button onClick={start}>Start</button>;
}
```

**useRef vs useState:** `useRef` does not trigger re-renders. Use it for values you need to track but that should not affect the UI (previous values, timer IDs, DOM nodes).

### useMemo and useCallback

Both are **performance optimizations** that memoize values/functions to avoid expensive recalculations or unnecessary re-renders.

```tsx
// useMemo — memoize a computed value
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => a.name.localeCompare(b.name)),
  [items] // only recompute when items changes
);

// useCallback — memoize a function reference
const handleClick = useCallback(
  (id: string) => setSelected(id),
  [] // stable reference, never changes
);
```

**When to use:**
- `useMemo` — expensive calculations, derived data from large lists
- `useCallback` — passing callbacks to memoized child components

**When NOT to use:**
- Simple calculations (adding numbers, string concatenation) — the memoization overhead is greater than the calculation itself
- Functions that are not passed to child components
- Premature optimization — profile first, optimize second

### React.memo

`React.memo` is a higher-order component that skips re-rendering if props haven't changed (shallow comparison):

```tsx
interface ItemProps {
  name: string;
  onClick: (name: string) => void;
}

const Item = React.memo(function Item({ name, onClick }: ItemProps) {
  console.log(`Rendering ${name}`);
  return <li onClick={() => onClick(name)}>{name}</li>;
});

// Parent must use useCallback for onClick, otherwise Item re-renders every time
// because a new function reference is created on each parent render
```

`React.memo` + `useCallback` work together: `memo` prevents re-render if props are equal, `useCallback` ensures function props keep the same reference.

## Learn More

- [useEffect](https://react.dev/reference/react/useEffect)
- [useContext](https://react.dev/reference/react/useContext)
- [useRef](https://react.dev/reference/react/useRef)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React.memo](https://react.dev/reference/react/memo)

## How to Work

1. **Study examples**:
   - `examples/use-effect-patterns.tsx` — data fetching, event listener cleanup, timer, dependency patterns
   - `examples/context-example.tsx` — ThemeContext with provider, consumer hook, nested components
   - `examples/custom-hooks.tsx` — useLocalStorage, useDebounce, useWindowSize

2. **Complete exercises**:
   - `exercises/use-fetch.tsx` — build a custom `useFetch<T>(url)` hook
   - `exercises/theme-switcher.tsx` — build a ThemeContext with provider, hook, and themed components

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

In `santa-app` (React + Vite + TypeScript):

### 1. Create AuthContext

Create `src/contexts/AuthContext.tsx`:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

- Store JWT token in `localStorage`
- On app mount, check `localStorage` for existing token and restore session
- `login` should POST to `/auth/login`, store the JWT and user data
- `logout` should clear token from state and `localStorage`
- Wrap the entire app with `<AuthProvider>`

### 2. Create useAuth Custom Hook

```tsx
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

### 3. Create useApi Custom Hook

Create `src/hooks/useApi.ts`:

```tsx
function useApi() {
  const { token, logout } = useAuth();

  const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`http://localhost:3001${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      logout(); // token expired
      throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  return { get: <T>(url: string) => request<T>(url), post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body: JSON.stringify(body) }) };
}
```

### 4. Implement Login Flow

In `LoginPage`:
1. Form with email and password fields
2. On submit: call `auth.login(email, password)`
3. Show loading spinner while request is in progress
4. Show error message if login fails
5. On success: redirect to `/rooms` (you will add the router in the next lesson)
