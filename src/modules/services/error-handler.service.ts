import * as config from 'config';
import * as log from 'log4js';
import * as Raven from 'raven';
import { Service } from 'typedi';
import { Breadcrum } from '../interfaces/breadcrum.interface';
import { LoggerProvider } from '../providers/logger.provider';

@Service()
export class ErrorHandler {
    config: Raven.ConstructorOptions;
    dsn: string;

    constructor(
        @LoggerProvider() private readonly logger: log.Logger
    ) {
        try {
            // tslint:disable-next-line:no-console
            console.warn('You need to create a config for raven. See the README in @teamhive/typedi-common');
            this.dsn = config.get<string>('raven.dsn') || null;

            this.config = {
                environment: process.env.NODE_ENV,
                release: process.env.npm_package_version,
                autoBreadcrumbs: true,
                captureUnhandledRejections: true
            };

            if (this.dsn) {
                Raven.config(this.dsn, this.config).install();
            }
        }
        catch (error) {
            this.logger.error(error);
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
        return new Promise((resolve, reject) => {
            if (process.env.DEPLOYMENT) {
                Raven.captureException(error, (e) => {
                    if (e) {
                        reject(e);
                    }
                    resolve();
                });
            }
            else {
                this.logger.error(error);
            }
        });
    }

    captureMessage(message: string) {
        if (process.env.DEPLOYMENT) {
            Raven.captureMessage(message);
        }
        else {
            this.logger.info(message);
        }
    }
}
