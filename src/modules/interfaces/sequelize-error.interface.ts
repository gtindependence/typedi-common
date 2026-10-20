export interface SequelizeError {
    name: string;
    message: string;
    stack: string;
    original: Error;
    parent: Error;
    sql: string;
}
