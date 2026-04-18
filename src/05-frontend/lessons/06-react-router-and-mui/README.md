# React Router & Material UI

## Quick Overview

Single-page applications need client-side routing to handle navigation without full page reloads. **React Router v6** is the standard library for this. **Material UI (MUI)** is the most popular React component library — it provides pre-built, accessible, customizable components following Material Design. Together, they form the backbone of most production React apps.

## Key Concepts

### Client-Side Routing

Traditional websites reload the entire page on navigation. SPAs use the **History API** (`history.pushState`, `popstate` event) to update the URL and render different components — all without a server round-trip. React Router abstracts this away.

```
Browser URL changes → React Router matches a Route → Renders the component
```

### React Router v6 Setup

```bash
npm install react-router-dom
```

Core components:

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation Hooks

```tsx
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// useParams — read URL parameters
function UserDetail() {
  const { id } = useParams<{ id: string }>();
  return <h1>User {id}</h1>;
}

// useNavigate — programmatic navigation
function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await login();
    navigate('/dashboard');           // push new route
    navigate('/dashboard', { replace: true }); // replace current history entry
    navigate(-1);                     // go back
  };
}

// useSearchParams — read/write query string
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <input
      value={query}
      onChange={(e) => setSearchParams({ q: e.target.value })}
    />
  );
}
```

### NavLink — Active Styling

`NavLink` is like `Link` but knows whether it matches the current URL:

```tsx
import { NavLink } from 'react-router-dom';

<NavLink
  to="/rooms"
  style={({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#1976d2' : 'inherit',
  })}
>
  Rooms
</NavLink>

// Or with className
<NavLink to="/rooms" className={({ isActive }) => isActive ? 'active' : ''}>
  Rooms
</NavLink>
```

### Nested Routes & Layouts

Use `<Outlet />` to render child routes inside a parent layout:

```tsx
function Layout() {
  return (
    <div>
      <header>My App</header>
      <main>
        <Outlet /> {/* child route renders here */}
      </main>
      <footer>Footer</footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>          {/* layout route — no path */}
          <Route index element={<Home />} />  {/* index route: "/" */}
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Protected Routes

Redirect unauthenticated users to login:

```tsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Usage in route config
<Routes>
  <Route path="/login" element={<LoginPage />} />

  <Route element={<ProtectedRoute />}>     {/* guard */}
    <Route element={<Layout />}>            {/* layout */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
    </Route>
  </Route>
</Routes>
```

### Material UI — Setup

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material     # optional: icon library
```

Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#d32f2f' },    // Santa red
    secondary: { main: '#2e7d32' },  // Christmas green
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />   {/* resets browser styles, applies theme background */}
      <RouterSetup />
    </ThemeProvider>
  );
}
```

### MUI — The sx Prop

The `sx` prop is MUI's styling solution. It supports theme-aware values and responsive breakpoints:

```tsx
import { Box, Typography } from '@mui/material';

<Box sx={{
  p: 2,                        // padding: theme.spacing(2) = 16px
  mt: 3,                       // marginTop: theme.spacing(3) = 24px
  bgcolor: 'primary.main',    // from theme palette
  color: 'white',
  borderRadius: 1,             // theme.shape.borderRadius * 1
  display: 'flex',
  gap: 2,
  '&:hover': { opacity: 0.9 },
  // Responsive
  width: { xs: '100%', md: '50%' },
}}>
  <Typography variant="h6">Hello</Typography>
</Box>
```

### MUI — Common Components

```tsx
import {
  AppBar, Toolbar, Typography, Button,
  Container, Card, CardContent, CardActions,
  TextField, Box, Grid, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton,
} from '@mui/material';
import { Add, Delete, Logout } from '@mui/icons-material';

// AppBar with navigation
<AppBar position="static">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>Santa App</Typography>
    <Button color="inherit" startIcon={<Logout />}>Logout</Button>
  </Toolbar>
</AppBar>

// Card
<Card sx={{ maxWidth: 345 }}>
  <CardContent>
    <Typography variant="h5">Room Name</Typography>
    <Typography color="text.secondary">3 members</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Open</Button>
  </CardActions>
</Card>

// TextField
<TextField
  label="Email"
  type="email"
  fullWidth
  required
  error={!!errorMsg}
  helperText={errorMsg}
/>

// Grid layout
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <Card>...</Card>
  </Grid>
  <Grid item xs={12} md={6}>
    <Card>...</Card>
  </Grid>
</Grid>

// Dialog
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Create Room</DialogTitle>
  <DialogContent>
    <TextField label="Room name" fullWidth sx={{ mt: 1 }} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="contained" onClick={handleCreate}>Create</Button>
  </DialogActions>
</Dialog>

// List
<List>
  {items.map(item => (
    <ListItem key={item.id} secondaryAction={
      <IconButton edge="end" onClick={() => handleDelete(item.id)}>
        <Delete />
      </IconButton>
    }>
      <ListItemText primary={item.name} secondary={item.description} />
    </ListItem>
  ))}
</List>
```

## Learn More

- [React Router Documentation](https://reactrouter.com/en/main)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [MUI Getting Started](https://mui.com/material-ui/getting-started/)
- [MUI Component API](https://mui.com/material-ui/all-components/)
- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [MUI sx prop](https://mui.com/system/getting-started/the-sx-prop/)

## How to Work

1. **Study examples**:
   - `examples/basic-routing.tsx` — BrowserRouter, Routes, Route, Link, useParams, 404 page
   - `examples/protected-routes.tsx` — ProtectedRoute component, layout with Outlet
   - `examples/mui-components.tsx` — showcase of MUI components

2. **Complete exercises**:
   - `exercises/multi-page-app.tsx` — multi-page app with React Router
   - `exercises/protected-app.tsx` — protected routes with auth guard

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

In `santa-app`:

### 1. Install Dependencies

```bash
npm install react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### 2. Setup Router

In `src/App.tsx`, configure routes:

```
/login           → LoginPage (public)
/register        → RegisterPage (public)
/rooms           → RoomsPage (protected, dashboard)
/rooms/:id       → RoomDetailPage (protected)
/rooms/:id/messages → MessagesPage (protected, chat)
```

### 3. Create ProtectedRoute

```tsx
// src/components/ProtectedRoute.tsx
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

### 4. Create Layout

```tsx
// src/components/Layout.tsx
// - MUI AppBar with:
//   - Logo / app name on the left
//   - User name display
//   - Logout button (calls auth.logout(), navigates to /login)
// - Container wrapping <Outlet />
// - Use NavLink for navigation items
```

### 5. Create MUI Theme

```tsx
const theme = createTheme({
  palette: {
    primary: { main: '#d32f2f' },    // red
    secondary: { main: '#2e7d32' },  // green
  },
});
```

Wrap the app with `<ThemeProvider>` and add `<CssBaseline />`.
