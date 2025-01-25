import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggerService } from '../logger/logger.service'

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    let errorMessage = exception.message
    if (Array.isArray(exception?.response?.message)) {
      errorMessage = exception?.response?.message.join(', ')
    }

    this.logger.error(errorMessage, exception.stack, `${request.originalUrl}`)

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
