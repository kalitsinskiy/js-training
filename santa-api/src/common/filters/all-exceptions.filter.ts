import {
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ExecutionContext): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let statusCode = 500;
    let message: string = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        if ('message' in responseObj) {
          const msg = responseObj.message;
          if (
            Array.isArray(msg) &&
            msg.length > 0 &&
            typeof msg[0] === 'string'
          ) {
            message = msg[0];
          } else if (typeof msg === 'string') {
            message = msg;
          }
        }
      }
    }

    const errorResponse = {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).send(errorResponse);
  }
}
