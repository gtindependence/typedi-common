import * as config from 'config';
import * as log from 'log4js';
import { Container } from 'typedi';

export function LoggerProvider() {
    return (object: any, propertyName: string, index?: number) => {
        let level: string;
        try {
            level = config.get('logger.level');
        }
        catch {
            // tslint:disable-next-line:no-console
            console.warn('You need to create a config for logger.level. See the README in @teamhive/typedi-common');
            level = 'debug';
        }

        const logger = log.getLogger();
        logger.level = level;

        Container.registerHandler({ object, propertyName, index, value: _containerInstance => logger });
    };
}
