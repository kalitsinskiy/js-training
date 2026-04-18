export {};
// ============================================
// MINI CRUD Exercise
// ============================================
// Run: npx ts-node src/04-backend/lessons/04-nestjs-fundamentals/exercises/mini-crud.ts
//
// Build a complete CRUD API for a "products" resource using NestJS.
//
// Requirements:
// - ProductsService with in-memory Map<string, Product> storage
// - ProductsController with all CRUD endpoints
// - ProductsModule wiring it all together
// - AppModule importing ProductsModule
// - Fastify adapter, port 3000
//
// Test your solution:
//   curl http://localhost:3000/products                                          # GET all
//   curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"Laptop","price":999,"category":"electronics"}'
//   curl http://localhost:3000/products/<id>                                     # GET one
//   curl -X PUT http://localhost:3000/products/<id> -H "Content-Type: application/json" -d '{"name":"Laptop Pro","price":1299}'
//   curl -X DELETE http://localhost:3000/products/<id>                           # DELETE

import 'reflect-metadata';
import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Module, Injectable,
  NotFoundException, HttpCode, HttpStatus,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

// These imports will be used when you implement the TODOs below
void Controller; void Get; void Post; void Put; void Delete;
void Param; void Body; void Module; void Injectable;
void NotFoundException; void HttpCode; void HttpStatus;
void NestFactory; void FastifyAdapter;
void (undefined as unknown as NestFastifyApplication);

// ---- Types ----

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateProductDto {
  name: string;
  price: number;
  category: string;
}

interface UpdateProductDto {
  name?: string;
  price?: number;
  category?: string;
}

// Will be used when you implement the TODOs
void (undefined as unknown as Product);
void (undefined as unknown as CreateProductDto);
void (undefined as unknown as UpdateProductDto);

// ---- Service ----

// TODO 1: Create a ProductsService class
// - Decorate it with @Injectable()
// - Use a private Map<string, Product> for storage
// - Implement these methods:
//   findAll(): Product[]                           — return all products as array
//   findOne(id: string): Product                   — return product or throw NotFoundException
//   create(dto: CreateProductDto): Product          — generate id with crypto.randomUUID(), set createdAt/updatedAt
//   update(id: string, dto: UpdateProductDto): Product — find existing or throw 404, merge fields, update updatedAt
//   remove(id: string): void                        — find existing or throw 404, delete from map


// ---- Controller ----

// TODO 2: Create a ProductsController class
// - Decorate with @Controller('products')
// - Inject ProductsService via constructor
// - Implement these route handlers:
//   @Get()         findAll()              — return all products (200)
//   @Get(':id')    findOne(@Param)        — return one product (200) or 404
//   @Post()        create(@Body)          — create product (201 — default for @Post)
//   @Put(':id')    update(@Param, @Body)  — update product (200) or 404
//   @Delete(':id') remove(@Param)         — delete product, return 204 (use @HttpCode)


// ---- Module ----

// TODO 3: Create a ProductsModule
// - Register ProductsController in controllers
// - Register ProductsService in providers


// ---- App Module ----

// TODO 4: Create an AppModule
// - Import ProductsModule


// ---- Bootstrap ----

// TODO 5: Create the bootstrap function
// - Use NestFactory.create with FastifyAdapter
// - Listen on port 3000
// - Log the URL to console

async function bootstrap() {
  // Your bootstrap code here
}

bootstrap();
