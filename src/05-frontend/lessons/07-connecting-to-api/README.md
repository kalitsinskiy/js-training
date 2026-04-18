# Connecting to API

## Quick Overview

A React frontend that talks to a real backend needs a structured approach to API communication. This lesson covers building an API service layer, handling async states (loading, error, success), form submission with validation feedback, JWT authentication in requests, and typing API responses with TypeScript. We use the native `fetch` API — no extra libraries required.

## Key Concepts

### fetch vs axios

| Feature | fetch (native) | axios (library) |
|---|---|---|
| Install | Built into browsers | `npm install axios` |
| JSON parsing | Manual: `res.json()` | Automatic: `res.data` |
| Error handling | Only rejects on network failure, not HTTP errors | Rejects on 4xx/5xx by default |
| Request interceptors | Manual | Built-in |
| Request cancellation | `AbortController` | `CancelToken` or `AbortController` |
| Bundle size | 0 KB | ~13 KB |

We use `fetch` in this course — it is more than enough, and understanding it teaches you more about HTTP than axios's abstractions.

**Key `fetch` gotcha:** `fetch` only rejects on network errors. A 404 or 500 response is still a resolved promise — you must check `response.ok`:

```tsx
const res = await fetch('/api/users');

// BAD — this does NOT catch HTTP errors
const data = await res.json();

// GOOD — check res.ok first
if (!res.ok) {
  throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}
const data = await res.json();
```

### API Service Layer

Centralize all API calls in one place. Benefits: single base URL, automatic JWT injection, consistent error handling, TypeScript types.

```tsx
// src/services/api.ts

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message || 'Request failed');
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// Typed convenience methods
export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
};
```

### Handling Async States

Every API call has three states: **loading**, **error**, **success**. Always handle all three:

```tsx
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function RoomList() {
  const [state, setState] = useState<AsyncState<Room[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    api.get<Room[]>('/rooms')
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: null, loading: false, error: err.message }));
  }, []);

  if (state.loading) return <CircularProgress />;
  if (state.error) return <Alert severity="error">{state.error}</Alert>;
  if (!state.data?.length) return <Typography>No rooms yet</Typography>;

  return (
    <List>
      {state.data.map((room) => (
        <ListItem key={room.id}>
          <ListItemText primary={room.name} />
        </ListItem>
      ))}
    </List>
  );
}
```

### Error Handling in UI

Transform API errors into user-friendly messages:

```tsx
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400: return 'Invalid input. Please check your data.';
      case 401: return 'Please log in again.';
      case 403: return 'You do not have permission to do this.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'This item already exists.';
      default: return error.message;
    }
  }
  if (error instanceof TypeError) {
    return 'Network error. Please check your connection.';
  }
  return 'Something went wrong. Please try again.';
}
```

Display errors with MUI `Alert` or `Snackbar`:

```tsx
{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
```

### Form Submission Pattern

```tsx
function CreateRoomForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const room = await api.post<Room>('/rooms', { name });
      navigate(`/rooms/${room.id}`);  // redirect on success
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Room'}
      </Button>
    </form>
  );
}
```

Key points:
- Disable inputs and button while loading
- Show loading indicator (spinner or text)
- Clear error before each submission
- Show error if request fails
- Redirect or update UI on success

### JWT in Requests

The backend returns a JWT on login. Store it and send it with every request:

```tsx
// Login response
interface LoginResponse {
  access_token: string;
  user: { id: string; name: string; email: string };
}

// Login
const { access_token, user } = await api.post<LoginResponse>('/auth/login', {
  email,
  password,
});
localStorage.setItem('token', access_token);

// All subsequent requests include the token automatically via the api service:
// Authorization: Bearer <token>
```

### Environment Variables in Vite

Vite exposes env variables prefixed with `VITE_`:

```bash
# .env
VITE_API_URL=http://localhost:3001

# .env.production
VITE_API_URL=https://api.santa-app.com
```

Access in code:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
// TypeScript: declare in src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
```

**Never put secrets in `VITE_` variables** — they are embedded in the client bundle and visible to anyone.

### TypeScript API Response Types

Type your API responses to get autocomplete and catch errors at compile time:

```tsx
// src/types/api.ts

interface User {
  id: string;
  name: string;
  email: string;
}

interface Room {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  members: User[];
  createdAt: string;
}

interface WishlistItem {
  id: string;
  title: string;
  url?: string;
  roomId: string;
  userId: string;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// Typed API calls
const rooms = await api.get<Room[]>('/rooms');          // rooms is Room[]
const room = await api.get<Room>(`/rooms/${id}`);       // room is Room
const created = await api.post<Room>('/rooms', { name }); // created is Room
```

## Learn More

- [Fetch API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Using Fetch (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [AbortController (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

## How to Work

1. **Study examples**:
   - `examples/api-service.ts` — API service class with JWT injection and error handling
   - `examples/data-fetching.tsx` — component that fetches data with loading/error states
   - `examples/form-submission.tsx` — form with submit, validation, loading, error, and redirect

2. **Complete exercises**:
   - `exercises/api-client.ts` — build a full API client with interceptors and error transformation
   - `exercises/crud-page.tsx` — build a page with list, create, edit, delete and all async states

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

In `santa-app`, wire up all pages to the real `santa-api` (port 3001):

### 1. Create API Service

Create `src/services/api.ts` with the pattern from this lesson. Use `VITE_API_URL` for the base URL.

Add a `.env` file:
```bash
VITE_API_URL=http://localhost:3001
```

### 2. Auth Endpoints

```tsx
// POST /auth/register — { name, email, password } → { access_token, user }
// POST /auth/login    — { email, password }        → { access_token, user }
```

Update `AuthContext` to use the real API instead of fake data.

### 3. Rooms Endpoints

```tsx
// GET    /rooms              → Room[]
// POST   /rooms              → Room         (body: { name })
// GET    /rooms/:id          → Room
// POST   /rooms/:code/join   → Room         (join by invite code)
```

- `RoomsPage`: fetch rooms on mount, show loading/error states, "Create Room" button with dialog
- `RoomDetailPage`: fetch room by ID, show members list

### 4. Wishlist Endpoints

```tsx
// GET    /rooms/:id/wishlist → WishlistItem[]
// POST   /rooms/:id/wishlist → WishlistItem  (body: { title, url? })
```

- Show wishlist items in RoomDetailPage
- Add form to create new wishlist items

### 5. Error Handling

- Show `Alert` components for errors
- Show `CircularProgress` while loading
- Handle 401 globally (redirect to login)
- Show empty states ("No rooms yet", "No items in wishlist")
