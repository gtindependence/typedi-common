import * as config from 'config';
import * as log from 'log4js';
import * as Raven from 'raven';
import { Service } from 'typedi';
import { RAVEN_DISPLAY_LIMIT } from '../constants';
import { Breadcrum } from '../interfaces/breadcrum.interface';
import { LoggerProvider } from '../providers/logger.provider';

@Service()
export class ErrorHandler {
    config: Raven.ConstructorOptions;
    dsn: string;

    constructor(
        @LoggerProvider() private readonly logger: log.Logger
    ) {
        this.config = {
            environment: process.env.NODE_ENV,
            release: process.env.npm_package_version,
            autoBreadcrumbs: true,
            captureUnhandledRejections: true
        };

        try {
            this.dsn = config.get<string>('raven.dsn');
        }
        catch {
            // tslint:disable-next-line:no-console
            console.warn('You need to create a config for raven. See the README in @teamhive/typedi-common');
            this.dsn = null;
        }

        if (this.dsn) {
            try {
                Raven.config(this.dsn, this.config).install();
            }
            catch (error) {
                this.logger.error(error);
            }
        }
    }

    captureBreadcrumb(breadcrumb: Breadcrum) {
        if (process.env.DEPLOYMENT) {
            Raven.captureBreadcrumb(breadcrumb);
        }
        else {
            this.logger.info(breadcrumb.message);
        }
    }

    captureException(error: Error) {
        return new Promise((resolve) => {
            if (process.env.DEPLOYMENT) {
                if (this.sizeInBites(error) > RAVEN_DISPLAY_LIMIT) {
                    this.captureMessage(`Error with message "${error.message}" is too large and will not have all data displayed.`);
                }

                Raven.captureException(error, (e: any) => {
                    if (e) {
                        this.logger.error(e);
                    }
                    resolve();
                });
            }
            else {
                this.logger.error(error);
                resolve();
            }
        });
    }

    captureMessage(message: string) {
        if (process.env.DEPLOYMENT) {
            Raven.captureMessage(message, (e: any) => {
                if (e) {
                    this.logger.error(e);
                }
            });
        }
        else {
            this.logger.info(message);
        }
    }

    private sizeInBites(object: any) {
        const objectList = [];
        const stack = [object];
        let bytes = 0;

        while (stack.length) {
            const value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            }
            else if (typeof value === 'string') {
                bytes += value.length * 2;
            }
            else if (typeof value === 'number') {
                bytes += 8;
            }
            else if (typeof value === 'object' && value !== null) {
                objectList.push(value);
                Object.getOwnPropertyNames(value).forEach((key) => stack.push(value[key]));
            }
        }
        return bytes;
    }
}
