# REST API Design Exercise: Library

Design a REST API for a Library management system. The domain has three resources: **Books**, **Authors**, and **Borrowings** (a user borrows a book).

## TODO: Define the Endpoints

For each endpoint, specify:
- HTTP method
- URI path
- Brief description
- Request body (if any)
- Response status codes

### Authors

<!-- TODO: Design CRUD endpoints for authors -->
<!-- An author has: id, name, bio, birthYear -->
<!-- Think about: list, get one, create, update, delete -->

| Method | URI | Description | Status Codes |
|--------|-----|-------------|--------------|
| | | | |

### Books

<!-- TODO: Design CRUD endpoints for books -->
<!-- A book has: id, title, isbn, authorId, publishedYear, available (boolean) -->
<!-- Think about: list all, get one, create, update, delete -->
<!-- Also: list books by a specific author (sub-resource or query param?) -->
<!-- Also: search books by title (query parameter) -->

| Method | URI | Description | Status Codes |
|--------|-----|-------------|--------------|
| | | | |

### Borrowings

<!-- TODO: Design endpoints for borrowing workflow -->
<!-- A borrowing has: id, bookId, userId, borrowedAt, returnedAt (nullable) -->
<!-- Think about: borrow a book, return a book, list active borrowings for a user -->
<!-- What happens if the book is already borrowed? Which status code? -->

| Method | URI | Description | Status Codes |
|--------|-----|-------------|--------------|
| | | | |

## TODO: Answer These Design Questions

1. Should "list books by author" be `GET /api/authors/:id/books` or `GET /api/books?authorId=:id`? What are the tradeoffs?

<!-- Your answer: -->

2. How would you handle "borrow a book"? Is it `POST /api/borrowings`, `POST /api/books/:id/borrow`, or something else? Why?

<!-- Your answer: -->

3. When a user tries to borrow a book that is already borrowed, what status code should you return and why?

<!-- Your answer: -->

4. The library wants to add a "search" feature: search books by title, author name, or ISBN. Design the endpoint(s).

<!-- Your answer: -->
