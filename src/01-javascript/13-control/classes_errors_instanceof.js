// ============================================
// TASK 5: Classes, error hierarchy, instanceof
// ============================================
// What does this code output? Explain why.

class AppError extends Error {
  static #count = 0;

  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    AppError.#count++;
  }

  static getCount() {
    return AppError.#count;
  }

  wrap(prefix) {
    return new AppError(`${prefix}: ${this.message}`, this.code);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  #fields;
  constructor(fields) {
    super('Validation failed', 400);
    this.name = 'ValidationError';
    this.#fields = fields;
  }
  getFields() {
    return [...this.#fields];
  }
}

// ⚠️ Pay attention to the order of instanceof checks
function handle(err) {
  if (err instanceof AppError) return `app:${err.code}`;
  if (err instanceof ValidationError) return `validate:${err.getFields()}`;
  if (err instanceof NotFoundError) return `404:${err.message}`;
  return `raw:${err.message}`;
}

const nfe = new NotFoundError('User');
const ve = new ValidationError(['email', 'name']);

console.log(handle(nfe)); // ? 'app:404'
console.log(handle(ve)); // ? 'app:400'
console.log(handle(new AppError('Fail', 500))); // ? 'app:500'
console.log(handle(new Error('raw'))); // ? 'raw:raw'

const wrapped = nfe.wrap('Retry');
console.log(wrapped instanceof NotFoundError); // ? false
console.log(wrapped instanceof AppError); // ? true
console.log(wrapped.name); // ? 'AppError'
console.log(wrapped.message); // ? 'Retry: User not found'

console.log(AppError.getCount()); // ? 4

// AppError.#count  ← what happens if you write this outside the class? Why?
//SyntaxError because #count is a private field
