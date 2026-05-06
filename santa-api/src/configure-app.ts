import { ValidationPipe } from '@nestjs/common';
import { RawServerDefault } from 'fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

export function configureApp(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
}
