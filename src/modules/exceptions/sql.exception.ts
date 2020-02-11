import { BaseException } from './base.exception';
import { SequelizeError } from '../interfaces';

export class SqlException extends BaseException {
    message: string;
    stack: string;
    error: any;

    constructor(error: SequelizeError) {
        super();

        if (error) {
            this.message = error.message;
            this.stack = error.stack;
            this.error = error;
        }
    }
}
