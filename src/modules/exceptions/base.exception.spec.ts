import { describe, expect, it } from 'vitest';
import { BaseException } from './base.exception';

describe('BaseException', () => {
    it('is an Error', () => {
        const exception = new BaseException();

        expect(exception).toBeInstanceOf(Error);
        expect(exception).toBeInstanceOf(BaseException);
    });

    it('has an empty message and a stack trace', () => {
        const exception = new BaseException();

        expect(exception.message).toBe('');
        expect(exception.stack).toBeDefined();
    });
});
