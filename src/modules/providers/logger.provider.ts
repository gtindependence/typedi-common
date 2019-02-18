import * as config from 'config';
import * as log from 'log4js';
import { Container } from 'typedi';

export function LoggerProvider() {
    return (object: any, propertyName: string, index?: number) => {
        const logger = log.getLogger();

        // tslint:disable-next-line:no-console
        console.warn('You need to create a config for logger. See the README in @teamhive/typedi-common');
        logger.level = config.get('logger.level');

        Container.registerHandler({ object, propertyName, index, value: _containerInstance => logger });
    };
}
