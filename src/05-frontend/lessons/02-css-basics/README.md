# CSS Basics

## Quick Overview

CSS (Cascading Style Sheets) controls how HTML elements **look** — colors, sizes, spacing, layout. The browser reads your CSS rules, matches them to HTML elements via **selectors**, and applies the declared **properties**. Understanding the cascade, specificity, box model, and layout systems (Flexbox, Grid) is essential for building any frontend.

## Key Concepts

### How CSS Works

A CSS rule has three parts:

```css
selector {
  property: value;
}
```

```css
/* Select all <p> elements and make them dark gray with spacing */
p {
  color: #333;
  margin-bottom: 1rem;
}
```

Three ways to add CSS (in order of preference):

1. **External stylesheet** (best) — `<link rel="stylesheet" href="styles.css">`
2. **`<style>` block** in `<head>` — fine for examples, avoid in production
3. **Inline styles** — `<p style="color: red;">` — avoid; hard to maintain

### Cascade and Specificity

When multiple rules target the same element, the browser decides which wins using **specificity**:

```
Inline styles    →  1,0,0,0    (highest)
#id selectors    →  0,1,0,0
.class selectors →  0,0,1,0
tag selectors    →  0,0,0,1    (lowest)
```

Examples:

```css
p { color: black; }                /* specificity: 0,0,0,1 */
.intro { color: blue; }           /* specificity: 0,0,1,0 — wins over p */
#hero { color: green; }           /* specificity: 0,1,0,0 — wins over .intro */
p.intro { color: red; }           /* specificity: 0,0,1,1 — wins over .intro alone */
```

Rules at the **same specificity**: the last one in the source wins.

`!important` overrides everything — avoid it. If you need it, your selectors are too complex.

### Inheritance

Some properties are inherited from parent to child (mostly text-related):
- **Inherited**: `color`, `font-family`, `font-size`, `line-height`, `text-align`
- **Not inherited**: `margin`, `padding`, `border`, `background`, `display`, `width`, `height`

```css
body {
  font-family: system-ui, sans-serif;  /* all children inherit this */
  color: #333;                          /* all text inherits this color */
}
```

### Box Model

Every element is a box with four layers:

```
┌─────────────── margin ───────────────┐
│  ┌─────────── border ──────────────┐ │
│  │  ┌──────── padding ──────────┐  │ │
│  │  │                           │  │ │
│  │  │        content            │  │ │
│  │  │    (width x height)       │  │ │
│  │  │                           │  │ │
│  │  └───────────────────────────┘  │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Critical:** By default, `width` only sets the content width. Padding and border are added on top:

```css
/* Default: box-sizing: content-box */
.box { width: 200px; padding: 20px; border: 2px solid; }
/* Actual rendered width: 200 + 20 + 20 + 2 + 2 = 244px  ← surprise! */

/* Fix: box-sizing: border-box — width INCLUDES padding and border */
.box { width: 200px; padding: 20px; border: 2px solid; box-sizing: border-box; }
/* Actual rendered width: 200px  ← what you expect */
```

Always use this reset at the top of your CSS:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### Display

```css
display: block;        /* takes full width, starts on new line (div, p, h1) */
display: inline;       /* flows with text, no width/height (span, a, strong) */
display: inline-block; /* inline but respects width/height */
display: none;         /* removed from layout entirely */
```

### Positioning

```css
position: static;    /* default — normal document flow */
position: relative;  /* offset from normal position (top/left/right/bottom) — still takes space */
position: absolute;  /* removed from flow; positioned relative to nearest positioned ancestor */
position: fixed;     /* removed from flow; positioned relative to viewport (stays on scroll) */
position: sticky;    /* normal flow until scroll threshold, then "sticks" */
```

Key rule: `absolute` positions relative to the nearest ancestor that has `position: relative` (or `absolute`/`fixed`). If none exists, it positions relative to `<html>`.

```css
.parent { position: relative; }
.child  { position: absolute; top: 0; right: 0; }  /* top-right of .parent */
```

### Flexbox

Flexbox is a **one-dimensional** layout system — either a row or a column.

```css
/* Container properties */
.container {
  display: flex;
  flex-direction: row;           /* row (default) | column */
  justify-content: center;       /* main axis: flex-start | center | flex-end | space-between | space-around | space-evenly */
  align-items: center;           /* cross axis: flex-start | center | flex-end | stretch | baseline */
  gap: 1rem;                     /* space between items */
  flex-wrap: wrap;               /* allow items to wrap to next line */
}

/* Item properties */
.item {
  flex-grow: 1;     /* how much extra space this item absorbs (0 = don't grow) */
  flex-shrink: 0;   /* how much this item shrinks when space is tight (0 = don't shrink) */
  flex-basis: 200px; /* initial size before growing/shrinking */
  order: 2;         /* visual order (default 0) */
}

/* Shorthand */
.item { flex: 1; }            /* grow: 1, shrink: 1, basis: 0 */
.item { flex: 0 0 200px; }    /* fixed 200px, no grow, no shrink */
```

Common patterns:

```css
/* Center anything */
.center { display: flex; justify-content: center; align-items: center; }

/* Space items evenly in a navbar */
.navbar { display: flex; justify-content: space-between; align-items: center; }

/* Equal-width columns */
.columns { display: flex; gap: 1rem; }
.columns > * { flex: 1; }
```

### CSS Grid

Grid is a **two-dimensional** layout system — rows and columns at the same time.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */
  grid-template-rows: auto;               /* rows size to content */
  gap: 1rem;                              /* space between cells */
}
```

Key concepts:

```css
/* Fixed + flexible columns */
grid-template-columns: 250px 1fr;         /* sidebar(250px) + main(rest) */

/* Repeat with minmax for responsive grids */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* Place an item across multiple cells */
.item {
  grid-column: 1 / 3;  /* spans columns 1 and 2 */
  grid-row: 1 / 2;     /* just row 1 */
}

/* Named areas */
.layout {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**Flexbox vs Grid:**
- Use **Flexbox** for one-dimensional layouts (navbar, card row, centering)
- Use **Grid** for two-dimensional layouts (page layout, dashboards, galleries)
- They work well **together** — Grid for the page layout, Flexbox for components inside

### Units

```css
/* Absolute */
px       /* pixels — fixed size, most common for borders and small values */

/* Relative to font */
em       /* relative to parent's font-size (1.5em = 1.5x parent font) */
rem      /* relative to root (<html>) font-size — PREFERRED for spacing/sizing */

/* Relative to viewport */
vh       /* 1% of viewport height */
vw       /* 1% of viewport width */

/* Percentage */
%        /* relative to parent's width (for width) or height (for height) */
```

Rule of thumb: use `rem` for font sizes, padding, margins. Use `px` for borders and shadows. Use `%` or `fr` for layout widths.

### Colors

```css
color: #333333;              /* hex (6 digits) */
color: #333;                 /* hex shorthand (3 digits) */
color: rgb(51, 51, 51);     /* rgb */
color: rgba(51, 51, 51, 0.5); /* rgb with alpha (transparency) */
color: hsl(0, 0%, 20%);     /* hue, saturation, lightness */
```

### Typography

```css
body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;      /* base size — 1rem will equal this */
  line-height: 1.6;     /* unitless — multiplier of font-size */
  font-weight: 400;     /* 400 = normal, 700 = bold */
}

h1 { font-size: 2rem; }     /* 32px if base is 16px */
h2 { font-size: 1.5rem; }   /* 24px */

.small { font-size: 0.875rem; }  /* 14px */
```

## Learn More

- [MDN: CSS First Steps](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps)
- [MDN: Box Model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)
- [MDN: Grid](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids)
- [CSS Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Tricks: A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Specificity Calculator](https://specificity.keegan.st/)

## How to Work

1. **Study examples** — open them directly in your browser:
   ```
   src/05-frontend/lessons/02-css-basics/examples/box-model.html
   src/05-frontend/lessons/02-css-basics/examples/flexbox-layouts.html
   src/05-frontend/lessons/02-css-basics/examples/grid-layouts.html
   ```

2. **Complete exercises** — open in your editor, follow TODO comments, open in a browser to verify:
   ```
   src/05-frontend/lessons/02-css-basics/exercises/card-layout.html
   src/05-frontend/lessons/02-css-basics/exercises/card-layout.css
   src/05-frontend/lessons/02-css-basics/exercises/navigation.html
   src/05-frontend/lessons/02-css-basics/exercises/navigation.css
   ```

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

### 1. Style the Login and Register Mockups

Take the HTML mockups from Lesson 01 and add CSS:

- Center the form card on the page (use Flexbox)
- Style inputs: padding, border, border-radius, focus state
- Style the submit button: background color, hover state
- Add a color scheme (pick any — green/red for Christmas or go minimal)
- Responsive: form should look good on both desktop and mobile

### 2. Create a Room Card Layout

In `santa-app` (or as a standalone HTML file), build a card grid for rooms:

- Each card shows: room name, room code, participant count, status badge, "Join" button
- Use CSS Grid or Flexbox to lay out cards in a responsive grid:
  - 3 cards per row on desktop (>1024px)
  - 2 cards per row on tablet (600px-1024px)
  - 1 card per row on mobile (<600px)
- Style the cards: border or shadow, border-radius, padding, hover effect
