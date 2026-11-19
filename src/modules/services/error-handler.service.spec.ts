import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('config', () => ({ get: vi.fn() }));
vi.mock('@sentry/node', () => ({
    init: vi.fn(),
    addBreadcrumb: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
}));

import * as config from 'config';
import * as Sentry from '@sentry/node';
import { RAVEN_DISPLAY_LIMIT } from '../constants';
import { ErrorHandler } from './error-handler.service';
import { LoggerService } from './logger.service';

describe('ErrorHandler', () => {
    let logger: {
        info: ReturnType<typeof vi.fn>;
        error: ReturnType<typeof vi.fn>;
    };
    const originalDeployment = process.env.DEPLOYMENT;

    const create = () => new ErrorHandler(logger as unknown as LoggerService);

    beforeEach(() => {
        vi.resetAllMocks();
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        vi.mocked(config.get).mockReturnValue('https://dsn.example');
        logger = { info: vi.fn(), error: vi.fn() };
        delete process.env.DEPLOYMENT;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        if (originalDeployment === undefined) {
            delete process.env.DEPLOYMENT;
        } else {
            process.env.DEPLOYMENT = originalDeployment;
        }
    });

    describe('constructor', () => {
        it('reads the dsn from config and initializes Sentry', () => {
            const handler = create();

            expect(config.get).toHaveBeenCalledWith('sentry.dsn');
            expect(handler.config.dsn).toBe('https://dsn.example');
            expect(Sentry.init).toHaveBeenCalledWith(handler.config);
        });

        it('warns and skips Sentry init when the config is missing', () => {
            vi.mocked(config.get).mockImplementation(() => {
                throw new Error('missing');
            });

            const handler = create();

            expect(console.warn).toHaveBeenCalled();
            expect(handler.config.dsn).toBeNull();
            expect(Sentry.init).not.toHaveBeenCalled();
        });

        it('skips Sentry init when the dsn is empty', () => {
            vi.mocked(config.get).mockReturnValue('');

            create();

            expect(Sentry.init).not.toHaveBeenCalled();
        });

        it('logs the error if Sentry.init throws', () => {
            const error = new Error('init failed');
            vi.mocked(Sentry.init).mockImplementation(() => {
                throw error;
            });

            expect(create).not.toThrow();
            expect(logger.error).toHaveBeenCalledWith(error);
        });
    });

    describe('captureBreadcrumb', () => {
        const breadcrumb = { message: 'crumb', data: { a: 1 } };

        it('adds a Sentry breadcrumb when deployed', () => {
            process.env.DEPLOYMENT = 'true';

            create().captureBreadcrumb(breadcrumb);

            expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(breadcrumb);
            expect(logger.info).not.toHaveBeenCalled();
        });

        it('logs the message and data when not deployed', () => {
            create().captureBreadcrumb(breadcrumb);

            expect(logger.info).toHaveBeenCalledWith('crumb', { a: 1 });
            expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
        });

        it('logs an empty string when there is no data', () => {
            create().captureBreadcrumb({ message: 'crumb' });

            expect(logger.info).toHaveBeenCalledWith('crumb', '');
        });
    });

    describe('captureException', () => {
        it('logs the error when not deployed', async () => {
            const error = new Error('boom');

            await create().captureException(error);

            expect(logger.error).toHaveBeenCalledWith(error);
            expect(Sentry.captureException).not.toHaveBeenCalled();
        });

        it('sends the error to Sentry when deployed', async () => {
            process.env.DEPLOYMENT = 'true';
            const error = new Error('boom');

            await create().captureException(error);

            expect(Sentry.captureException).toHaveBeenCalledWith(error);
            expect(Sentry.captureMessage).not.toHaveBeenCalled();
            expect(logger.error).not.toHaveBeenCalled();
        });

        it('also captures a message when the error exceeds the display limit', async () => {
            process.env.DEPLOYMENT = 'true';
            const error = new Error('huge');
            // strings count as 2 bytes per character
            Object.assign(error, { payload: 'x'.repeat(RAVEN_DISPLAY_LIMIT) });

            await create().captureException(error);

            expect(Sentry.captureMessage).toHaveBeenCalledWith(
                'Error with message "huge" is too large and will not have all data displayed.',
            );
            expect(Sentry.captureException).toHaveBeenCalledWith(error);
        });
    });

    describe('captureMessage', () => {
        it('sends the message to Sentry when deployed', () => {
            process.env.DEPLOYMENT = 'true';

            create().captureMessage('hi');

            expect(Sentry.captureMessage).toHaveBeenCalledWith('hi');
            expect(logger.info).not.toHaveBeenCalled();
        });

        it('logs the message when not deployed', () => {
            create().captureMessage('hi');

            expect(logger.info).toHaveBeenCalledWith('hi');
            expect(Sentry.captureMessage).not.toHaveBeenCalled();
        });
    });
});
