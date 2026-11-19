import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockLogger = vi.hoisted(() => ({ info: vi.fn(), error: vi.fn() }));

vi.mock('log4js', () => ({
    getLogger: vi.fn(() => mockLogger),
}));

import * as log from 'log4js';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
    let service: LoggerService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new LoggerService();
    });

    it('creates a log4js logger on construction', () => {
        expect(log.getLogger).toHaveBeenCalledTimes(1);
        expect(service.logger).toBe(mockLogger);
    });

    it('info delegates the message and extra args to the logger', () => {
        service.info('hello', { a: 1 }, 2);

        expect(mockLogger.info).toHaveBeenCalledWith('hello', { a: 1 }, 2);
    });

    it('error delegates the message and extra args to the logger', () => {
        const error = new Error('boom');

        service.error(error, 'extra');

        expect(mockLogger.error).toHaveBeenCalledWith(error, 'extra');
    });
});
