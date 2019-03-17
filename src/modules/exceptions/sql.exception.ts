import { SequelizeError } from '../interfaces';

export class SqlException extends Error {
    message: string;
    stack: string;
    original: any;

    constructor(error: SequelizeError) {
        super();

        if (error) {
            this.message = error.message;
            this.stack = error.stack;
            this.original = error.original;
        }
    }
}
