import * as log from 'log4js';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    logger: log.Logger;

    constructor() {
        this.logger = log.getLogger();
    }

    info(message: any, ...args: any[]) {
        this.logger.info(message, ...args);
    }

    error(message: any, ...args: any[]) {
        this.logger.error(message, ...args);
    }
}
