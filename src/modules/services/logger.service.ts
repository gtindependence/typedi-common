import * as config from 'config';
import * as log from 'log4js';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    logger: log.Logger;

    constructor() {
        let level: string;
        try {
            level = config.get('logger.level');
        }
        catch {
            // tslint:disable-next-line:no-console
            console.warn('You need to create a config for logger.level. See the README in @teamhive/typedi-common');
            level = 'debug';
        }

        this.logger = log.getLogger();
        this.logger.level = level;
    }

    info(message: any, ...args: any[]) {
        this.logger.info(message, ...args);
    }

    error(message: any, ...args: any[]) {
        this.logger.error(message, ...args);
    }

}
