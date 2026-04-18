# Testing React

## Quick Overview

React Testing Library (RTL) tests components the way users interact with them — by finding elements by role, label, or text, and simulating clicks and typing. Combined with Vitest (or Jest) and jsdom, you get fast, reliable tests that give confidence your UI works without testing implementation details.

## Key Concepts

### Testing Philosophy

React Testing Library is opinionated: **test user behavior, not implementation details**.

- **Do** test what the user sees and does: rendered text, button clicks, form submission, error messages
- **Don't** test internal state, refs, component instance methods, or how many times something re-rendered
- If you refactor a component's internals but the behavior stays the same, the tests should still pass

### Setup with Vite + Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

`vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

`src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

Run tests:
```bash
npx vitest          # watch mode
npx vitest run      # single run
```

### render and screen

`render` mounts a component into jsdom. `screen` provides queries to find elements:

```tsx
import { render, screen } from '@testing-library/react';
import { Greeting } from './Greeting';

test('renders greeting message', () => {
  render(<Greeting name="Alice" />);

  // screen.getByText finds an element containing this text
  expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
});
```

### Query Priority

Use queries in this order (most accessible to least):

1. **`getByRole`** — accessible role (button, heading, textbox, link, etc.)
   ```tsx
   screen.getByRole('button', { name: 'Submit' });
   screen.getByRole('heading', { level: 1 });
   screen.getByRole('textbox', { name: 'Email' });
   ```

2. **`getByLabelText`** — form elements by their label
   ```tsx
   screen.getByLabelText('Password');
   ```

3. **`getByPlaceholderText`** — by placeholder attribute
   ```tsx
   screen.getByPlaceholderText('Search...');
   ```

4. **`getByText`** — by visible text content
   ```tsx
   screen.getByText('No rooms found');
   ```

5. **`getByTestId`** — last resort, by `data-testid` attribute
   ```tsx
   screen.getByTestId('room-card-1');
   ```

Each query has three variants:
- `getBy...` — throws if not found (synchronous, for elements that must be present)
- `queryBy...` — returns `null` if not found (for asserting absence)
- `findBy...` — returns a promise, waits for element to appear (for async operations)

```tsx
// Assert element exists
expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

// Assert element does NOT exist
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// Wait for element to appear (async)
const heading = await screen.findByRole('heading', { name: 'Dashboard' });
```

### User Events

Prefer `userEvent` over `fireEvent` — it simulates real user behavior more accurately (focus, keyboard events, pointer events):

```tsx
import userEvent from '@testing-library/user-event';

test('login form submission', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();

  render(<LoginForm onSubmit={handleSubmit} />);

  // Type into inputs
  await user.type(screen.getByLabelText('Email'), 'alice@test.com');
  await user.type(screen.getByLabelText('Password'), 'secret123');

  // Click submit button
  await user.click(screen.getByRole('button', { name: 'Sign In' }));

  // Assert the handler was called with correct data
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'alice@test.com',
    password: 'secret123',
  });
});
```

**fireEvent vs userEvent:**
- `fireEvent.click(button)` — dispatches a single click event
- `userEvent.click(button)` — simulates the full interaction: pointerdown, mousedown, pointerup, mouseup, click, focus

### Async Testing

Use `waitFor` or `findBy` for elements that appear after async operations:

```tsx
import { render, screen, waitFor } from '@testing-library/react';

test('loads and displays rooms', async () => {
  render(<RoomList />);

  // Loading state should appear first
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data to load — findBy retries until element appears or timeout
  const roomName = await screen.findByText('Office Party');
  expect(roomName).toBeInTheDocument();

  // Loading should be gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// waitFor — for more complex assertions
test('shows error on failed fetch', async () => {
  render(<RoomList />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

### Mocking API Calls

Mock `fetch` or your API service to control responses in tests:

**Option 1: vi.mock (Vitest) / jest.mock (Jest)**

```tsx
import { api } from '../services/api';

vi.mock('../services/api');

const mockedApi = vi.mocked(api);

test('displays rooms from API', async () => {
  mockedApi.get.mockResolvedValue([
    { id: '1', name: 'Office Party', code: 'ABC123' },
  ]);

  render(<RoomList />);

  expect(await screen.findByText('Office Party')).toBeInTheDocument();
  expect(mockedApi.get).toHaveBeenCalledWith('/rooms');
});

test('shows error when API fails', async () => {
  mockedApi.get.mockRejectedValue(new Error('Server error'));

  render(<RoomList />);

  expect(await screen.findByText(/server error/i)).toBeInTheDocument();
});
```

**Option 2: MSW (Mock Service Worker)**

```tsx
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('http://localhost:3001/rooms', () => {
    return HttpResponse.json([
      { id: '1', name: 'Office Party', code: 'ABC123' },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays rooms', async () => {
  render(<RoomList />);
  expect(await screen.findByText('Office Party')).toBeInTheDocument();
});

test('handles server error', async () => {
  server.use(
    http.get('http://localhost:3001/rooms', () => {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    })
  );

  render(<RoomList />);
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

### Testing Custom Hooks

Use `renderHook` from Testing Library:

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('useCounter increments and decrements', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(1);

  act(() => { result.current.decrement(); });
  expect(result.current.count).toBe(0);
});
```

For hooks that need context (like `useAuth`), wrap them with a provider:

```tsx
test('useAuth returns user after login', async () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login('test@test.com', 'password');
  });

  expect(result.current.user).toBeTruthy();
  expect(result.current.isAuthenticated).toBe(true);
});
```

### Snapshot Testing

Useful for catching unintended UI changes, but easy to abuse. Use sparingly — only for stable, well-defined components:

```tsx
test('Button matches snapshot', () => {
  const { container } = render(<Button variant="primary">Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});
```

When a snapshot test fails, check the diff carefully. If the change is intentional, update the snapshot with `vitest run -u`.

## Learn More

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Query Priority Guide](https://testing-library.com/docs/queries/about#priority)
- [User Event Library](https://testing-library.com/docs/user-event/intro)
- [Vitest](https://vitest.dev/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Common Mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## How to Work

1. **Study examples**:
   - `examples/component-test.spec.tsx` — test a Button component (render, click, disabled)
   - `examples/form-test.spec.tsx` — test a LoginForm (inputs, submit, error)
   - `examples/hook-test.spec.tsx` — test custom hooks with renderHook
   - `examples/api-mock-test.spec.tsx` — test a component with mocked API

2. **Complete exercises**:
   - `exercises/login-form.spec.tsx` — write tests for LoginForm component
   - `exercises/item-list.spec.tsx` — write tests for ItemList component

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

In `santa-app`, add tests:

### 1. Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Update `vite.config.ts` to include test config (see setup section above).

### 2. Test LoginForm

```tsx
// src/components/__tests__/LoginForm.spec.tsx
// - Renders email and password inputs
// - Submit button is present
// - Calls onSubmit with email and password when form is submitted
// - Shows error message when login fails
// - Disables button while loading
```

### 3. Test RegisterForm

```tsx
// - Renders name, email, password inputs
// - Validates required fields
// - Calls onSubmit with correct data
// - Shows API error messages
```

### 4. Test RoomList

```tsx
// - Shows loading spinner initially
// - Renders room cards after data loads
// - Shows "No rooms" message when list is empty
// - Shows error with retry button on API failure
```

### 5. Test ProtectedRoute

```tsx
// - Renders children when authenticated
// - Redirects to /login when not authenticated
// (Use MemoryRouter for route testing)
```

### 6. Test useAuth Hook

```tsx
// - Returns null user initially
// - Returns user data after login
// - Clears user on logout
// - Stores token in localStorage
```
