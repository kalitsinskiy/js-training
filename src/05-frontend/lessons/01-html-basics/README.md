# HTML Basics

## Quick Overview

HTML (HyperText Markup Language) is the skeleton of every web page. It describes the **structure** and **meaning** of content — not how it looks (that is CSS's job). A browser reads HTML, builds a DOM (Document Object Model) tree, and renders it on screen. Writing semantic, well-structured HTML is the foundation of accessibility, SEO, and maintainable frontends.

## Key Concepts

### Document Structure

Every HTML page starts with this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
</head>
<body>
  <!-- visible content goes here -->
</body>
</html>
```

- `<!DOCTYPE html>` — tells the browser this is HTML5 (always include it)
- `<html lang="en">` — root element; `lang` helps screen readers and search engines
- `<head>` — metadata: charset, viewport, title, links to CSS, meta tags
- `<body>` — everything the user sees

### Meta Tags

Meta tags live in `<head>` and provide information about the page:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Secret Santa app — organize gift exchanges">
<meta name="author" content="Your Name">
<link rel="icon" href="/favicon.ico">
```

The `viewport` meta tag is critical for mobile — without it, mobile browsers render the page at desktop width and zoom out.

### Semantic Elements

Semantic elements tell the browser (and screen readers) **what** the content is, not just how to display it:

```html
<header>    <!-- top-level banner, logo, nav -->
<nav>       <!-- navigation links -->
<main>      <!-- primary content (one per page) -->
<section>   <!-- thematic grouping of content -->
<article>   <!-- self-contained piece (blog post, card, comment) -->
<aside>     <!-- sidebar, related content -->
<footer>    <!-- bottom of page or section -->
```

Why it matters:
- Screen readers use semantic elements to navigate the page
- Search engines rank semantic pages higher
- Code is easier to read and maintain

**Avoid `<div>` soup.** Use `<div>` only when no semantic element fits.

### Headings and Paragraphs

```html
<h1>Main Page Title</h1>        <!-- one per page -->
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<p>This is a paragraph of text.</p>
```

Rules:
- Use only **one `<h1>`** per page
- Do not skip heading levels (e.g., `<h1>` then `<h3>`) — this confuses screen readers
- Headings create an implicit document outline

### Lists

```html
<!-- Unordered list (bullets) -->
<ul>
  <li>Item A</li>
  <li>Item B</li>
</ul>

<!-- Ordered list (numbered) -->
<ol>
  <li>First step</li>
  <li>Second step</li>
</ol>

<!-- Definition list (term + description) -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
```

### Links and Images

```html
<!-- Link -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit Example
</a>

<!-- Image -->
<img src="photo.jpg" alt="A group photo from the team party" width="600" height="400">
```

- `alt` is **required** for accessibility — describe the image content
- `target="_blank"` opens a new tab; always pair with `rel="noopener noreferrer"` for security
- Specify `width` and `height` to prevent layout shifts while the image loads

### Tables

Tables are for **tabular data only** (not for layout):

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>Developer</td>
      <td>alice@example.com</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>Designer</td>
      <td>bob@example.com</td>
    </tr>
  </tbody>
</table>
```

### Forms

Forms are how users send data. Key elements:

```html
<form action="/register" method="POST">
  <fieldset>
    <legend>Account Details</legend>

    <label for="name">Full Name</label>
    <input type="text" id="name" name="name" required placeholder="John Doe">

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password</label>
    <input type="password" id="password" name="password" required minlength="8">
  </fieldset>

  <button type="submit">Register</button>
</form>
```

Common input types:
- `text`, `email`, `password`, `number`, `tel`, `url`, `date`
- `checkbox`, `radio` — must share the same `name` for radio groups
- `select` + `option` — dropdown
- `textarea` — multi-line text

Key rules:
- Every `<input>` needs a `<label>` with a matching `for`/`id` pair
- Use `<fieldset>` and `<legend>` to group related inputs
- `required`, `minlength`, `maxlength`, `pattern` provide built-in validation
- Use `<button type="submit">` instead of `<input type="submit">` (more flexible)

### Attributes

```html
<!-- id — unique identifier (one per page) -->
<div id="main-content">...</div>

<!-- class — reusable styling hook (many per page) -->
<div class="card card-highlighted">...</div>

<!-- data-* — custom data for JavaScript -->
<button data-room-id="abc123" data-action="join">Join Room</button>
```

- `id` must be unique in the entire document
- `class` can be used on multiple elements and an element can have multiple classes
- `data-*` attributes store custom data; access in JS via `element.dataset.roomId`

### Accessibility Basics

Accessibility (a11y) means making your page usable by everyone, including people using screen readers, keyboards, or other assistive tools.

```html
<!-- alt text for images -->
<img src="logo.png" alt="Secret Santa logo">

<!-- Decorative images get empty alt -->
<img src="decoration.png" alt="">

<!-- aria-label for elements without visible text -->
<button aria-label="Close dialog">X</button>

<!-- aria-hidden hides from screen readers -->
<span aria-hidden="true">|</span>

<!-- role attribute (use semantic elements instead when possible) -->
<div role="navigation">...</div>
```

Best practices:
- Use semantic HTML first — it is inherently accessible
- All interactive elements (`<a>`, `<button>`, `<input>`) must be reachable by keyboard
- Use `<label>` for every form input
- Color alone should not be the only way to convey information

## Learn More

- [MDN: HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
- [MDN: Structuring the Web](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [MDN: HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)
- [MDN: Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)
- [HTML Validator](https://validator.w3.org/)

## How to Work

1. **Study examples** — open them directly in your browser:
   ```
   src/05-frontend/lessons/01-html-basics/examples/semantic-page.html
   src/05-frontend/lessons/01-html-basics/examples/forms.html
   src/05-frontend/lessons/01-html-basics/examples/tables-and-lists.html
   ```

2. **Complete exercises** — open in your editor, follow TODO comments, then open in a browser to verify:
   ```
   src/05-frontend/lessons/01-html-basics/exercises/registration-page.html
   src/05-frontend/lessons/01-html-basics/exercises/product-catalog.html
   ```

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

### 1. Initialize santa-app

```bash
npm create vite@latest santa-app -- --template react-ts
cd santa-app
npm install
npm run dev    # should open on http://localhost:5173
```

Explore the generated project structure:
- `index.html` — the single HTML file (Vite's entry point)
- `src/main.tsx` — React entry point
- `src/App.tsx` — root component
- `vite.config.ts` — Vite configuration

### 2. Create Static HTML Mockups

Inside `santa-app/public/mockups/` (or a separate `mockups/` folder), create two plain HTML files:

**`login.html`** — a login page with:
- Page title "Secret Santa - Login"
- Semantic structure: `<header>`, `<main>`, `<footer>`
- A heading "Welcome Back"
- A form with email input, password input, submit button
- A link "Don't have an account? Register"

**`register.html`** — a registration page with:
- Page title "Secret Santa - Register"
- Semantic structure: `<header>`, `<main>`, `<footer>`
- A heading "Create Account"
- A form with name, email, password, confirm password inputs, submit button
- A link "Already have an account? Login"

These are throwaway mockups — we will rebuild them as React components later. The goal is to practice HTML structure before adding CSS and JavaScript.
