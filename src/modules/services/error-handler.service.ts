import * as config from 'config';
import { Service } from 'typedi';
import { LoggerService } from './logger.service';
import { RAVEN_DISPLAY_LIMIT } from '../constants';
import { Breadcrum } from '../interfaces';
import * as Sentry from '@sentry/node';

@Service()
export class ErrorHandler {
    config: Sentry.NodeOptions;
    dsn: string;

    constructor(
        private readonly logger: LoggerService
    ) {
        this.config = {
            environment: process.env.NODE_ENV,
            release: process.env.npm_package_version,
            dsn: null
        };

        try {
            this.config.dsn = config.get<string>('sentry.dsn');
        }
        catch {
            // eslint-disable-next-line no-console
            console.warn('You need to create a config for sentry. See the README in @gtindependence/typedi-common');
            this.config.dsn = null;
        }

        if (this.config.dsn) {
            try {
                Sentry.init(this.config)
            }
            catch (error) {
                this.logger.error(error);
            }
        }
    }

    captureBreadcrumb(breadcrumb: Breadcrum) {
        if (process.env.DEPLOYMENT) {
            Sentry.addBreadcrumb(breadcrumb);
        }
        else {
            this.logger.info(breadcrumb.message, breadcrumb.data ? breadcrumb.data : '');
        }
    }

    captureException(error: Error) {
        return new Promise<void>((resolve) => {
            if (process.env.DEPLOYMENT) {
                if (this.sizeInBites(error) > RAVEN_DISPLAY_LIMIT) {
                    this.captureMessage(`Error with message "${error.message}" is too large and will not have all data displayed.`);
                }

                Sentry.captureException(error);
                resolve();
            }
            else {
                this.logger.error(error);
                resolve();
            }
        });
    }

    captureMessage(message: string) {
        if (process.env.DEPLOYMENT) {
            Sentry.captureMessage(message);
        }
        else {
            this.logger.info(message);
        }
    }

    private sizeInBites(object: unknown) {
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
