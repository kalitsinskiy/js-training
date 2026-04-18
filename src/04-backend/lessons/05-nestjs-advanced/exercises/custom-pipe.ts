export {};
// ============================================
// CUSTOM PIPE Exercise
// ============================================
// Run: npx ts-node src/04-backend/lessons/05-nestjs-advanced/exercises/custom-pipe.ts
//
// Create a custom ParseIntPipe that validates and transforms a string to a number.
// Then create a ParseSortPipe that validates sort direction ("asc" or "desc").

import 'reflect-metadata';
import {
  Controller, Get, Query, Module, Injectable,
  PipeTransform, ArgumentMetadata, BadRequestException,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

// These imports will be used when you implement the TODOs below
void Controller; void Get; void Query; void Module; void Injectable;
void (undefined as unknown as PipeTransform);
void (undefined as unknown as ArgumentMetadata);
void BadRequestException; void NestFactory; void FastifyAdapter;
void (undefined as unknown as NestFastifyApplication);

// ---- Pipes ----

// TODO 1: Create a CustomParseIntPipe
// - Implement PipeTransform<string, number>
// - In the transform() method:
//   - Parse the value with parseInt(value, 10)
//   - If the result is NaN, throw BadRequestException with a descriptive message
//     that includes the parameter name from metadata.data
//   - Return the parsed number
// - Decorate with @Injectable()

// TODO 2: Create a ParseSortPipe
// - Implement PipeTransform<string, 'asc' | 'desc'>
// - In the transform() method:
//   - Convert value to lowercase
//   - If the value is not "asc" or "desc", throw BadRequestException
//   - If value is undefined/empty, return 'asc' as default
//   - Return the validated sort direction

// ---- Controller ----

// TODO 3: Create an ItemsController with route GET /items
// - Use @Query('page', CustomParseIntPipe) to get page as number
// - Use @Query('limit', CustomParseIntPipe) to get limit as number
// - Use @Query('sort', ParseSortPipe) to get sort direction
// - Return an object: { page, limit, sort, message: 'Params validated!' }
//
// Example requests:
//   GET /items?page=1&limit=10&sort=desc  -> { page: 1, limit: 10, sort: 'desc', ... }
//   GET /items?page=abc&limit=10          -> 400 Bad Request
//   GET /items?page=1&limit=10&sort=xyz   -> 400 Bad Request

// ---- Module & Bootstrap ----

// TODO 4: Create AppModule and bootstrap function
// - Register the controller
// - Use FastifyAdapter, port 3000
// - Log the URL and example curl commands

async function bootstrap() {
  // Your bootstrap code here
}

bootstrap();
