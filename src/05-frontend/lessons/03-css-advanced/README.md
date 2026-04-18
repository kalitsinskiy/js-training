# CSS Advanced

## Quick Overview

This lesson covers the techniques that turn basic CSS into production-ready styling: **responsive design** with media queries, **CSS custom properties** for theming, **transitions and animations** for polish, **pseudo-classes and pseudo-elements** for fine-grained control, and two popular approaches for scoping styles in component-based apps: **CSS Modules** and **Styled Components**.

## Key Concepts

### Media Queries

Media queries let you apply CSS rules conditionally based on the viewport size:

```css
/* Mobile-first: base styles are for small screens */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Mobile-first** means:
1. Write base CSS for the smallest screen
2. Use `min-width` media queries to progressively enhance for larger screens
3. This approach loads less CSS on mobile (better performance) and forces you to prioritize content

Common breakpoints (not strict rules, adapt to your content):
- `480px` — large phones
- `768px` — tablets
- `1024px` — small desktops
- `1280px` — large desktops

### CSS Custom Properties (Variables)

CSS variables let you define reusable values and change them dynamically:

```css
:root {
  /* Define variables on the root element */
  --color-primary: #2d5a27;
  --color-primary-dark: #1e3d1a;
  --color-danger: #c0392b;
  --color-text: #333;
  --color-bg: #ffffff;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Use variables with var() */
.card {
  background: var(--color-bg);
  color: var(--color-text);
  padding: var(--spacing-md);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius);
}
```

Theme switching — override variables on a different selector:

```css
/* Dark theme: override variables on body or a container */
[data-theme="dark"] {
  --color-text: #e0e0e0;
  --color-bg: #1a1a2e;
  --color-primary: #4caf50;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
```

Variables cascade and inherit, so overriding them on a parent affects all children.

### Transitions and Animations

**Transitions** animate between two states (e.g., hover):

```css
.button {
  background: #2d5a27;
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background: #1e3d1a;
  transform: translateY(-2px);
}
```

`transition` shorthand: `property duration timing-function delay`

**Animations** for complex, multi-step effects:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.3s ease-out;
}

/* Multi-step animation */
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.notification-badge {
  animation: pulse 2s infinite;
}
```

### Pseudo-classes and Pseudo-elements

**Pseudo-classes** select elements based on state:

```css
a:hover { color: red; }              /* mouse over */
a:focus { outline: 2px solid blue; } /* keyboard focus */
a:active { color: darkred; }         /* being clicked */
a:visited { color: purple; }         /* already visited */

input:focus { border-color: #2d5a27; }
input:invalid { border-color: #c0392b; }
input:disabled { opacity: 0.5; }

li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(even) { background: #f9f9f9; }  /* zebra striping */
li:nth-child(3n) { color: red; }              /* every 3rd item */
```

**Pseudo-elements** create virtual elements:

```css
/* Add decorative content before/after */
.required-label::after {
  content: " *";
  color: #c0392b;
}

/* Style the first line or first letter */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }

/* Decorative elements */
.card::before {
  content: "";
  display: block;
  height: 4px;
  background: linear-gradient(to right, #2d5a27, #4caf50);
  border-radius: 4px 4px 0 0;
}
```

### CSS Modules

CSS Modules scope class names locally to a component, preventing naming collisions.

**How it works:**

1. Name your file `Component.module.css`
2. Import it as an object in your component
3. Class names are automatically made unique at build time

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  background: #2d5a27;
  color: white;
}

.danger {
  background: #c0392b;
  color: white;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

In the compiled HTML, class names become something like `Button_button_x7d2k` — unique, no collisions.

**Key features:**
- Local scope by default (no global leaks)
- `composes` keyword to combine classes: `composes: button from './shared.module.css';`
- Works out of the box with Vite (no extra config)

### Styled Components

Styled Components use tagged template literals to write CSS directly in your TypeScript/JavaScript files:

```bash
npm install styled-components
npm install -D @types/styled-components
```

```tsx
import styled from 'styled-components';

// Create a styled button
const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  background: ${props => props.$primary ? '#2d5a27' : '#ddd'};
  color: ${props => props.$primary ? 'white' : '#333'};

  &:hover {
    opacity: 0.9;
  }
`;

// Usage
<Button $primary>Save</Button>
<Button>Cancel</Button>
```

**Props-based styling** with TypeScript:

```tsx
interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'sm' | 'md' | 'lg';
}

const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  /* Size */
  padding: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.25rem 0.75rem';
      case 'lg': return '0.75rem 2rem';
      default:   return '0.5rem 1.25rem';
    }
  }};

  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default:   return '1rem';
    }
  }};

  /* Variant */
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'danger':    return '#c0392b';
      case 'secondary': return '#6c757d';
      default:          return '#2d5a27';
    }
  }};
  color: white;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

**Theming** with `ThemeProvider`:

```tsx
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#2d5a27',
    danger: '#c0392b',
    text: '#333',
    bg: '#fff',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
};

// Wrap your app
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>

// Access theme in any styled component
const Card = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.md};
`;
```

**Extending styles:**

```tsx
const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
`;

const PrimaryButton = styled(Button)`
  background: #2d5a27;
  color: white;
`;

const DangerButton = styled(Button)`
  background: #c0392b;
  color: white;
`;
```

### Comparison: Plain CSS vs CSS Modules vs Styled Components

| Feature | Plain CSS | CSS Modules | Styled Components |
|---|---|---|---|
| Scoping | Global (manual BEM) | Local (automatic) | Local (automatic) |
| Dynamic styles | CSS variables | CSS variables | Props-based |
| Learning curve | Low | Low | Medium |
| TypeScript support | N/A | Limited | Full |
| Theming | CSS variables | CSS variables | ThemeProvider |
| Bundle size | 0 (just CSS) | 0 (just CSS) | ~12KB runtime |
| Server-side rendering | Works | Works | Needs setup |

**When to use what:**
- **CSS Modules** — default choice; simple, zero runtime, works with Vite out of the box
- **Styled Components** — when you need heavy prop-based styling or a design system with TypeScript
- **Plain CSS** — for global styles, resets, CSS variables; combine with one of the above

## Learn More

- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN: CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions)
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
- [MDN: Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- [CSS Modules GitHub](https://github.com/css-modules/css-modules)
- [Styled Components Docs](https://styled-components.com/docs)

## How to Work

1. **Study examples** — open HTML files in your browser, React/TS files in your editor:
   ```
   src/05-frontend/lessons/03-css-advanced/examples/responsive.html
   src/05-frontend/lessons/03-css-advanced/examples/css-variables.html
   src/05-frontend/lessons/03-css-advanced/examples/css-modules-demo/   (read the files)
   src/05-frontend/lessons/03-css-advanced/examples/styled-components-demo.tsx
   ```

2. **Complete exercises** — follow TODO comments:
   ```
   src/05-frontend/lessons/03-css-advanced/exercises/responsive-page.html + .css
   src/05-frontend/lessons/03-css-advanced/exercises/styled-button.tsx
   ```

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

### 1. Choose a Styling Approach

In `santa-app`, decide between CSS Modules and Styled Components. Either is fine — pick one and commit to it.

**If CSS Modules:**
```bash
# No installation needed — Vite supports .module.css natively
# Just create files like LoginForm.module.css
```

**If Styled Components:**
```bash
cd santa-app
npm install styled-components
npm install -D @types/styled-components
```

### 2. Create Base Styles

Set up foundational styles for the app:

- **CSS Reset** — remove default browser styling (`margin: 0`, `box-sizing: border-box`, etc.)
- **CSS Variables** or theme object — define colors, spacing, border-radius, shadows:
  - Primary: green (#2d5a27)
  - Danger: red (#c0392b)
  - Background: #f5f5f5
  - Card background: #ffffff
  - Text: #333
- **Typography** — set base `font-family`, `font-size`, `line-height` on `body`

### 3. Responsive Layout Shell

Create a responsive app layout:

- **Mobile (<768px)**: single column, nav at top with hamburger
- **Desktop (>=768px)**: optional sidebar or centered content with max-width
- Header/navbar that is consistent across pages
- Main content area with proper padding and max-width
