import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? ((exception.getResponse() as { message?: string | string[] })
            .message ?? exception.message)
        : 'Internal server error';

    reply.status(statusCode).send({
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
