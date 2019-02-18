import { SendMailOptions } from 'nodemailer';

export interface EmailOptions {
    /**
     * The template name
     */
    template: string;
    /**
     * Nodemailer Message <Nodemailer.com/message/>
     */
    message: SendMailOptions;
    /**
     * The Template Variables
     */
    locals: any;
}
