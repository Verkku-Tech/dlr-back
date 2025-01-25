import { Injectable } from '@nestjs/common'
import { logger } from './winston.config'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class LoggerService {
  constructor(private readonly configService: ConfigService) {}

  private connectionString = this.configService.getOrThrow('MONGO_URL')
  private dbName = this.configService.getOrThrow('MONGO_DB_NAME')

  log(message: string, context?: string) {
    logger(this.connectionString, this.dbName).info(message, { context })
  }

  error(message: string, trace: string, context?: string) {
    logger(this.connectionString, this.dbName).error(message, {
      context,
      trace,
    })
  }

  warn(message: string, context?: string) {
    logger(this.connectionString, this.dbName).warn(message, { context })
  }

  debug(message: string, context?: string) {
    logger(this.connectionString, this.dbName).debug(message, { context })
  }
}
