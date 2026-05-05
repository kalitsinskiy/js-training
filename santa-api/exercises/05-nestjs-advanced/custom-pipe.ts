export {};
// ============================================
// CUSTOM PIPE Exercise
// ============================================
// Run from santa-api/:  npx ts-node exercises/05-nestjs-advanced/custom-pipe.ts
//
// Create a custom ParseIntPipe that validates and transforms a string to a number.
// Then create a ParseSortPipe that validates sort direction ("asc" or "desc").

import 'reflect-metadata';
import {
  Controller,
  Get,
  Query,
  Module,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

// ---- Pipes ----

// TODO 1: Create a CustomParseIntPipe
// - Implement PipeTransform<string, number>
// - In the transform() method:
//   - Parse the value with parseInt(value, 10)
//   - If the result is NaN, throw BadRequestException with a descriptive message
//     that includes the parameter name from metadata.data
//   - Return the parsed number
// - Decorate with @Injectable()
@Injectable()
class CustomParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsed = parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(
        `Validation failed: "${metadata.data}" must be a number, got "${value}"`,
      );
    }

    return parsed;
  }
}

// TODO 2: Create a ParseSortPipe
// - Implement PipeTransform<string, 'asc' | 'desc'>
// - In the transform() method:
//   - Convert value to lowercase
//   - If the value is not "asc" or "desc", throw BadRequestException
//   - If value is undefined/empty, return 'asc' as default
//   - Return the validated sort direction
@Injectable()
class ParseSortPipe implements PipeTransform<
  string | undefined,
  'asc' | 'desc'
> {
  transform(value: string | undefined): 'asc' | 'desc' {
    if (value === undefined || value === '') return 'asc';

    const normalized = value.toLowerCase();

    if (normalized !== 'asc' && normalized !== 'desc') {
      throw new BadRequestException(
        `Sort must be "asc" or "desc", got "${value}"`,
      );
    }

    return normalized;
  }
}

// ---- Controller ----

// TODO 3: Create an ItemsController with route GET /items
// - Use @Query('page', CustomParseIntPipe) to get page as number
// - Use @Query('limit', CustomParseIntPipe) to get limit as number
// - Use @Query('sort', ParseSortPipe) to get sort direction
// - Return an object: { page, limit, sort, message: 'Params validated!' }
//
@Controller('items')
class ItemsController {
  @Get()
  findAll(
    @Query('page', CustomParseIntPipe) page: number,
    @Query('limit', CustomParseIntPipe) limit: number,
    @Query('sort', ParseSortPipe) sort: 'asc' | 'desc',
  ) {
    return { page, limit, sort, message: 'Params validated' };
  }
}
// Example requests:
//   GET /items?page=1&limit=10&sort=desc  -> { page: 1, limit: 10, sort: 'desc', ... }
//   GET /items?page=abc&limit=10          -> 400 Bad Request
//   GET /items?page=1&limit=10&sort=xyz   -> 400 Bad Request

// ---- Module & Bootstrap ----

// TODO 4: Create AppModule and bootstrap function
// - Register the controller
// - Use FastifyAdapter, port 3000
// - Log the URL and example curl commands
@Module({ controllers: [ItemsController] })
class AppModule {}

async function bootstrap() {
  // Your bootstrap code here
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, '0.0.0.0');
  console.log('Custom pipe demo running on http://localhost:3000');
  console.log('Try:');
  console.log('  curl "http://localhost:3000/items?page=1&limit=10&sort=desc"');
  console.log(
    '  curl "http://localhost:3000/items?page=abc&limit=10"     # 400',
  );
  console.log(
    '  curl "http://localhost:3000/items?page=1&limit=10&sort=xyz" # 400',
  );
}

bootstrap();
