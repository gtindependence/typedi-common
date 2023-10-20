import * as log from 'log4js';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    logger: log.Logger;

    constructor() {
        this.logger = log.getLogger();
    }

    info(message: any, ...args: unknown[]) {
        this.logger.info(message, ...args);
    }

    error(message: any, ...args: unknown[]) {
        this.logger.error(message, ...args);
    }
}
