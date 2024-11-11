import { LoggerService, Injectable } from "@nestjs/common";
import pino from "pino";
import pretty from "pino-pretty"

@Injectable()
export class PinoLoggerService implements LoggerService {
    private logger = pino({
        level: process.env.LOG_LEVEL || 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'SYS:standard',
            }
        }

    })

    log(message: any, context?: string) {
        this.logger.info({ context }, message)
    }

    error(message: any, trace?: string, context?: string) {
        this.logger.error({ context, trace }, message)
    }

    warn(message: any, context?: string) {
        this.logger.warn({ context }, message)
    }
}