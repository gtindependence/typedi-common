import { SequelizeError } from '../interfaces';
import { BaseException } from './base.exception';

export class SqlException extends BaseException {
    message: string;
    stack: string;
    error: SequelizeError;

    constructor(error: SequelizeError) {
        super();

        if (error) {
            this.message = error.message;
            this.stack = error.stack;
            this.error = error;
        }
    }
}
