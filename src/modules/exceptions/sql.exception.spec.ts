import { describe, expect, it } from 'vitest';
import { SequelizeError } from '../interfaces';
import { BaseException } from './base.exception';
import { SqlException } from './sql.exception';

describe('SqlException', () => {
    const sequelizeError: SequelizeError = {
        name: 'SequelizeDatabaseError',
        message: 'relation "users" does not exist',
        stack: 'SequelizeDatabaseError: relation "users" does not exist\n    at query',
        original: new Error('original'),
        parent: new Error('parent'),
        sql: 'SELECT * FROM users',
    };

    it('extends BaseException and Error', () => {
        const exception = new SqlException(sequelizeError);

        expect(exception).toBeInstanceOf(SqlException);
        expect(exception).toBeInstanceOf(BaseException);
        expect(exception).toBeInstanceOf(Error);
    });

    it('copies the message, stack and error from the Sequelize error', () => {
        const exception = new SqlException(sequelizeError);

        expect(exception.message).toBe(sequelizeError.message);
        expect(exception.stack).toBe(sequelizeError.stack);
        expect(exception.error).toBe(sequelizeError);
    });

    it('does not throw when no error is provided', () => {
        const exception = new SqlException(undefined);

        expect(exception.error).toBeUndefined();
        expect(exception.message).toBe('');
    });
});
