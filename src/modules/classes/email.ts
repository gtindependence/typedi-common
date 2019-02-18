import * as EmailTemplate from 'email-templates';
import { Container } from 'typedi';
import { EmailOptions } from '../interfaces';
import { EmailConfig } from '../interfaces/email-config.interface';
import { ErrorHandler } from '../services/error-handler.service';

export class Email extends EmailTemplate {
    errorHandler: ErrorHandler;

    constructor(options: EmailConfig) {
        super(options);

        this.errorHandler = Container.get(ErrorHandler);
    }

    /**
     *
     * @param mailData EmailOptions
     *
     * This function wraps the standard email-templates send function.
     * It returns true or false to indicate if the email was sent successfully
     * and will also log to the error handler.
     */
    async send(mailData: EmailOptions, handleErrors = true) {
        try {
            const response = await super.send(mailData);

            if (response[0] && response[0].statusCode && response[0].statusCode === 202) {
                return true;
            }
            return false;
        }
        catch (error) {
            if (!handleErrors) {
                throw error;
            }

            this.errorHandler.captureException(error);
            return false;
        }
    }
}
