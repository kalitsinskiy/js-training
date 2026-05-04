# REST API Design Exercise: Library

Design a REST API for a Library management system. The domain has three resources: **Books**, **Authors**, and **Borrowings** (a user borrows a book).

## TODO: Define the Endpoints

For each endpoint, specify:
- HTTP method
- URI path
- Brief description
- Response status codes

### Authors (example — already filled in)

| Method | URI | Description | Status Codes |
|--------|-----|-------------|--------------|
| GET | /api/authors | List all authors | 200 |
| GET | /api/authors/:id | Get author by id | 200, 404 |
| POST | /api/authors | Create author | 201, 400 |
| PATCH | /api/authors/:id | Update author partially | 200, 400, 404 |
| DELETE | /api/authors/:id | Delete author | 204, 404 |

### Books

Design the CRUD endpoints for books. Consider:
Q: How to list all books (with optional filters: by author, by title, by availability)
A: GET endpoint with optional query parameters

Q: How to handle duplicate ISBNs (what status code?)
A: Return 409 (Conflict) code

Q: Whether to support partial updates (PATCH) or full replacement (PUT) — or both
A: Partial updates. To be consistent with `authors` endpoint

Q: A sub-resource endpoint for "books by author"
A: New `/api/books/byAuthor/:id` GET endpoint

| Method | URI | Description | Status Codes |
|--------|-----|-------------|--------------|
| GET | /api/books | List all books. Supports optional query parameters `?author=`, `?title=`, `?availability=` | 200 |
| GET | /api/books/:id | Get book by id | 200, 404 |
| POST | /api/books | Create book | 201, 409 |
| PATCH | /api/books/:id | Update book partially | 200, 400, 404 |
| DELETE | /api/books/:id | Delete book | 204, 404 |
| GET | /api/books/byAuthor/:id | List all books by author id | 200, 404 |

### Borrowings

Design endpoints for the borrowing flow. Think about:
Q: How does a user borrow a book? Is it a new resource or an action on a book?
A: New resource

Q: What happens if the book is already borrowed? (What status code?)
A: 409 (Conflict) code is returned

Q: How does returning a book work?
A: PATCH request to `/api/borrowings/:id/returned` endpoint

Q: How to list active borrowings for a user?
A: New `/api/borrowings/byUser/:id` GET endpoint

| Method | URI | Description | Status Codes |
|--------|-----|-------------|--------------|
| GET | /api/borrowings | List all borrowings | 200 |
| GET | /api/borrowings/:id | Get a borrowing by id | 200, 404 |
| POST | /api/borrowings | Create a borrowing | 201, 409 |
| PATCH | /api/borrowings/:id/returned | Mark book as returned | 200, 404 |
| DELETE | /api/borrowings/:id | Delete borrowing | 204, 404 |
| GET | /api/borrowings/byUser/:id | List all borrowings by user id | 200, 404 |

## TODO: Answer These Design Questions

1. Should "list books by author" be `GET /api/authors/:id/books` or `GET /api/books?authorId=:id`? What are the tradeoffs?

2. How would you handle "borrow a book"? Is it `POST /api/borrowings`, `POST /api/books/:id/borrow`, or something else? Why?

3. When a user tries to borrow a book that is already borrowed, what status code should you return and why?

4. The library wants to add a "search" feature: search books by title, author name, or ISBN. Design the endpoint(s).

---

> After completing, check your answers against [rest-api-design.solution.md](rest-api-design.solution.md)
