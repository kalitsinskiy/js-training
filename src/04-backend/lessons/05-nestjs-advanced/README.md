# NestJS Advanced

## Quick Overview

NestJS has a rich request lifecycle with multiple extension points: middleware, guards, interceptors, pipes, and exception filters. Together with DTOs and `class-validator`, these give you a clean, declarative way to handle authentication, validation, logging, and error formatting — without polluting your business logic.

## Key Concepts

### Request Lifecycle

Every request flows through these layers in order:

```
Incoming Request
  │
  ▼
Middleware          (raw req/res manipulation, logging, CORS)
  │
  ▼
Guards              (authentication / authorization — return true or false)
  │
  ▼
Interceptors (pre)  (before handler — logging, caching, transform request)
  │
  ▼
Pipes               (validation + transformation of parameters)
  │
  ▼
Route Handler       (your controller method)
  │
  ▼
Interceptors (post) (after handler — transform response, timing)
  │
  ▼
Exception Filters   (catch and format errors)
  │
  ▼
Response
```

Each layer can short-circuit the request (e.g., a guard returning `false` throws `ForbiddenException` before the handler runs).

### Guards

Guards decide whether a request should proceed. They implement the `CanActivate` interface:

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    return apiKey === 'my-secret-key';
  }
}
```

Apply guards:

```typescript
import { UseGuards } from '@nestjs/common';

// On a single route
@Get('secret')
@UseGuards(ApiKeyGuard)
getSecret() { return { secret: 42 }; }

// On an entire controller
@Controller('admin')
@UseGuards(ApiKeyGuard)
class AdminController { /* all routes protected */ }
```

Or globally in `main.ts`:

```typescript
app.useGlobalGuards(new ApiKeyGuard());
```

### Pipes

Pipes transform or validate input **before** it reaches the handler. NestJS ships with built-in pipes (`ValidationPipe`, `ParseIntPipe`, `ParseUUIDPipe`):

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id is guaranteed to be a number here
  // if the param is "abc", NestJS returns 400 automatically
}
```

The `ValidationPipe` is the most important — it validates DTOs using `class-validator`:

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // strip properties not in DTO
  forbidNonWhitelisted: true, // throw if unknown properties sent
  transform: true,        // auto-transform payloads to DTO class instances
}));
```

### DTOs with class-validator

DTOs (Data Transfer Objects) define the shape of incoming data. Combined with `class-validator` decorators, they become self-validating:

```typescript
import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

enum Role { USER = 'user', ADMIN = 'admin' }

class CreateUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
```

Install:
```bash
npm install class-validator class-transformer
```

When `ValidationPipe` is active and the body fails validation, NestJS automatically returns 400 with a detailed error message — no manual checking needed.

### class-transformer

Works alongside `class-validator` to transform plain objects into class instances:

```typescript
import { Exclude, Expose, Transform } from 'class-transformer';

class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Exclude()
  password!: string; // never sent to client

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt!: Date;
}
```

Use with `ClassSerializerInterceptor` to automatically apply transformations to responses:

```typescript
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
class UsersController { /* ... */ }
```

### Interceptors

Interceptors wrap around the handler using RxJS `Observable`. They can:
- Execute logic before/after the handler
- Transform the result
- Extend or override behavior
- Measure timing

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`${method} ${url} — ${duration}ms`);
      }),
    );
  }
}
```

Apply:
```typescript
@UseInterceptors(LoggingInterceptor) // on controller or method
```

Or globally:
```typescript
app.useGlobalInterceptors(new LoggingInterceptor());
```

### Transform Interceptor

A common pattern — wrap all responses in a standard envelope:

```typescript
import { map } from 'rxjs';

@Injectable()
class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

### Exception Filters

Exception filters catch errors and format the response:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch() // catches ALL exceptions
class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    reply.status(status).send({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

Apply globally:
```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

### Putting It All Together

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Global pipes — validate all incoming DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global interceptors — log all requests
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global filters — catch all unhandled errors
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001, '0.0.0.0');
}
```

## Learn More

- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [class-validator docs](https://github.com/typestack/class-validator)
- [class-transformer docs](https://github.com/typestack/class-transformer)

## How to Work

> **Important:** NestJS examples and exercises must run from the `santa-api/` directory.
> NestJS depends on `reflect-metadata`, `rxjs`, and a `tsconfig.json` with `"emitDecoratorMetadata": true` —
> all of which are set up inside `santa-api/`. Running from the repo root will fail.
>
> **Note:** First run takes ~10 seconds — `ts-node` compiles NestJS + all its dependencies on cold start. Subsequent runs are faster.

### One-time setup

The DTO examples and exercises use `class-validator` and `class-transformer`. Install them in `santa-api`:

```bash
cd santa-api
npm install class-validator class-transformer
```

### Run

1. **Study examples** (run from `santa-api/`):
   ```bash
   cd santa-api
   npx ts-node examples/05-nestjs-advanced/dto-validation.ts
   npx ts-node examples/05-nestjs-advanced/guards.ts
   npx ts-node examples/05-nestjs-advanced/interceptors.ts
   npx ts-node examples/05-nestjs-advanced/exception-filters.ts
   ```

   Each example is **self-contained** — it starts a server, makes test requests via `fetch()`, prints results, then closes. No need to curl manually.

2. **Complete exercises** (run from `santa-api/`):
   ```bash
   cd santa-api
   npx ts-node exercises/05-nestjs-advanced/custom-pipe.ts
   npx ts-node exercises/05-nestjs-advanced/custom-guard.ts
   npx ts-node exercises/05-nestjs-advanced/dto-exercise.ts
   ```

3. **Answer** `QUESTIONS.md` for self-evaluation.

4. **Complete the App Task** below.

## App Task

In `santa-api`:

### 0. Install Validation Dependencies (if not already done)

```bash
cd santa-api
npm install class-validator class-transformer
```

### 1. DTOs with Validation

Create DTOs with `class-validator` decorators for all existing endpoints:

- `CreateUserDto` — name (string, min 2 chars), email (valid email format)
- `CreateRoomDto` — name (string, min 3 chars), ownerId (string, UUID format)
- `JoinRoomDto` — userId (string, UUID format)
- `UpdateWishlistDto` — items (array of strings, each min 1 char)

### 2. Global ValidationPipe

In `main.ts`, add:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### 3. LoggingInterceptor

Create `src/common/interceptors/logging.interceptor.ts` — log method, URL, and duration for every request. Apply globally.

### 4. Global Exception Filter

Create `src/common/filters/all-exceptions.filter.ts` — catch all exceptions, return a consistent JSON structure:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 5. WishlistModule

Create `WishlistModule` with:
- `POST /rooms/:id/wishlist` — set wishlist for a user in a room (`{ userId, items }`)
- `GET /rooms/:id/wishlist/:userId` — get a user's wishlist in a room
- In-memory storage in `WishlistService`
